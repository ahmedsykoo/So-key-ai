#!/usr/bin/env bash
# So-key Ai — build a signed, installable APK without Gradle / Android SDK.
#
#   scripts/build-apk.sh [--release] [--clean]
#
# Pipeline: aapt2 compile -> aapt2 link -> ecj (java) -> d8 (dex) -> zip
#           -> zipalign -> apksigner -> verification
#
# Signing:
#   debug   (default) ... the well-known android debug keystore
#   release (--release) . env SOKEY_KEYSTORE / SOKEY_KEY_ALIAS /
#                         SOKEY_STORE_PASS / SOKEY_KEY_PASS
#                         (never commit a keystore or its passwords)
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CACHE_DIR="${SOKEY_TOOLS_DIR:-$HOME/.cache/sokey-tools}"
OUT_DIR="${SOKEY_OUT_DIR:-$ROOT/artifacts}"
BUILD_DIR="$ROOT/build/offline"
APP_DIR="$ROOT/app/src/main"
JAVA_SRC="$APP_DIR/java"

MODE="debug"
CLEAN=0
for arg in "$@"; do
  case "$arg" in
    --release) MODE="release" ;;
    --clean) CLEAN=1 ;;
    *) echo "unknown argument: $arg" >&2; exit 2 ;;
  esac
done

say() { printf '\033[1;36m[build]\033[0m %s\n' "$1"; }
step() { printf '\033[1;32m  →\033[0m %s\n' "$1"; }
die() { printf '\033[1;31m[build] %s\033[0m\n' "$1" >&2; exit 1; }

# ---------------------------------------------------------------- toolchain
if [ ! -f "$CACHE_DIR/env.sh" ]; then
  say "toolchain missing — running scripts/bootstrap-tools.sh"
  "$ROOT/scripts/bootstrap-tools.sh"
fi
# shellcheck disable=SC1090
. "$CACHE_DIR/env.sh"

