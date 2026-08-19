import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Zap,
  TrendingUp,
  ShieldCheck,
  RotateCcw,
  CheckCircle2,
  ChevronDown,
  Bot
} from 'lucide-react';

export default function ChatbotWidget({
  persona,
  onNavigateTab,
  onFilterRisk,
  onFilterRegion,
  onBulkApproveHealthy,
  onExportCSV
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'msg_welcome',
      sender: 'ai',
      text: "### 👋 Hello! I'm your PromoAlign AI Assistant.\nI monitor stock levels, margin floors, and regional demand signals to help you optimize campaign ROI.\n\n**How can I assist your team today?**",
      actions: [
        { label: '🔴 Find Stockout Risks', command: 'FILTER_RISK', value: 'STOCKOUT_RISK' },
        { label: '📈 Summarize Campaign ROI', command: 'NAV_TAB', value: 'SUMMARY' },
        { label: '🟢 One-Click Approve Healthy Promos', command: 'APPROVE_HEALTHY' }
      ]
    }
  ]);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend) => {
    const text = textToSend || inputMessage;
    if (!text.trim()) return;

    const userMsg = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text: text.trim()
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputMessage('');
    setIsTyping(true);

    try {
      const res = await fetch('http://localhost:5001/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text.trim(), persona })
      });

      const data = await res.json();
      setIsTyping(false);

      if (data && data.response) {
        const aiMsg = {
          id: data.id || `ai_${Date.now()}`,
          sender: 'ai',
          text: data.response.text,
          actions: data.response.actions || []
        };
        setMessages((prev) => [...prev, aiMsg]);
      }
    } catch (err) {
      console.error('Chatbot API error:', err);
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          sender: 'ai',
          text: '⚠️ Sorry, I ran into an issue connecting to the AI backend. Please verify server status.'
        }
      ]);
    }
  };

  const handleActionClick = (action) => {
    if (!action) return;

    switch (action.command) {
      case 'NAV_TAB':
        if (onNavigateTab) onNavigateTab(action.value);
        break;
      case 'FILTER_RISK':
        if (onNavigateTab) onNavigateTab('FEED');
        if (onFilterRisk) onFilterRisk(action.value);
        break;
      case 'FILTER_REGION':
        if (onNavigateTab) onNavigateTab('FEED');
        if (onFilterRegion) onFilterRegion(action.value);
        break;
      case 'APPROVE_HEALTHY':
        if (onBulkApproveHealthy) onBulkApproveHealthy();
        break;
      case 'EXPORT_CSV':
        if (onExportCSV) onExportCSV();
        break;
      default:
        break;
    }
  };

  const quickPromptChips = [
    '🔴 Stockout risks',
    '📈 Summarize ROI',
    '⚡ Top fit score',
    '🟢 Approve healthy'
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="relative group flex items-center gap-2.5 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-2xl shadow-xl shadow-indigo-600/30 transition-all active:scale-95 animate-glow"
        >
          <div className="w-7 h-7 rounded-xl bg-white/20 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-sans tracking-tight">AI Copilot</span>
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 border border-white animate-pulse"></span>
        </button>
      )}

      {/* Slide-out Chat Window */}
      {isOpen && (
        <div className="w-[380px] sm:w-[420px] h-[580px] bg-white rounded-3xl border border-slate-200 shadow-2xl flex flex-col overflow-hidden transition-all animate-in fade-in zoom-in duration-200">
          
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-bold tracking-tight">PromoAlign AI Copilot</h3>
                <span className="flex items-center gap-1.5 text-[10px] text-indigo-100 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  Active & Context-Aware
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setMessages([messages[0]])}
                title="Clear Chat History"
                className="w-7 h-7 rounded-lg hover:bg-white/20 flex items-center justify-center text-indigo-100 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="w-7 h-7 rounded-lg hover:bg-white/20 flex items-center justify-center text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Conversation Message Stream */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50/60">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-indigo-600 text-white font-medium shadow-sm rounded-tr-none'
                      : 'bg-white border border-slate-200 text-slate-800 shadow-sm rounded-tl-none space-y-2'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{msg.text}</div>

                  {/* Interactive Action Buttons attached to AI message */}
                  {msg.actions && msg.actions.length > 0 && (
                    <div className="pt-2 border-t border-slate-100 flex flex-col gap-1.5">
                      {msg.actions.map((act, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleActionClick(act)}
                          className="w-full text-left px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition-all active:scale-95 flex items-center justify-between"
                        >
                          <span>{act.label}</span>
                          <Sparkles className="w-3 h-3 text-indigo-600" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-start">
                <div className="bg-white border border-slate-200 p-3 rounded-2xl text-xs text-slate-500 shadow-sm flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce"></div>
                  <div className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce [animation-delay:0.4s]"></div>
                  <span className="text-[11px] font-medium ml-1">Analyzing campaign data...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompt Chips */}
          <div className="px-3 py-2 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto">
            {quickPromptChips.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(chip)}
                className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-200 whitespace-nowrap transition-all"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Input Footer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask AI Copilot (e.g. 'Show stockout risks')..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="flex-1 bg-slate-100 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-indigo-500"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim()}
              className="w-9 h-9 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white rounded-xl flex items-center justify-center transition-all shadow-sm active:scale-95"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}

    </div>
  );
}
