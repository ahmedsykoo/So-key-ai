# So-key Ai

**مساحة عمل ذكاء اصطناعي لنظام أندرويد** — محادثات، وكلاء، مهارات، محطة طرفية، مشاريع وأدوات،
بدعم عربي كامل (RTL) وواجهة قابلة للتخصيص (١٢ ثيمًا، خطوط مخصّصة، تحجيم نص).
An Android AI workspace — chat, agents, skills, terminal, projects and tools, Arabic-first.

| | |
|---|---|
| App name | `So-key Ai` |
| Application ID | `ai.sokey.workspace` |
| Version | `1.0.0` (versionCode 1) |
| minSdk / targetSdk | 24 / 35 (Android 7.0 … Android 15) |
| ABI | universal (no native libs — pure Java + WebView) |
| License | GPL-3.0-or-later |

---

## ما تم إنجازه فعليًا (Verified)

| الحالة | البند |
|---|---|
| ✅ | **APK مبني وموقّع وقابل للتثبيت** — `artifacts/so-key-ai-1.0.0-debug.apk` (≈870 KB) |
| ✅ | المعرّف `ai.sokey.workspace` والاسم `So-key Ai` وأيقونة المشغّل من `so-key-ai-logo.png` |
| ✅ | سلسلة بناء كاملة **بدون Gradle وبدون Android SDK** (aapt2 + ecj + d8 + apksigner) |
| ✅ | واجهة عربية RTL كاملة + تبديل فوري للإنجليزية (LTR) |
| ✅ | ٢٣ شاشة/مسارًا مطابقة للصور المرجعية الخمس |
| ✅ | ١٢ ثيمًا + استيراد خطوط `.ttf/.otf` + تحجيم النص 85/100/115/130% |
| ✅ | محادثات حقيقية مع أي مزوّد متوافق مع OpenAI، و**OmniRoute** بعنوان قابل للتعديل |
| ✅ | بث SSE حقيقي + مسار أصلي (Java) لتجاوز قيود CORS على الشبكة المحلية |
| ✅ | أدوات: طرفية مقيّدة بمساحة العمل، ملفات، GitHub، سير عمل، MCP، متصفح، مثبّت APK |
| ✅ | اختبار واجهة آلي (jsdom): **32/32 ناجح** — `tools/ui-smoke` |
| ⚠️ | لم يُختبر على جهاز/محاكي أندرويد حقيقي من هذه البيئة (لا يوجد جهاز ولا Android SDK) |

التفاصيل الكاملة في [`docs/BUILD_STATUS.md`](docs/BUILD_STATUS.md) و[`docs/TESTING.md`](docs/TESTING.md).

---

## التثبيت

```bash
# من إصدار جاهز
adb install -r artifacts/so-key-ai-1.0.0-debug.apk
# أو انسخ الملف إلى الهاتف وافتحه (اسمح بالتثبيت من مصادر غير معروفة)
```

أول تشغيل: التطبيق يبدأ بواجهة عربية على الثيم الداكن. اذهب إلى
**الإعدادات ← مزوّدو الذكاء الاصطناعي ← OmniRoute** واضبط العنوان:

* `http://127.0.0.1:20128` إذا كان OmniRoute يعمل على نفس الهاتف
* `http://<IP-الجهاز-في-الشبكة>:20128` إذا كان يعمل على حاسوب في نفس الشبكة

ثم اضغط **اختبار OmniRoute**؛ عند النجاح يظهر «متصل» ويمكن اختيار النموذج.

---

## البناء

لا يحتاج المشروع إلى Android SDK ولا إلى Gradle: التطبيق بلا أي تبعية أندرويد خارجية
(لا AndroidX ولا React Native)، لذلك تُستخدم أدوات قياسية تُنزَّل في مجلد مؤقت:

```bash
# 1) أدوات البناء (JDK من PyPI + aapt2/d8/apksigner من npm)  → ~/.cache/sokey-tools
bash scripts/bootstrap-tools.sh

# 2) إعادة توليد الأيقونات من الشعار (اختياري)
python3 scripts/make-assets.py

# 3) بناء APK موقّع بمفتاح التطوير
bash scripts/build-apk.sh --clean
#    → artifacts/so-key-ai-1.0.0-debug.apk

# 4) إصدار موقّع بمفتاحك (لا ترفع المفتاح إلى Git أبدًا)
SOKEY_KEYSTORE=release.keystore SOKEY_KEY_ALIAS=sokey \
SOKEY_STORE_PASS=… SOKEY_KEY_PASS=… bash scripts/build-apk.sh --release
```

