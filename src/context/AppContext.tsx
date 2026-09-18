import React, { createContext, useContext, useState, useEffect } from 'react';
import { ViewMode, Language, ThemeId, TextScale, Project, Agent, Skill, Plugin, ChatSession, ChatMessage, TerminalLog } from '../types';

interface AppContextType {
  activeView: ViewMode;
  setActiveView: (view: ViewMode) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  theme: ThemeId;
  setTheme: (theme: ThemeId) => void;
  textScale: TextScale;
  setTextScale: (scale: TextScale) => void;
  
  // Projects
  projects: Project[];
  activeProject: Project;
  setActiveProject: (p: Project) => void;
  
  // Agents
  agents: Agent[];
  toggleAgentStatus: (id: string) => void;
  
  // Skills & Plugins
  skills: Skill[];
  plugins: Plugin[];
  toggleSkill: (id: string) => void;
  togglePlugin: (id: string) => void;
  
  // Chat
  chats: ChatSession[];
  activeChatId: string;
  setActiveChatId: (id: string) => void;
  currentChat: ChatSession;
  sendMessage: (text: string) => void;
  isStreaming: boolean;
  
  // Terminal
  terminalLogs: TerminalLog[];
  executeCommand: (cmd: string) => void;
  clearTerminal: () => void;

  // OmniRoute Provider
  omniRoute: {
    baseUrl: string;
    apiKey: string;
    model: string;
    isConnected: boolean;
  };
  updateOmniRoute: (data: Partial<AppContextType['omniRoute']>) => void;
  
  // Mobile Drawer
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
}

const initialProjects: Project[] = [
  {
    id: 'p-1',
    name: 'Super Driver',
    path: '/storage/projects/super-driver',
    description: 'تطبيق إدارة الرحلات وحساب التكلفة بالذكاء الاصطناعي',
    lastModified: 'تم التعديل منذ 5 دقائق',
    tasksCount: 8,
    agentsCount: 3,
    filesCount: 12,
    progressPercent: 72,
    activeBranch: 'main',
  },
  {
    id: 'p-2',
    name: 'So-key Core Engine',
    path: '/storage/projects/sokey-core',
    description: 'المحرك البرمجي الأساسي لإدارة الوكلاء والسكيلز',
    lastModified: 'أمس الساعة 4:20 م',
    tasksCount: 14,
    agentsCount: 4,
    filesCount: 38,
    progressPercent: 90,
    activeBranch: 'feature/agents-v2',
  },
];

const initialAgents: Agent[] = [
  {
    id: 'ag-1',
    name: 'Codex',
    role: 'الوكيل الرئيسي / مطوّر الكود',
    avatar: '🤖',
    model: 'GPT-4 / OmniRoute',
    status: 'running',
    skills: ['Android Development', 'Code Review', 'API Integration'],
    systemPrompt: 'أنت وكيل برمجي متقدم متخصص في تحليلات البرمجيات وتطوير تطبيقات Android.',
  },
  {
    id: 'ag-2',
    name: 'Claude 3.5',
    role: 'مراجعة الكود والأسلوب',
    avatar: '❇️',
    model: 'Claude 3.5 Sonnet',
    status: 'active',
    skills: ['UI/UX Design', 'Documentation'],
    systemPrompt: 'مختص في تدقيق الهندسة المعمارية للأكواد وتحسين أداء التطبيقات.',
  },
  {
    id: 'ag-3',
    name: 'ChatGPT',
    role: 'مستشار وكاتب وثائق',
    avatar: '🟢',
    model: 'GPT-4o',
    status: 'idle',
    skills: ['Problem Solving', 'Documentation'],
    systemPrompt: 'مساعد عام لكتابة التقارير وتجهيز مستندات النظام.',
  },
  {
    id: 'ag-4',
    name: 'Gemini Pro',
    role: 'تحليل البيانات والاختبارات',
    avatar: '💎',
    model: 'Gemini 1.5 Pro',
    status: 'idle',
    skills: ['Testing', 'DevOps'],
    systemPrompt: 'محلل بيانات واختبار حالات الاستخدام الحساسة.',
  }
];

