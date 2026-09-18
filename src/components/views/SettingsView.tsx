import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ThemeId, TextScale } from '../../types';
import { 
  Palette, 
  Globe, 
  Cpu, 
  Terminal, 
  ShieldCheck, 
  HardDrive, 
  Check, 
  RefreshCw, 
  Sliders,
  Sparkles
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { 
    language, 
    setLanguage, 
    theme, 
    setTheme, 
    textScale, 
    setTextScale, 
    omniRoute, 
    updateOmniRoute 
  } = useApp();

  const isArabic = language === 'ar';
  const [activeSection, setActiveSection] = useState<'themes' | 'providers' | 'general'>('themes');

  const themeOptions: { id: ThemeId; nameAr: string; nameEn: string; bg: string; accent: string }[] = [
    { id: 'dark-orange', nameAr: 'داكن برتقالي (الافتراضي)', nameEn: 'Dark Orange (Default)', bg: 'bg-[#081017]', accent: 'bg-[#e05a10]' },
    { id: 'amoled', nameAr: 'AMOLED أسود فاخر', nameEn: 'AMOLED Black', bg: 'bg-black', accent: 'bg-orange-500' },
    { id: 'neon', nameAr: 'نيون مستقبلي', nameEn: 'Neon Cyber', bg: 'bg-[#050510]', accent: 'bg-pink-500' },
    { id: 'light', nameAr: 'فاتح ومريح للعين', nameEn: 'Light Mode', bg: 'bg-slate-100 text-slate-900', accent: 'bg-orange-600' },
    { id: 'glass', nameAr: 'زجاجي شفاف (Glass)', nameEn: 'Glassmorphism', bg: 'bg-[#0c1824]', accent: 'bg-cyan-500' },
    { id: 'sunset', nameAr: 'غروب دافئ', nameEn: 'Sunset Orange', bg: 'bg-[#180d14]', accent: 'bg-amber-500' },
    { id: 'ocean', nameAr: 'محيط هادئ', nameEn: 'Quiet Ocean', bg: 'bg-[#0a1622]', accent: 'bg-blue-500' },
    { id: 'forest', nameAr: 'غابة طبيعية', nameEn: 'Deep Forest', bg: 'bg-[#081711]', accent: 'bg-emerald-500' },
    { id: 'dracula', nameAr: 'دراكيولا أنيق', nameEn: 'Dracula Dark', bg: 'bg-[#13121d]', accent: 'bg-purple-500' },
  ];

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-5xl mx-auto">
      {/* Settings Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-[#1e2938] pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveSection('themes')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeSection === 'themes'
              ? 'bg-[#e05a10] text-white shadow-orange-glow-sm'
              : 'bg-[#141c26] text-slate-400 border border-[#233042] hover:text-slate-200'
          }`}
        >
          <Palette className="w-4 h-4" />
          <span>{isArabic ? 'المظهر والثيمات (Themes)' : 'Themes & Appearance'}</span>
        </button>

        <button
          onClick={() => setActiveSection('providers')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeSection === 'providers'
              ? 'bg-[#e05a10] text-white shadow-orange-glow-sm'
              : 'bg-[#141c26] text-slate-400 border border-[#233042] hover:text-slate-200'
          }`}
        >
          <Cpu className="w-4 h-4" />
          <span>{isArabic ? 'مزودي الذكاء و OmniRoute' : 'AI Providers & OmniRoute'}</span>
        </button>

        <button
          onClick={() => setActiveSection('general')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeSection === 'general'
              ? 'bg-[#e05a10] text-white shadow-orange-glow-sm'
              : 'bg-[#141c26] text-slate-400 border border-[#233042] hover:text-slate-200'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>{isArabic ? 'عام واللغة والخطوط' : 'General & Language'}</span>
        </button>
      </div>

      {activeSection === 'themes' && (
        <div className="space-y-6">
          <div className="bg-[#0d1218] border border-[#233042] p-5 rounded-2xl space-y-4">
            <div>
              <h3 className="text-sm font-extrabold text-white">{isArabic ? 'اختر النمط والمظهر المناسب (Themes)' : 'Choose Theme Style'}</h3>
              <p className="text-xs text-slate-400 mt-0.5">{isArabic ? 'يتم حفظ النمط وتطبيقه مباشرة دون إعادة التشغيل' : 'Applies instantly without restart'}</p>
            </div>

            {/* Grid of Theme Cards matching 03-chat-themes.png */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
              {themeOptions.map((th) => {
                const isSelected = theme === th.id;
                return (
                  <button
                    key={th.id}
                    onClick={() => setTheme(th.id)}
                    className={`p-4 rounded-2xl border text-right transition flex flex-col justify-between h-28 ${th.bg} ${
                      isSelected 
                        ? 'border-orange-500 shadow-orange-glow-sm ring-2 ring-orange-500/50' 
                        : 'border-[#233042] hover:border-slate-500'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-white">{isArabic ? th.nameAr : th.nameEn}</span>
                      {isSelected && <Check className="w-4 h-4 text-orange-400" />}
                    </div>

                    {/* Preview Accent Strip */}
                    <div className="flex items-center gap-1.5 pt-2">
                      <div className={`w-5 h-5 rounded-lg ${th.accent}`} />
                      <div className="w-12 h-2 rounded bg-slate-700/50" />
                      <div className="w-8 h-2 rounded bg-slate-700/30" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {activeSection === 'providers' && (
        <div className="bg-[#0d1218] border border-[#233042] p-5 rounded-2xl space-y-5">
          <div>
            <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
              <Cpu className="w-4 h-4 text-orange-400" />
              <span>{isArabic ? 'إعدادات OmniRoute ومزودي الذكاء الاصطناعي' : 'OmniRoute & AI Providers'}</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {isArabic ? 'توجيه الطلبات عبر خوادم OmniRoute ومزودي OpenAI/OpenRouter' : 'Configure base API endpoints and authentication keys'}
            </p>
          </div>

          <div className="space-y-4 max-w-lg">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">{isArabic ? 'رابط خادم OmniRoute Base URL:' : 'OmniRoute Base URL:'}</label>
              <input
                type="text"
                value={omniRoute.baseUrl}
                onChange={(e) => updateOmniRoute({ baseUrl: e.target.value })}
                className="w-full bg-[#141c26] border border-[#233042] text-xs text-white rounded-xl p-3 focus:outline-none focus:border-orange-500 font-mono dir-ltr"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">{isArabic ? 'مفتاح API Key المحفوظ بأمان:' : 'API Key:'}</label>
              <input
                type="password"
                value={omniRoute.apiKey}
                onChange={(e) => updateOmniRoute({ apiKey: e.target.value })}
                className="w-full bg-[#141c26] border border-[#233042] text-xs text-white rounded-xl p-3 focus:outline-none focus:border-orange-500 font-mono dir-ltr"
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-[#141c26] border border-[#233042] rounded-xl text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-bold text-white">{isArabic ? 'حالة الاتصال: متصل وسريع (12ms)' : 'Connection: Connected (12ms)'}</span>
              </div>
              <button className="bg-[#1e2938] hover:bg-[#283548] text-orange-400 px-3 py-1 rounded-lg font-bold transition flex items-center gap-1">
                <RefreshCw className="w-3.5 h-3.5" />
                <span>{isArabic ? 'اختبار الاتصال' : 'Test Connection'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {activeSection === 'general' && (
        <div className="bg-[#0d1218] border border-[#233042] p-5 rounded-2xl space-y-6">
          {/* Language Picker */}
          <div className="space-y-2">
            <h4 className="text-xs font-extrabold text-white flex items-center gap-2">
              <Globe className="w-4 h-4 text-orange-400" />
              <span>{isArabic ? 'لغة الواجهة (Language & RTL)' : 'Interface Language'}</span>
            </h4>
            <div className="flex gap-3">
              <button
                onClick={() => setLanguage('ar')}
                className={`px-4 py-2 rounded-xl text-xs font-bold border transition ${
                  language === 'ar' 
                    ? 'bg-[#e05a10] border-orange-400 text-white shadow-orange-glow-sm' 
                    : 'bg-[#141c26] border-[#233042] text-slate-400'
                }`}
              >
                العربية (RTL)
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`px-4 py-2 rounded-xl text-xs font-bold border transition ${
                  language === 'en' 
                    ? 'bg-[#e05a10] border-orange-400 text-white shadow-orange-glow-sm' 
                    : 'bg-[#141c26] border-[#233042] text-slate-400'
                }`}
              >
                English (LTR)
              </button>
            </div>
          </div>

          {/* Text Scale Picker */}
          <div className="space-y-2 pt-3 border-t border-[#1e2938]">
            <h4 className="text-xs font-extrabold text-white">{isArabic ? 'حجم الخط والتكبير (Text Scale)' : 'Text Scale'}</h4>
            <div className="flex gap-2">
              {(['85%', '100%', '115%', '130%'] as TextScale[]).map((scale) => (
                <button
                  key={scale}
                  onClick={() => setTextScale(scale)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition ${
                    textScale === scale
                      ? 'bg-[#e05a10] border-orange-400 text-white shadow-orange-glow-sm'
                      : 'bg-[#141c26] border-[#233042] text-slate-400'
                  }`}
                >
                  {scale}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
