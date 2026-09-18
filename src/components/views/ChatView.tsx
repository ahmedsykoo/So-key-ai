import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Send, 
  Paperclip, 
  Mic, 
  Code, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  Loader2, 
  Copy, 
  RotateCcw, 
  Share2, 
  Bot, 
  FileCode2, 
  AlertCircle
} from 'lucide-react';

export const ChatView: React.FC = () => {
  const { currentChat, sendMessage, isStreaming, language } = useApp();
  const isArabic = language === 'ar';

  const [input, setInput] = useState<string>('');
  const [selectedModel, setSelectedModel] = useState<string>('Codex (GPT-4)');
  const [expandedThinking, setExpandedThinking] = useState<Record<string, boolean>>({});

  const handleSend = () => {
    if (!input.trim() || isStreaming) return;
    sendMessage(input);
    setInput('');
  };

  const toggleThinking = (msgId: string) => {
    setExpandedThinking(prev => ({ ...prev, [msgId]: !prev[msgId] }));
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col bg-[#081017]">
      {/* Top Model & Context Bar matching 03-chat-themes.png */}
      <div className="px-4 py-3 bg-[#0d1218] border-b border-[#1e2938] flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {/* Model Selector Dropdown */}
          <div className="relative">
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="appearance-none bg-[#141c26] border border-[#233042] text-xs font-bold text-white pl-3 pr-8 py-1.5 rounded-xl focus:outline-none focus:border-orange-500 cursor-pointer"
            >
              <option value="Codex (GPT-4)">Codex (GPT-4 / OmniRoute)</option>
              <option value="Claude 3.5 Sonnet">Claude 3.5 Sonnet</option>
              <option value="ChatGPT (GPT-4o)">ChatGPT (GPT-4o)</option>
              <option value="Gemini 1.5 Pro">Gemini 1.5 Pro</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute top-2.5 right-2.5 pointer-events-none" />
          </div>

          <span className="hidden sm:inline-block text-[11px] text-slate-400 bg-[#141c26] px-2.5 py-1 rounded-lg border border-[#233042]">
            {isArabic ? 'السياق: 12 ملفاً متضمناً' : 'Context: 12 Files Included'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs text-slate-300 font-medium">{isArabic ? 'الوكيل جاهز' : 'Agent Ready'}</span>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 max-w-4xl mx-auto w-full">
        {currentChat.messages.map((msg) => {
          const isUser = msg.sender === 'user';
          const isThinkingOpen = expandedThinking[msg.id];

          return (
            <div 
              key={msg.id} 
              className={`flex flex-col gap-2 ${isUser ? 'items-end' : 'items-start'}`}
            >
              {/* Sender Name & Avatar */}
              <div className="flex items-center gap-2 px-1">
                {!isUser ? (
                  <div className="w-6 h-6 rounded-lg bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                ) : (
                  <div className="w-6 h-6 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-bold text-[10px]">
                    أنت
                  </div>
                )}
                <span className="text-xs font-bold text-slate-200">{isUser ? (isArabic ? 'أنت' : 'You') : (msg.model || 'Codex (GPT-4)')}</span>
                <span className="text-[10px] text-slate-500 dir-ltr">{msg.timestamp}</span>
              </div>

              {/* Message Bubble Container */}
              <div className={`w-full max-w-2xl rounded-2xl p-4 text-xs leading-relaxed border space-y-3 ${
                isUser 
                  ? 'bg-[#1e2938] text-slate-100 border-[#2b3b4e] rounded-tr-none' 
                  : 'bg-[#141c26] text-slate-100 border-[#233042] rounded-tl-none shadow-card-dark'
              }`}>
                {/* Thinking Process Accordion if present */}
                {msg.thinkingContent && (
                  <div className="bg-[#081017] border border-[#233042] rounded-xl overflow-hidden">
                    <button
                      onClick={() => toggleThinking(msg.id)}
                      className="w-full flex items-center justify-between p-2.5 text-[11px] font-bold text-orange-400 hover:bg-[#0d1218] transition"
                    >
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-3.5 h-3.5 text-orange-400" />
                        <span>{isArabic ? 'التفكير العميق والخطوات' : 'Thinking Process'}</span>
                      </div>
                      {isThinkingOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                    {isThinkingOpen && (
                      <div className="p-3 border-t border-[#233042] font-mono text-[11px] text-slate-300 bg-[#081017] whitespace-pre-wrap dir-ltr">
                        {msg.thinkingContent}
                      </div>
                    )}
                  </div>
                )}

                {/* Main Content Text */}
                <p className="whitespace-pre-wrap">{msg.content}</p>

                {/* Tool Calls execution list matching 03-chat-themes.png */}
                {msg.toolCalls && msg.toolCalls.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-[#233042]">
                    <span className="text-[11px] font-bold text-slate-400 block">{isArabic ? 'خطوات التنفيذ:' : 'Execution Steps:'}</span>
                    <div className="space-y-1.5">
                      {msg.toolCalls.map((tc) => (
                        <div key={tc.id} className="flex items-center justify-between bg-[#081017] border border-[#233042] p-2 rounded-lg text-[11px]">
                          <div className="flex items-center gap-2">
                            {tc.status === 'completed' ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Loader2 className="w-3.5 h-3.5 text-orange-400 animate-spin" />
                            )}
                            <span className="font-semibold text-slate-200">{tc.name}</span>
                          </div>
                          {tc.result && <span className="text-slate-400 text-[10px]">{tc.result}</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* File Diffs Card matching 03-chat-themes.png */}
                {msg.fileDiffs && msg.fileDiffs.length > 0 && (
                  <div className="bg-[#081017] border border-[#233042] rounded-xl p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                        <FileCode2 className="w-3.5 h-3.5 text-orange-400" />
                        <span>{isArabic ? `الملفات المعدلة (${msg.fileDiffs.length})` : `Modified Files (${msg.fileDiffs.length})`}</span>
                      </span>
                    </div>

                    <div className="space-y-1.5 font-mono text-[11px]">
                      {msg.fileDiffs.map((fd, idx) => (
                        <div key={idx} className="flex items-center justify-between bg-[#141c26] p-1.5 rounded-lg border border-[#233042]">
                          <span className="text-slate-200">{fd.fileName}</span>
                          <div className="flex items-center gap-2 text-[10px]">
                            <span className="text-emerald-400">+{fd.additions}</span>
                            <span className="text-rose-400">-{fd.deletions}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Progress bar matching 03-chat-themes.png */}
                {msg.progressPercent !== undefined && (
                  <div className="space-y-1 pt-1">
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span>{msg.statusText || (isArabic ? 'جارٍ التنفيذ...' : 'Processing...')}</span>
                      <span className="font-mono text-orange-400">{msg.progressPercent}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-[#081017] rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-[#e05a10] to-[#f38f49] rounded-full transition-all duration-500"
                        style={{ width: `${msg.progressPercent}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Bottom Message Action Bar */}
                {!isUser && (
                  <div className="flex items-center gap-3 pt-2 text-slate-400 text-[11px]">
                    <button className="hover:text-white flex items-center gap-1">
                      <Copy className="w-3 h-3" />
                      <span>{isArabic ? 'نسخ' : 'Copy'}</span>
                    </button>
                    <button className="hover:text-white flex items-center gap-1">
                      <RotateCcw className="w-3 h-3" />
                      <span>{isArabic ? 'إعادة' : 'Retry'}</span>
                    </button>
                    <button className="hover:text-white flex items-center gap-1">
                      <Share2 className="w-3 h-3" />
                      <span>{isArabic ? 'مشاركة' : 'Share'}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isStreaming && (
          <div className="flex items-center gap-2 text-orange-400 text-xs font-bold p-3 bg-[#141c26] border border-orange-500/30 rounded-2xl w-fit animate-orange-pulse">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>{isArabic ? 'So-key Ai يفكر الآن ويولد الإجابة...' : 'So-key Ai is thinking...'}</span>
          </div>
        )}
      </div>

      {/* Glowing Prompt Bar matching 03-chat-themes.png */}
      <div className="p-4 bg-[#0d1218] border-t border-[#1e2938]">
        <div className="max-w-4xl mx-auto flex items-center gap-2 bg-[#141c26] border border-[#233042] focus-within:border-orange-500 p-2 rounded-2xl transition shadow-card-dark">
          <button className="p-2 text-slate-400 hover:text-orange-400 transition" title={isArabic ? 'إرفاق ملف' : 'Attach File'}>
            <Paperclip className="w-4 h-4" />
          </button>

          <button className="p-2 text-slate-400 hover:text-orange-400 transition" title={isArabic ? 'إدراج كود' : 'Code Format'}>
            <Code className="w-4 h-4" />
          </button>

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={isArabic ? 'اكتب رسالتك هنا... (مثال: أضف ميزة جديدة أو فحص كود)' : 'Type your message here...'}
            className="flex-1 bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none px-2"
          />

          <button className="p-2 text-slate-400 hover:text-orange-400 transition" title={isArabic ? 'إدخال صوتي' : 'Voice Input'}>
            <Mic className="w-4 h-4" />
          </button>

          {/* Glowing Orange Send Button matching 03-chat-themes.png */}
          <button
            onClick={handleSend}
            disabled={!input.trim() || isStreaming}
            className="p-2.5 bg-gradient-to-r from-[#e05a10] to-[#f38f49] hover:from-[#ff6b00] hover:to-[#fdba74] text-white rounded-xl shadow-orange-glow-sm disabled:opacity-50 transition"
          >
            <Send className={`w-4 h-4 ${isArabic && 'rotate-180'}`} />
          </button>
        </div>
      </div>
    </div>
  );
};
