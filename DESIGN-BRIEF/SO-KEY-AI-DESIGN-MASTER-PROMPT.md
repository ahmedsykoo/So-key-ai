# SO-KEY AI — مخطط التصميم الرئيسي + برومبت التنفيذ

## تعليمات عامة للوكيل المنفّذ

أنت تعمل على تصميم وتنفيذ تطبيق Android باسم **So-key Ai**.
الصور الخمس داخل `DESIGN-REFERENCES/` هي مراجع بصرية موحّدة للهوية والتخطيط والأسلوب، وليست كودًا جاهزًا للنسخ.

### قواعد أساسية
- التصميم Mobile-first ومهيأ لـ Android، مع دعم الشاشات الصغيرة والكبيرة.
- العربية RTL هي اللغة الأساسية، مع إمكانية التبديل إلى English.
- حافظ على أداء خفيف وسلس وتجنب المؤثرات الثقيلة.
- استخدم Design System موحدًا للألوان والمسافات والزوايا والظلال والأيقونات والخطوط.
- لا تنشئ صفحات شكلية فقط. كل شاشة يجب أن تكون قابلة للاستخدام.
- استخدم الصور الخمس كمراجع مباشرة أثناء التنفيذ.
- الاسم النهائي هو **So-key Ai** ولا تستبدله باسم Sykoo AI.
- حافظ على attribution والترخيص للمصدر المفتوح المستخدم.

---

# القسم 01 — الهوية البصرية وSplash / App Icon

**مرجع الصورة:** `DESIGN-REFERENCES/05-so-key-logo.png`

### المطلوب
- اعتماد شعار S + Key كعنصر الهوية الرئيسي.
- إنشاء App Icon داكن، Light، وMonochrome.
- Splash Screen تحمل So-key Ai و`UNLOCK A SMARTER TOMORROW`.
- الحفاظ على نفس لغة الألوان والإضاءة في المرجع بدون مبالغة في الـglow.

# القسم 02 — الصفحة الرئيسية / AI Workspace Dashboard

**مرجع الصورة:** `DESIGN-REFERENCES/01-dashboard.png`

### المطلوب
إنشاء الصفحة الرئيسية كمركز التطبيق، وتشمل:
- Navigation/Sidebar قابل للطي.
- Header.
- ترحيب بالمستخدم.
- New Chat.
- Projects.
- Agents.
- Skills.
- Plugins.
- Tools.
- Terminal.
- Git & GitHub.
- Usage.
- Reports.
- Settings.
- بطاقات New Chat / Create Project / Use an Agent / Automate.
- آخر المشاريع والمحادثات.

على Android يتحول الـSidebar إلى Drawer أو Navigation Rail حسب حجم الشاشة.

# القسم 03 — المحادثة وواجهة AI Agent

**مرجع الصورة:** `DESIGN-REFERENCES/03-chat-themes.png`

### المطلوب
واجهة محادثة متقدمة تدعم:
- User Message وAI Message.
- Streaming text.
- Thinking state.
- Tool Calls وTool Results.
- Approval / Confirmation cards.
- Progress / Task status.
- Code blocks وDiff blocks.
- Attachments وImages وFiles.
- Copy / Share / Regenerate / Stop.
- Model selector وAgent selector وContext indicator.

Prompt bar يدعم النص والإرفاق واختيار Agent/Model والإرسال.

# القسم 04 — Themes / Chat Styles

**مرجع الصورة:** `DESIGN-REFERENCES/03-chat-themes.png`

### المطلوب
نظام Themes حقيقي:
- Dark.
- Light.
- AMOLED.
- Neon.
- Minimal.
- Glass.
- Custom.

كل Theme يتحكم في الخلفيات والأسطح والبطاقات والـaccent والنصوص والـcode blocks والـbubbles والـtool cards والحدود والظلال والخطوط.
احفظ الاختيار محليًا ولا تعيد تشغيل التطبيق عند التغيير.

# القسم 05 — Skills / Plugins / Tools

**مرجع الصورة:** `DESIGN-REFERENCES/02-skills-plugins.png`