const initialSkills: Skill[] = [
  { id: 'sk-1', name: 'Android Development', description: 'مساعدة في تطوير تطبيقات أندرويد وKotlin', category: 'تطوير', iconName: 'Android', isInstalled: true, isEnabled: true, isRecommended: true },
  { id: 'sk-2', name: 'Code Review', description: 'مراجعة وتحسين قواعد الأكواد وتصحيح الأخطاء', category: 'جودة', iconName: 'Code', isInstalled: true, isEnabled: true, isRecommended: true },
  { id: 'sk-3', name: 'GitHub Expert', description: 'إدارة مستودعات GitHub والدمج وسير العمل', category: 'أدوات', iconName: 'Github', isInstalled: true, isEnabled: true, isRecommended: true },
  { id: 'sk-4', name: 'UI/UX Design', description: 'تصميم واجهات المستخدم وتجارب التفاعل المتميزة', category: 'تصميم', iconName: 'Palette', isInstalled: true, isEnabled: true, isRecommended: true },
  { id: 'sk-5', name: 'Problem Solving', description: 'تحليل وحل المشكلات والخوارزميات المعقدة', category: 'ذكاء', iconName: 'Zap', isInstalled: true, isEnabled: true, isRecommended: true },
  { id: 'sk-6', name: 'Testing', description: 'كتابة واختبار الأكواد وحالات الاستخدام (Unit Tests)', category: 'جودة', iconName: 'TestTube', isInstalled: false, isEnabled: false, isRecommended: true },
  { id: 'sk-7', name: 'Documentation', description: 'إنشاء وتحديث التوثيق الفني ومستندات API', category: 'وثائق', iconName: 'FileText', isInstalled: false, isEnabled: false, isRecommended: true },
  { id: 'sk-8', name: 'DevOps & CI/CD', description: 'النشر التلقائي وربط أنابيب العمل بالذكاء', category: 'بنية', iconName: 'Infinity', isInstalled: false, isEnabled: false, isRecommended: true }
];

const initialPlugins: Plugin[] = [
  { id: 'pl-1', name: 'File System', description: 'وصول مباشر واستكشاف لملفات المجلد المحلي', version: 'v2.4.1', isInstalled: true, isEnabled: true },
  { id: 'pl-2', name: 'GitHub Connector', description: 'مزامنة الـPRs والمشاكل والأفرع مباشرة مع GitHub', version: 'v1.8.0', isInstalled: true, isEnabled: true },
  { id: 'pl-3', name: 'Browser & Automation', description: 'أتمتة المتصفح واستخراج البيانات من مواقع الويب', version: 'v3.1.2', isInstalled: true, isEnabled: true },
  { id: 'pl-4', name: 'Terminal Shell', description: 'تنفيذ أوامر النظام وخدمات Terminal التفاعلية', version: 'v2.0.0', isInstalled: true, isEnabled: true }
];

