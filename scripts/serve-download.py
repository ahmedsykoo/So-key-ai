#!/usr/bin/env python3
"""Tiny download server for the demo APK.

    python3 scripts/serve-download.py [port] [--dir artifacts/dl]

Serves the download page at "/" and the newest APK at the stable path
"/so-key-ai.apk" (so the link never changes between builds), with the proper
Android MIME type and a Content-Disposition that makes browsers save the file
instead of rendering it.
"""
from __future__ import annotations

import http.server
import os
import re
import socketserver
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DIR = ROOT / "artifacts" / "dl"
STABLE_PATH = "/so-key-ai.apk"


def newest_apk() -> Path | None:
    candidates = sorted(
        (ROOT / "artifacts").glob("so-key-ai-*.apk"),
        key=lambda p: p.stat().st_mtime,
        reverse=True,
    )
    return candidates[0] if candidates else None


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(DIR), **kwargs)

    def log_message(self, fmt, *args):  # quieter logs
        sys.stderr.write("  %s\n" % (fmt % args))

    def _serve_apk(self, apk: Path):
        size = apk.stat().st_size
        self.send_response(200)
        self.send_header("Content-Type", "application/vnd.android.package-archive")
        self.send_header("Content-Disposition", 'attachment; filename="%s"' % apk.name)
        self.send_header("Content-Length", str(size))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        with open(apk, "rb") as fh:
            self.copyfile(fh, self.wfile)

    def do_HEAD(self):
        if self.path.rstrip("/") == STABLE_PATH:
            apk = newest_apk()
            if apk:
                self.send_response(200)
                self.send_header("Content-Type", "application/vnd.android.package-archive")
                self.send_header("Content-Disposition",
                                 'attachment; filename="%s"' % apk.name)
                self.send_header("Content-Length", str(apk.stat().st_size))
                self.end_headers()
                return
        super().do_HEAD()

    def do_GET(self):
        path = self.path.split("?")[0]
        if path.rstrip("/") == STABLE_PATH:
            apk = newest_apk()
            if not apk:
                self.send_error(404, "no APK built yet")
                return
            self._serve_apk(apk)
            return
        if path in ("/", "/index.html"):
            # keep the landing page's download link pointing at the stable path
            page = (DIR / "index.html")
            if page.exists():
                html = page.read_text(encoding="utf-8")
                html = re.sub(r'href="so-key-ai-[^"]+\.apk"', 'href="%s"' % STABLE_PATH, html)
                body = html.encode("utf-8")
                self.send_response(200)
                self.send_header("Content-Type", "text/html; charset=utf-8")
                self.send_header("Content-Length", str(len(body)))
                self.send_header("Cache-Control", "no-store")
                self.end_headers()
                self.wfile.write(body)
                return
        super().do_GET()


def main() -> int:
    port = int(os.environ.get("SOKEY_DOWNLOAD_PORT", "8081"))
    for arg in sys.argv[1:]:
        if arg.isdigit():
            port = int(arg)
        elif arg.startswith("--dir="):
            global DIR
            DIR = Path(arg.split("=", 1)[1]).resolve()

    DIR.mkdir(parents=True, exist_ok=True)
    socketserver.TCPServer.allow_reuse_address = True
    apk = newest_apk()
    print(f"serving {DIR}")
    print(f"  page   : http://0.0.0.0:{port}/")
    print(f"  apk    : http://0.0.0.0:{port}{STABLE_PATH}  ->  {apk.name if apk else 'none'}")
    with socketserver.TCPServer(("0.0.0.0", port), Handler) as httpd:
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            pass
    return 0


if __name__ == "__main__":
    sys.exit(main())
