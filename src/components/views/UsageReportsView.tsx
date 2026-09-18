import React from 'react';
import { useApp } from '../../context/AppContext';
import { BarChart3, PieChart, Coins, TrendingUp, Cpu } from 'lucide-react';

export const UsageReportsView: React.FC = () => {
  const { language } = useApp();
  const isArabic = language === 'ar';

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-5xl mx-auto">
      <div className="border-b border-[#1e2938] pb-4">
        <h2 className="text-base font-extrabold text-white flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-orange-400" />
          <span>{isArabic ? 'تقرير استخدام التوكنز والموارد' : 'Token Usage & Analytics'}</span>
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          {isArabic ? 'متابعة استهلاك الذكاء الاصطناعي والتكلفة التقريبية' : 'Monitor model token usage and request counts'}
        </p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#0d1218] border border-[#233042] p-4 rounded-2xl space-y-2">
          <span className="text-xs text-slate-400 block">{isArabic ? 'الاستخدام اليومي' : 'Daily Usage'}</span>
          <div className="text-xl font-extrabold text-white dir-ltr">42,560 / 180,000</div>
          <p className="text-[10px] text-emerald-400 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>24% {isArabic ? 'من الحد اليومي' : 'of daily limit'}</span>
          </p>
        </div>

        <div className="bg-[#0d1218] border border-[#233042] p-4 rounded-2xl space-y-2">
          <span className="text-xs text-slate-400 block">{isArabic ? 'إجمالي الشهري' : 'Monthly Total'}</span>
          <div className="text-xl font-extrabold text-orange-400 dir-ltr">124,000 / 500,000</div>
          <p className="text-[10px] text-slate-400">{isArabic ? 'مجموع استهلاك التوكنز' : 'Total tokens consumed'}</p>
        </div>

        <div className="bg-[#0d1218] border border-[#233042] p-4 rounded-2xl space-y-2">
          <span className="text-xs text-slate-400 block">{isArabic ? 'الموديل الأكثر استخداماً' : 'Most Used Model'}</span>
          <div className="text-sm font-extrabold text-white">Codex (GPT-4 / OmniRoute)</div>
          <p className="text-[10px] text-slate-400">{isArabic ? '68% من إجمالي الطلبات' : '68% of all requests'}</p>
        </div>
      </div>
    </div>
  );
};