const initialChats: ChatSession[] = [
  {
    id: 'chat-1',
    title: 'تطوير نظام حساب سعر الرحلات',
    updatedAt: '10:24 ص',
    model: 'Codex (GPT-4)',
    messages: [
      {
        id: 'm-1',
        sender: 'user',
        content: 'أضف نظام حساب سعر الرحلة بالكيلومتر مع قراءة بيانات الرحلات من أوبر',
        timestamp: '10:24 ص',
      },
      {
        id: 'm-2',
        sender: 'assistant',
        model: 'Codex (GPT-4)',
        timestamp: '10:24 ص',
        thinkingContent: 'تحليل المتطلبات البرمجية:\n1. استخراج ملفات البيانات الخاصة بأوبر\n2. كتابة معادلة الحساب بناءً على المسافة بالكيلومتر\n3. إنتاج وحدة FareCalculator.kt وتحديث واجهة المستخدم',
        isThinkingExpanded: false,
        content: 'حسناً، سأقوم بتحليل المشروع وإضافة نظام حساب سعر الرحلة بالكيلومتر مع قراءة بيانات الرحلات من أوبر.',
        statusText: 'يتم العمل الآن على: ربط بيانات أوبر',
        progressPercent: 72,
        toolCalls: [
          { id: 'tc-1', name: 'تحليل هيكل المشروع', args: { path: '/storage/projects/super-driver' }, status: 'completed', result: 'تم العثور على 12 ملفاً' },
          { id: 'tc-2', name: 'فحص ملفات الرحلات', args: { query: 'UberAPI' }, status: 'completed', result: 'تم فحص TripReader.kt' },
          { id: 'tc-3', name: 'إضافة حساب السعر / كم', args: { file: 'FareCalculator.kt' }, status: 'running' }
        ],
        fileDiffs: [
          { fileName: 'FareCalculator.kt', additions: 42, deletions: 3 },
          { fileName: 'TripReader.kt', additions: 18, deletions: 2 },
          { fileName: 'strings.xml', additions: 6, deletions: 0 }
        ]
      }
    ]
  }
];

