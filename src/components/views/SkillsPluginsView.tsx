import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Zap, 
  Puzzle, 
  Search, 
  Plus, 
  Smartphone, 
  Code, 
  Github, 
  Palette, 
  TestTube, 
  FileText, 
  Infinity as InfinityIcon,
  Check,
  ChevronLeft
} from 'lucide-react';

export const SkillsPluginsView: React.FC = () => {
  const { skills, plugins, toggleSkill, togglePlugin, language } = useApp();
  const isArabic = language === 'ar';

  const [activeCategory, setActiveTab] = useState<'skills' | 'plugins'>('skills');
  const [filter, setFilter] = useState<'all' | 'installed' | 'recommended'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const installedSkills = skills.filter(s => s.isInstalled);
  const recommendedSkills = skills.filter(s => !s.isInstalled && s.isRecommended);

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-5xl mx-auto">
      {/* Category Tabs Bar matching 02-skills-plugins.png */}
      <div className="flex items-center justify-between border-b border-[#1e2938] pb-3">
        <div className="flex items-center gap-2 bg-[#141c26] p-1 rounded-2xl border border-[#233042]">
          <button
            onClick={() => setActiveTab('skills')}
            className={`px-5 py-2 rounded-xl text-xs font-extrabold transition ${
              activeCategory === 'skills'
                ? 'bg-[#e05a10] text-white shadow-orange-glow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {isArabic ? 'السكيلز (Skills)' : 'Skills'}
          </button>
          <button
            onClick={() => setActiveTab('plugins')}
            className={`px-5 py-2 rounded-xl text-xs font-extrabold transition ${
              activeCategory === 'plugins'
                ? 'bg-[#e05a10] text-white shadow-orange-glow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {isArabic ? 'الإضافات (Plugins)' : 'Plugins'}
          </button>
        </div>

        <button className="flex items-center gap-1.5 bg-[#141c26] hover:bg-[#1e2938] border border-[#233042] text-orange-400 hover:text-orange-300 px-3.5 py-2 rounded-xl text-xs font-bold transition">
          <Plus className="w-4 h-4" />
          <span>{isArabic ? 'إنشاء سكيل مخصص' : 'Custom Skill'}</span>
        </button>
      </div>

      {/* Search & Filter Chips Bar matching 02-skills-plugins.png */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className={`w-4 h-4 text-slate-400 absolute top-2.5 ${isArabic ? 'right-3' : 'left-3'}`} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isArabic ? 'بحث في السكيلز والإضافات...' : 'Search skills...'}
            className={`w-full bg-[#141c26] border border-[#233042] text-xs text-white placeholder-slate-500 rounded-xl py-2 focus:outline-none focus:border-orange-500 transition ${
              isArabic ? 'pr-9 pl-3' : 'pl-9 pr-3'
            }`}
          />
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {[
            { id: 'all', labelAr: 'الكل', labelEn: 'All' },
            { id: 'installed', labelAr: 'مثبتة', labelEn: 'Installed' },
            { id: 'recommended', labelAr: 'موصى بها', labelEn: 'Recommended' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                filter === f.id
                  ? 'bg-[#e05a10] text-white shadow-orange-glow-sm'
                  : 'bg-[#141c26] text-slate-400 border border-[#233042] hover:text-slate-200'
              }`}
            >
              {isArabic ? f.labelAr : f.labelEn}
            </button>
          ))}
        </div>
      </div>

      {activeCategory === 'skills' ? (
        <div className="space-y-6">
          {/* Installed Skills Section matching 02-skills-plugins.png */}
          {(filter === 'all' || filter === 'installed') && (
            <div className="bg-[#0d1218] border border-[#233042] rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                  <Zap className="w-4 h-4 text-orange-400" />
                  <span>{isArabic ? `السكيلز المثبتة (${installedSkills.length})` : `Installed Skills (${installedSkills.length})`}</span>
                </h3>
                <span className="text-xs text-slate-400">{isArabic ? 'عرض الكل' : 'View All'}</span>
              </div>

              <div className="space-y-2.5">
                {installedSkills.map((sk) => (
                  <div 
                    key={sk.id}
                    className="flex items-center justify-between bg-[#141c26] hover:bg-[#1e2938] border border-[#233042] p-3.5 rounded-xl transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                        <Smartphone className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">{sk.name}</h4>
                        <p className="text-[11px] text-slate-400">{sk.description}</p>
                      </div>
                    </div>

                    {/* Toggle Switch */}
                    <button
                      onClick={() => toggleSkill(sk.id)}
                      className={`w-11 h-6 rounded-full transition-colors p-1 flex items-center ${
                        sk.isEnabled ? 'bg-emerald-500 justify-end' : 'bg-[#233042] justify-start'
                      }`}
                    >
                      <div className="w-4 h-4 rounded-full bg-white shadow-md" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommended Skills Section matching 02-skills-plugins.png */}
          {(filter === 'all' || filter === 'recommended') && (
            <div className="bg-[#0d1218] border border-[#233042] rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                  <Puzzle className="w-4 h-4 text-orange-400" />
                  <span>{isArabic ? 'السكيلز الموصى بها' : 'Recommended Skills'}</span>
                </h3>
              </div>

              <div className="space-y-2.5">
                {recommendedSkills.map((sk) => (
                  <div 
                    key={sk.id}
                    className="flex items-center justify-between bg-[#141c26] hover:bg-[#1e2938] border border-[#233042] p-3.5 rounded-xl transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400">
                        <TestTube className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">{sk.name}</h4>
                        <p className="text-[11px] text-slate-400">{sk.description}</p>
                      </div>
                    </div>

                    {/* Install Button matching 02-skills-plugins.png */}
                    <button
                      onClick={() => toggleSkill(sk.id)}
                      className="bg-[#e05a10] hover:bg-orange-500 text-white px-4 py-1.5 rounded-xl text-xs font-extrabold transition shadow-orange-glow-sm"
                    >
                      {isArabic ? 'تثبيت' : 'Install'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Plugins Category Tab */
        <div className="bg-[#0d1218] border border-[#233042] rounded-2xl p-5 space-y-4">
          <h3 className="text-sm font-extrabold text-white">{isArabic ? 'الإضافات المتوفرة' : 'Installed Plugins'}</h3>
          <div className="space-y-3">
            {plugins.map((pl) => (
              <div key={pl.id} className="flex items-center justify-between bg-[#141c26] border border-[#233042] p-4 rounded-xl">
                <div>
                  <h4 className="text-xs font-bold text-white">{pl.name}</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">{pl.description}</p>
                </div>

                <button
                  onClick={() => togglePlugin(pl.id)}
                  className={`w-11 h-6 rounded-full transition-colors p-1 flex items-center ${
                    pl.isEnabled ? 'bg-emerald-500 justify-end' : 'bg-[#233042] justify-start'
                  }`}
                >
                  <div className="w-4 h-4 rounded-full bg-white shadow-md" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