خط الأنابيب: `aapt2 compile → aapt2 link → ecj → d8 → zip → zipalign (scripts/zipalign.py) → apksigner → verify`.

سير عمل GitHub Actions (`.github/workflows/android-build.yml`) ينفّذ نفس الخطوات
ويرفع الـ APK كـ artifact في كل دفعة، ويدعم توقيع الإصدار عبر Secrets
(`SOKEY_KEYSTORE_BASE64`, `SOKEY_KEY_ALIAS`, `SOKEY_STORE_PASS`, `SOKEY_KEY_PASS`).

---

## الاختبارات

```bash
# فحص الصياغة
for f in app/src/main/assets/www/js/*.js; do node --check "$f"; done

# اختبار الواجهة الكامل (jsdom + جسر أصلي وهمي + مزوّد وهمي)
cd tools/ui-smoke && npm install && node smoke.mjs && node csscheck.mjs
```

يغطي الاختبار: الإقلاع، ٢٣ مسارًا، تبديل اللغة والاتجاه، الثيمات، تحجيم النص، استيراد الخطوط،
عنوان OmniRoute، بث رد المحادثة وحساب التوكن، الطرفية، الملفات، سير العمل + خدمة الوكلاء،
البحث، التقارير، وزر الرجوع في أندرويد.

---

## بنية المشروع

```
app/src/main/
├── AndroidManifest.xml            المعرّف، الصلاحيات، الأنشطة والخدمات
├── java/ai/sokey/workspace/       طبقة أندرويد الأصلية (Java فقط، بلا تبعيات)
│   ├── MainActivity.java          مضيف WebView + Insets + زر الرجوع + منتقي الملفات
│   ├── NativeBridge.java          واجهة الأدوات الأصلية المكشوفة للـ JS
│   ├── Workspace.java             نظام ملفات مقيّد بمساحة التطبيق
│   ├── HttpTool.java              HTTP + بث SSE (يتجاوز CORS للمزودين المحليين)
│   ├── TerminalTool.java          طرفية مقيّدة بأوامر مساحة العمل
│   ├── AgentService.java          خدمة أمامية لتشغيل الوكلاء/سير العمل
│   ├── BrowserActivity.java       متصفح/معاينة داخل التطبيق
│   ├── ShareProvider.java         مشاركة الملفات وتثبيت APK عبر content://
│   └── BootReceiver.java          استئناف الوكلاء بعد إعادة التشغيل (اختياري)
├── assets/www/                    واجهة المستخدم (HTML/CSS/JS بلا أي مكتبة خارجية)
│   ├── index.html
│   ├── css/{base,components,themes}.css
│   └── js/{i18n,store,api,components,screens,screens2,settings,app}.js
└── res/                           الأيقونات، الثيمات، النصوص (ar/en)، إعدادات الشبكة
scripts/                           أدوات البناء (bootstrap-tools، build-apk، zipalign، الأصول)
tools/ui-smoke/                    اختبار الواجهة الآلي
docs/                              حالة البناء، خريطة الواجهات، الاختبار
```

خريطة الشاشات والتنقّل المستخرجة من الصور المرجعية: [`docs/UI-MAP.md`](docs/UI-MAP.md).

---

## الخصوصية

* لا يوجد أي تتبّع أو إرسال بيانات إلى خدماتنا: التطبيق يتحدث فقط مع المزوّد الذي تضبطه.
* كل الملفات داخل مساحة خاصة بالتطبيق `files/workspace` ولا يمكن للوكيل أو الطرفية الخروج منها.
* مفاتيح API تُخزَّن محليًا في حالة التطبيق على الجهاز فقط.
* `usesCleartextTraffic` مُفعّل لأن مزوّدي الخدمة المحليين (OmniRoute/Ollama/LM Studio) يعملون على HTTP محلي.

## الترخيص

GPL-3.0-or-later — انظر [`LICENSE`](LICENSE).