### المطلوب
مركز موحّد للقدرات مع Tabs:
- Skills
- Plugins
- Tools
- Installed
- Recommended
- Repository

كل عنصر يعرض الاسم والوصف والحالة والمصدر والإصدار وEnable/Disable وSettings وUpdate وRemove.

# القسم 06 — Agents

شاشة Agents مستقلة. كل Agent يحتوي الاسم والوصف وModel وSystem instructions وTools وSkills وPermissions وMemory وWorkspace وStatus.

Actions: Create / Edit / Duplicate / Run / Pause / Delete.

# القسم 07 — Projects

إدارة المشاريع محليًا:
- Project list.
- Project details.
- Workspace path.
- Files.
- Chats.
- Agents.
- Tasks.
- Git status.
- Build status.

كل Project مستقل عن بقية المشاريع.

# القسم 08 — Terminal

واجهة Terminal حقيقية للموبايل:
- Terminal tabs.
- Command input.
- Output streaming.
- Copy / Clear / Search.
- Environment status.
- Working directory.
- Process state.

الصلاحيات واضحة وأي أمر حساس يحتاج تأكيدًا مناسبًا.

# القسم 09 — Git & GitHub

واجهة Git عملية:
- Repository.
- Branch.
- Status.
- Diff.
- Commit.
- Push / Pull / Clone.
- Issues.
- Pull Requests.
- Actions / Workflows.

لا تربط التطبيق تلقائيًا بمستودع المستخدم `Super-Driver`. So-key Ai مستقل.

# القسم 10 — MCP / A2A / Integrations

شاشة لإدارة MCP servers وA2A agents وExternal tools وAPI endpoints وAuthentication مع Enable/Disable وConnection status وLogs.

# القسم 11 — OmniRoute ومزودي الذكاء الاصطناعي

Provider Manager يدعم OpenAI-compatible providers وOmniRoute وOpenRouter ومزودين مستقبلًا.

OmniRoute:
- Base URL قابل للتعديل.
- Model قابل للتعديل.
- API key محفوظ بأمان.
- Connection status.
- Test connection.
- Default model.

لا تثبت localhost داخل الواجهة بشكل إجباري.

# القسم 12 — Browser / Automation

واجهة Automation تشمل Workflows وTriggers وActions وConditions وAgent execution وLogs وHistory وEnable/Disable وSchedule.

استلهم لوحة الـWorkflow من المرجع، لكن صمّمها للموبايل بدل تصغير واجهة Desktop.

# القسم 13 — Usage / Reports

لوحة استخدام تعرض Tokens وRequests وModels وProviders وErrors وCost عندما تتوفر البيانات، مع Daily/Weekly/Monthly.

# القسم 14 — Settings

الأقسام:
- General.
- Language.
- Appearance.
- Themes.
- Font.
- Text Scale.
- AI Providers.
- OmniRoute.
- Security.
- Terminal.
- Notifications.
- Storage.
- GitHub.
- MCP.
- About.

Text Scale: 85% / 100% / 115% / 130%.

Fonts: Built-in picker + Import TTF/OTF + حفظ الاختيار محليًا.

# القسم 15 — العربية وRTL

- RTL كامل.
- اتجاه الأيقونات حسب السياق.
- دعم English.
- عدم كسر الأكواد أو المسارات أو Git URLs عند RTL.
- Numbers/timestamps منطقية.
- Terminal وCode تبقى LTR حيث يلزم.

# القسم 16 — Responsive Android Design

دعم هاتف صغير وهاتف عادي وشاشة كبيرة وFoldable إن أمكن.
نفس Design System مع Layout متكيف. لا تصغّر Desktop UI داخل الهاتف.

# القسم 17 — Design System

أنشئ Design Tokens مركزية:
- Colors.
- Typography.
- Spacing.
- Radius.
- Elevation.
- Shadows.
- Icon sizes.
- Motion.
- Component states.

كل الواجهات تستخدم الـtokens بدل القيم العشوائية.

# القسم 18 — حالات كل شاشة

