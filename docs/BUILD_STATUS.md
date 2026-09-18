# So-key Ai — Build status

> الحالة: **APK 1.0.1 مبني وموقّع وقابل للتثبيت — مع إصلاح انهيار الإقلاع** ✅
> آخر تحديث: 2026-09-18

## الخلاصة

| البند | القيمة |
|---|---|
| الملف | `artifacts/so-key-ai-1.0.1-debug.apk` |
| الحجم | ≈ 1000 KB |
| الحزمة | `ai.sokey.workspace` |
| الاسم | `So-key Ai` (label) |
| الإصدار | `1.0.1` (versionCode 2) |
| minSdk / targetSdk | 24 / 35 |
| البنية | universal — بلا مكتبات أصلية (`classes.dex` واحد + أصول الواجهة) |
| التوقيع | مفتاح Android Debug (v1+v2+v3) — تجريبي وليس للتوزيع |
| التحقق | `apksigner verify` ناجح، `zipalign` 4 بايت، `zipfile.testzip()` نظيف |
| SHA-256 | يُطبع في نهاية كل بناء وفي سير عمل GitHub Actions |

## لماذا لا يوجد Gradle / Android SDK

المشروع في هذه النسخة **مستقل تمامًا**: لا Expo، لا React Native، لا AndroidX، ولا أي
تبعية خارجية. لذلك لا حاجة إلى Maven/Gradle لتحليل التبعيات، ويمكن البناء بأدوات
منفردة فقط:

```
aapt2 compile → aapt2 link → ecj (javac-compatible) → d8 → zip
             → zipalign (scripts/zipalign.py) → apksigner → verify
```

البيئة التي تم فيها البناء لا تصل إلى `dl.google.com` ولا إلى Maven ولا إلى
`services.gradle.org`، لذلك كان هذا المسار هو الممكن فعليًا — وهو أيضًا أسرع بكثير
(≈ 5 ثوانٍ لبناء كامل) وأسهل في التكرار.

الأدوات تُنزَّل إلى `~/.cache/sokey-tools` (خارج Git) عبر `scripts/bootstrap-tools.sh`:

| الأداة | المصدر | الترخيص |
|---|---|---|
| JDK 25 (Temurin) | PyPI `jdk4py` | GPL-2.0 + Classpath Exception |
| aapt2 | npm `aaptjs3` (ثنائي AOSP) | Apache-2.0 |
| d8/R8, apksigner, android.jar, ecj | npm `@drxiaozhi/minapk` | Apache-2.0 / EPL-2.0 |

## 🔴 عطل حرج اكتُشف على الجهاز وأُصلح: «التطبيق يتوقف»

**العَرَض:** بعد تثبيت 1.0.0 على Realme 10 (Android 14) ظهر «So-key Ai keeps stopping» مباشرة
عند الإقلاع، بلا أي واجهة.

**السبب الجذري:** ملف `app/src/main/res/xml/network_security_config.xml` كان بجذر خاطئ:

```xml
<resources>                 <!-- ❌ خطأ -->
    <network-security-config> … </network-security-config>
</resources>
```

المانيفست يشير إليه عبر `android:networkSecurityConfig`، وأندرويد يحلّل هذا الملف **عند بدء
العملية** (NetworkSecurityConfigProvider). الجذر غير المتوقع يرفع
`RuntimeException: Failed to parse XML configuration` قبل إنشاء أي نشاط — لذلك لا يظهر شيء
سوى رسالة التوقف المتكرر. وaapt2 يمرّره بصمت لأن الملف XML صحيح نحويًا.

**الإصلاح:** الجذر أصبح `<network-security-config>` مباشرة، وأُضيف:

1. `scripts/check-resources.py` — يتحقق من الجذر الصحيح لكل ملف XML في `res/`، ويعمل داخل
   `scripts/build-apk.sh` (خطوة 0) وسير عمل GitHub Actions، فيُفشل البناء فورًا عند تكرار الخطأ.