VERSION_NAME="$(grep -oP 'android:versionName="\K[^"]+' "$APP_DIR/AndroidManifest.xml" | head -1)"
VERSION_CODE="$(grep -oP 'android:versionCode="\K[^"]+' "$APP_DIR/AndroidManifest.xml" | head -1)"
APP_LABEL="$(grep -oP 'android:label="\K[^"]+' "$APP_DIR/AndroidManifest.xml" | head -1)"

[ "$CLEAN" = "1" ] && rm -rf "$BUILD_DIR"
mkdir -p "$BUILD_DIR"/{res,gen,classes,dex,apk,final} "$OUT_DIR"
rm -rf "$BUILD_DIR/gen" "$BUILD_DIR/classes"
mkdir -p "$BUILD_DIR/gen" "$BUILD_DIR/classes"

say "So-key Ai $VERSION_NAME ($VERSION_CODE) — mode: $MODE"

# 1. resources -------------------------------------------------------------
step "aapt2 compile resources"
if find "$APP_DIR/res" -type f | grep -q .; then
  "$SOKEY_AAPT2" compile --dir "$APP_DIR/res" -o "$BUILD_DIR/res/compiled.zip" >/dev/null
else
  die "no resources found in $APP_DIR/res"
fi

step "aapt2 link"
"$SOKEY_AAPT2" link \
  -o "$BUILD_DIR/apk/resources.apk" \
  -I "$SOKEY_ANDROID_JAR" \
  --manifest "$APP_DIR/AndroidManifest.xml" \
  --java "$BUILD_DIR/gen" \
  --min-sdk-version 24 \
  --target-sdk-version 35 \
  --version-code "$VERSION_CODE" \
  --version-name "$VERSION_NAME" \
  -A "$APP_DIR/assets" \
  --auto-add-overlay \
  "$BUILD_DIR/res/compiled.zip"

# 2. java ------------------------------------------------------------------
step "compiling java sources (ecj)"
find "$JAVA_SRC" "$BUILD_DIR/gen" -name '*.java' > "$BUILD_DIR/sources.txt"
SOURCE_COUNT="$(wc -l < "$BUILD_DIR/sources.txt" | tr -d ' ')"
echo "      $SOURCE_COUNT source files"
"$JAVA_HOME/bin/java" -jar "$SOKEY_ECJ_JAR" \
  -source 1.8 -target 1.8 -encoding UTF-8 -nowarn -proc:none \
  -bootclasspath "$SOKEY_ANDROID_JAR" -classpath "$SOKEY_ANDROID_JAR" \
  -d "$BUILD_DIR/classes" \
  @"$BUILD_DIR/sources.txt" 2>&1 | grep -vE '^(Note|WARNING)' | head -40 || true
CLASS_COUNT="$(find "$BUILD_DIR/classes" -name '*.class' | wc -l | tr -d ' ')"
[ "$CLASS_COUNT" -gt 0 ] || die "java compilation produced no classes"
step "compiled $CLASS_COUNT classes"

# 3. dex -------------------------------------------------------------------
step "dexing with d8"
find "$BUILD_DIR/classes" -name '*.class' > "$BUILD_DIR/classes.txt"
"$JAVA_HOME/bin/java" -cp "$SOKEY_D8_JAR" com.android.tools.r8.D8 \
  --min-api 24 --release --lib "$SOKEY_ANDROID_JAR" \
  --output "$BUILD_DIR/dex" \
  @"$BUILD_DIR/classes.txt"
ls "$BUILD_DIR/dex"/classes*.dex >/dev/null || die "d8 produced no dex"

# 4. package ---------------------------------------------------------------
step "packaging APK"
cp "$BUILD_DIR/apk/resources.apk" "$BUILD_DIR/final/app-unsigned.apk"
( cd "$BUILD_DIR/dex" && zip -q -u -X "../final/app-unsigned.apk" ./*.dex )

step "aligning (4 bytes)"
python3 "$ROOT/scripts/zipalign.py" -a 4 "$BUILD_DIR/final/app-unsigned.apk" "$BUILD_DIR/final/app-aligned.apk"

# 5. sign ------------------------------------------------------------------
if [ "$MODE" = "release" ]; then
  KS="${SOKEY_KEYSTORE:?set SOKEY_KEYSTORE for --release}"
  KS_ALIAS="${SOKEY_KEY_ALIAS:?set SOKEY_KEY_ALIAS for --release}"
  KS_STORE_PASS="${SOKEY_STORE_PASS:?set SOKEY_STORE_PASS for --release}"
  KS_KEY_PASS="${SOKEY_KEY_PASS:-$KS_STORE_PASS}"
  SIGN_SUFFIX="release"
else
  KS="$SOKEY_DEBUG_KEYSTORE"
  KS_ALIAS="androiddebugkey"
  KS_STORE_PASS="android"
  KS_KEY_PASS="android"
  SIGN_SUFFIX="debug"
fi

step "signing ($MODE)"
JAVA_TOOL_OPTIONS="--enable-native-access=ALL-UNNAMED" "$JAVA_HOME/bin/java" -jar "$SOKEY_APKSIGNER_JAR" sign \
  --ks "$KS" --ks-key-alias "$KS_ALIAS" \
  --ks-pass "pass:$KS_STORE_PASS" --key-pass "pass:$KS_KEY_PASS" \
  --v1-signing-enabled true --v2-signing-enabled true --v3-signing-enabled true \
  --out "$BUILD_DIR/final/app-signed.apk" "$BUILD_DIR/final/app-aligned.apk" 2>&1 | grep -v WARNING || true

# 6. verify ----------------------------------------------------------------
step "verifying"
JAVA_TOOL_OPTIONS="--enable-native-access=ALL-UNNAMED" "$JAVA_HOME/bin/java" -jar "$SOKEY_APKSIGNER_JAR" verify --print-certs "$BUILD_DIR/final/app-signed.apk" | head -5

APK_NAME="so-key-ai-${VERSION_NAME}-${SIGN_SUFFIX}.apk"
cp "$BUILD_DIR/final/app-signed.apk" "$OUT_DIR/$APK_NAME"
SIZE="$(du -h "$OUT_DIR/$APK_NAME" | cut -f1)"

echo
say "APK: $OUT_DIR/$APK_NAME ($SIZE)"
"$SOKEY_AAPT2" dump badging "$OUT_DIR/$APK_NAME" | grep -E "^(package|application-label|sdkVersion|targetSdkVersion|launchable-activity|native-code)" || true
