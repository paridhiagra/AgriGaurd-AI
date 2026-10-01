import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import farmerAvatar from '../assets/images/farmer_profile_1790829686715.jpg';

export default function Settings() {
  const { lang, setLang, t } = useLanguage();
  const { theme, toggleTheme, isDark } = useTheme();
  const { user, logout } = useAuth();

  const [irrigationAlerts, setIrrigationAlerts] = useState(true);
  const [weatherAlerts, setWeatherAlerts] = useState(true);
  const [rainAlerts, setRainAlerts] = useState(true);
  const [aiConfidenceThreshold, setAiConfidenceThreshold] = useState(85);
  const [autoSchedule, setAutoSchedule] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto px-margin pb-6 space-y-space-md animate-in fade-in duration-200">
      <div className="mt-2">
        <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-primary tracking-tight font-extrabold">
          {t('navSettings')}
        </h1>
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          Customize agronomic parameters, alerts, languages, and theme preferences.
        </p>
      </div>

      {saved && (
        <div className="p-3 rounded-xl bg-secondary-container text-on-secondary-fixed font-label-md text-sm flex items-center gap-2 shadow-sm animate-in fade-in">
          <span className="material-symbols-outlined text-[20px]">check_circle</span>
          <span>Settings saved successfully!</span>
        </div>
      )}

      {/* Profile Section */}
      <div className="rounded-2xl bg-surface-container-lowest p-5 shadow-sm border border-surface-container-high/50 flex flex-col gap-4">
        <div className="flex items-center gap-2 text-primary font-title-sm text-base font-bold border-b border-surface-container-high pb-2">
          <span className="material-symbols-outlined text-[20px]">person</span>
          <span>Farmer Profile</span>
        </div>

        <div className="flex items-center gap-4">
          <img
            alt="User profile"
            className="w-16 h-16 rounded-full object-cover shadow-sm border-2 border-primary"
            src={farmerAvatar}
          />
          <div className="flex flex-col">
            <h3 className="font-headline-sm text-lg font-bold text-primary">{user?.name || 'Ramesh Patel'}</h3>
            <p className="font-body-sm text-xs text-on-surface-variant">{user?.email || 'ramesh@farm.com'}</p>
            <span className="inline-flex items-center gap-1 font-label-sm text-[11px] text-secondary mt-1 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
              Verified Farm Owner • Green Valley Sector 4
            </span>
          </div>
        </div>
      </div>

      {/* Language & Theme Section */}
      <div className="rounded-2xl bg-surface-container-lowest p-5 shadow-sm border border-surface-container-high/50 flex flex-col gap-4">
        <div className="flex items-center gap-2 text-primary font-title-sm text-base font-bold border-b border-surface-container-high pb-2">
          <span className="material-symbols-outlined text-[20px]">palette</span>
          <span>Appearance & Localization</span>
        </div>

        {/* Language Selection */}
        <div className="flex items-center justify-between py-1">
          <div>
            <span className="font-label-md text-sm font-semibold text-on-surface block">Application Language</span>
            <span className="font-body-sm text-xs text-on-surface-variant">Switch between English and Hindi</span>
          </div>
          <div className="inline-flex p-1 rounded-xl bg-surface-container-high">
            <button
              type="button"
              onClick={() => setLang('en')}
              className={`px-3 py-1 rounded-lg font-label-sm text-xs transition-all ${
                lang === 'en'
                  ? 'bg-surface text-primary shadow-xs font-bold'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              English
            </button>
            <button
              type="button"
              onClick={() => setLang('hi')}
              className={`px-3 py-1 rounded-lg font-label-sm text-xs transition-all ${
                lang === 'hi'
                  ? 'bg-surface text-primary shadow-xs font-bold'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              हिंदी
            </button>
          </div>
        </div>

        {/* Theme Selection */}
        <div className="flex items-center justify-between py-1 border-t border-surface-container-high/40">
          <div>
            <span className="font-label-md text-sm font-semibold text-on-surface block">Theme Mode</span>
            <span className="font-body-sm text-xs text-on-surface-variant">
              {isDark ? 'Dark Green / Charcoal' : 'Natural Light Surface'}
            </span>
          </div>
          <div className="inline-flex p-1 rounded-xl bg-surface-container-high">
            <button
              type="button"
              onClick={() => toggleTheme('light')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-label-sm text-xs transition-all ${
                !isDark
                  ? 'bg-surface text-primary shadow-xs font-bold'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">wb_sunny</span>
              <span>Light</span>
            </button>
            <button
              type="button"
              onClick={() => toggleTheme('dark')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-label-sm text-xs transition-all ${
                isDark
                  ? 'bg-surface text-primary shadow-xs font-bold'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">dark_mode</span>
              <span>Dark</span>
            </button>
          </div>
        </div>
      </div>

      {/* Notifications Section */}
      <div className="rounded-2xl bg-surface-container-lowest p-5 shadow-sm border border-surface-container-high/50 flex flex-col gap-4">
        <div className="flex items-center gap-2 text-primary font-title-sm text-base font-bold border-b border-surface-container-high pb-2">
          <span className="material-symbols-outlined text-[20px]">notifications_active</span>
          <span>Field Notifications & Alerts</span>
        </div>

        <div className="flex items-center justify-between py-1">
          <div>
            <span className="font-label-md text-sm font-semibold text-on-surface block">Irrigation Directives</span>
            <span className="font-body-sm text-xs text-on-surface-variant">Alert when soil moisture drops below critical 22%</span>
          </div>
          <input
            type="checkbox"
            checked={irrigationAlerts}
            onChange={(e) => setIrrigationAlerts(e.target.checked)}
            className="w-5 h-5 rounded accent-secondary cursor-pointer"
          />
        </div>

        <div className="flex items-center justify-between py-1 border-t border-surface-container-high/40">
          <div>
            <span className="font-label-md text-sm font-semibold text-on-surface block">Weather Alerts</span>
            <span className="font-body-sm text-xs text-on-surface-variant">Real-time alerts for high evaporation spikes (&gt; 32°C)</span>
          </div>
          <input
            type="checkbox"
            checked={weatherAlerts}
            onChange={(e) => setWeatherAlerts(e.target.checked)}
            className="w-5 h-5 rounded accent-secondary cursor-pointer"
          />
        </div>

        <div className="flex items-center justify-between py-1 border-t border-surface-container-high/40">
          <div>
            <span className="font-label-md text-sm font-semibold text-on-surface block">Rain & Precipitation Alerts</span>
            <span className="font-body-sm text-xs text-on-surface-variant">Advise deferrals when radar forecast exceeds 40%</span>
          </div>
          <input
            type="checkbox"
            checked={rainAlerts}
            onChange={(e) => setRainAlerts(e.target.checked)}
            className="w-5 h-5 rounded accent-secondary cursor-pointer"
          />
        </div>
      </div>

      {/* AI Preferences Section */}
      <div className="rounded-2xl bg-surface-container-lowest p-5 shadow-sm border border-surface-container-high/50 flex flex-col gap-4">
        <div className="flex items-center gap-2 text-primary font-title-sm text-base font-bold border-b border-surface-container-high pb-2">
          <span className="material-symbols-outlined text-[20px]">smart_toy</span>
          <span>AI Decision Engine Configuration</span>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-label-md text-sm font-semibold text-on-surface block">Minimum Confidence Threshold</span>
              <span className="font-body-sm text-xs text-on-surface-variant">Recommendations below this fallback to manual confirmation</span>
            </div>
            <span className="font-title-sm text-sm font-bold text-primary">{aiConfidenceThreshold}%</span>
          </div>
          <input
            type="range"
            min="60"
            max="95"
            value={aiConfidenceThreshold}
            onChange={(e) => setAiConfidenceThreshold(Number(e.target.value))}
            className="w-full h-1.5 bg-surface-container-high rounded-lg appearance-none cursor-pointer accent-secondary"
          />
        </div>

        <div className="flex items-center justify-between py-1 border-t border-surface-container-high/40">
          <div>
            <span className="font-label-md text-sm font-semibold text-on-surface block">Autonomous Schedule Sync</span>
            <span className="font-body-sm text-xs text-on-surface-variant">Auto-program solenoid valves for optimal window</span>
          </div>
          <input
            type="checkbox"
            checked={autoSchedule}
            onChange={(e) => setAutoSchedule(e.target.checked)}
            className="w-5 h-5 rounded accent-secondary cursor-pointer"
          />
        </div>

        <div className="pt-2 border-t border-surface-container-high flex justify-between items-center">
          <button
            type="button"
            onClick={logout}
            className="px-4 py-2 rounded-xl bg-error-container text-on-error-container font-label-md text-xs font-semibold hover:bg-error/20 transition-colors"
          >
            Log Out Account
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 rounded-xl bg-primary text-on-primary font-label-md text-xs font-semibold shadow-md active:scale-95 transition-all"
          >
            Save All Preferences
          </button>
        </div>
      </div>
    </div>
  );
}
