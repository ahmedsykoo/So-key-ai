import React from 'react';
import { useApp } from '../../context/AppContext';
import { Workflow, Play, Plus, CheckCircle2, Clock, Activity, Zap } from 'lucide-react';

export const AutomationView: React.FC = () => {
  const { language } = useApp();
  const isArabic = language === 'ar';

  const workflows = [
    { id: 'wf-1', name: 'أتمتة بناء واختبار Android APK', trigger: 'عند فتح PR جديد على GitHub', status: 'active', lastRun: 'منذ ساعتين' },
    { id: 'wf-2', name: 'التدقيق التلقائي للأكواد والأداء', trigger: 'جدولة يومية - 12:00 منتصف الليل', status: 'active', lastRun: 'أمس' },
    { id: 'wf-3', name: 'مزامنة وتوثيق ملفات API مع Swagger', trigger: 'عند تحديث ملفات Kotlin', status: 'idle', lastRun: 'منذ 3 أيام' }
  ];

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between border-b border-[#1e2938] pb-4">
        <div>
          <h2 className="text-base font-extrabold text-white flex items-center gap-2">
            <Workflow className="w-5 h-5 text-orange-400" />
            <span>{isArabic ? 'سير العمل والأتمتة (Workflows & Automation)' : 'Automation Workflows'}</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {isArabic ? 'إنشاء وتشغيل المسارات التلقائية باستخدام الوكلاء المتاحين' : 'Build automated trigger & action rules'}
          </p>
        </div>

        <button className="flex items-center gap-2 bg-gradient-to-r from-[#e05a10] to-[#f38f49] hover:from-[#ff6b00] text-white px-4 py-2 rounded-xl text-xs font-extrabold shadow-orange-glow-sm transition">
          <Plus className="w-4 h-4" />
          <span>{isArabic ? 'إنشاء مسار جديد' : 'New Workflow'}</span>
        </button>
      </div>

      <div className="space-y-3">
        {workflows.map((wf) => (
          <div key={wf.id} className="bg-[#0d1218] border border-[#233042] hover:border-orange-500/40 p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition shadow-card-dark">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-extrabold text-white">{wf.name}</h3>
                <p className="text-[11px] text-slate-400">{isArabic ? `المشغل: ${wf.trigger}` : `Trigger: ${wf.trigger}`}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 border-[#1e2938] pt-3 sm:pt-0">
              <span className="text-[10px] text-slate-400 flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-500" />
                <span>{wf.lastRun}</span>
              </span>

              <button className="flex items-center gap-1.5 bg-[#e05a10] hover:bg-orange-500 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold transition shadow-orange-glow-sm">
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{isArabic ? 'تشغيل' : 'Run'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
