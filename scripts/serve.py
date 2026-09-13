#!/usr/bin/env python3
"""
Solar System - tiny static development server.

Serves the project root over http:// so the site behaves exactly as it will once
deployed. Opening index.html over file:// is NOT equivalent - cross-document view
transitions (@view-transition in css/main.css) and some asset loads misbehave there.

No dependencies: Python standard library only, so there is nothing to install and
nothing to keep up to date.

Launch by double-clicking serve.bat in the project root, or run:

    python scripts/serve.py

Deliberately does NOT inject a live-reload script into pages. Auto-reload works by
inserting a <script> into every HTML response, which would contaminate accessibility
and behaviour testing. Caching is disabled instead, so a plain Ctrl+R always shows
your latest edit.
"""

import functools
import http.server
import os
import sys
import threading
import webbrowser
from urllib.parse import unquote

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PREFERRED_PORT = 8000
PORT_ATTEMPTS = 20


class DevHandler(http.server.SimpleHTTPRequestHandler):
    """Static file handler that forbids browser caching.

    Without this, an edited .css or .js can keep serving from cache and you end up
    debugging a file the browser never re-fetched.
    """

    def end_headers(self):
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()

    def list_directory(self, path):
        """No directory browsing.

        SimpleHTTPRequestHandler generates a browsable index for any directory
        without an index.html. Rooted at the project, that would expose .git/,
        plans/ and .claude/. Loopback-only binding keeps this off the network,
        but anything else on the machine - including a hostile page probing
        localhost in another tab - could still walk the repository.
        """
        self.send_error(404, "No directory listing")
        return None

    def send_head(self):
        # Refuse dot-segments (.git, .claude, a stray .env). translate_path
        # already neutralises ../ traversal, but it serves dotted directories
        # happily. Unquote first so %2e cannot smuggle a dot past the check.
        raw = unquote(self.path.split("?", 1)[0].split("#", 1)[0])
        if any(seg.startswith(".") for seg in raw.split("/") if seg):
            self.send_error(404, "Not found")
            return None
        return super().send_head()

    def log_message(self, fmt, *args):
        sys.stdout.write("  %s\n" % (fmt % args))
        sys.stdout.flush()


# Make sure the project's asset types are served with correct MIME types even on a
# machine whose registry has odd mappings (a known Windows quirk for .js and .css).
DevHandler.extensions_map.update({
    ".js": "text/javascript",
    ".mjs": "text/javascript",
    ".css": "text/css",
    ".json": "application/json",
    ".svg": "image/svg+xml",
    ".webp": "image/webp",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".html": "text/html",
})


def serve_on_first_free_port(handler, start, attempts):
    """Bind the real server to the first free port at or after `start`.

    Returns (httpd, port), or (None, None) if the whole range is taken.

    Binds the actual server rather than probing with a throwaway socket first:
    probing leaves a gap between the check and the real bind in which another
    process can claim the port, which would surface as an uncaught OSError
    traceback instead of the friendly message below.

    Loopback only - 0.0.0.0 would expose the dev server to everyone on the
    local network, which a development server should never do by default.
    """
    for port in range(start, start + attempts):
        try:
            return http.server.ThreadingHTTPServer(("127.0.0.1", port), handler), port
        except OSError:
            continue
    return None, None


def main():
    handler = functools.partial(DevHandler, directory=ROOT)
    httpd, port = serve_on_first_free_port(handler, PREFERRED_PORT, PORT_ATTEMPTS)
    if httpd is None:
        print("  Could not find a free port in range "
              f"{PREFERRED_PORT}-{PREFERRED_PORT + PORT_ATTEMPTS - 1}.")
        print("  Close whatever is using them and try again.")
        return 1

    url = "http://localhost:%d/" % port

    line = "=" * 60
    print(line)
    print("  Solar System - development server")
    print(line)
    print("  Serving : %s" % ROOT)
    print("  Open    : %s" % url)
    print("  Caching : disabled, so Ctrl+R always shows your latest edit")
    print("  Stop    : press Ctrl+C, or just close this window")
    print(line)
    print()

    # Give the server a moment to start listening before the browser requests a page.
    threading.Timer(0.6, lambda: webbrowser.open(url)).start()

    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n  Server stopped.")
    finally:
        httpd.server_close()
    return 0


if __name__ == "__main__":
    sys.exit(main())
