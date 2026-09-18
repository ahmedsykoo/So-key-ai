import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Folder, 
  Globe, 
  Sun, 
  MessageSquare, 
  GitFork, 
  Layers, 
  Zap, 
  ChevronDown,
  Menu,
  Terminal,
  FileCode
} from 'lucide-react';

export const Header: React.FC = () => {
  const { 
    activeView, 
    setActiveView, 
    activeProject, 
    language, 
    setLanguage, 
    theme, 
    setTheme, 
    setIsSidebarOpen 
  } = useApp();

  const isArabic = language === 'ar';

  return (
    <header className="h-16 bg-[#081017] border-b border-[#1e2938] px-4 flex items-center justify-between gap-4 sticky top-0 z-30 select-none">
      {/* Left / Start: Project Switcher & Mobile Menu Toggle */}
      <div className="flex items-center gap-3">
        <button 
          onClick={() => setIsSidebarOpen(true)} 
          className="lg:hidden p-2 rounded-lg text-slate-300 hover:bg-[#141c26] hover:text-white"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Project Selector Badge */}
        <div className="flex items-center gap-2.5 bg-[#141c26] hover:bg-[#1e2938] border border-[#233042] px-3 py-1.5 rounded-lg transition cursor-pointer">
          <Folder className="w-4 h-4 text-orange-400" />
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold text-slate-100">{activeProject.name}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <span className="text-[10px] text-slate-400 dir-ltr">{activeProject.path}</span>
          </div>
        </div>
      </div>

      {/* Center: Mode Toggle Pills matching 01-dashboard.png */}
      <div className="hidden md:flex items-center bg-[#0d1218] p-1 rounded-xl border border-[#233042]">
        <button
          onClick={() => setActiveView('chat')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
            activeView === 'chat'
              ? 'bg-[#e05a10] text-white shadow-orange-glow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>{isArabic ? 'وضع المحادثة' : 'Chat Mode'}</span>
        </button>

        <button
          onClick={() => setActiveView('dashboard')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
            activeView === 'dashboard'
              ? 'bg-[#e05a10] text-white shadow-orange-glow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <GitFork className="w-3.5 h-3.5" />
          <span>{isArabic ? 'وضع سير العمل' : 'Workflow Mode'}</span>
        </button>

        <button
          onClick={() => setActiveView('terminal')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
            activeView === 'terminal'
              ? 'bg-[#e05a10] text-white shadow-orange-glow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Terminal className="w-3.5 h-3.5" />
          <span>{isArabic ? 'المحطة الطرفية' : 'Terminal'}</span>
        </button>
      </div>

      {/* Right / End: Stats & Controls */}
      <div className="flex items-center gap-3">
        {/* Token Usage Meter */}
        <div className="hidden sm:flex items-center gap-2.5 bg-[#141c26] border border-[#233042] px-3 py-1 rounded-lg">
          <div className="flex flex-col text-right">
            <span className="text-[10px] text-slate-400">{isArabic ? 'إجمالي الاستخدام' : 'Total Usage'}</span>
            <span className="text-xs font-bold text-orange-400 dir-ltr">124K / 500K</span>
          </div>
          {/* Progress Ring */}
          <div className="relative w-6 h-6 flex items-center justify-center">
            <svg className="w-6 h-6 transform -rotate-90">
              <circle cx="12" cy="12" r="9" stroke="#233042" stroke-width="2.5" fill="none" />
              <circle cx="12" cy="12" r="9" stroke="#f38f49" stroke-width="2.5" stroke-dasharray="56" stroke-dashoffset="18" stroke-linecap="round" fill="none" />
            </svg>
          </div>
        </div>

        {/* Theme Switcher Toggle */}
        <button
          onClick={() => setTheme(theme === 'dark-orange' ? 'light' : 'dark-orange')}
          className="p-2 text-slate-300 hover:text-white bg-[#141c26] hover:bg-[#1e2938] border border-[#233042] rounded-lg transition"
          title={isArabic ? 'تغيير الثيم' : 'Toggle Theme'}
        >
          <Sun className="w-4 h-4 text-orange-400" />
        </button>

        {/* Language Toggle Button */}
        <button
          onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
          className="flex items-center gap-1.5 bg-[#141c26] hover:bg-[#1e2938] border border-[#233042] px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-200 transition"
        >
          <Globe className="w-3.5 h-3.5 text-orange-400" />
          <span>{language === 'ar' ? 'العربية' : 'English'}</span>
        </button>
      </div>
    </header>
  );
};