2. تحصين `SoKeyApp`/`MainActivity`: كل خطوة في الإقلاع داخل `try/catch`، وعند الفشل تُعرض
   شاشة خطأ تقرأ السبب بدل «يتوقف التطبيق».
3. `CrashLog` + زر «سجل آخر خطأ» في شاشة **حول التطبيق** (نسخ/حذف التقرير) — لتشخيص أي خطأ
   مستقبلي من الجهاز بلا حاجة إلى `adb`.
4. رفع الإصدار إلى **1.0.1 / versionCode 2** ليُثبَّت فوق النسخة المعطوبة مباشرة.

**التحقق:** `aapt2 dump xmltree --file res/xml/network_security_config.xml` على الـ APK الجديد
يُظهر `E: network-security-config` كجذر ✅ (وكان يُظهر `E: resources` قبل الإصلاح).

## سجل البناء الفعلي (مختصر)

| # | المشكلة التي ظهرت | الإصلاح |
|---|---|---|
| 1 | `bootstrap-tools.sh` كان يخلط مخرجات الطبع مع المسارات | رسائل الحالة إلى stderr |
| 2 | aapt2 ليس قابلًا للتنفيذ بعد فك الضغط | `chmod +x` قبل التحقق |
| 3 | `aapt2 link` يرفض المانيفست | إضافة `package="ai.sokey.workspace"` |
| 4 | `-bootclasspath` غير مدعوم فوق إصدار 8 في ecj | `-source 1.8 -target 1.8` |
| 5 | `java.lang.invoke.LambdaMetafactory` غير موجود في stubs | إزالة تعبير lambda الوحيد |
| 6 | `new File(File)` غير موجود | تمرير `File` مباشرة |
| 7 | خطأ في ترويسة zip المركزية داخل zipalign | تصحيح بنية السجل (46 بايت) وتثبيت تواريخ DOS |
| 8 | نصوص الواجهة تبقى عربية بعد التبديل للإنجليزية | `t()` كان يقرأ اللغة من مكان خاطئ (اكتشفه اختبار jsdom) |

## ما لم يُختبر (بصراحة)

* **لم يُشغَّل على جهاز أندرويد حقيقي أو محاكي** من هذه البيئة: لا Android SDK،
  ولا `adb`، ولا جهاز متصل. لذلك لم يتم التحقق من: زمن الإقلاع الفعلي، ظهور الشاشة الأولى،
  سلوك WebView الحقيقي، منتقي الملفات (SAF)، تثبيت APK عبر النظام، والإشعارات.
* اختبار الواجهة يعمل على jsdom (محاكاة DOM بلا محرك رسم)، فهو يثبت منطق التطبيق
  وربط الجسر الأصلي، **ولا يثبت** المظهر البصري النهائي ولا أداء WebView.
* لا يوجد بعد اختبار واجهة على محرك رسم حقيقي (لا متصفح headless متاح في هذه البيئة).

## أول تشغيل مقترح على الجهاز (Realme 10 / Android 14)

1. `adb install -r artifacts/so-key-ai-1.0.0-debug.apk`
2. افتح التطبيق → يجب أن تظهر الواجهة العربية على الثيم الداكن مع الأيقونة الجديدة.
3. الإعدادات ← مزوّدو الذكاء الاصطناعي ← OmniRoute ← عدّل العنوان (127.0.0.1:20128 أو IP الشبكة).
4. اضغط **اختبار OmniRoute** ← يجب أن تظهر «متصل» وعدد النماذج.
5. جرّب: محادثة جديدة، تبديل الثيم، استيراد خط `.ttf`، تحجيم النص، الطرفية (`help`)، الملفات، سير العمل.

إن فشل أي شيء، سجّل الخطأ عبر `adb logcat -s SoKeyBoot chromium` وأرسله.
