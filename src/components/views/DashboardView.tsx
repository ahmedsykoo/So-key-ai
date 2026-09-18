import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Bot, 
  Zap, 
  Puzzle, 
  CheckCircle2, 
  Play, 
  Calendar, 
  Plus, 
  FileCode2, 
  FileText, 
  Activity, 
  ChevronLeft, 
  ChevronRight,
  Database,
  Smartphone,
  ShieldCheck,
  Globe,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const { language, setActiveView, activeProject, agents, skills, plugins } = useApp();
  const isArabic = language === 'ar';

  const [activeTab, setActiveTab] = useState<'workflow' | 'tasks' | 'files' | 'notes'>('workflow');
  const [selectedDay, setSelectedDay] = useState<number>(13);

  const activeAgents = agents.slice(0, 4);
  const installedSkills = skills.filter(s => s.isInstalled);
  const installedPlugins = plugins.filter(p => p.isInstalled);

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Quick Action Cards Section matching 04-brand-home-ui.png */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <button
          onClick={() => setActiveView('chat')}
          className="flex items-center justify-between p-4 bg-[#141c26] hover:bg-[#1e2938] border border-[#233042] hover:border-orange-500/50 rounded-2xl transition group text-right shadow-sm"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400 group-hover:scale-105 transition">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white">{isArabic ? 'محادثة جديدة' : 'New Chat'}</h3>
              <p className="text-[11px] text-slate-400">{isArabic ? 'ابدأ حواراً مع الذكاء' : 'Start conversation'}</p>
            </div>
          </div>
          <ChevronLeft className={`w-4 h-4 text-slate-500 group-hover:text-orange-400 transition ${!isArabic && 'rotate-180'}`} />
        </button>

        <button
          onClick={() => setActiveView('projects')}
          className="flex items-center justify-between p-4 bg-[#141c26] hover:bg-[#1e2938] border border-[#233042] hover:border-cyan-500/50 rounded-2xl transition group text-right shadow-sm"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white">{isArabic ? 'إنشاء مشروع' : 'Create Project'}</h3>
              <p className="text-[11px] text-slate-400">{isArabic ? 'إدارة المستودعات والكود' : 'Build something amazing'}</p>
            </div>
          </div>
          <ChevronLeft className={`w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition ${!isArabic && 'rotate-180'}`} />
        </button>

        <button
          onClick={() => setActiveView('agents')}
          className="flex items-center justify-between p-4 bg-[#141c26] hover:bg-[#1e2938] border border-[#233042] hover:border-indigo-500/50 rounded-2xl transition group text-right shadow-sm"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 group-hover:scale-105 transition">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white">{isArabic ? 'استخدام وكيل' : 'Use an Agent'}</h3>
              <p className="text-[11px] text-slate-400">{isArabic ? 'تشغيل وكلاء برمجية' : 'Let AI work for you'}</p>
            </div>
          </div>
          <ChevronLeft className={`w-4 h-4 text-slate-500 group-hover:text-indigo-400 transition ${!isArabic && 'rotate-180'}`} />
        </button>

        <button
          onClick={() => setActiveView('automation')}
          className="flex items-center justify-between p-4 bg-[#141c26] hover:bg-[#1e2938] border border-[#233042] hover:border-purple-500/50 rounded-2xl transition group text-right shadow-sm"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:scale-105 transition">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white">{isArabic ? 'سير العمل والأتمتة' : 'Automate'}</h3>
              <p className="text-[11px] text-slate-400">{isArabic ? 'تحويل الفكرة إلى أتمتة' : 'Turn ideas into workflows'}</p>
            </div>
          </div>
          <ChevronLeft className={`w-4 h-4 text-slate-500 group-hover:text-purple-400 transition ${!isArabic && 'rotate-180'}`} />
        </button>
      </div>

      {/* Main Workspace Dashboard Grid matching 01-dashboard.png */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Center & Left Area (2 Columns) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Project Header Banner & Tabs */}
          <div className="bg-[#0d1218] border border-[#233042] rounded-2xl p-5 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>{activeProject.name}</span>
                  <span className="text-xs bg-orange-500/20 text-orange-400 border border-orange-500/30 px-2 py-0.5 rounded-md">
                    {activeProject.activeBranch}
                  </span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">{activeProject.description}</p>
              </div>

              {/* Sub tabs */}
              <div className="flex items-center gap-1 bg-[#141c26] p-1 rounded-xl border border-[#233042]">
                <button
                  onClick={() => setActiveTab('workflow')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    activeTab === 'workflow'
                      ? 'bg-[#e05a10] text-white shadow-orange-glow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {isArabic ? 'مخطط المشروع' : 'Workflow Diagram'}
                </button>
                <button
                  onClick={() => setActiveTab('tasks')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    activeTab === 'tasks'
                      ? 'bg-[#e05a10] text-white shadow-orange-glow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {isArabic ? 'المهام (8)' : 'Tasks (8)'}
                </button>
                <button
                  onClick={() => setActiveTab('files')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    activeTab === 'files'
                      ? 'bg-[#e05a10] text-white shadow-orange-glow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {isArabic ? 'الملفات (12)' : 'Files (12)'}
                </button>
              </div>
            </div>

            {/* Project Metrics Summary Bar */}
            <div className="grid grid-cols-4 gap-3 bg-[#141c26] p-3.5 rounded-xl border border-[#233042] text-center">
              <div>
                <span className="text-[10px] text-slate-400 block">{isArabic ? 'المهام' : 'Tasks'}</span>
                <span className="text-sm font-extrabold text-white">8</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">{isArabic ? 'الوكلاء' : 'Agents'}</span>
                <span className="text-sm font-extrabold text-white">3</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">{isArabic ? 'الملفات' : 'Files'}</span>
                <span className="text-sm font-extrabold text-white">12</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">{isArabic ? 'الإنجاز' : 'Completed'}</span>
                <span className="text-sm font-extrabold text-emerald-400 dir-ltr">72%</span>
              </div>
            </div>

            {/* Interactive Visual Workflow Diagram matching 01-dashboard.png */}
            {activeTab === 'workflow' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300">
                    {isArabic ? 'مسار التنفيذ الحالي' : 'Execution Pipeline'}
                  </span>
                  <button className="flex items-center gap-1.5 bg-[#e05a10] hover:bg-orange-500 text-white px-3 py-1 rounded-lg text-xs font-bold transition shadow-orange-glow-sm">
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>{isArabic ? 'تشغيل الكل' : 'Run All'}</span>
                  </button>
                </div>

                {/* Flow Diagram Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {/* Node 1: Requirements */}
                  <div className="bg-[#141c26] border border-emerald-500/40 rounded-xl p-3 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">{isArabic ? 'جمع المتطلبات' : 'Gathering Requirements'}</h4>
                        <p className="text-[10px] text-slate-400">{isArabic ? 'تحليل الطلب وفهم المتطلبات' : 'Requirements analysis'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Node 2: Project Analysis */}
                  <div className="bg-[#141c26] border border-cyan-500/40 rounded-xl p-3 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400">
                        <Bot className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">{isArabic ? 'تحليل المشروع' : 'Project Analysis'}</h4>
                        <p className="text-[10px] text-slate-400">{isArabic ? 'فحص الكود الحالي' : 'Current code scan'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Node 3: Uber Data Reading (ACTIVE GLOW NODE) */}
                  <div className="bg-[#1e2938] border-2 border-orange-500 rounded-xl p-3 flex items-center justify-between shadow-orange-glow-sm">
                    <div className="flex items-center gap-2.5">
                      <div className="p-1.5 rounded-lg bg-orange-500/20 text-orange-400">
                        <Database className="w-4 h-4 animate-pulse" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-orange-200">{isArabic ? 'قراءة بيانات أوبر' : 'Uber Data Extraction'}</h4>
                        <p className="text-[10px] text-orange-300/80">{isArabic ? 'استخراج بيانات الرحلات' : 'Fetching trip records'}</p>
                      </div>
                    </div>
                    <span className="w-2 h-2 rounded-full bg-orange-400 animate-ping" />
                  </div>
                </div>

                {/* Secondary Flow Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="bg-[#141c26] border border-[#233042] rounded-xl p-3 flex items-center gap-2.5">
                    <div className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400">
                      <FileCode2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-200">{isArabic ? 'حساب السعر بالكيلومتر' : 'Fare Calculation / km'}</h4>
                      <p className="text-[10px] text-slate-400">{isArabic ? 'تنفيذ المنطق البرمجي' : 'Business logic'}</p>
                    </div>
                  </div>

                  <div className="bg-[#141c26] border border-[#233042] rounded-xl p-3 flex items-center gap-2.5">
                    <div className="p-1.5 rounded-lg bg-purple-500/20 text-purple-400">
                      <Smartphone className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-200">{isArabic ? 'تحديث الواجهة' : 'UI Update'}</h4>
                      <p className="text-[10px] text-slate-400">{isArabic ? 'تصميم وتكامل الواجهة' : 'Android UI integration'}</p>
                    </div>
                  </div>

                  <div className="bg-[#141c26] border border-[#233042] rounded-xl p-3 flex items-center gap-2.5">
                    <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-200">{isArabic ? 'الاختبار' : 'System Testing'}</h4>
                      <p className="text-[10px] text-slate-400">{isArabic ? 'اختبار شامل للنظام' : 'Unit & Integration'}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Timeline & Weekly Breakdown Box matching 01-dashboard.png */}
          <div className="bg-[#0d1218] border border-[#233042] rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-orange-400" />
                <span className="text-xs font-bold text-white">{isArabic ? 'عرض تفاصيل الجدول الزمني' : 'Timeline Details'}</span>
              </div>
              <span className="text-xs text-slate-400 bg-[#141c26] border border-[#233042] px-2.5 py-1 rounded-lg">
                {isArabic ? 'أغسطس 2024 (أسبوع)' : 'August 2024 (Week)'}
              </span>
            </div>

            {/* Days Horizontal Picker */}
            <div className="grid grid-cols-7 gap-1.5 text-center">
              {[
                { dayAr: 'الأحد', dayEn: 'Sun', num: 21 },
                { dayAr: 'الإثنين', dayEn: 'Mon', num: 12 },
                { dayAr: 'الثلاثاء', dayEn: 'Tue', num: 13, active: true },
                { dayAr: 'الأربعاء', dayEn: 'Wed', num: 14 },
                { dayAr: 'الخميس', dayEn: 'Thu', num: 15 },
                { dayAr: 'الجمعة', dayEn: 'Fri', num: 16 },
                { dayAr: 'السبت', dayEn: 'Sat', num: 17 },
              ].map((d) => (
                <button
                  key={d.num}
                  onClick={() => setSelectedDay(d.num)}
                  className={`p-2.5 rounded-xl border flex flex-col items-center justify-center transition ${
                    selectedDay === d.num
                      ? 'bg-[#e05a10] border-orange-400 text-white shadow-orange-glow-sm'
                      : 'bg-[#141c26] border-[#233042] text-slate-300 hover:bg-[#1e2938]'
                  }`}
                >
                  <span className="text-[10px] opacity-80">{isArabic ? d.dayAr : d.dayEn}</span>
                  <span className="text-sm font-extrabold">{d.num}</span>
                </button>
              ))}
            </div>

            {/* Bottom Summary Bar */}
            <div className="flex flex-wrap items-center justify-between bg-[#141c26] p-3 rounded-xl border border-[#233042] text-xs">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-white">Super Driver</span>
                <span className="text-slate-400 text-[11px]">{isArabic ? 'تم التعديل منذ 5 دقائق' : 'Updated 5m ago'}</span>
              </div>
              <div className="flex items-center gap-4 text-slate-300">
                <span>18 {isArabic ? 'ملف معدل' : 'Files'}</span>
                <span className="text-emerald-400 font-mono font-bold">+42 / -7</span>
                <span>3 {isArabic ? 'مكتملة' : 'Done'}</span>
                <span>2 {isArabic ? 'قيد التنفيذ' : 'In Progress'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Agents, Skills, Plugins Panel matching 01-dashboard.png */}
        <div className="space-y-6">
          {/* Agents List Module */}
          <div className="bg-[#0d1218] border border-[#233042] rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-[#1e2938] pb-2.5">
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4 text-orange-400" />
                <h3 className="text-xs font-extrabold text-white">{isArabic ? 'الوكلاء المشاركون' : 'Active Agents'}</h3>
              </div>
              <button 
                onClick={() => setActiveView('agents')}
                className="text-[11px] text-orange-400 hover:underline"
              >
                {isArabic ? 'إدارة الوكلاء' : 'Manage'}
              </button>
            </div>

            <div className="space-y-2">
              {activeAgents.map((ag) => (
                <div key={ag.id} className="flex items-center justify-between p-2.5 bg-[#141c26] hover:bg-[#1e2938] border border-[#233042] rounded-xl transition">
                  <div className="flex items-center gap-2.5">
                    <span className="text-base">{ag.avatar}</span>
                    <div>
                      <h4 className="text-xs font-bold text-white">{ag.name}</h4>
                      <p className="text-[10px] text-slate-400">{ag.role}</p>
                    </div>
                  </div>
                  <span className={`w-2 h-2 rounded-full ${ag.status === 'running' ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
                </div>
              ))}
            </div>
          </div>

          {/* Installed Skills Module */}
          <div className="bg-[#0d1218] border border-[#233042] rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-[#1e2938] pb-2.5">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-orange-400" />
                <h3 className="text-xs font-extrabold text-white">{isArabic ? 'السكيلز المستخدمة' : 'Installed Skills'}</h3>
              </div>
              <button 
                onClick={() => setActiveView('skills')}
                className="text-[11px] text-orange-400 hover:underline"
              >
                {isArabic ? 'عرض الكل' : 'View All'}
              </button>
            </div>

            <div className="space-y-2">
              {installedSkills.slice(0, 3).map((sk) => (
                <div key={sk.id} className="flex items-center justify-between p-2.5 bg-[#141c26] border border-[#233042] rounded-xl">
                  <span className="text-xs font-semibold text-slate-200">{sk.name}</span>
                  <ChevronLeft className={`w-3.5 h-3.5 text-slate-400 ${!isArabic && 'rotate-180'}`} />
                </div>
              ))}

              <button 
                onClick={() => setActiveView('skills')}
                className="w-full flex items-center justify-center gap-1.5 bg-[#141c26] hover:bg-[#1e2938] border border-[#233042] py-2 rounded-xl text-xs font-bold text-orange-400 hover:text-orange-300 transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{isArabic ? 'إضافة سكيل جديد' : 'Add New Skill'}</span>
              </button>
            </div>
          </div>

          {/* Installed Plugins Module */}
          <div className="bg-[#0d1218] border border-[#233042] rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-[#1e2938] pb-2.5">
              <div className="flex items-center gap-2">
                <Puzzle className="w-4 h-4 text-orange-400" />
                <h3 className="text-xs font-extrabold text-white">{isArabic ? 'الإضافات المستخدمة' : 'Installed Plugins'}</h3>
              </div>
            </div>

            <div className="space-y-2">
              {installedPlugins.slice(0, 3).map((pl) => (
                <div key={pl.id} className="flex items-center justify-between p-2.5 bg-[#141c26] border border-[#233042] rounded-xl">
                  <span className="text-xs font-semibold text-slate-200">{pl.name}</span>
                  <span className="text-[10px] text-slate-400 font-mono">{pl.version}</span>
                </div>
              ))}

              <button 
                onClick={() => setActiveView('plugins')}
                className="w-full flex items-center justify-center gap-1.5 bg-[#141c26] hover:bg-[#1e2938] border border-[#233042] py-2 rounded-xl text-xs font-bold text-orange-400 hover:text-orange-300 transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{isArabic ? 'إضافة إضافة جديدة' : 'Add New Plugin'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
