#!/usr/bin/env python3
"""
Solar System - fetch and downsize imagery from the NASA Image and Video Library.

Why this exists
---------------
The content pages need real NASA/ESA photographs. Downloading the original assets
beats screenshotting a web page: full quality, no browser chrome, and - crucially -
the API carries the credit metadata, so attribution is GENERATED rather than typed
from memory. (A hand-written caption is exactly how planet/mercury.html ended up
displaying a CC BY 4.0 texture while claiming it was not real imagery.)

Picking images is the hard part: the search API happily returns promo graphics and
video stills for a good query. So candidates are SCORED against the query terms and
undersized results are rejected, with fallbacks tried in order. It is still not a
substitute for a human eye - run with --sheet and open the contact sheet to review.

Usage
-----
    python scripts/fetch-images.py            # fetch anything missing
    python scripts/fetch-images.py --force    # re-fetch everything
    python scripts/fetch-images.py --list     # show the manifest, download nothing
    python scripts/fetch-images.py --only formation-nebula
    python scripts/fetch-images.py --sheet    # rebuild the review contact sheet only
    python scripts/fetch-images.py --report   # print current files + credits

Outputs
-------
    assets/media/<slot>.webp      downsized image, <= MAX_WIDTH px
    assets/media/credits.json     {slot: {title, nasa_id, center, creator, url}}
    assets/media/review.html      local contact sheet (gitignored)

Requires Pillow. No API key: images-api.nasa.gov is public.
"""

import argparse
import io
import json
import os
import re
import sys
import urllib.parse
import urllib.request

from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_DIR = os.path.join(ROOT, "assets", "media")
CREDITS = os.path.join(OUT_DIR, "credits.json")
SHEET = os.path.join(OUT_DIR, "review.html")

API = "https://images-api.nasa.gov/search"
UA = {"User-Agent": "Mozilla/5.0 (SolarSystemExploration image fetcher)"}

MAX_WIDTH = 1500
WEBP_QUALITY = 78
TIMEOUT = 40
# Judge candidates by SOURCE PIXEL WIDTH, never by raw file size. Some of the most
# famous frames are legitimately tiny - Voyager's 1990 "Pale Blue Dot" compresses
# to under 20 KB - and a byte threshold throws exactly those away.
MIN_SRC_WIDTH = 400

# Bytes-per-pixel floor. This is what actually separates a photograph from a
# near-blank video still: the archive returns title cards and black frames that
# pass both a size and a dimension check. A real image runs 0.05-0.3 B/px; a
# 960x540 frame weighing 1 KB is 0.002 B/px and is simply blank.
MIN_BYTES_PER_PIXEL = 0.01
MAX_CANDIDATES = 8         # how many search hits to consider per slot
BUDGET_MB = 2.0

# slot -> search query. Add "nasa_id" to pin an exact asset once you have found
# one you like (its id is shown in the contact sheet and in credits.json).
MANIFEST = [
    # Queries deliberately avoid naming an observatory unless the subject IS the
    # observatory: "Orion Nebula Hubble" surfaces Hubble programme-history pages
    # rather than the nebula.
    # --- formation.html ---
    {"slot": "formation-nebula", "query": "Orion Nebula"},
    {"slot": "formation-protoplanetary-disk", "query": "planet forming disk star"},
    {"slot": "formation-young-star", "query": "newborn star jet nebula"},
    {"slot": "formation-moon-impact", "query": "impact crater Moon surface"},

    # --- exploration.html ---
    {"slot": "exploration-apollo11", "query": "Apollo 11 astronaut lunar surface"},
    {"slot": "exploration-earthrise", "query": "Earthrise"},
    {"slot": "exploration-iss", "query": "International Space Station orbit"},
    {"slot": "exploration-shuttle", "query": "Space Shuttle launch"},
    {"slot": "exploration-perseverance", "query": "Perseverance rover Mars selfie"},
    {"slot": "exploration-pale-blue-dot", "query": "Pale Blue Dot"},

    # --- instruments.html: the hardware ---
    {"slot": "instrument-hubble", "query": "Hubble Space Telescope deployed orbit"},
    {"slot": "instrument-jwst", "query": "James Webb Space Telescope primary mirror"},
    {"slot": "instrument-chandra", "query": "Chandra Observatory spacecraft payload"},
    {"slot": "instrument-parker", "query": "Parker Solar Probe spacecraft"},
    {"slot": "instrument-voyager", "query": "Voyager spacecraft"},

    # --- instruments.html: what the hardware produced ---
    {"slot": "image-hubble-pillars", "query": "Pillars of Creation"},
    {"slot": "image-jwst-carina", "query": "Cosmic Cliffs Carina Nebula"},
    {"slot": "image-cassini-saturn", "query": "Saturn rings spacecraft view"},
]

