import React from 'react';
import { useApp } from '../../context/AppContext';
import { ViewMode } from '../../types';
import { 
  LayoutDashboard, 
  PlusCircle, 
  MessageSquare, 
  FolderKanban, 
  Bot, 
  Zap, 
  Puzzle, 
  Wrench, 
  Terminal, 
  FileText, 
  GitBranch, 
  Workflow, 
  BarChart3, 
  PieChart, 
  Settings, 
  Search, 
  MoreVertical,
  X,
  Server
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { 
    activeView, 
    setActiveView, 
    language, 
    isSidebarOpen, 
    setIsSidebarOpen,
    setActiveChatId,
    chats
  } = useApp();

  const isArabic = language === 'ar';

  const menuItems: { id: ViewMode; labelAr: string; labelEn: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'dashboard', labelAr: 'الرئيسية', labelEn: 'Dashboard', icon: LayoutDashboard },
    { id: 'chat', labelAr: 'المحادثات', labelEn: 'Chats', icon: MessageSquare },
    { id: 'projects', labelAr: 'المشاريع', labelEn: 'Projects', icon: FolderKanban },
    { id: 'agents', labelAr: 'الوكلاء (Agents)', labelEn: 'AI Agents', icon: Bot },
    { id: 'skills', labelAr: 'السكيلز (Skills)', labelEn: 'Skills', icon: Zap },
    { id: 'plugins', labelAr: 'الإضافات (Plugins)', labelEn: 'Plugins', icon: Puzzle },
    { id: 'tools', labelAr: 'الأدوات (Tools)', labelEn: 'Tools', icon: Wrench },
    { id: 'terminal', labelAr: 'المحطة الطرفية', labelEn: 'Terminal', icon: Terminal },
    { id: 'files', labelAr: 'إدارة الملفات', labelEn: 'File Manager', icon: FileText },
    { id: 'github', labelAr: 'Git و GitHub', labelEn: 'Git & GitHub', icon: GitBranch },
    { id: 'automation', labelAr: 'سير العمل (Automation)', labelEn: 'Automation', icon: Workflow },
    { id: 'usage', labelAr: 'الاستخدام', labelEn: 'Usage', icon: BarChart3 },
    { id: 'reports', labelAr: 'التقارير', labelEn: 'Reports', icon: PieChart },
    { id: 'mcps', labelAr: 'الأدوات والمكاملات (MCP)', labelEn: 'MCP & Integrations', icon: Server },
    { id: 'settings', labelAr: 'الإعدادات', labelEn: 'Settings', icon: Settings },
  ];

  const handleSelectView = (view: ViewMode) => {
    setActiveView(view);
    setIsSidebarOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)} 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Sidebar Drawer */}
      <aside 
        className={`fixed top-0 bottom-0 z-50 lg:z-10 w-64 bg-[#0d1218] border-r border-[#1e2938] flex flex-col transition-transform duration-300 ease-in-out ${
          isArabic ? 'right-0 border-l border-r-0' : 'left-0 border-r'
        } ${
          isSidebarOpen 
            ? 'translate-x-0' 
            : isArabic ? 'translate-x-full lg:translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="p-4 border-b border-[#1e2938] flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Custom S Logo Container with Glow */}
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#00d2ff] via-[#3a7bd5] to-[#f38f49] p-0.5 shadow-orange-glow-sm flex items-center justify-center">
              <div className="w-full h-full bg-[#081017] rounded-[10px] flex items-center justify-center font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-orange-400 text-lg">
                S
              </div>
            </div>
            <div>
              <h1 className="text-base font-extrabold text-white leading-none tracking-tight">
                So-key <span className="text-orange-400">Ai</span>
              </h1>
              <p className="text-[10px] text-slate-400 font-medium tracking-wide">
                Your AI Workspace
              </p>
            </div>
          </div>

          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden p-1 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Input Bar matching design refs */}
        <div className="p-3">
          <div className="relative">
            <Search className={`w-4 h-4 text-slate-400 absolute top-2.5 ${isArabic ? 'right-3' : 'left-3'}`} />
            <input 
              type="text"
              placeholder={isArabic ? 'بحث... ⌘K' : 'Search... ⌘K'}
              className={`w-full bg-[#141c26] border border-[#233042] text-xs text-slate-200 placeholder-slate-500 rounded-lg py-2 focus:outline-none focus:border-orange-500 transition ${
                isArabic ? 'pr-9 pl-3' : 'pl-9 pr-3'
              }`}
            />
          </div>
        </div>

        {/* Quick Action "New Chat +" Button */}
        <div className="px-3 pb-2">
          <button
            onClick={() => {
              setActiveChatId(chats[0]?.id || 'chat-1');
              handleSelectView('chat');
            }}
            className="w-full flex items-center justify-between bg-gradient-to-r from-[#141c26] to-[#1e2938] hover:from-[#e05a10] hover:to-[#f38f49] border border-[#233042] hover:border-orange-400/50 text-slate-100 hover:text-white px-3.5 py-2 rounded-xl text-xs font-bold transition shadow-sm group"
          >
            <span className="flex items-center gap-2">
              <PlusCircle className="w-4 h-4 text-orange-400 group-hover:text-white transition" />
              <span>{isArabic ? 'محادثة جديدة' : 'New Chat'}</span>
            </span>
            <span className="text-[10px] bg-[#233042] group-hover:bg-white/20 px-1.5 py-0.5 rounded text-slate-300 group-hover:text-white">
              +
            </span>
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto px-2 py-2 space-y-0.5">
          <div className="text-[10px] font-bold text-slate-500 px-3 py-1 uppercase tracking-wider">
            {isArabic ? 'الرئيسية والبيئة' : 'Main Menu'}
          </div>

          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelectView(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition ${
                  isActive
                    ? 'bg-[#1e2938] text-orange-400 border border-orange-500/30 shadow-orange-glow-sm'
                    : 'text-slate-300 hover:bg-[#141c26] hover:text-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-orange-400' : 'text-slate-400'}`} />
                  <span>{isArabic ? item.labelAr : item.labelEn}</span>
                </div>
                {item.id === 'chat' && (
                  <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping" />
                )}
              </button>
            );
          })}
        </nav>

        {/* User Profile Footer matching 01-dashboard.png */}
        <div className="p-3 border-t border-[#1e2938] bg-[#081017]">
          <div className="flex items-center justify-between p-2 rounded-lg hover:bg-[#141c26] transition cursor-pointer">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" 
                  alt="User Avatar"
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-orange-500/40"
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-[#081017] rounded-full" />
              </div>
              <div className="flex flex-col text-right">
                <span className="text-xs font-bold text-slate-200">Ahmed Ramadan</span>
                <span className="text-[10px] text-slate-400">ahmed@sokey.ai</span>
              </div>
            </div>
            <MoreVertical className="w-4 h-4 text-slate-400 hover:text-white" />
          </div>
        </div>
      </aside>
    </>
  );
};
