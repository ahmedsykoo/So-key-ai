# SO-KEY AI — AI HANDOFF / CONTINUATION BRIEF

## الهدف النهائي
أكمل مشروع **So-key Ai** حتى يصبح Android app قابلًا للبناء والتثبيت والتشغيل فعليًا.

المطلوب:
- تنفيذ عملي، وليس شرحًا نظريًا.
- إصلاح ما يمنع البناء والتشغيل.
- إنتاج APK قابل للتثبيت.
- الحفاظ على UI خفيف وسلس وحديث.
- دعم العربية.
- توفير تحديثات مختصرة جدًا لتوفير الـ tokens.
- افحص الموجود أولًا، ولا تعيد تنفيذ ميزة موجودة.

## المشروع الحالي
Release Candidate ZIP:
`/mnt/data/So-key-Ai-release-candidate.zip`

بعد فك الضغط:
`/tmp/sokeycheck/foundation/so-key-ai`

ونسخة العمل:
`/mnt/data/buildwork/foundation/so-key-ai`

البراند:
- App name: `So-key Ai`
- Android package/application ID: `ai.sokey.workspace`
- Version: `1.0.0`
- Slug: `so-key-ai`
- License: GPL-3.0-or-later

## فكرة التطبيق
Workspace للذكاء الاصطناعي على Android، مبني على أساس مشروع Shelly مفتوح المصدر، ويستهدف:
- AI chat
- Agents
- Terminal
- Skills / Plugins
- GitHub
- MCP / A2A
- Browser / automation
- Multiple AI providers
- OmniRoute OpenAI-compatible provider
- Themes / chat styles
- Arabic localization
- Custom fonts
- UI text scaling
- Android-native capabilities

ليس المطلوب Demo شكلي، بل تطبيق قابل للاستخدام.

## المصدر والترخيص
المصدر الأساسي:
`RYOITABASHI/Shelly`

Shelly مرخص GPL-3.0.
حافظ على attribution/license ومتطلبات GPL عند التوزيع، ولا تدّعِ ملكية الكود المقتبس.

## الموجود بالفعل
حسب حالة المشروع الحالية:
- So-key Ai branding
- S+key logo
- Android ID `ai.sokey.workspace`
- OmniRoute OpenAI-compatible integration
- default OmniRoute URL: `http://127.0.0.1:20128`
- default model: `auto`
- runtime theme system
- built-in font picker
- import `.ttf` / `.otf`
- persistent custom-font metadata
- sandboxed font files
- global text scaling: 85 / 100 / 115 / 130%
- Arabic localization foundation + English + Japanese
- terminal
- agents
- skills/plugins
- GitHub
- MCP/A2A
- browser
- automation machinery

**لا تعتمد على docs وحدها. افحص الكود الفعلي قبل اعتبار feature مكتملة.**

## أهم حالة البناء
المشكلة الأساسية حاليًا هي build infrastructure، وليس فكرة التطبيق.

البيئة السابقة:
- Node موجود تقريبًا `22.16.0`
- Java/Javac موجود
- Android SDK غير متوفر
- Gradle executable غير متوفر
- `android/gradlew` غير موجود
- `node_modules` غير موجود في ZIP
- network/registry في البيئة الحالية غير متاح بشكل كافٍ لتثبيت كل dependencies

ملف الحالة:
`docs/BUILD_STATUS.md`

لذلك لم يكن هناك APK نهائي موثوق حتى الآن.

## package.json
الإصدارات الأساسية تقريبًا:
- Expo `~54.0.29`
- React Native `0.81.5`
- React `19.1`
- NativeWind
- expo-font
- expo-document-picker
- expo-secure-store
- expo-router
- `@openai/codex` `^0.119.0`

Scripts المهمة:
- `start`
- `android`
- `ios`
- `check`
- `test`
- `lint`
- `bridge`
- `build:gate`

**افحص lockfile واستخدم package manager الصحيح. لا تخمن.**

## Android config
`app.config.ts` يحتوي على:
- package `ai.sokey.workspace`
- min SDK 24
- ABI `arm64-v8a`
- permissions للـ notifications / foreground service / exact alarm / boot completed / battery optimization / all-files / install packages / network state
- plugins للـ terminal service / security / APK installer / saved state / configuration guard / remote input / audio / video / splash / localization / build properties

لا تضف permissions/plugins عشوائيًا.

## تحذير مهم جدًا عن EAS
`app.config.ts` يحتوي EAS project ID موروثًا من Shelly:
`e0d124cb-e18f-46c4-aca2-e19e48ba04fc`

لا تعتبره مشروع So-key الخاص بالمستخدم.
لا تستخدمه في release النهائي بدون التحقق من ownership.
الأفضل build مستقل.

## GitHub
الحساب المتصل:
`ahmedsykoo`

Repository معروف:
`ahmedsykoo/Super-Driver-`

**هذا مشروع مختلف. لا تضع So-key داخله ولا تعدله إلا بطلب صريح.**
الأفضل repository مستقل لـ So-key Ai.
إذا لم تتوفر صلاحية إنشاء repo، جهز workflow/source ولا تخرب repo آخر.

## المطلوب تنفيذه بالترتيب

### 1. Inspection
افحص أولًا:
- `package.json`
- lockfile
- `app.config.ts`
- `android/`
- `docs/BUILD_STATUS.md`
- `README.md`
- `.github/workflows/`

وابحث عن:
- `Shelly`
- `e0d124cb-e18f-46c4-aca2-e19e48ba04fc`
- `OmniRoute`
- `20128`
- theme
- font
- scaling
- localization