STOPWORDS = {"the", "and", "for", "with", "from", "above", "its"}


def get(url, timeout=TIMEOUT):
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return r.read()


def terms(query):
    return [w for w in re.findall(r"[a-z0-9]+", query.lower())
            if len(w) > 2 and w not in STOPWORDS]


def score(data, words):
    """Rank a result by query-term overlap. Title matches count double.

    Penalise the tells of a non-photograph: promo graphics and video stills
    routinely outrank the real photo for an obvious query.
    """
    title = (data.get("title") or "").lower()
    desc = (data.get("description") or "").lower()
    s = sum(2 for w in words if w in title) + sum(1 for w in words if w in desc)
    # The archive is full of material that matches the words but is not the
    # photograph anyone means: programme-history montages, mission patches,
    # press graphics. These outrank the real image surprisingly often.
    for bad in ("hangout", "briefing", "logo", "poster", "animation",
                "press conference", "infographic", "history of", "mission patch",
                "patch", "artist concept", "artist's concept", "artist rendering",
                "illustration", "graphic", "screenshot", "interview"):
        if bad in title:
            s -= 5
    if re.fullmatch(r"[a-z]{2,4}-?\d{2,}[a-z0-9-]*", title.strip()):
        s -= 2          # bare archive ids like "KSC-99pp0353" make poor credits
    return s


def candidates(entry):
    """Return [(image_url, credit)] best-first, or (None, reason)."""
    if entry.get("nasa_id"):
        q = urllib.parse.urlencode({"nasa_id": entry["nasa_id"]})
    else:
        q = urllib.parse.urlencode({"q": entry["query"], "media_type": "image"})

    try:
        payload = json.loads(get("%s?%s" % (API, q)))
    except Exception as exc:
        return None, "search failed: %s" % exc

    items = payload.get("collection", {}).get("items", [])[:MAX_CANDIDATES]
    if not items:
        return None, "no results"

    words = terms(entry.get("query", ""))
    ranked = sorted(items, key=lambda it: -score((it.get("data") or [{}])[0], words))

    out = []
    for item in ranked:
        data = (item.get("data") or [{}])[0]
        try:
            assets = json.loads(get(item["href"]))
        except Exception:
            continue
        # Prefer ~large: originals are routinely 20-50 MB, and everything here is
        # downsized to MAX_WIDTH anyway, so pulling the original would waste
        # hundreds of megabytes of transfer to produce the same output.
        url = None
        for suffix in ("~large.jpg", "~medium.jpg", "~orig.jpg"):
            url = next((u for u in assets if u.endswith(suffix)), None)
            if url:
                break
        if not url:
            url = next((u for u in assets
                        if u.endswith(".jpg") and "~thumb" not in u), None)
        if not url:
            continue
        out.append((url, {
            "title": (data.get("title") or "").strip(),
            "nasa_id": data.get("nasa_id", ""),
            "center": data.get("center", "") or "",
            # secondary_creator carries STScI / ESA / institutional credit
            "creator": (data.get("secondary_creator")
                        or data.get("photographer") or "").strip(),
            "url": "https://images.nasa.gov/details/%s" % data.get("nasa_id", ""),
        }))
    if not out:
        return None, "no usable jpg asset in %d results" % len(items)
    return out, None


