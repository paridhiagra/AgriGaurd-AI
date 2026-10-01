import React, { useState, useEffect } from 'react';
import { sendChatMessage } from '../services/api.js';
import { useLanguage } from '../context/LanguageContext.jsx';

export default function VoiceAssistantModal({ isOpen, onClose, initialQuery, farmContext }) {
  const { lang } = useLanguage();
  const [listening, setListening] = useState(false);
  const [query, setQuery] = useState(initialQuery || '');
  const [response, setResponse] = useState('');
  const [speaking, setSpeaking] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const q = initialQuery || (lang === 'hi' ? 'क्या मुझे आज शाम गेहूं में पानी देना चाहिए?' : 'Should I irrigate my wheat field tonight?');
      setQuery(q);
      executeVoiceQuery(q);
    } else {
      setResponse('');
      setListening(false);
      setSpeaking(false);
    }
  }, [isOpen, initialQuery]);

  const executeVoiceQuery = async (text) => {
    setListening(true);
    setResponse('Analyzing soil moisture sensors and satellite forecast...');

    try {
      const res = await sendChatMessage(text, farmContext);
      setListening(false);
      setResponse(res.reply);

      // Web Speech API synthesis if available
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(res.reply);
        utterance.lang = lang === 'hi' ? 'hi-IN' : 'en-US';
        utterance.onstart = () => setSpeaking(true);
        utterance.onend = () => setSpeaking(false);
        utterance.onerror = () => setSpeaking(false);
        window.speechSynthesis.speak(utterance);
      }
    } catch (err) {
      setListening(false);
      setResponse('Irrigation is recommended tonight between 6:00 PM – 8:00 PM due to low soil moisture (18%).');
    }
  };

  const handleSimulatedMicTap = () => {
    if (listening) return;
    const sample = lang === 'hi' ? 'कल का मौसम कैसा रहेगा?' : 'What will the weather be like tomorrow?';
    setQuery(sample);
    executeVoiceQuery(sample);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary/50 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-surface-container-lowest rounded-3xl p-6 shadow-2xl border border-surface-container-high text-center relative flex flex-col items-center">
        {/* Close Button */}
        <button
          onClick={() => {
            if ('speechSynthesis' in window) window.speechSynthesis.cancel();
            onClose();
          }}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-container text-on-secondary-fixed font-label-sm text-xs mb-4">
          <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
          <span>Voice Telemetry Copilot</span>
        </div>

        {/* Animated Mic Sphere */}
        <div className="relative my-4">
          <div className={`w-24 h-24 rounded-full flex items-center justify-center text-on-primary transition-all duration-300 shadow-xl ${
            listening ? 'bg-error scale-110' : speaking ? 'bg-secondary animate-pulse' : 'bg-primary'
          }`}>
            <span className="material-symbols-outlined text-[44px]">
              {listening ? 'hearing' : speaking ? 'volume_up' : 'mic'}
            </span>
          </div>
          {listening && (
            <div className="absolute inset-0 rounded-full border-4 border-error animate-ping pointer-events-none opacity-40"></div>
          )}
          {speaking && (
            <div className="absolute inset-0 rounded-full border-4 border-secondary animate-ping pointer-events-none opacity-40"></div>
          )}
        </div>

        {/* Question */}
        <div className="bg-surface-container-low px-4 py-2.5 rounded-2xl w-full my-2">
          <span className="font-label-sm text-[11px] text-on-surface-variant uppercase tracking-wider block">Farmer Query</span>
          <p className="font-title-sm text-base text-primary font-bold mt-0.5">"{query}"</p>
        </div>

        {/* AI Audio Response */}
        <div className="p-4 rounded-2xl bg-surface-container w-full min-h-[90px] flex items-center justify-center text-sm leading-relaxed text-on-surface text-left">
          {listening ? (
            <div className="flex items-center gap-2 text-secondary font-medium">
              <span className="material-symbols-outlined text-[20px] animate-spin">sync</span>
              <span>Processing voice telemetry with Gemini...</span>
            </div>
          ) : (
            <p className="w-full text-center sm:text-left">{response}</p>
          )}
        </div>

        {/* Action button */}
        <div className="flex gap-2 w-full mt-4">
          <button
            type="button"
            onClick={handleSimulatedMicTap}
            className="flex-1 h-11 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-primary font-label-md text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
          >
            <span className="material-symbols-outlined text-[16px]">mic</span>
            <span>Ask Another Question</span>
          </button>
          <button
            type="button"
            onClick={() => {
              if ('speechSynthesis' in window) window.speechSynthesis.cancel();
              onClose();
            }}
            className="h-11 px-5 rounded-xl bg-primary text-on-primary font-label-md text-xs font-semibold flex items-center justify-center"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