استخدم search/grep/rg بدل عرض الملفات كاملة.

### 2. Cleanup
أصلح:
- Shelly branding غير المقصود
- EAS reference غير المملوك
- README/docs القديمة
- package metadata
- app name / package / icons / splash
- broken references

مع الحفاظ على GPL attribution/license.

### 3. Build pipeline
جهز Android build قابل للتكرار، ويفضل GitHub Actions إذا لم يتوفر Android SDK محليًا.

Workflow منطقي:
1. checkout
2. setup Node
3. install dependencies من lockfile
4. setup Java
5. setup Android SDK
6. install required SDK packages
7. install required NDK إذا كان مطلوبًا
8. prebuild/generate native project إذا لزم
9. build APK
10. upload APK artifact

يجب أن يكون متوافقًا مع Expo 54 / RN 0.81.5 / native modules الحالية.

### 4. Gradle / native
المشروع لا يحتوي `gradlew`.
قبل إضافة wrapper أو إعادة prebuild:
- افحص هل Android project مكتمل.
- افحص الـ config plugins.
- لا تمسح native customizations بلا سبب.

### 5. NDK
هناك مؤشر سابق على الحاجة إلى:
`26.1.10909125`

تحقق من Gradle/native dependencies قبل تثبيتها.

### 6. APK
أول هدف:
**debug/installable APK** لإثبات أن التطبيق يعمل.

بعد نجاحه يمكن تجهيز release signing.
لا تضع keystore/private key داخل source أو chat.
استخدم GitHub Secrets إذا لزم.

### 7. Testing
Static:
- TypeScript
- lint
- tests
- build gate

Android:
- APK موجود
- package ID صحيح
- app name صحيح
- arm64 مناسب
- لا crash عند launch

Functional:
- startup
- chat
- themes
- Arabic
- fonts
- text scaling
- settings
- OmniRoute
- terminal
- agents/skills navigation

Compile success وحده لا يعني أن التطبيق انتهى.

## OmniRoute
المستخدم يشغل OmniRoute محليًا.
نسخة مستخدمة سابقًا تقريبًا:
`OmniRoute v3.8.50`

عناوين استُخدمت سابقًا:
- `http://iocaihost:20128`
- `http://localhost:20128`
- `http://127.0.0.1:20128`

لذلك اجعل Base URL قابلًا للتعديل.
لا تربط التطبيق بـ hostname واحد.
Default يمكن أن يكون `http://127.0.0.1:20128`.

## الجهاز المستهدف
- Realme 10
- Android 14
- model `RMX3630`
- arm64

الهدف الأساسي APK يعمل على Android 14.

## قواعد توفير الـ tokens
**لا تفعل:**
- لا تطبع ملفات كاملة.
- لا ترسل logs ضخمة.
- لا تعيد شرح المشروع كاملًا بعد كل خطوة.
- لا تعيد كتابة code موجود بدون سبب.
- لا تبحث عن معلومات يمكن استخراجها من source.
- لا تسأل عن كل خطوة صغيرة.
- لا تغيّر عشرات الملفات بلا ضرورة.

**افعل:**
- استخدم `find`, `grep`, `rg`, `git diff`, `git status`.
- اعرض فقط النتائج المهمة.
- نفذ التعديلات مباشرة.
- اختبر بعد كل مجموعة تعديلات.
- عند الخطأ اعرض آخر 30-80 سطر فقط.
- احتفظ بتقدم مختصر في:
  `docs/AI_HANDOFF_PROGRESS.md`

تحديثات مناسبة:
`[1/5] Inspecting`
`[2/5] Fixing build`
`[3/5] Adding CI`
`[4/5] Testing`
`[5/5] APK result`

## استراتيجية الأخطاء
إذا فشل build:
1. حدد أول error حقيقي.
2. أصلح سببًا واحدًا.
3. أعد الاختبار.
4. لا تخفِ الخطأ بحلول مؤقتة.
5. لا تعمل upgrades/downgrades عشوائية.
6. أصلح config/plugin في المصدر بدل تعديل generated files فقط عندما يكون ذلك هو السبب.

## تعريف النجاح
النجاح يعني:
**So-key Ai Android app**
+
**package `ai.sokey.workspace`**
+
**OmniRoute provider**
+
**Arabic**
+
**Themes**
+
**Custom fonts**
+
**Text scaling**
+
**Terminal / Agents / Skills foundation**
+
**Android build pipeline**
+
**actual installable APK**

وليس README يقول إن كل ذلك موجود.

## شرط الصدق
لا تقل "جاهز" إلا إذا:
- build نجح فعليًا
- APK تم إنتاجه
- package ID صحيح
- يمكن تحديد مكان APK

إذا تعذر البناء بسبب Android SDK/network:
- جهز كل شيء ممكن.
- جهز GitHub Actions.
- لا تدّعِ أن APK تم إنتاجه.

## نقطة البداية
ابدأ فورًا:
1. افحص المشروع.
2. افحص package + lockfile.
3. افحص Android config.
4. افحص workflows.
5. ابحث عن Shelly/EAS/OmniRoute.
6. `git status`.
7. لا تلمس Super-Driver.
8. نفذ build pipeline.
9. شغل checks.
10. ابنِ APK أو جهز CI لإنتاجه.

**طريقة العمل المختصرة:**
افحص → عدّل → اختبر → أصلح → ابنِ → تحقق.

لا تستهلك الـ tokens في محادثة طويلة. التفاصيل الكبيرة توضع في ملفات المشروع، والـ chat يستخدم فقط للنتائج والقرارات المهمة.
