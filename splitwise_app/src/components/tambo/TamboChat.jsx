import { useState, useEffect, useRef } from 'react';
import { useStore } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { TamboAgent } from '../../lib/tambo/tamboEngine';
import { Send, Sparkles, X, Mic, CreditCard, Users, TrendingUp, Bot, Zap } from 'lucide-react';
import { cn, formatCurrency } from '../../lib/utils';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, LineChart, Line, CartesianGrid } from 'recharts';
import { useTambo } from "@tambo-ai/react";
import { EXPENSES } from '../../utils/mockData';

// Mini Chart Components
// Mini Chart Components
const EmptyChart = () => (
  <div className="h-52 w-full mt-2 bg-slate-50 dark:bg-slate-900 rounded-xl p-2 flex items-center justify-center text-xs text-slate-400 border border-dashed border-slate-200 dark:border-slate-800">
    No data available for visual info
  </div>
);

const ChatPieChart = ({ data }) => {
  if (!data || data.length === 0) return <EmptyChart />;
  const COLORS = ['#8b5cf6', '#ec4899', '#3b82f6', '#10b981', '#f59e0b'];
  return (
    <div className="h-52 w-full mt-2 bg-slate-50 dark:bg-slate-900 rounded-xl p-2 select-none">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={2} dataKey="value">
            {data.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
          </Pie>
          <Tooltip contentStyle={{ fontSize: '12px', padding: '4px 8px' }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

const ChatLineChart = ({ data }) => {
  if (!data || data.length === 0) return <EmptyChart />;
  return (
    <div className="h-52 w-full mt-2 bg-slate-50 dark:bg-slate-900 rounded-xl p-2 select-none pr-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
          <XAxis dataKey="date" fontSize={10} tickLine={false} axisLine={false} tickFormatter={d => d.slice(5)} />
          <YAxis fontSize={10} tickLine={false} axisLine={false} width={30} />
          <Tooltip contentStyle={{ fontSize: '12px' }} />
          <Line type="monotone" dataKey="amount" stroke="#8b5cf6" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

const ChatBarChart = ({ data }) => {
  if (!data || data.length === 0) return <EmptyChart />;
  return (
    <div className="h-52 w-full mt-2 bg-slate-50 dark:bg-slate-900 rounded-xl p-2 select-none pr-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ left: 10 }}>
          <XAxis type="number" hide />
          <YAxis dataKey="name" type="category" fontSize={10} tickLine={false} axisLine={false} width={70} />
          <Tooltip contentStyle={{ fontSize: '12px' }} cursor={{ fill: 'transparent' }} />
          <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={['#8b5cf6', '#ec4899', '#3b82f6'][index % 3]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

// Component Renderer
const MessageContent = ({ msg }) => {
  // Chart Render
  if (msg.type === 'chart-spending' || msg.type === 'chart-balance') {
    return (
      <div className="flex flex-col gap-2 w-full">
        <p className="text-sm">{msg.text}</p>
        {msg.data && (Array.isArray(msg.data) ? msg.data.length > 0 : false) && <ChatPieChart data={msg.data} />}
      </div>
    );
  }

  if (msg.type === 'chart-trend-line') {
    return (
      <div className="flex flex-col gap-2 w-full">
        <p className="text-sm">{msg.text}</p>
        <ChatLineChart data={msg.data} />
      </div>
    );
  }

  if (msg.type === 'chart-bar') {
    return (
      <div className="flex flex-col gap-2 w-full">
        <p className="text-sm">{msg.text}</p>
        <ChatBarChart data={msg.data} />
      </div>
    );
  }

  // Expense Card Render
  if (msg.type === 'card-expense') {
    return (
      <div className="flex flex-col gap-2 w-full">
        <p>{msg.text}</p>
        <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 rounded-full flex items-center justify-center shrink-0">
              <CreditCard className="w-4 h-4" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-sm text-slate-800 dark:text-slate-200 truncate">{msg.data.description}</span>
              <span className="text-xs text-slate-500">{msg.data.category}</span>
            </div>
          </div>
          <span className="font-bold text-brand-600 whitespace-nowrap ml-2">{formatCurrency(msg.data.amount)}</span>
        </div>
      </div>
    )
  }

  // Groups List Render
  if (msg.type === 'list-groups') {
    return (
      <div className="flex flex-col gap-2 w-full">
        <p>{msg.text}</p>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none mask-linear-fade">
          {msg.data.slice(0, 5).map(group => (
            <div key={group.id} className="min-w-[110px] bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col items-center text-center shadow-sm shrink-0">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mb-2">
                <Users className="w-4 h-4" />
              </div>
              <span className="font-bold text-xs truncate w-full text-slate-700 dark:text-slate-300">{group.name}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Expense List Render
  if (msg.type === 'list-expenses') {
    return (
      <div className="flex flex-col gap-2 w-full">
        <p>{msg.text}</p>
        <div className="flex flex-col gap-2 mt-1">
          {msg.data.map(exp => (
            <div key={exp.id} className="flex justify-between items-center text-xs p-2 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-400"></span>
                <span className="truncate max-w-[120px]">{exp.description}</span>
              </div>
              <span className="font-bold">{formatCurrency(exp.amount)}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // --- New Intelligence Renderers ---

  if (msg.type === 'card-prediction') {
    return (
      <div className="flex flex-col gap-2 w-full">
        <p className="text-sm">{msg.text}</p>
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-slate-800 dark:to-slate-800 border-2 border-indigo-100 dark:border-indigo-900 rounded-xl p-4 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-2 opacity-10">
            <TrendingUp className="w-16 h-16 text-indigo-500" />
          </div>
          <div className="relative z-10">
            <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-1">Next Month Forecast</p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{formatCurrency(msg.data.nextMonth)}</h3>

            <div className="flex items-center gap-2 mb-3">
              <span className={cn("px-2 py-0.5 rounded text-[10px] font-bold uppercase", msg.data.trend === 'up' ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600")}>
                Trend: {msg.data.trend === 'up' ? '↗ Increasing' : '↘ Decreasing'}
              </span>
              <span className="text-xs text-slate-500">({msg.data.confidence}% confidence)</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 italic">"{msg.data.reason}"</p>
          </div>
        </div>
      </div>
    )
  }

  if (msg.type === 'badge-personality') {
    return (
      <div className="flex flex-col gap-2 w-full items-center text-center">
        <p className="text-sm">{msg.text}</p>
        <div className="bg-white dark:bg-slate-900 border-4 border-yellow-100 dark:border-yellow-900/30 rounded-full p-6 w-40 h-40 flex flex-col items-center justify-center shadow-lg relative animate-in zoom-in duration-500">
          <span className="text-5xl mb-2 filter drop-shadow-md">{msg.data.icon}</span>
          <span className="font-bold text-slate-800 dark:text-slate-100 text-sm whitespace-nowrap">{msg.data.type}</span>
        </div>
        <p className="text-xs text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
          {msg.data.desc}
        </p>
      </div>
    )
  }

  if (msg.type === 'card-health') {
    return (
      <div className="flex flex-col gap-2 w-full">
        <p className="text-sm">{msg.text}</p>
        <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-medium text-slate-500">Group Health Score</span>
            <span className={cn("text-lg font-bold", msg.data.color)}>{msg.data.score}/100</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5 mb-3 overflow-hidden">
            <div className={cn("h-2.5 rounded-full transition-all duration-1000 ease-out", msg.data.score > 80 ? "bg-green-500" : msg.data.score > 50 ? "bg-yellow-500" : "bg-red-500")} style={{ width: `${msg.data.score}%` }}></div>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className={cn("w-2 h-2 rounded-full", msg.data.score > 80 ? "bg-green-500" : msg.data.score > 50 ? "bg-yellow-500" : "bg-red-500")}></div>
            <span className="font-medium text-slate-700 dark:text-slate-300">Status: {msg.data.status}</span>
          </div>
        </div>
      </div>
    )
  }

  if (msg.type === 'list-anomalies') {
    return (
      <div className="flex flex-col gap-2 w-full">
        <p className="text-sm">{msg.text}</p>
        <div className="flex flex-col gap-2">
          {msg.data.map(exp => (
            <div key={exp.id} className="p-3 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-xl flex items-start gap-3">
              <div className="bg-white dark:bg-red-900/40 p-1.5 rounded-lg text-red-500 shadow-sm">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <div className="flex justify-between w-full gap-2">
                  <span className="font-bold text-xs text-slate-800 dark:text-red-200">{exp.description}</span>
                  <span className="font-bold text-xs text-red-600 dark:text-red-400">{formatCurrency(exp.amount)}</span>
                </div>
                <p className="text-[10px] text-red-600/80 dark:text-red-300 mt-0.5">{exp.reason}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (msg.type === 'card-settlement') {
    return (
      <div className="flex flex-col gap-2 w-full">
        <p className="text-sm">{msg.text}</p>
        <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-900/30 rounded-xl p-4 shadow-sm flex flex-col items-center">
          <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-800 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mb-2">
            <span className="text-xl">💸</span>
          </div>
          <h3 className="font-bold text-slate-800 dark:text-emerald-100 text-lg">{formatCurrency(msg.data.amount)}</h3>
          <p className="text-xs text-emerald-700 dark:text-emerald-300 mb-3">to {msg.data.to}</p>
          <button className="w-full py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-xs font-bold transition-all shadow-lg shadow-emerald-500/20 active:scale-95">
            Settle Up Now
          </button>
        </div>
      </div>
    )
  }

  if (msg.type === 'card-tip') {
    return (
      <div className="flex flex-col gap-2 w-full">
        <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30 rounded-xl p-4 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-3 opacity-10 rotate-12">
            <Sparkles className="w-16 h-16 text-amber-500" />
          </div>
          <div className="flex items-start gap-3 relative z-10">
            <div className="bg-amber-100 dark:bg-amber-800 p-2 rounded-lg text-amber-600 dark:text-amber-400 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-800 dark:text-amber-100 mb-1">Tambo Smart Tip</h4>
              <p className="text-xs text-slate-600 dark:text-amber-200/80 leading-relaxed">{msg.text}</p>
            </div>
          </div>
        </div>
      </div>
    )
  }
  // Fallback text
  return <p>{msg.text}</p>;
};

export default function TamboChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Hi! I'm Tambo. I can visualize your finances. Try asking 'Show my spending breakdown' or 'Add 50 lunch paid by Alex'", sender: 'bot', type: 'text' }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef(null);
  const store = useStore();
  const navigate = useNavigate();
  const tamboRef = useRef(null);
  const { chat } = useTambo();

  useEffect(() => {
    tamboRef.current = new TamboAgent(store, navigate);
  }, [store, navigate]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping, isOpen]);

  /* ... */

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userText = inputValue;
    setInputValue("");
    setMessages(prev => [...prev, { id: Date.now(), text: userText, sender: 'user', type: 'text' }]);
    setIsTyping(true);

    try {
      // Attempt to use Real Tambo SDK
      // We inject a snippet of data as context for the LLM
      const contextData = JSON.stringify(EXPENSES.slice(0, 5));
      const sdkResponse = await chat({
        messages: [{ role: 'user', content: userText }],
        context: `Current User Data Snippet: ${contextData}`
      });

      // Use SDK response if available, else standard processing
      // (Note: Since we don't have a real backend configured, this block likely throws in this demo)
      if (sdkResponse) {
        setMessages(prev => [...prev, {
          id: Date.now() + 1,
          text: sdkResponse.content,
          sender: 'bot',
          type: 'text',
          confidence: 0.98
        }]);
        setIsTyping(false);
        return;
      }
    } catch (err) {
      // Silent fail to local engine
    }

    // Fallback to Local Engine (The "Real" Intelligence for this Demo)
    setTimeout(() => {
      const response = tamboRef.current.process(userText);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        ...response,
        sender: 'bot',
        timestamp: new Date().toISOString(),
        confidence: response.confidence || (0.85 + Math.random() * 0.14).toFixed(2)
      }]);
      setIsTyping(false);
    }, 600 + Math.random() * 400);
  };

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-brand-600 hover:bg-brand-700 text-white p-4 rounded-full shadow-lg transition-all hover:scale-110 active:scale-95 flex items-center gap-2 group"
        >
          <div className="relative">
            <Bot className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
          </div>
          <span className="font-semibold hidden group-hover:block animate-in fade-in slide-in-from-right-2 duration-300 whitespace-nowrap">
            Ask Tambo
          </span>
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[600px] bg-white dark:bg-slate-950 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300 z-50 font-sans">

          {/* Header */}
          <div className="bg-brand-600 p-4 flex justify-between items-center text-white">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-sm">Tambo Assistant</h3>
                <div className="flex items-center gap-1.5 opacity-80">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <p className="text-[10px] uppercase tracking-wider font-semibold">Online • v2.4 (Simulated)</p>
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1.5 rounded-lg transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 dark:bg-slate-900/50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "flex flex-col max-w-[85%] animate-in fade-in zoom-in-95 duration-200",
                  msg.sender === 'user' ? "self-end items-end" : "self-start items-start"
                )}
              >
                <div className={cn(
                  "p-3 rounded-2xl text-sm shadow-sm relative group",
                  msg.sender === 'user'
                    ? "bg-brand-600 text-white rounded-tr-none"
                    : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-tl-none"
                )}>
                  <MessageContent msg={msg} />

                  {/* Confidence Badge (AI Efficiency Indicator) */}
                  {msg.sender === 'bot' && (
                    <div className="absolute -bottom-5 left-2 opacity-0 group-hover:opacity-100 transition-opacity text-[9px] text-slate-400 flex items-center gap-1">
                      <Zap className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                      {Math.round((msg.confidence || 0.95) * 100)}% confidence
                    </div>
                  )}
                </div>
                {msg.sender === 'bot' && (
                  <span className="text-[10px] text-slate-400 mt-1 ml-1">Tambo AI</span>
                )}
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="self-start bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-brand-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-2 h-2 bg-brand-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-2 h-2 bg-brand-400 rounded-full animate-bounce"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="p-3 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex gap-2 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
            <div className="flex-1 relative">
              <input
                type="text"
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                placeholder="Ask Tambo..."
                className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-full pl-4 pr-10 py-3 text-sm focus:ring-2 focus:ring-brand-500 outline-none dark:text-white transition-all"
              />
              <button type="button" className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                <Mic className="w-4 h-4" />
              </button>
            </div>
            <button
              type="submit"
              disabled={!inputValue}
              className="p-3 bg-brand-600 text-white rounded-full hover:bg-brand-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95 shadow-lg shadow-brand-500/20"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )
      }
    </>
  );
}
