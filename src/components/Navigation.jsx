import React from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';

export default function Navigation({ activeTab, onTabChange }) {
  const { t } = useLanguage();

  const tabs = [
    { id: 'dashboard', label: t('navDashboard'), icon: 'dashboard' },
    { id: 'farm', label: t('navFarm'), icon: 'potted_plant' },
    { id: 'ai-decisions', label: t('navAiDecisions'), icon: 'psychology' },
    { id: 'weather', label: t('navWeather'), icon: 'partly_cloudy_day' },
    { id: 'history', label: t('navHistory'), icon: 'history_edu' },
    { id: 'settings', label: t('navSettings'), icon: 'settings' },
  ];

  return (
    <nav
      className="fixed bottom-0 w-full z-40 pb-safe bg-surface/90 backdrop-blur-xl shadow-[0_-2px_12px_rgba(19,78,53,0.05)] border-t border-surface-container-high/40 transition-colors"
      data-active-classes="text-primary font-bold"
    >
      <div className="flex justify-around items-center h-16 px-space-xs max-w-lg mx-auto">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              aria-current={isActive ? 'page' : undefined}
              className={`flex flex-col items-center justify-center gap-0.5 flex-1 h-full transition-all active:scale-95 ${
                isActive
                  ? 'text-primary font-bold scale-105'
                  : 'text-on-surface-variant hover:text-primary opacity-80 hover:opacity-100'
              }`}
            >
              <span
                className="material-symbols-outlined text-[22px]"
                style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
              >
                {tab.icon}
              </span>
              <span className="font-label-sm text-[11px] tracking-tight">{tab.label}</span>
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-secondary -mt-0.5"></span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