def process(url, dest):
    """Download, downsize to MAX_WIDTH, save as WebP.

    Returns (bytes, out_w, out_h, src_w) - src_w lets the caller reject
    thumbnails without penalising legitimately small historic frames.
    """
    img = Image.open(io.BytesIO(get(url)))
    src_w = img.width
    if img.mode not in ("RGB", "RGBA"):
        img = img.convert("RGB")
    if img.width > MAX_WIDTH:
        h = round(img.height * MAX_WIDTH / img.width)
        img = img.resize((MAX_WIDTH, h), Image.LANCZOS)
    img.save(dest, "WEBP", quality=WEBP_QUALITY, method=6)
    return os.path.getsize(dest), img.width, img.height, src_w


def load_credits():
    if os.path.exists(CREDITS):
        try:
            with open(CREDITS, encoding="utf-8") as fh:
                return json.load(fh)
        except Exception:
            pass
    return {}


def esc(s):
    """Escape for the contact sheet. Titles contain & and curly quotes; credits
    contain strings like "ESA/Hubble & NASA", which mangle unescaped HTML."""
    return (str(s if s is not None else "")
            .replace("&", "&amp;").replace("<", "&lt;")
            .replace(">", "&gt;").replace('"', "&quot;").replace("'", "&#39;"))


def credit_line(c):
    bits = [b for b in (c.get("creator"), c.get("center")) if b]
    return "NASA" + (" / " + " / ".join(bits) if bits else "")


def write_sheet(credits):
    """A local contact sheet: the only practical way for a human to review these."""
    rows = []
    for e in MANIFEST:
        slot = e["slot"]
        path = os.path.join(OUT_DIR, slot + ".webp")
        if not os.path.exists(path):
            rows.append("<figure class='miss'><div class='ph'>missing</div>"
                        "<figcaption><b>%s</b><br>query: %s</figcaption></figure>"
                        % (esc(slot), esc(e.get("query", ""))))
            continue
        c = credits.get(slot, {})
        kb = os.path.getsize(path) / 1024
        try:
            w, h = Image.open(path).size
        except Exception:
            w = h = 0
        rows.append(
            "<figure><img src='%s.webp' loading='lazy' alt=''>"
            "<figcaption><b>%s</b><br>%s<br>"
            "<span class=m>%s &middot; %d&times;%d &middot; %.0f KB</span><br>"
            "<a href='%s' target='_blank' rel='noopener'>%s</a></figcaption></figure>"
            % (esc(slot), esc(slot), esc(c.get("title", "(no title)")),
               esc(credit_line(c)), w, h, kb,
               esc(c.get("url", "#")), esc(c.get("nasa_id", "")))
        )

    html = """<!doctype html>
<meta charset="utf-8"><title>Image review - Solar System</title>
<style>
 body{background:#08110f;color:#eaf1f1;font:14px/1.5 system-ui,sans-serif;margin:0;padding:24px}
 h1{font-size:1.3rem;margin:0 0 4px} p.lead{color:#b7c9cb;margin:0 0 24px}
 .grid{display:grid;gap:18px;grid-template-columns:repeat(auto-fill,minmax(300px,1fr))}
 figure{margin:0;background:#0c2a33;border:1px solid rgba(150,205,210,.2);border-radius:12px;overflow:hidden}
 img{display:block;width:100%;height:200px;object-fit:cover;background:#0a1e26}
 .ph{height:200px;display:grid;place-items:center;color:#8fa6a8;background:#0a1e26}
 figcaption{padding:10px 12px;font-size:12px}
 .m{color:#8fa6a8} a{color:#f5b942}
 .miss{outline:2px solid #b4442e}
</style>
<h1>Image review</h1>
<p class="lead">Every slot the content pages will use. Tell Claude which slots to
re-fetch and it will try alternatives, or pin a specific NASA id.</p>
<div class="grid">
""" + "\n".join(rows) + "\n</div>\n"
    with open(SHEET, "w", encoding="utf-8") as fh:
        fh.write(html)


