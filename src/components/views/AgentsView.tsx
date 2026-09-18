import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Agent } from '../../types';
import { Bot, Play, Pause, Plus, Settings, Cpu, Shield, Zap, Copy, Trash2, Edit3 } from 'lucide-react';

export const AgentsView: React.FC = () => {
  const { agents, toggleAgentStatus, language } = useApp();
  const isArabic = language === 'ar';

  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between border-b border-[#1e2938] pb-4">
        <div>
          <h2 className="text-base font-extrabold text-white flex items-center gap-2">
            <Bot className="w-5 h-5 text-orange-400" />
            <span>{isArabic ? 'إدارة وكلاء الذكاء الاصطناعي (AI Agents)' : 'AI Agents Management'}</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {isArabic ? 'تخصيص وتعيين الوكلاء لإنجاز المهام التلقائية بالبرمجة' : 'Manage system instructions and assigned models'}
          </p>
        </div>

        <button className="flex items-center gap-2 bg-gradient-to-r from-[#e05a10] to-[#f38f49] hover:from-[#ff6b00] hover:to-[#fdba74] text-white px-4 py-2 rounded-xl text-xs font-extrabold transition shadow-orange-glow-sm">
          <Plus className="w-4 h-4" />
          <span>{isArabic ? 'إنشاء وكيل جديد' : 'Create Agent'}</span>
        </button>
      </div>

      {/* Grid of Agents */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {agents.map((ag) => (
          <div 
            key={ag.id} 
            className="bg-[#0d1218] border border-[#233042] hover:border-orange-500/40 rounded-2xl p-5 space-y-4 transition shadow-card-dark"
          >
            {/* Top Bar */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <span className="text-3xl bg-[#141c26] border border-[#233042] p-2 rounded-2xl">{ag.avatar}</span>
                <div>
                  <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                    <span>{ag.name}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border ${
                      ag.status === 'running' 
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' 
                        : 'bg-slate-500/20 text-slate-400 border-slate-500/30'
                    }`}>
                      {ag.status === 'running' ? (isArabic ? 'نشط ويعمل' : 'Running') : (isArabic ? 'خامل' : 'Idle')}
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400">{ag.role}</p>
                </div>
              </div>

              {/* Status Action Toggle */}
              <button
                onClick={() => toggleAgentStatus(ag.id)}
                className={`p-2 rounded-xl border transition ${
                  ag.status === 'running'
                    ? 'bg-rose-500/10 border-rose-500/30 text-rose-400 hover:bg-rose-500/20'
                    : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                }`}
                title={ag.status === 'running' ? 'إيقاف مؤقت' : 'تشغيل الوكيل'}
              >
                {ag.status === 'running' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
              </button>
            </div>

            {/* Model Badge */}
            <div className="flex items-center gap-2 bg-[#141c26] p-2.5 rounded-xl border border-[#233042] text-xs">
              <Cpu className="w-4 h-4 text-orange-400" />
              <span className="text-slate-400">{isArabic ? 'الموديل:' : 'Model:'}</span>
              <span className="font-bold text-white">{ag.model}</span>
            </div>

            {/* System Prompt Snippet */}
            <div className="bg-[#081017] p-3 rounded-xl border border-[#233042] text-xs text-slate-300 font-mono text-[11px] line-clamp-2">
              "{ag.systemPrompt}"
            </div>

            {/* Assigned Skills */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-slate-400 block">{isArabic ? 'المهارات المعينة:' : 'Assigned Skills:'}</span>
              <div className="flex flex-wrap gap-1.5">
                {ag.skills.map((sk, idx) => (
                  <span key={idx} className="bg-[#141c26] text-orange-300 border border-[#233042] px-2.5 py-0.5 rounded-lg text-[10px] font-semibold">
                    {sk}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Buttons Footer */}
            <div className="flex items-center justify-between pt-2 border-t border-[#1e2938] text-xs">
              <button 
                onClick={() => setSelectedAgent(ag)}
                className="flex items-center gap-1 text-slate-400 hover:text-white transition"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>{isArabic ? 'تعديل البرومبت' : 'Edit Prompt'}</span>
              </button>

              <div className="flex items-center gap-2">
                <button className="p-1.5 text-slate-400 hover:text-white" title={isArabic ? 'نسخ' : 'Duplicate'}>
                  <Copy className="w-3.5 h-3.5" />
                </button>
                <button className="p-1.5 text-slate-400 hover:text-rose-400" title={isArabic ? 'حذف' : 'Delete'}>
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit System Prompt Modal */}
      {selectedAgent && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0d1218] border border-[#233042] rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
              <Bot className="w-4 h-4 text-orange-400" />
              <span>{isArabic ? `تعديل تعليمات النظام — ${selectedAgent.name}` : `Edit Prompt — ${selectedAgent.name}`}</span>
            </h3>

            <textarea
              rows={5}
              defaultValue={selectedAgent.systemPrompt}
              className="w-full bg-[#141c26] border border-[#233042] rounded-xl p-3 text-xs text-white focus:outline-none focus:border-orange-500 font-mono"
            />

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setSelectedAgent(null)}
                className="px-4 py-2 bg-[#141c26] hover:bg-[#1e2938] border border-[#233042] text-slate-300 rounded-xl text-xs font-bold"
              >
                {isArabic ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                onClick={() => setSelectedAgent(null)}
                className="px-4 py-2 bg-[#e05a10] hover:bg-orange-500 text-white rounded-xl text-xs font-bold shadow-orange-glow-sm"
              >
                {isArabic ? 'حفظ التغييرات' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
