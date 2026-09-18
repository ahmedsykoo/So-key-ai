#!/usr/bin/env python3
"""Validate the root element of every XML file under app/src/main/res.

aapt2 accepts almost any XML, so a wrong root element (for example a network
security config wrapped in <resources>) compiles cleanly and only explodes on the
device — Android parses android:networkSecurityConfig while the process starts and
throws, which looks exactly like "the app keeps stopping". This check closes that
gap in the Gradle-less build.
"""
from __future__ import annotations

import sys
import xml.etree.ElementTree as ET
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
RES = ROOT / "app/src/main/res"

# directory / file -> allowed root elements
BY_NAME = {
    "xml/network_security_config.xml": {"network-security-config"},
    "xml/locales_config.xml": {"locale-config"},
}
BY_DIR = {
    "values": {"resources"},
    "drawable": {"shape", "layer-list", "selector", "vector", "bitmap", "ripple",
                 "inset", "level-list", "transition", "animation-list", "animated-vector",
                 "clip-path", "scale", "set", "nine-patch", "color"},
    "layout": {"LinearLayout", "FrameLayout", "RelativeLayout", "ScrollView", "merge",
               "androidx.constraintlayout.widget.ConstraintLayout"},
    "menu": {"menu"},
    "anim": {"set", "alpha", "scale", "translate", "rotate"},
}
BY_MIPMAP_DIR_PREFIX = {"mipmap-anydpi-v26": {"adaptive-icon"}}


def expected(rel: str) -> set[str] | None:
    rel_norm = rel.replace("\\", "/")
    if rel_norm in BY_NAME:
        return BY_NAME[rel_norm]
    top = rel_norm.split("/", 1)[0]
    if top in BY_MIPMAP_DIR_PREFIX:
        return BY_MIPMAP_DIR_PREFIX[top]
    base = top.split("-", 1)[0]
    return BY_DIR.get(base)


def main() -> int:
    failures: list[str] = []
    checked = 0
    for path in sorted(RES.rglob("*.xml")):
        rel = path.relative_to(RES).as_posix()
        if rel.startswith("mipmap-") and "-anydpi" in rel:
            pass
        expected_roots = expected(rel)
        if expected_roots is None and not rel.startswith("mipmap-"):
            continue
        try:
            root = ET.parse(path).getroot()
        except ET.ParseError as e:
            failures.append(f"{rel}: XML parse error — {e}")
            continue
        checked += 1
        tag = root.tag
        if expected_roots and tag not in expected_roots:
            failures.append(
                f"{rel}: root <{tag}> is invalid — expected one of "
                f"{', '.join('<' + t + '>' for t in sorted(expected_roots))}"
            )

    # the manifest must keep the app identity stable
    manifest = ET.parse(ROOT / "app/src/main/AndroidManifest.xml").getroot()
    if manifest.get("package") != "ai.sokey.workspace":
        failures.append("AndroidManifest.xml: package must be ai.sokey.workspace")
    if manifest.find("application") is None:
        failures.append("AndroidManifest.xml: missing <application>")

    if failures:
        print("\033[1;31m[resources] invalid resource files:\033[0m", file=sys.stderr)
        for f in failures:
            print("  - " + f, file=sys.stderr)
        return 1
    print(f"\033[1;32m[resources] {checked} XML resources validated (package ai.sokey.workspace)\033[0m")
    return 0


if __name__ == "__main__":
    sys.exit(main())
