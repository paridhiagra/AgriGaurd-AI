import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import farmerAvatar from '../assets/images/farmer_profile_1790829686715.jpg';

export default function Header({ onOpenVoice, onNavigate }) {
  const { lang, setLang, t } = useLanguage();
  const { theme, toggleTheme, isDark } = useTheme();
  const { user, logout } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: '🔴 Low Soil Moisture',
      desc: 'Soil moisture has dropped to 18%.',
      time: '10m ago',
      type: 'warning',
      unread: true
    },
    {
      id: 2,
      title: '🌧️ Rain Alert',
      desc: 'Rain probability has increased to 78%.',
      time: '45m ago',
      type: 'rain',
      unread: true
    },
    {
      id: 3,
      title: '⏰ Irrigation Scheduled',
      desc: 'Irrigation is scheduled for 6:00 PM.',
      time: '2h ago',
      type: 'schedule',
      unread: true
    },
    {
      id: 4,
      title: '💧 Water Tank',
      desc: 'Water tank level is currently 22%.',
      time: '4h ago',
      type: 'water',
      unread: false
    }
  ]);

  const hasUnread = notifications.some(n => n.unread);

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  return (
    <>
      <header className="fixed top-0 w-full z-50 bg-surface/90 backdrop-blur-xl pt-safe shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-surface-container-high/40 transition-colors">
        <div className="h-20 px-margin flex items-center justify-between gap-space-xs max-w-7xl mx-auto">
          {/* User profile & Farm context */}
          <div className="flex items-center gap-space-sm min-w-0 flex-1">
            <div className="relative flex-shrink-0 cursor-pointer" onClick={() => setShowUserMenu(!showUserMenu)}>
              <img
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover shadow-[0_2px_10px_rgba(10,45,29,0.15)] border-2 border-surface-container-high hover:border-primary transition-all ring-1 ring-black/5"
                src={farmerAvatar}
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-secondary border-2 border-surface"></span>
            </div>

            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-space-xs">
                <span className="font-label-lg text-label-lg text-primary tracking-tight truncate font-bold">
                  {t('appName')}
                </span>
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-surface-container-high text-on-secondary-fixed-variant">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>
                  <span className="font-label-sm text-label-sm truncate max-w-[130px] sm:max-w-none">
                    {user?.farmName || 'Green Valley'} • Wheat
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right utility buttons */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Language toggle */}
            <div className="inline-flex items-center p-0.5 rounded-full bg-surface-container-high shadow-inner">
              <button
                className={`px-2 py-0.5 rounded-full font-label-sm text-label-sm transition-all ${
                  lang === 'en'
                    ? 'bg-surface text-primary shadow-[0_1px_2px_rgba(0,0,0,0.06)] font-bold'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
                type="button"
                onClick={() => setLang('en')}
              >
                EN
              </button>
              <button
                className={`px-2 py-0.5 rounded-full font-label-sm text-label-sm transition-all ${
                  lang === 'hi'
                    ? 'bg-surface text-primary shadow-[0_1px_2px_rgba(0,0,0,0.06)] font-bold'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
                type="button"
                onClick={() => setLang('hi')}
              >
                हिंदी
              </button>
            </div>

            {/* Dark Mode toggle */}
            <button
              aria-label="Toggle Theme"
              className="w-10 h-10 rounded-full flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors"
              type="button"
              onClick={() => toggleTheme()}
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              <span className="material-symbols-outlined text-[20px]">
                {isDark ? 'light_mode' : 'dark_mode'}
              </span>
            </button>

            {/* Voice Assistant Trigger */}
            <button
              aria-label="Voice Assistant"
              className="w-10 h-10 rounded-full flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors"
              type="button"
              onClick={onOpenVoice}
              title="Voice Assistant"
            >
              <span className="material-symbols-outlined text-[22px]">mic</span>
            </button>

            {/* Notifications Trigger */}
            <div className="relative">
              <button
                aria-label="Notifications"
                className="relative w-10 h-10 rounded-full flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors cursor-pointer"
                type="button"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <span className="material-symbols-outlined text-[22px]">notifications</span>
                {hasUnread && (
                  <>
                    <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-error animate-ping"></span>
                    <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-error"></span>
                  </>
                )}
              </button>

              {/* Notification Popup Dropdown (Section 18) */}
              {showNotifications && (
                <div className="absolute right-0 top-12 w-84 rounded-2xl bg-surface-container-lowest p-3.5 shadow-2xl border border-surface-container-high/60 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex items-center justify-between pb-2 border-b border-surface-container-high">
                    <span className="font-label-md text-label-md text-primary font-bold">Notifications</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        className="font-label-sm text-[11px] text-secondary hover:underline cursor-pointer font-semibold"
                        onClick={handleMarkAllRead}
                      >
                        Mark all as read
                      </button>
                      <button
                        type="button"
                        className="text-on-surface-variant hover:text-primary cursor-pointer text-xs"
                        onClick={() => setShowNotifications(false)}
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 mt-2 max-h-72 overflow-y-auto no-scrollbar">
                    {notifications.map(n => (
                      <div
                        key={n.id}
                        className={`p-2.5 rounded-xl transition-colors flex gap-2.5 ${
                          n.unread ? 'bg-secondary-container/30 border border-secondary/20' : 'bg-surface-container-low hover:bg-surface-container'
                        }`}
                      >
                        <div className="flex flex-col min-w-0 flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-label-md text-label-md text-primary font-semibold">{n.title}</span>
                            <span className="font-label-sm text-[10px] text-on-surface-variant/70">{n.time}</span>
                          </div>
                          <span className="font-body-sm text-[12px] text-on-surface-variant leading-snug mt-0.5">{n.desc}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Dedicated Settings Button (Visible directly in navbar) */}
            <button
              aria-label="System Settings"
              className="w-10 h-10 rounded-full flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors cursor-pointer"
              type="button"
              onClick={() => onNavigate?.('settings')}
              title="Settings"
            >
              <span className="material-symbols-outlined text-[22px]">settings</span>
            </button>

            {/* Profile Menu Dropdown */}
            {showUserMenu && (
              <div className="absolute right-4 top-20 w-56 rounded-2xl bg-surface-container-lowest p-2 shadow-2xl border border-surface-container-high/60 z-50 animate-in fade-in duration-150">
                <div className="px-3 py-2 border-b border-surface-container-high">
                  <div className="font-label-md text-label-md text-primary font-bold">{user?.name || 'Farmer Ramesh'}</div>
                  <div className="font-body-sm text-[12px] text-on-surface-variant truncate">{user?.email || 'ramesh@farm.com'}</div>
                </div>
                <div className="flex flex-col gap-1 mt-1">
                  <button
                    onClick={() => { setShowUserMenu(false); onNavigate?.('farm'); }}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-surface-container font-label-md text-label-md text-on-surface transition-colors text-left"
                  >
                    <span className="material-symbols-outlined text-[18px]">agriculture</span>
                    <span>Farm Profile</span>
                  </button>
                  <button
                    onClick={() => { setShowUserMenu(false); onNavigate?.('settings'); }}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-surface-container font-label-md text-label-md text-on-surface transition-colors text-left"
                  >
                    <span className="material-symbols-outlined text-[18px]">settings</span>
                    <span>System Settings</span>
                  </button>
                  <button
                    onClick={() => { setShowUserMenu(false); logout(); }}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-error-container text-error font-label-md text-label-md transition-colors text-left"
                  >
                    <span className="material-symbols-outlined text-[18px]">logout</span>
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
}
