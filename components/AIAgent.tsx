
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { useApp } from '../store/AppContext';
import { MessageSquare, Send, X, Bot, User, Loader2, Minus, Maximize2, Cpu, Globe, ExternalLink } from 'lucide-react';

interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  sources?: { uri: string; title: string }[];
}

export const AIAgent: React.FC = () => {
  const { currentUser, marketData } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (currentUser && messages.length === 0) {
      setMessages([{ role: 'model', text: `Neural link established for ${currentUser.name}. I am the protocol specialist with real-time market grounding. How can I assist your yield strategy?` }]);
    }
  }, [currentUser, messages.length]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;
    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      // Correct implementation: Using process.env.API_KEY directly for initialization.
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prices = marketData.map(c => `${c.symbol}: $${c.price}`).join(', ');
      
      const systemInstruction = `You are the CryptoYield Premium AI Specialist. 
      Current Protocol Prices: ${prices}. 
      User Liquidity: $${currentUser?.balance}.
      Instructions: Be institutional, concise, and use cybernetic metaphors. 
      Use Google Search tools for any real-world crypto trends or news. 
      Always provide strategic yield advice based on the platform's simulated data.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userMessage,
        config: {
          systemInstruction,
          tools: [{ googleSearch: {} }],
          temperature: 0.2,
        },
      });

      const responseText = response.text || "Uplink disrupted.";
      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
      const sources = chunks?.map((c: any) => c.web).filter(Boolean) || [];

      setMessages(prev => [...prev, { role: 'model', text: responseText, sources }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: 'NODE_ERROR: Neural bridge timeout. Check your connectivity.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!currentUser) return null;

  return (
    <div className="fixed bottom-24 right-6 md:right-8 z-[60] flex flex-col items-end gap-4 pointer-events-none">
      {isOpen && (
        <div className={`pointer-events-auto bg-white/95 dark:bg-brand-darkSecondary/95 backdrop-blur-3xl border border-slate-200 dark:border-white/10 rounded-[32px] shadow-2xl flex flex-col transition-all duration-500 overflow-hidden ${isMinimized ? 'h-16 w-72' : 'h-[500px] w-[320px] md:w-[400px]'}`}>
          <div className="p-4 bg-blue-600/5 border-b border-slate-200 dark:border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg"><Cpu className="w-4 h-4 text-white" /></div>
              <div>
                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white">AI Core Node</h4>
                <div className="flex items-center gap-1"><span className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" /><span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Grounding Active</span></div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => setIsMinimized(!isMinimized)} className="p-1.5 text-slate-400 hover:text-blue-500 transition-colors">{isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minus className="w-4 h-4" />}</button>
              <button onClick={() => setIsOpen(false)} className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors"><X className="w-4 h-4" /></button>
            </div>
          </div>

          {!isMinimized && (
            <>
              <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-4 no-scrollbar">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex flex-col gap-1 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-slate-200 dark:bg-white/5' : 'bg-blue-600 text-white'}`}>
                        {msg.role === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                      </div>
                      <div className={`p-3 rounded-2xl text-xs max-w-[85%] ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-white/5 text-slate-800 dark:text-gray-200 shadow-sm'}`}>
                        {msg.text}
                      </div>
                    </div>
                    {msg.sources && msg.sources.length > 0 && (
                      <div className="mt-2 ml-10 flex flex-wrap gap-2">
                        {msg.sources.map((src, j) => (
                          <a key={j} href={src.uri} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-2 py-1 bg-blue-500/10 border border-blue-500/20 rounded-lg text-[9px] font-black text-blue-600 hover:bg-blue-600 hover:text-white transition-all">
                            <ExternalLink className="w-2.5 h-2.5" /> {src.title || 'Source'}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                {isLoading && (
                  <div className="flex gap-3 animate-pulse">
                    <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0"><Bot className="w-3.5 h-3.5" /></div>
                    <div className="p-3 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center gap-2">
                       <Globe className="w-3 h-3 animate-spin text-blue-500" />
                       <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Querying Global Ledger...</span>
                    </div>
                  </div>
                )}
              </div>
              <div className="p-4 border-t border-slate-200 dark:border-white/5">
                <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="relative">
                  <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Consult AI Protocol..." className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-4 py-3 text-xs font-bold text-slate-900 dark:text-white outline-none focus:border-blue-600" />
                  <button disabled={!input.trim() || isLoading} className="absolute right-1.5 top-1/2 -translate-y-1/2 p-2 bg-blue-600 text-white rounded-xl active:scale-95 disabled:opacity-50 transition-all"><Send className="w-3.5 h-3.5" /></button>
                </form>
              </div>
            </>
          )}
        </div>
      )}
      {!isOpen && (
        <button onClick={() => setIsOpen(true)} className="pointer-events-auto w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl shadow-2xl flex items-center justify-center transition-all hover:-translate-y-1 active:scale-90"><MessageSquare className="w-6 h-6" /></button>
      )}
    </div>
  );
};
