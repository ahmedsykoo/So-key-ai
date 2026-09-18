import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FolderKanban, Plus, GitBranch, FileCode2, CheckCircle, Clock, ExternalLink } from 'lucide-react';

export const ProjectsView: React.FC = () => {
  const { projects, activeProject, setActiveProject, language, setActiveView } = useApp();
  const isArabic = language === 'ar';

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between border-b border-[#1e2938] pb-4">
        <div>
          <h2 className="text-base font-extrabold text-white flex items-center gap-2">
            <FolderKanban className="w-5 h-5 text-orange-400" />
            <span>{isArabic ? 'إدارة المشاريع والمستودعات' : 'Projects Workspace'}</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {isArabic ? 'مشاريع البرمجة المحلية المربوطة بالذكاء الاصطناعي' : 'Local software projects connected to AI workspace'}
          </p>
        </div>

        <button className="flex items-center gap-2 bg-gradient-to-r from-[#e05a10] to-[#f38f49] hover:from-[#ff6b00] hover:to-[#fdba74] text-white px-4 py-2 rounded-xl text-xs font-extrabold transition shadow-orange-glow-sm">
          <Plus className="w-4 h-4" />
          <span>{isArabic ? 'مشروع جديد' : 'New Project'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects.map((proj) => {
          const isActive = proj.id === activeProject.id;
          return (
            <div 
              key={proj.id}
              className={`bg-[#0d1218] border rounded-2xl p-5 space-y-4 transition ${
                isActive 
                  ? 'border-orange-500 shadow-orange-glow-sm bg-[#0e1620]' 
                  : 'border-[#233042] hover:border-slate-600'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                    <span>{proj.name}</span>
                    {isActive && (
                      <span className="text-[10px] bg-orange-500/20 text-orange-400 border border-orange-500/40 px-2 py-0.5 rounded-full">
                        {isArabic ? 'المشروع النشط' : 'Active'}
                      </span>
                    )}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">{proj.description}</p>
                </div>

                {!isActive && (
                  <button
                    onClick={() => setActiveProject(proj)}
                    className="text-xs font-bold text-orange-400 bg-[#141c26] border border-[#233042] px-3 py-1.5 rounded-xl hover:bg-[#1e2938] transition"
                  >
                    {isArabic ? 'تفعيل' : 'Activate'}
                  </button>
                )}
              </div>

              {/* Path & Branch */}
              <div className="space-y-1.5 bg-[#141c26] p-3 rounded-xl border border-[#233042] text-xs font-mono">
                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-slate-500">{isArabic ? 'المسار:' : 'Path:'}</span>
                  <span className="text-slate-200 dir-ltr">{proj.path}</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-slate-500">{isArabic ? 'الفرع:' : 'Branch:'}</span>
                  <span className="text-orange-400 font-bold dir-ltr flex items-center gap-1">
                    <GitBranch className="w-3.5 h-3.5" />
                    <span>{proj.activeBranch}</span>
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-400">{isArabic ? 'نسبة الإنجاز:' : 'Progress:'}</span>
                  <span className="font-bold text-emerald-400 dir-ltr">{proj.progressPercent}%</span>
                </div>
                <div className="w-full h-2 bg-[#141c26] rounded-full overflow-hidden border border-[#233042]">
                  <div 
                    className="h-full bg-gradient-to-r from-[#e05a10] to-[#f38f49] rounded-full transition-all duration-300"
                    style={{ width: `${proj.progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Action Footer */}
              <div className="flex items-center justify-between pt-2 border-t border-[#1e2938] text-xs">
                <span className="text-slate-500 text-[11px]">{proj.lastModified}</span>
                <button
                  onClick={() => setActiveView('dashboard')}
                  className="flex items-center gap-1.5 text-orange-400 font-bold hover:underline"
                >
                  <span>{isArabic ? 'فتح مخطط العمل' : 'Open Workspace'}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
