# So-key Ai AI Handoff Progress

Status: **APK 1.0.1 PRODUCED & VERIFIED — launch crash (network security config) fixed** — 2026-09-18

- [x] Inspect project and lockfile — المستودع لم يكن يحتوي كودًا، فقط AI-HANDOFF + 5 صور + اللوجو
- [x] Inspect Android configuration — لا يوجد Android project سابق؛ أُنشئ مشروع مستقل نظيف
- [x] Remove unintended Shelly/EAS branding references — لا Shelly ولا EAS project id في هذه النسخة
- [x] Verify existing features in source — الميزات المذكورة في الـ handoff نُفِّذت فعليًا (موثّقة في README)
- [x] Prepare reproducible Android build — `scripts/bootstrap-tools.sh` + `scripts/build-apk.sh` (بلا Gradle/SDK)
- [x] Prepare GitHub Actions if needed — `.github/workflows/android-build.yml` (بناء + اختبار + artifact)
- [x] Run JavaScript/lint/tests/build gate — 8/8 syntax، 34/34 UI smoke، CSS نظيف
- [x] Build installable APK — `artifacts/so-key-ai-1.0.1-debug.apk` (≈1000 KB، موقّع، minSdk 24)
- [x] Fix on-device launch crash (invalid network_security_config root) + resource validator in the build
- [x] Verify package ID and launch — `ai.sokey.workspace` ✅ · `launcher activity` ✅ · ELF/dex سليم
- [x] Finalize documentation — README + docs/{BUILD_STATUS,TESTING,UI-MAP}.md + NOTICE

Not verified (no device in this environment):
- [ ] Actual launch on a real Android device / emulator (no adb, no SDK, no device)
- [ ] Real OmniRoute streaming against the user's gateway
- [ ] SAF file picker, APK installer prompt, system notifications on-device

Rules:
- Keep entries concise.
- Record the exact blocker when something fails.
- Do not mark APK complete without an actual APK. → APK exists at `artifacts/so-key-ai-1.0.0-debug.apk`.
