#!/usr/bin/env python3
"""Pure-python zipalign replacement (4/16-byte alignment of uncompressed entries).

Usage: zipalign.py [-a 4] input.apk output.apk

Only uncompressed (STORED) entries need alignment; DEFLATEd entries are copied
verbatim. Alignment padding is written as an `0xd935` extra field in the local
file header, exactly like AOSP's zipalign.
"""
from __future__ import annotations

import argparse
import struct
import sys
import time
import zlib
import zipfile

PADDING_FIELD = 0xD935

# entries that Android wants stored uncompressed (and therefore aligned)
STORED_NAMES = ("resources.arsc", "AndroidManifest.xml")
STORED_SUFFIXES = (".so", ".dex", ".png", ".arsc")


def needs_store(name: str) -> bool:
    return name in STORED_NAMES or name.endswith(STORED_SUFFIXES)


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("-a", "--align", type=int, default=4)
    ap.add_argument("-p", "--page-align-shared-libs", action="store_true")
    ap.add_argument("input")
    ap.add_argument("output")
    args = ap.parse_args()

    align = args.align
    with zipfile.ZipFile(args.input) as zin, open(args.output, "wb") as out:
        central: list[bytes] = []
        for info in zin.infolist():
            raw = zin.read(info.filename)
            store = needs_store(info.filename)
            if store:
                data = raw
                method = zipfile.ZIP_STORED
                crc = zlib.crc32(data) & 0xFFFFFFFF
                comp_size = len(data)
            else:
                method = zipfile.ZIP_DEFLATED
                comp = zlib.compressobj(9, zlib.DEFLATED, -15)
                data = comp.compress(raw) + comp.flush()
                crc = zlib.crc32(raw) & 0xFFFFFFFF
                comp_size = len(data)

            name = info.filename.encode("utf-8")
            flag = 0x0800  # UTF-8 names
            if info.is_dir():
                flag |= 0x0000
            # ZIP stores MS-DOS timestamps: 1980..2107. Some packers emit epochs
            # outside that window, so anything odd is normalised instead of crashing.
            y, mo, d, hh, mm, ss = (info.date_time + (0, 0, 0))[:6]
            if y < 1980 or y > 2107:
                y, mo, d, hh, mm, ss = (2009, 1, 1, 0, 0, 0)
            dostime = ((hh & 0x1F) << 11) | ((mm & 0x3F) << 5) | ((ss // 2) & 0x1F)
            dosdate = (((y - 1980) & 0x7F) << 9) | ((mo & 0x0F) << 5) | (d & 0x1F)

            extra = b""
            header_wo_extra = 30 + len(name)
            if store:
                offset = out.tell()
                pad = (-(offset + header_wo_extra)) % align
                if pad:
                    if pad < 4:
                        pad += align
                    extra = struct.pack("<HH", PADDING_FIELD, pad - 4) + b"\x00" * (pad - 4)
            header = struct.pack(
                "<IHHHHHIIIHH",
                0x04034B50, 20, flag, method, dostime, dosdate, crc,
                comp_size, len(raw), len(name), len(extra),
            )
            local_offset = out.tell()
            out.write(header + name + extra + data)
            # central directory record: 48 fixed bytes
            # sig | version_made_by | version_needed | flags | method | time | date
            #     | crc | comp_size | uncomp_size | name_len | extra_len | comment_len
            #     | disk_start | internal_attrs | external_attrs | local_offset
            central.append(
                struct.pack(
                    "<IHHHHHHIIIHHHHHII",
                    0x02014B50,          # signature
                    20 | (20 << 8),      # version made by
                    20,                  # version needed (2.0 — deflate)
                    flag, method, dostime, dosdate,
                    crc, comp_size, len(raw),
                    len(name), len(extra), 0,   # name / extra / comment lengths
                    0, 0,                       # disk start / internal attrs
                    0,                          # external attrs
                    local_offset,
                ) + name + extra
            )

        cd_start = out.tell()
        for rec in central:
            out.write(rec)
        cd_size = out.tell() - cd_start
        count = len(central)
        out.write(
            struct.pack(
                "<IHHHHIIH", 0x06054B50, 0, 0, count, count, cd_size, cd_start, 0
            )
        )
    return 0


if __name__ == "__main__":
    sys.exit(main())
