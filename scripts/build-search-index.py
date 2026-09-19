#!/usr/bin/env python3
"""Build js/search-index.js from the site's own built HTML.

    python scripts/build-search-index.py

WHY PYTHON, not Node like scripts/build-planets.js: there is no Node on the
author's machine, so a Node generator can only ever run in CI and the index
would drift silently between pushes. Python 3 is present, uses only the
standard library here, and so this can be re-run locally whenever content
changes. CI checks it the same way it checks the planet pages.

WHY IT PARSES THE BUILT HTML rather than js/data.js: the eight planet pages
are fully baked static HTML, and the three article pages are hand-written
prose that exists nowhere else. Parsing the rendered pages indexes exactly
what a reader can actually see, in one pass, with no second source of truth.

WHY A .js FILE, not .json: nothing on this site performs a runtime fetch, and
that is deliberate -- the pages are required to work from file://, where fetch
of a local JSON is blocked by CORS. A plain <script> assigning a global keeps
that guarantee.
"""

import html
import json
import pathlib
import re
import sys
from html.parser import HTMLParser

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / "js" / "search-index.js"

PAGES = [
    ("index.html", "Solar System", "page"),
    ("formation.html", "How the Solar System formed", "article"),
    ("exploration.html", "Fifty years beyond Earth", "article"),
    ("instruments.html", "The instruments", "article"),
]
PLANETS = ["mercury", "venus", "earth", "mars", "jupiter", "saturn", "uranus", "neptune"]

# Chrome, not content: navigation, the skip link, the injected mobile bar, and
# the cosmic background would otherwise appear in every single record.
SKIP_TAGS = {"script", "style", "svg", "noscript", "template"}
SKIP_CLASSES = {
    "topbar", "tabbar", "sheet", "skip-link", "cosmos", "nav__links",
    "neighbors", "content-next", "source-tag", "backlink-bar", "scroll-cue",
    "selector__list", "figure__credit", "planet-orb__note",
}


class Extractor(HTMLParser):
    """Collect (anchor, heading, text) records, split at h1/h2/h3."""

    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.records = []
        self.depth_skip = 0          # >0 while inside a skipped subtree
        self.skip_stack = []
        self.id_stack = []           # ids of currently-open elements
        self.cur = None              # record being accumulated
        self.in_heading = None
        self.heading_buf = []
        self.heading_id = None
        self.open_tags = []

    # -- helpers ----------------------------------------------------------
    @staticmethod
    def _tidy(text):
        """Collapse whitespace, then undo the gap left before punctuation.

        _gap() inserts a space at every tag boundary, which is correct inside a
        sentence but wrong when the boundary falls between a word and its own
        full stop: "How it all began<span>.</span>" came out as "began .".
        """
        text = re.sub(r"\s+", " ", text).strip()
        return re.sub(r" +([.,;:!?%’)\]])", r"\1", text)

    def _flush(self):
        if self.cur and self.cur["b"].strip():
            self.cur["b"] = self._tidy(self.cur["b"])
            self.records.append(self.cur)
        self.cur = None

    def _start_record(self, heading, anchor):
        self._flush()
        self.cur = {"s": heading, "a": anchor or "", "b": ""}

    # -- parser hooks -----------------------------------------------------
    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        self.open_tags.append(tag)
        classes = set((a.get("class") or "").split())
        if tag in SKIP_TAGS or (classes & SKIP_CLASSES):
            self.depth_skip += 1
            self.skip_stack.append(len(self.open_tags))
            return
        if self.depth_skip:
            return
        self._gap()
        self.id_stack.append((len(self.open_tags), a.get("id")))
        if tag in ("h1", "h2", "h3"):
            self.in_heading = tag
            self.heading_buf = []
            # Prefer the heading's own id; fall back to the nearest ancestor's.
            self.heading_id = a.get("id") or self._nearest_id()

    def handle_endtag(self, tag):
        if self.skip_stack and self.skip_stack[-1] == len(self.open_tags):
            self.skip_stack.pop()
            self.depth_skip -= 1
        while self.id_stack and self.id_stack[-1][0] >= len(self.open_tags):
            self.id_stack.pop()
        if self.open_tags:
            self.open_tags.pop()
        if not self.depth_skip:
            self._gap()
        if self.in_heading == tag:
            text = self._tidy("".join(self.heading_buf))
            if text:
                self._start_record(text, self.heading_id)
            self.in_heading = None

    def handle_data(self, data):
        if self.depth_skip:
            return
        if self.in_heading:
            self.heading_buf.append(data)
        elif self.cur is not None:
            self.cur["b"] += data
        # Text before the first heading is front-matter; deliberately dropped.

    def _gap(self):
        """Insert whitespace at every tag boundary.

        Without this, markup that carries no literal space between elements is
        silently welded together: "Eight worlds.<br>One star." became
        "Eight worlds.One star." and three sibling <span>s became
        "8 planets1 starReal NASA data" -- neither of which a reader could ever
        match by typing what they saw. Runs are collapsed on flush, so the
        extra spaces cost nothing.
        """
        if self.in_heading:
            self.heading_buf.append(" ")
        elif self.cur is not None:
            self.cur["b"] += " "

    def _nearest_id(self):
        for _, i in reversed(self.id_stack):
            if i:
                return i
        return None

    def close(self):
        super().close()
        self._flush()
        return self.records


def page_title(src):
    m = re.search(r"<title>(.*?)</title>", src, re.S)
    return html.unescape(m.group(1)).strip() if m else ""


def build():
    docs = []
    targets = [(p, t, k) for p, t, k in PAGES]
    targets += [("planet/%s.html" % p, p.capitalize(), "planet") for p in PLANETS]

    for rel, _label, kind in targets:
        path = ROOT / rel
        if not path.exists():
            sys.exit("missing page: %s" % rel)
        src = path.read_text(encoding="utf-8")
        title = page_title(src)
        ex = Extractor()
        ex.feed(src)
        for r in ex.close():
            body = r["b"]
            if len(body) < 12:          # a heading with no prose under it
                continue
            docs.append({
                "u": rel.replace("\\", "/"),
                "a": r["a"],
                "t": title,
                "s": r["s"],
                "k": kind,
                "b": body[:1200],       # generous; snippets never need more
            })
    return docs


def main():
    docs = build()
    payload = json.dumps(docs, ensure_ascii=False, separators=(",", ":"))
    banner = (
        "/* GENERATED by scripts/build-search-index.py - do not edit by hand.\n"
        "   Re-run after changing any page's prose:  python scripts/build-search-index.py\n"
        "   Assigned as a global rather than fetched, so search keeps working\n"
        "   from file:// like the rest of the site. */\n"
    )
    OUT.write_text(banner + "window.SEARCH_INDEX = " + payload + ";\n",
                   encoding="utf-8", newline="\n")
    words = sum(len(d["b"].split()) for d in docs)
    print("wrote %s" % OUT.relative_to(ROOT))
    print("  %d records from %d pages, %d words, %.1f KB"
          % (len(docs), len({d["u"] for d in docs}), words, OUT.stat().st_size / 1024))


if __name__ == "__main__":
    main()