كل شاشة يجب أن تحتوي على Loading / Empty / Error / Success / Offline / Permission required / Disabled / Processing / Completed.

# القسم 19 — مكونات AI التفاعلية

استخدم مفهوم مكونات AI الحديثة عند الحاجة:
- Thinking.
- Streaming.
- Tool Call.
- Tool Result.
- Approval.
- Task status.
- Diff.
- Citation.
- Context.
- Agent status.

يمكن استخدام المستودعات أدناه كمراجع للمكونات، وليس شرطًا إدخال Web-only dependencies في Android.

# القسم 20 — المستودعات والمراجع

## المصدر الأساسي
Shelly:
https://github.com/RYOITABASHI/Shelly

استخدمه كأساس Android/terminal/agent architecture مع الحفاظ على GPL attribution.

## Beautiful UI — AI interface primitives
https://github.com/slev12397/beautiful-ui

مرجع لمكونات Thinking وStreaming وTool Calls وApproval cards وTask states وAI chat primitives.

لا تفترض أن مكونات Next.js/Web تعمل مباشرة داخل React Native. استخدم الأفكار والمكونات المتوافقة فقط.

## Beautiful UI — Agent UI workflow
https://github.com/Kainiko943/beautiful-ui

مرجع لطريقة توجيه Coding Agents في UI design workflow وAndroid UI guidance وDesign verification.

## assistant-ui Tool UI
https://github.com/assistant-ui/tool-ui

مرجع لمكونات Tool calls وApprovals وForms وTables وDiffs وTerminal UI.

## Expo
https://github.com/expo/expo

مرجع Framework وExpo وReact Native tooling.

# القسم 21 — قواعد استخدام المستودعات

قبل استخدام أي Repository جديد:
1. ضع رابطه داخل هذا القسم.
2. تحقق من License.
3. تحقق من توافقه مع Android / React Native.
4. لا تضف Web-only dependency إلى Android بدون سبب.
5. لا تنسخ كودًا بدون معرفة الترخيص.
6. حافظ على attribution.
7. سجّل أي Repository جديد في `docs/REFERENCES.md`.

# القسم 22 — ترتيب التنفيذ

نفّذ بالترتيب:
1. Design Tokens.
2. Navigation.
3. Home Dashboard.
4. Chat.
5. AI streaming/tool states.
6. Themes.
7. Skills/Plugins.
8. Agents.
9. Projects.
10. Terminal.
11. Git/GitHub.
12. Providers/OmniRoute.
13. MCP/A2A.
14. Browser/Automation.
15. Usage/Reports.
16. Settings.
17. Arabic RTL.
18. Responsive Android.
19. Accessibility.
20. Performance.
21. Build.
22. APK verification.

# القسم 23 — معيار قبول التصميم

لا تعتبر So-key Ai مكتملًا إلا إذا:
- كل قسم يعمل فعليًا.
- العربية RTL سليمة.
- التصميم موحّد.
- الصور المرجعية استُخدمت في الأقسام المحددة.
- لا توجد شاشة Placeholder غير مقصودة.
- لا توجد أسماء Sykoo AI في المنتج النهائي.
- لا توجد روابط أو IDs موروثة من مشروع آخر بدون سبب.
- التطبيق لا يعتمد على Web UI كبديل عن Android UI.
- الأداء سلس.
- Build Android ناجح.
- APK قابل للتثبيت.
- Package ID هو `ai.sokey.workspace`.

# القسم 24 — قاعدة التنفيذ النهائية

قبل كتابة أي UI:

**اقرأ الصور المرجعية الخمس، ثم افحص الكود الحالي، ثم أنشئ Design System، ثم نفّذ.**

لا تبدأ بإنشاء صفحات عشوائية.

كل صورة مرجع بصري، وكل قسم أعلاه مسؤول عن تحويل المرجع إلى واجهة Android فعلية قابلة للاستخدام.

النتيجة المطلوبة:
**So-key Ai = Android AI Workspace حقيقي، وليس مجرد نسخة شكلية من الصور.**
