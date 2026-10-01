import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login({ onSwitchToSignup }) {
  const { login, loginAsDemo } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('ramesh@farm.com');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [infoMessage, setInfoMessage] = useState('');

  const handleSignupNavigation = () => {
    if (onSwitchToSignup) {
      onSwitchToSignup();
    } else {
      navigate('/signup');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setInfoMessage('');
    setSuccessMessage('');

    // Client-side email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!password) {
      setError('Incorrect email or password.');
      return;
    }

    setLoading(true);

    try {
      const res = await login(email.trim(), password);
      setSuccessMessage(res.message || 'Welcome back!');
      setTimeout(() => {
        navigate('/dashboard');
      }, 500);
    } catch (err) {
      if (err.message && err.message.includes('Failed to fetch')) {
        setError('Unable to connect to the server. Please try again.');
      } else {
        setError(err.message || 'Incorrect email or password.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDemoClick = async () => {
    setError('');
    setInfoMessage('');
    setLoading(true);
    try {
      await loginAsDemo();
      setSuccessMessage('Welcome back!');
      setTimeout(() => {
        navigate('/dashboard');
      }, 400);
    } catch (err) {
      setError('Unable to connect to the server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-surface text-on-surface relative overflow-hidden transition-colors duration-300">
      {/* Background Soft Glows */}
      <div className="absolute -left-28 -top-28 w-96 h-96 rounded-full bg-secondary-fixed/30 dark:bg-secondary-container/20 blur-3xl pointer-events-none"></div>
      <div className="absolute -right-28 -bottom-28 w-96 h-96 rounded-full bg-secondary-container/30 dark:bg-primary-container/20 blur-3xl pointer-events-none"></div>

      {/* Main Responsive Grid Container */}
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 gap-6 items-center relative z-10">
        
        {/* Subtle Agricultural Visual Feature (Desktop/Tablet Side Panel) */}
        <div className="hidden lg:flex lg:col-span-5 flex-col justify-between p-8 rounded-3xl bg-surface-container-low dark:bg-surface-container-lowest border border-surface-container-high/60 shadow-[0_8px_30px_rgba(19,78,53,0.06)] relative overflow-hidden h-[540px]">
          {/* Subtle Ambient Agricultural Patterns */}
          <div className="absolute inset-0 pointer-events-none opacity-40 dark:opacity-20">
            <svg viewBox="0 0 400 500" className="w-full h-full stroke-primary/30" fill="none">
              {/* Field Contour Curves */}
              <path d="M -50,100 C 100,120 200,60 450,110" strokeWidth="1.5" strokeDasharray="3 3" />
              <path d="M -50,180 C 80,210 220,150 450,200" strokeWidth="1.5" />
              <path d="M -50,260 C 120,290 250,230 450,280" strokeWidth="1.5" strokeDasharray="4 4" />
              <path d="M -50,340 C 90,370 230,310 450,360" strokeWidth="1.5" />
              <path d="M -50,420 C 130,450 260,390 450,440" strokeWidth="1.5" strokeDasharray="2 2" />
            </svg>
          </div>

          {/* Floating Subtle Agricultural Particles */}
          <div className="absolute top-16 right-12 w-3 h-3 rounded-full bg-secondary-fixed anim-particle-1"></div>
          <div className="absolute top-44 left-10 w-2.5 h-2.5 rounded-full bg-primary-fixed anim-particle-2"></div>
          <div className="absolute bottom-28 right-16 w-3 h-3 rounded-full bg-secondary anim-particle-3"></div>

          {/* Top Brand Block */}
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-highest/80 text-on-surface font-label-sm text-xs font-semibold mb-4">
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
              <span>Autonomous Agro-Telemetry</span>
            </div>
            <h2 className="font-headline-sm text-2xl font-extrabold text-primary dark:text-primary leading-tight">
              Precision Water Management for Modern Fields.
            </h2>
            <p className="font-body-sm text-xs text-on-surface-variant mt-2 leading-relaxed">
              Real-time soil moisture sensors combined with radar weather telemetry to schedule the optimal irrigation window.
            </p>
          </div>

          {/* Middle Micro-Bento Snapshot */}
          <div className="relative z-10 bg-surface-container-lowest/80 dark:bg-surface-container/60 backdrop-blur-md rounded-2xl p-4 border border-surface-container-high/60 space-y-2.5 shadow-sm">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-primary flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-secondary">psychology</span>
                Neural Decision Matrix
              </span>
              <span className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-fixed text-[10px] font-bold">
                Active
              </span>
            </div>
            <div className="flex items-center gap-3 pt-1">
              <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[20px]">water_drop</span>
              </div>
              <div>
                <span className="font-headline-sm text-base text-primary font-bold block leading-tight">
                  142,000 Liters
                </span>
                <span className="font-body-sm text-[11px] text-on-surface-variant">
                  Cumulative water conserved
                </span>
              </div>
            </div>
          </div>

          {/* Bottom Trust Tag */}
          <div className="relative z-10 flex items-center justify-between text-[11px] text-on-surface-variant pt-2 border-t border-surface-container-high/40">
            <span>Punjab Agricultural Zones</span>
            <span className="font-semibold text-secondary">94% Crop Health Index</span>
          </div>
        </div>

        {/* Dedicated Login Card (Section 1, 2 & 3) */}
        <div className="lg:col-span-7 w-full max-w-md mx-auto bg-surface-container-lowest dark:bg-surface-container-lowest rounded-3xl p-6 sm:p-8 shadow-[0_16px_40px_-8px_rgba(19,78,53,0.1)] border border-surface-container-high/60 relative z-10 anim-auth-card">
          
          {/* 1. AgriGuard Logo (fades in 300ms) */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center text-secondary shadow-lg mb-3 relative overflow-hidden anim-auth-logo">
              <svg viewBox="0 0 100 100" className="w-11 h-11 text-secondary-fixed" fill="currentColor">
                <path d="M50 12 C40 28, 24 50, 24 66 C24 80, 35 90, 50 90 C65 90, 76 80, 76 66 C76 50, 60 28, 50 12 Z" opacity="0.3" fill="#aeeecb" />
                <path d="M50 20 C42 34, 30 52, 30 65 C30 76, 39 84, 50 84 C61 84, 70 76, 70 65 C70 52, 58 34, 50 20 Z" fill="#2c694e" />
                <line x1="50" y1="36" x2="50" y2="74" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" />
                <circle cx="50" cy="74" r="4.5" fill="#aeeecb" />
                <line x1="50" y1="46" x2="62" y2="38" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
                <circle cx="62" cy="38" r="3.5" fill="#aeeecb" />
                <line x1="50" y1="56" x2="38" y2="48" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
                <circle cx="38" cy="48" r="3.5" fill="#aeeecb" />
                <line x1="50" y1="62" x2="60" y2="58" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
                <circle cx="60" cy="58" r="3.5" fill="#aeeecb" />
              </svg>
            </div>

            {/* 3. Heading & Supporting Text (fade in 450ms) */}
            <div className="anim-auth-text">
              <div className="flex items-center justify-center gap-1.5">
                <span className="font-headline-sm text-2xl font-extrabold text-primary tracking-tight">AgriGuard AI</span>
              </div>
              <p className="font-body-sm text-xs text-on-surface-variant font-medium mt-0.5">
                "From Farm Data to the Right Action."
              </p>
              <h1 className="font-headline-md text-xl font-bold text-on-surface mt-3">
                Welcome Back
              </h1>
              <p className="font-body-sm text-xs text-on-surface-variant mt-1 max-w-xs mx-auto">
                Sign in to continue managing your farm with intelligent irrigation insights.
              </p>
            </div>
          </div>

          {/* Animated Success Message */}
          {successMessage && (
            <div className="mb-4 p-3 rounded-xl bg-secondary-container dark:bg-secondary-container text-on-secondary-fixed text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-200">
              <span className="material-symbols-outlined text-[18px]">check_circle</span>
              <span>{successMessage}</span>
            </div>
          )}

          {/* Animated Info / Forgot Hint */}
          {infoMessage && (
            <div className="mb-4 p-3 rounded-xl bg-surface-container-high text-on-surface text-xs font-medium flex items-center gap-2 animate-in fade-in duration-200">
              <span className="material-symbols-outlined text-[18px] text-secondary">info</span>
              <span>{infoMessage}</span>
            </div>
          )}

          {/* Animated Error Message (Section 10) */}
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-error-container text-on-error-container text-xs font-medium flex items-center gap-2 animate-in fade-in duration-200">
              <span className="material-symbols-outlined text-[18px]">error</span>
              <span>{error}</span>
            </div>
          )}

          {/* 4. Form Fields (Staggered Animation 80-100ms) */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            
            {/* Field 1: Email */}
            <div className="flex flex-col gap-1 anim-auth-field-1">
              <label className="font-label-sm text-xs text-on-surface-variant font-semibold">
                Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ramesh@farm.com"
                  className="w-full h-11 pl-10 pr-3 rounded-xl bg-surface-container-low dark:bg-surface-container border border-surface-container-high text-sm text-on-surface ag-input-interactive"
                />
                <span className="material-symbols-outlined absolute left-3 top-2.5 text-[20px] text-on-surface-variant pointer-events-none">
                  mail
                </span>
              </div>
            </div>

            {/* Field 2: Password with Show/Hide button */}
            <div className="flex flex-col gap-1 anim-auth-field-2">
              <label className="font-label-sm text-xs text-on-surface-variant font-semibold">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-11 pl-10 pr-10 rounded-xl bg-surface-container-low dark:bg-surface-container border border-surface-container-high text-sm text-on-surface ag-input-interactive"
                />
                <span className="material-symbols-outlined absolute left-3 top-2.5 text-[20px] text-on-surface-variant pointer-events-none">
                  lock
                </span>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-2.5 text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {/* Field 3: Remember me & Forgot password link */}
            <div className="flex items-center justify-between text-xs anim-auth-field-3">
              <label className="flex items-center gap-2 cursor-pointer select-none text-on-surface-variant">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded accent-secondary cursor-pointer"
                />
                <span>Remember me</span>
              </label>
              <button
                type="button"
                onClick={() => setInfoMessage('Demo credentials: use ramesh@farm.com / password123, or click Quick Demo Login below.')}
                className="text-secondary hover:underline font-semibold cursor-pointer"
              >
                Forgot password?
              </button>
            </div>

            {/* 5. Login Button (smoothly appears last 500ms) */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl bg-primary text-on-primary font-label-lg text-sm font-bold flex items-center justify-center gap-2 shadow-md hover:bg-primary-container ag-btn-interactive mt-1 cursor-pointer disabled:opacity-70 anim-auth-btn"
            >
              {loading ? (
                <>
                  <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Login Option */}
          <div className="mt-3 anim-auth-btn">
            <button
              type="button"
              onClick={handleDemoClick}
              disabled={loading}
              className="w-full h-11 rounded-xl bg-secondary-container hover:bg-secondary-fixed text-on-secondary-fixed font-label-md text-xs font-bold flex items-center justify-center gap-2 ag-btn-interactive border border-secondary/20 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">bolt</span>
              <span>Quick Demo: Login as Farmer Ramesh</span>
            </button>
          </div>

          {/* Switch to Signup Link */}
          <div className="mt-6 text-center text-xs text-on-surface-variant anim-auth-btn">
            <span>Don't have an account? </span>
            <button
              type="button"
              onClick={handleSignupNavigation}
              className="text-secondary font-bold hover:underline cursor-pointer"
            >
              Create Account
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
