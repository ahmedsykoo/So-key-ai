import React from 'react';
import { useApp } from '../../context/AppContext';
import { Server, Plug, CheckCircle2, ShieldAlert } from 'lucide-react';

export const MCPIntegrationsView: React.FC = () => {
  const { language } = useApp();
  const isArabic = language === 'ar';

  const mcps = [
    { name: 'FileSystem MCP Server', status: 'connected', endpoint: 'mcp://localhost:8080/filesystem' },
    { name: 'GitHub Integration Protocol', status: 'connected', endpoint: 'mcp://api.github.com/v1' },
    { name: 'Android Emulator Debugger', status: 'connected', endpoint: 'mcp://127.0.0.1:5555/adb' }
  ];

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-5xl mx-auto">
      <div className="border-b border-[#1e2938] pb-4">
        <h2 className="text-base font-extrabold text-white flex items-center gap-2">
          <Server className="w-5 h-5 text-orange-400" />
          <span>{isArabic ? 'إدارة خوادم MCP والمكاملات الخارجية' : 'MCP Servers & External Tools'}</span>
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Model Context Protocol (MCP) Integration Engine
        </p>
      </div>

      <div className="space-y-3">
        {mcps.map((mcp, idx) => (
          <div key={idx} className="bg-[#0d1218] border border-[#233042] p-4 rounded-2xl flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-white">{mcp.name}</h3>
              <p className="text-[11px] text-slate-400 font-mono mt-0.5 dir-ltr">{mcp.endpoint}</p>
            </div>
            <span className="text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-xl font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{isArabic ? 'متصل' : 'Connected'}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
