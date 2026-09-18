import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Terminal as TerminalIcon, Play, Trash2, Copy, Search, CornerDownLeft } from 'lucide-react';

export const TerminalView: React.FC = () => {
  const { terminalLogs, executeCommand, clearTerminal, activeProject, language } = useApp();
  const isArabic = language === 'ar';

  const [inputCmd, setInputCmd] = useState<string>('');

  const handleRun = () => {
    if (!inputCmd.trim()) return;
    executeCommand(inputCmd);
    setInputCmd('');
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col bg-[#05090e] font-mono text-xs">
      {/* Top Header Bar */}
      <div className="p-3 bg-[#0d1218] border-b border-[#1e2938] flex items-center justify-between gap-4 select-none">
        <div className="flex items-center gap-2">
          <TerminalIcon className="w-4 h-4 text-orange-400" />
          <span className="font-bold text-white text-xs">Terminal — bash</span>
          <span className="text-[11px] text-slate-400 bg-[#141c26] px-2 py-0.5 rounded border border-[#233042] dir-ltr">
            {activeProject.path}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={clearTerminal}
            className="p-1.5 bg-[#141c26] hover:bg-[#1e2938] border border-[#233042] text-slate-400 hover:text-white rounded-lg transition"
            title={isArabic ? 'مسح الشاشة' : 'Clear Screen'}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Output Console Logs Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 dir-ltr text-slate-200">
        {terminalLogs.map((log) => (
          <div key={log.id} className="space-y-1">
            {log.type === 'input' && (
              <div className="flex items-center gap-2 text-orange-400 font-bold">
                <span className="text-cyan-400">so-key@mobile:{activeProject.name}$</span>
                <span>{log.text}</span>
              </div>
            )}
            {log.type === 'output' && (
              <pre className="text-slate-300 whitespace-pre-wrap pl-4 border-l-2 border-[#233042] font-mono leading-relaxed">
                {log.text}
              </pre>
            )}
            {log.type === 'system' && (
              <div className="text-slate-500 italic text-[11px]">
                [{log.timestamp}] {log.text}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Command Input Bar */}
      <div className="p-3 bg-[#0d1218] border-t border-[#1e2938]">
        <div className="flex items-center gap-2 bg-[#141c26] border border-[#233042] focus-within:border-orange-500 rounded-xl px-3 py-2 transition dir-ltr">
          <span className="text-cyan-400 font-bold">$</span>
          <input
            type="text"
            value={inputCmd}
            onChange={(e) => setInputCmd(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleRun()}
            placeholder="Enter shell command (e.g. git status, help, status, build)..."
            className="flex-1 bg-transparent text-xs text-slate-100 placeholder-slate-500 focus:outline-none font-mono"
          />
          <button
            onClick={handleRun}
            className="bg-orange-600 hover:bg-orange-500 text-white p-1.5 rounded-lg transition"
          >
            <CornerDownLeft className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