const initialTerminalLogs: TerminalLog[] = [
  { id: 't-1', type: 'system', text: 'So-key Ai Terminal Environment v1.0.0 Ready.', timestamp: '10:00:01' },
  { id: 't-2', type: 'system', text: 'Working Directory: /storage/projects/super-driver', timestamp: '10:00:02' },
  { id: 't-3', type: 'input', text: 'git status', timestamp: '10:20:15' },
  { id: 't-4', type: 'output', text: 'On branch main\nChanges modified:\n  modified: FareCalculator.kt (+42 -3)\n  modified: TripReader.kt (+18 -2)\n  modified: strings.xml (+6 -0)', timestamp: '10:20:16' }
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeView, setActiveView] = useState<ViewMode>('dashboard');
  const [language, setLanguage] = useState<Language>('ar');
  const [theme, setTheme] = useState<ThemeId>('dark-orange');
  const [textScale, setTextScale] = useState<TextScale>('100%');
  
  const [projects] = useState<Project[]>(initialProjects);
  const [activeProject, setActiveProject] = useState<Project>(initialProjects[0]);
  const [agents, setAgents] = useState<Agent[]>(initialAgents);
  const [skills, setSkills] = useState<Skill[]>(initialSkills);
  const [plugins, setPlugins] = useState<Plugin[]>(initialPlugins);
  
  const [chats, setChats] = useState<ChatSession[]>(initialChats);
  const [activeChatId, setActiveChatId] = useState<string>('chat-1');
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  
  const [terminalLogs, setTerminalLogs] = useState<TerminalLog[]>(initialTerminalLogs);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  
  const [omniRoute, setOmniRoute] = useState({
    baseUrl: 'https://api.omniroute.sokey.ai/v1',
    apiKey: 'sk-sokey-omni-9988231',
    model: 'omniroute-gpt4o-code',
    isConnected: true,
  });

  const updateOmniRoute = (data: Partial<typeof omniRoute>) => {
    setOmniRoute((prev) => ({ ...prev, ...data }));
  };

  // Sync RTL / HTML dir attributes when language changes
  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  // Sync theme class
  useEffect(() => {
    document.documentElement.className = `theme-${theme} dark`;
  }, [theme]);

  const toggleAgentStatus = (id: string) => {
    setAgents(prev => prev.map(a => {
      if (a.id === id) {
        const nextStatus = a.status === 'running' ? 'paused' : a.status === 'paused' ? 'active' : 'running';
        return { ...a, status: nextStatus };
      }
      return a;
    }));
  };

  const toggleSkill = (id: string) => {
    setSkills(prev => prev.map(s => {
      if (s.id === id) {
        const nextInstalled = !s.isInstalled;
        return { ...s, isInstalled: nextInstalled, isEnabled: nextInstalled };
      }
      return s;
    }));
  };

  const togglePlugin = (id: string) => {
    setPlugins(prev => prev.map(p => p.id === id ? { ...p, isEnabled: !p.isEnabled } : p));
  };

  const currentChat = chats.find(c => c.id === activeChatId) || chats[0];

  const sendMessage = (text: string) => {
    if (!text.trim() || isStreaming) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString(language === 'ar' ? 'ar-EG' : 'en-US', { hour: '2-digit', minute: '2-digit' }),
    };

    setChats(prev => prev.map(c => {
      if (c.id === activeChatId) {
        return { ...c, messages: [...c.messages, userMsg] };
      }
      return c;
    }));

    setIsStreaming(true);

    // Simulate AI response stream
    setTimeout(() => {
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        model: currentChat.model,
        timestamp: new Date().toLocaleTimeString(language === 'ar' ? 'ar-EG' : 'en-US', { hour: '2-digit', minute: '2-digit' }),
        thinkingContent: 'تحليل طلب المستخدم وتفعيل الأدوات المناسبة عبر So-key AI Agent Framework...',
        isThinkingExpanded: false,
        content: `تم استلام الطلب: "${text}". يجري الآن تنفيذ الأوامر عبر بيئة So-key Ai ومراجعة نتائج العملية.`,
        progressPercent: 100,
        toolCalls: [
          { id: `tc-${Date.now()}`, name: 'تنفيذ الأوامر', args: { command: text }, status: 'completed', result: 'تم التنفيذ بنجاح (exit 0)' }
        ]
      };

      setChats(prev => prev.map(c => {
        if (c.id === activeChatId) {
          return { ...c, messages: [...c.messages, aiMsg] };
        }
        return c;
      }));

      setIsStreaming(false);
    }, 1500);
  };

  const executeCommand = (cmd: string) => {
    if (!cmd.trim()) return;

    const now = new Date().toLocaleTimeString();
    const newLogs: TerminalLog[] = [
      ...terminalLogs,
      { id: `log-${Date.now()}`, type: 'input', text: cmd, timestamp: now }
    ];

    let outputText = '';
    const cleanCmd = cmd.trim().toLowerCase();

    if (cleanCmd === 'help') {
      outputText = 'الفيادات المتاحة:\n  help        - عرض المساعدة\n  status      - عرض حالة المشروع والوكلاء\n  git status  - فحص التغييرات\n  build       - بناء مشروع So-key Ai\n  clear       - مسح الشاشة';
    } else if (cleanCmd === 'status') {
      outputText = `المشروع الحالي: ${activeProject.name}\nالمسار: ${activeProject.path}\nنسبة الإنجاز: ${activeProject.progressPercent}%\nعدد الوكلاء النشطين: 3`;
    } else if (cleanCmd.startsWith('git status')) {
      outputText = 'On branch main\nYour branch is up to date with \'origin/main\'.\n\nChanges to be committed:\n  modified: FareCalculator.kt\n  modified: TripReader.kt\n  modified: strings.xml';
    } else if (cleanCmd === 'clear') {
      setTerminalLogs([]);
      return;
    } else {
      outputText = `Executing: ${cmd}\n[So-key Shell] Completed successfully with status code 0.`;
    }

    newLogs.push({ id: `log-${Date.now()+1}`, type: 'output', text: outputText, timestamp: now });
    setTerminalLogs(newLogs);
  };

  const clearTerminal = () => {
    setTerminalLogs([]);
  };

  return (
    <AppContext.Provider
      value={{
        activeView,
        setActiveView,
        language,
        setLanguage,
        theme,
        setTheme,
        textScale,
        setTextScale,
        projects,
        activeProject,
        setActiveProject,
        agents,
        toggleAgentStatus,
        skills,
        plugins,
        toggleSkill,
        togglePlugin,
        chats,
        activeChatId,
        setActiveChatId,
        currentChat,
        sendMessage,
        isStreaming,
        terminalLogs,
        executeCommand,
        clearTerminal,
        omniRoute,
        updateOmniRoute,
        isSidebarOpen,
        setIsSidebarOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