def report(credits):
    total = 0
    print("%-32s %9s  %s" % ("slot", "size", "title / credit"))
    print("-" * 96)
    for e in MANIFEST:
        slot = e["slot"]
        path = os.path.join(OUT_DIR, slot + ".webp")
        if not os.path.exists(path):
            print("%-32s %9s  -- MISSING --" % (slot, "-"))
            continue
        kb = os.path.getsize(path) / 1024
        total += os.path.getsize(path)
        c = credits.get(slot, {})
        print("%-32s %7.1fKB  %s  [%s]"
              % (slot, kb, (c.get("title") or "?")[:44], credit_line(c)))
    print("-" * 96)
    print("total %.2f MB (budget %.1f MB)" % (total / 1024 / 1024, BUDGET_MB))


def main():
    ap = argparse.ArgumentParser(description="Fetch NASA imagery for the content pages.")
    ap.add_argument("--force", action="store_true", help="re-fetch images that already exist")
    ap.add_argument("--list", action="store_true", help="print the manifest and exit")
    ap.add_argument("--only", metavar="SLOT", help="fetch a single slot")
    ap.add_argument("--sheet", action="store_true", help="rebuild the contact sheet only")
    ap.add_argument("--report", action="store_true", help="print current files and credits")
    args = ap.parse_args()

    os.makedirs(OUT_DIR, exist_ok=True)
    credits = load_credits()

    if args.sheet:
        write_sheet(credits)
        print("contact sheet -> assets/media/review.html")
        return 0
    if args.report:
        report(credits)
        return 0

    entries = MANIFEST
    if args.only:
        entries = [e for e in MANIFEST if e["slot"] == args.only]
        if not entries:
            print("No such slot: %s" % args.only)
            return 1
    if args.list:
        for e in entries:
            print("  %-32s %s" % (e["slot"], e.get("nasa_id") or e["query"]))
        print("\n%d slots." % len(entries))
        return 0

    failures = []
    for e in entries:
        slot = e["slot"]
        dest = os.path.join(OUT_DIR, slot + ".webp")

        if os.path.exists(dest) and not args.force:
            print("  skip   %-32s %7.1f KB (exists)" % (slot, os.path.getsize(dest) / 1024))
            continue

        found, err = candidates(e)
        if err:
            failures.append((slot, err))
            print("  FAIL   %-32s %s" % (slot, err))
            continue

        # Validate into a temp file, then swap. Writing straight to `dest` meant a
        # --force run where every candidate happened to be rejected would delete the
        # previously curated image - losing a hand-picked asset to a transient API
        # ranking change, and leaving the page with a 404.
        tmp = dest + ".tmp"
        placed = False
        for url, credit in found:
            try:
                size, w, h, src_w = process(url, tmp)
            except Exception:
                continue
            if src_w < MIN_SRC_WIDTH:
                continue          # a thumbnail - try the next candidate
            if w and h and (size / float(w * h)) < MIN_BYTES_PER_PIXEL:
                continue          # near-blank frame or title card, not a photo
            os.replace(tmp, dest)
            credits[slot] = credit
            print("  ok     %-32s %7.1f KB  %d×%d  %s"
                  % (slot, size / 1024, w, h, credit["title"][:38]))
            placed = True
            break
        if os.path.exists(tmp):
            os.remove(tmp)
        if not placed:
            kept = os.path.exists(dest)
            failures.append((slot, "no candidate produced a usable image"
                                   + (" (kept existing file)" if kept else "")))
            print("  FAIL   %-32s no usable candidate%s"
                  % (slot, " - existing file kept" if kept else ""))

    with open(CREDITS, "w", encoding="utf-8") as fh:
        json.dump(credits, fh, indent=2, ensure_ascii=False, sort_keys=True)
        fh.write("\n")
    write_sheet(credits)

    total = sum(os.path.getsize(os.path.join(OUT_DIR, f))
                for f in os.listdir(OUT_DIR) if f.endswith(".webp"))
    print()
    print("  total %.2f MB  |  credits.json + review.html written"
          % (total / 1024 / 1024))
    if total > BUDGET_MB * 1024 * 1024:
        print("  WARNING: over the ~%.1f MB imagery budget." % BUDGET_MB)
    if failures:
        print("\n  %d failed:" % len(failures))
        for slot, why in failures:
            print("    %-32s %s" % (slot, why))
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
