import React, { useState, useRef, useEffect } from 'react';
import { sendChatMessage } from '../services/api.js';
import { useLanguage } from '../context/LanguageContext.jsx';

export default function AskAgriGuardModal({ isOpen, onClose, farmContext }) {
  const { lang, t } = useLanguage();
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: lang === 'hi' 
        ? 'नमस्ते किसान! मैं आपका एग्रीगार्ड एआई सहायक हूँ। आपके खेत में नमी 18% है और आज शाम 6:00 से 8:00 के बीच 35mm सिंचाई की सलाह है। आप क्या पूछना चाहते हैं?' 
        : 'Hello Farmer! I am your AgriGuard AI Copilot. Soil moisture in Zone 1 is at 18%, and irrigation (35mm) is recommended for tonight between 6:00 PM – 8:00 PM. How can I assist you today?'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const quickPrompts = lang === 'hi' ? [
    'क्या मुझे आज शाम सिंचाई करनी चाहिए?',
    'सिंचाई की सलाह क्यों दी गई है?',
    'कम मिट्टी नमी का क्या प्रभाव पड़ेगा?',
    'क्या आगामी बारिश मेरी योजना बदलेगी?'
  ] : [
    'Should I irrigate today?',
    'Why is irrigation recommended?',
    'What does low soil moisture mean?',
    'Will rain affect my irrigation plan?'
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  if (!isOpen) return null;

  const handleSend = async (textToSend) => {
    const text = textToSend || inputText;
    if (!text.trim() || loading) return;

    const userMsg = { id: Date.now(), sender: 'user', text: text.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setLoading(true);

    try {
      const response = await sendChatMessage(text.trim(), farmContext);
      const aiMsg = {
        id: Date.now() + 1,
        sender: 'ai',
        text: response.reply || 'Analyzing field conditions... Recommendation remains to irrigate during evening hours.'
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'ai',
          text: 'AI telemetry sync was interrupted, but based on your 18% soil moisture reading, irrigating tonight (6:00–8:00 PM) is still strongly recommended.'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-primary/40 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-surface-container-lowest rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col h-[85vh] sm:h-[650px] border border-surface-container-high/60 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 bg-primary text-on-primary flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-primary shadow-sm">
              <span className="material-symbols-outlined text-[24px]">smart_toy</span>
            </div>
            <div>
              <div className="font-headline-sm text-[17px] font-bold flex items-center gap-1.5">
                <span>AgriGuard AI Copilot</span>
                <span className="w-2 h-2 rounded-full bg-primary-fixed animate-ping"></span>
              </div>
              <div className="font-body-sm text-[12px] opacity-90">
                Grounded in Green Valley Farm Telemetry
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-on-primary transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Quick context telemetry bar */}
        <div className="bg-surface-container-high/60 px-4 py-2 flex items-center justify-between text-on-surface-variant font-label-sm text-[11px] border-b border-surface-container-high">
          <span>Moisture: <strong className="text-error">18%</strong></span>
          <span>Rain: <strong>20%</strong></span>
          <span>Temp: <strong>31°C</strong></span>
          <span>Tank: <strong className="text-primary">72%</strong></span>
        </div>

        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 no-scrollbar bg-surface/50">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-3.5 shadow-sm text-body-md ${
                  m.sender === 'user'
                    ? 'bg-primary text-on-primary rounded-br-none'
                    : 'bg-surface-container-lowest border border-surface-container-high text-on-surface rounded-bl-none'
                }`}
              >
                {m.sender === 'ai' && (
                  <div className="flex items-center gap-1 text-secondary font-label-sm text-[11px] mb-1 font-bold">
                    <span className="material-symbols-outlined text-[14px]">psychology</span>
                    <span>AgriGuard Advisor</span>
                  </div>
                )}
                <p className="whitespace-pre-line text-sm leading-relaxed">{m.text}</p>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="rounded-2xl rounded-bl-none p-3.5 bg-surface-container-lowest border border-surface-container-high shadow-sm flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-secondary animate-spin">progress_activity</span>
                <span className="font-body-sm text-body-sm text-on-surface-variant">
                  Consulting agro-meteorological models...
                </span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Pills */}
        <div className="px-3 py-2 bg-surface-container-low border-t border-surface-container-high">
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSend(prompt)}
                className="whitespace-nowrap px-3 py-1 rounded-full bg-surface-container-lowest hover:bg-secondary-container text-on-surface hover:text-on-secondary-fixed font-label-sm text-xs border border-surface-container-high transition-colors shadow-sm"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-3 bg-surface-container-lowest border-t border-surface-container-high flex items-center gap-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={lang === 'hi' ? "खेत या सिंचाई से जुड़ा प्रश्न पूछें..." : "Ask about irrigation, soil, or weather..."}
            className="flex-1 h-11 px-4 rounded-xl bg-surface-container-low border border-surface-container-high focus:outline-none focus:ring-2 focus:ring-secondary text-sm text-on-surface"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || loading}
            className="h-11 px-4 rounded-xl bg-primary text-on-primary font-label-md text-sm font-semibold flex items-center justify-center gap-1.5 disabled:opacity-50 active:scale-95 transition-all shadow-md"
          >
            <span>Send</span>
            <span className="material-symbols-outlined text-[18px]">send</span>
          </button>
        </form>
      </div>
    </div>
  );
}
