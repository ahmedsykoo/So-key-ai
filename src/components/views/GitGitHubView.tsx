import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { GitBranch, GitCommit, GitPullRequest, FileDiff, Check, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

export const GitGitHubView: React.FC = () => {
  const { activeProject, language } = useApp();
  const isArabic = language === 'ar';

  const [commitMsg, setCommitMsg] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'changes' | 'history' | 'prs'>('changes');

  const modifiedFiles = [
    { name: 'FareCalculator.kt', path: 'src/main/java/ai/sokey/FareCalculator.kt', additions: 42, deletions: 3 },
    { name: 'TripReader.kt', path: 'src/main/java/ai/sokey/TripReader.kt', additions: 18, deletions: 2 },
    { name: 'strings.xml', path: 'src/main/res/values/strings.xml', additions: 6, deletions: 0 },
  ];

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#1e2938] pb-4">
        <div>
          <h2 className="text-base font-extrabold text-white flex items-center gap-2">
            <GitBranch className="w-5 h-5 text-orange-400" />
            <span>{isArabic ? 'إدارة Git و GitHub' : 'Git & GitHub Workspace'}</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {isArabic ? `المستودع النشط: ${activeProject.name}` : `Active Repo: ${activeProject.name}`}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs bg-[#141c26] text-orange-400 border border-[#233042] px-3 py-1.5 rounded-xl font-mono font-bold flex items-center gap-1.5 dir-ltr">
            <GitBranch className="w-3.5 h-3.5" />
            <span>{activeProject.activeBranch}</span>
          </span>

          <button className="bg-[#141c26] hover:bg-[#1e2938] border border-[#233042] text-slate-200 px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />
            <span>Push</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 bg-[#141c26] p-1 rounded-xl border border-[#233042] w-fit">
        <button
          onClick={() => setActiveTab('changes')}
          className={`px-4 py-1.5 rounded-lg text-xs font-bold transition ${
            activeTab === 'changes' ? 'bg-[#e05a10] text-white shadow-orange-glow-sm' : 'text-slate-400'
          }`}
        >
          {isArabic ? 'التغييرات (3)' : 'Changes (3)'}
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`px-4 py-1.5 rounded-lg text-xs font-bold transition ${
            activeTab === 'history' ? 'bg-[#e05a10] text-white shadow-orange-glow-sm' : 'text-slate-400'
          }`}
        >
          {isArabic ? 'سجل الـCommits' : 'Commit History'}
        </button>
      </div>

      {activeTab === 'changes' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* File list */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="text-xs font-extrabold text-slate-300">{isArabic ? 'الملفات المعدلة (Staged / Unstaged)' : 'Staged Changes'}</h3>
            <div className="space-y-2">
              {modifiedFiles.map((file, idx) => (
                <div key={idx} className="bg-[#0d1218] border border-[#233042] p-3.5 rounded-xl flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-white font-mono">{file.name}</h4>
                    <p className="text-[10px] text-slate-400 font-mono dir-ltr">{file.path}</p>
                  </div>
                  <div className="flex items-center gap-2 font-mono text-xs font-bold">
                    <span className="text-emerald-400">+{file.additions}</span>
                    <span className="text-rose-400">-{file.deletions}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Commit Form Box */}
          <div className="bg-[#0d1218] border border-[#233042] p-4 rounded-2xl space-y-4">
            <h3 className="text-xs font-extrabold text-white flex items-center gap-1.5">
              <GitCommit className="w-4 h-4 text-orange-400" />
              <span>{isArabic ? 'حفظ التغييرات (Commit)' : 'Commit Changes'}</span>
            </h3>

            <textarea
              value={commitMsg}
              onChange={(e) => setCommitMsg(e.target.value)}
              placeholder={isArabic ? 'اكتب وصف التغييرات (Commit message)...' : 'Write commit message...'}
              rows={4}
              className="w-full bg-[#141c26] border border-[#233042] text-xs text-white placeholder-slate-500 rounded-xl p-3 focus:outline-none focus:border-orange-500"
            />

            <button 
              disabled={!commitMsg.trim()}
              className="w-full bg-gradient-to-r from-[#e05a10] to-[#f38f49] hover:from-[#ff6b00] hover:to-[#fdba74] text-white py-2 rounded-xl text-xs font-extrabold transition shadow-orange-glow-sm disabled:opacity-50"
            >
              {isArabic ? 'تأكيد الحفظ (Commit to main)' : 'Commit & Push'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
