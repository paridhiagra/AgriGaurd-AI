import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Signup({ onSwitchToLogin }) {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [farmName, setFarmName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleLoginNavigation = () => {
    if (onSwitchToLogin) {
      onSwitchToLogin();
    } else {
      navigate('/login');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!name.trim()) {
      setError('Please provide your full name.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const res = await register({
        name: name.trim(),
        email: email.trim(),
        password,
        confirmPassword,
        farmName: farmName.trim() || 'Green Valley Farm'
      });
      setSuccessMessage(res.message || 'Your account has been created successfully.');
      setTimeout(() => {
        navigate('/dashboard');
      }, 500);
    } catch (err) {
      if (err.message && err.message.includes('Failed to fetch')) {
        setError('Unable to connect to the server. Please try again.');
      } else {
        setError(err.message || 'An account with this email already exists.');
      }
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
        <div className="hidden lg:flex lg:col-span-5 flex-col justify-between p-8 rounded-3xl bg-surface-container-low dark:bg-surface-container-lowest border border-surface-container-high/60 shadow-[0_8px_30px_rgba(19,78,53,0.06)] relative overflow-hidden h-[580px]">
          {/* Subtle Ambient Agricultural Patterns */}
          <div className="absolute inset-0 pointer-events-none opacity-40 dark:opacity-20">
            <svg viewBox="0 0 400 500" className="w-full h-full stroke-primary/30" fill="none">
              <path d="M -50,80 C 120,110 240,50 450,90" strokeWidth="1.5" strokeDasharray="3 3" />
              <path d="M -50,160 C 100,190 220,130 450,170" strokeWidth="1.5" />
              <path d="M -50,240 C 80,270 210,210 450,250" strokeWidth="1.5" strokeDasharray="4 4" />
              <path d="M -50,320 C 110,350 250,290 450,330" strokeWidth="1.5" />
              <path d="M -50,400 C 90,430 230,370 450,410" strokeWidth="1.5" strokeDasharray="2 2" />
            </svg>
          </div>

          {/* Floating Subtle Agricultural Particles */}
          <div className="absolute top-16 right-12 w-3 h-3 rounded-full bg-secondary-fixed anim-particle-1"></div>
          <div className="absolute top-48 left-10 w-2.5 h-2.5 rounded-full bg-primary-fixed anim-particle-2"></div>
          <div className="absolute bottom-28 right-16 w-3 h-3 rounded-full bg-secondary anim-particle-3"></div>

          {/* Top Brand Block */}
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-highest/80 text-on-surface font-label-sm text-xs font-semibold mb-4">
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
              <span>Intelligent Field Onboarding</span>
            </div>
            <h2 className="font-headline-sm text-2xl font-extrabold text-primary leading-tight">
              Connect Your Soil, Save Every Drop.
            </h2>
            <p className="font-body-sm text-xs text-on-surface-variant mt-2 leading-relaxed">
              Create an account to track your crops, simulate environmental changes, and receive automated irrigation schedules.
            </p>
          </div>

          {/* Key Advantages */}
          <div className="relative z-10 space-y-2.5 pt-2">
            <div className="flex items-center gap-2.5 text-xs text-on-surface">
              <span className="w-5 h-5 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-fixed font-bold text-[11px]">✓</span>
              <span>Prevent root waterlogging with radar forecast analysis</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-on-surface">
              <span className="w-5 h-5 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-fixed font-bold text-[11px]">✓</span>
              <span>LoRaWAN & IoT root-zone moisture sensor tracking</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-on-surface">
              <span className="w-5 h-5 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-fixed font-bold text-[11px]">✓</span>
              <span>Bilingual AI copilot in English and हिन्दी</span>
            </div>
          </div>

          {/* Bottom Trust Tag */}
          <div className="relative z-10 flex items-center justify-between text-[11px] text-on-surface-variant pt-2 border-t border-surface-container-high/40">
            <span>Punjab & Haryana AgTech Network</span>
            <span className="font-semibold text-secondary">Zero Waste Goal</span>
          </div>
        </div>

        {/* Dedicated Signup Card */}
        <div className="lg:col-span-7 w-full max-w-md mx-auto bg-surface-container-lowest dark:bg-surface-container-lowest rounded-3xl p-6 sm:p-8 shadow-[0_16px_40px_-8px_rgba(19,78,53,0.1)] border border-surface-container-high/60 relative z-10 anim-auth-card">
          
          {/* Logo & Heading */}
          <div className="flex flex-col items-center text-center mb-5">
            <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center text-secondary shadow-lg mb-2 relative overflow-hidden anim-auth-logo">
              <svg viewBox="0 0 100 100" className="w-9 h-9 text-secondary-fixed" fill="currentColor">
                <path d="M50 12 C40 28, 24 50, 24 66 C24 80, 35 90, 50 90 C65 90, 76 80, 76 66 C76 50, 60 28, 50 12 Z" opacity="0.3" fill="#aeeecb" />
                <path d="M50 20 C42 34, 30 52, 30 65 C30 76, 39 84, 50 84 C61 84, 70 76, 70 65 C70 52, 58 34, 50 20 Z" fill="#2c694e" />
                <line x1="50" y1="36" x2="50" y2="74" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" />
                <circle cx="50" cy="74" r="4.5" fill="#aeeecb" />
                <line x1="50" y1="46" x2="62" y2="38" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
                <circle cx="62" cy="38" r="3.5" fill="#aeeecb" />
              </svg>
            </div>

            <div className="anim-auth-text">
              <span className="font-headline-sm text-2xl font-extrabold text-primary tracking-tight">AgriGuard AI</span>
              <p className="font-body-sm text-xs text-on-surface-variant font-medium mt-0.5">
                "From Farm Data to the Right Action."
              </p>
              <h1 className="font-headline-md text-xl font-bold text-on-surface mt-2">
                Create Account
              </h1>
              <p className="font-body-sm text-xs text-on-surface-variant mt-0.5">
                Sign in to continue managing your farm with intelligent irrigation insights.
              </p>
            </div>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="mb-4 p-3 rounded-xl bg-secondary-container text-on-secondary-fixed text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-200">
              <span className="material-symbols-outlined text-[18px]">check_circle</span>
              <span>{successMessage}</span>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-error-container text-on-error-container text-xs font-medium flex items-center gap-2 animate-in fade-in duration-200">
              <span className="material-symbols-outlined text-[18px]">error</span>
              <span>{error}</span>
            </div>
          )}

          {/* Form Fields */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            
            {/* Full Name */}
            <div className="flex flex-col gap-1 anim-auth-field-1">
              <label className="font-label-sm text-xs text-on-surface-variant font-semibold">
                Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ramesh Patel"
                  className="w-full h-10 pl-9 pr-3 rounded-xl bg-surface-container-low dark:bg-surface-container border border-surface-container-high text-sm text-on-surface ag-input-interactive"
                />
                <span className="material-symbols-outlined absolute left-2.5 top-2.5 text-[18px] text-on-surface-variant pointer-events-none">
                  person
                </span>
              </div>
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1 anim-auth-field-2">
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
                  className="w-full h-10 pl-9 pr-3 rounded-xl bg-surface-container-low dark:bg-surface-container border border-surface-container-high text-sm text-on-surface ag-input-interactive"
                />
                <span className="material-symbols-outlined absolute left-2.5 top-2.5 text-[18px] text-on-surface-variant pointer-events-none">
                  mail
                </span>
              </div>
            </div>

            {/* Farm Name (Optional) */}
            <div className="flex flex-col gap-1 anim-auth-field-3">
              <label className="font-label-sm text-xs text-on-surface-variant font-semibold">
                Farm Name (Optional)
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={farmName}
                  onChange={(e) => setFarmName(e.target.value)}
                  placeholder="Green Valley Farm"
                  className="w-full h-10 pl-9 pr-3 rounded-xl bg-surface-container-low dark:bg-surface-container border border-surface-container-high text-sm text-on-surface ag-input-interactive"
                />
                <span className="material-symbols-outlined absolute left-2.5 top-2.5 text-[18px] text-on-surface-variant pointer-events-none">
                  potted_plant
                </span>
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1 anim-auth-field-4">
              <label className="font-label-sm text-xs text-on-surface-variant font-semibold">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full h-10 pl-9 pr-9 rounded-xl bg-surface-container-low dark:bg-surface-container border border-surface-container-high text-sm text-on-surface ag-input-interactive"
                />
                <span className="material-symbols-outlined absolute left-2.5 top-2.5 text-[18px] text-on-surface-variant pointer-events-none">
                  lock
                </span>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-2.5 top-2.5 text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col gap-1 anim-auth-field-5">
              <label className="font-label-sm text-xs text-on-surface-variant font-semibold">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  className="w-full h-10 pl-9 pr-3 rounded-xl bg-surface-container-low dark:bg-surface-container border border-surface-container-high text-sm text-on-surface ag-input-interactive"
                />
                <span className="material-symbols-outlined absolute left-2.5 top-2.5 text-[18px] text-on-surface-variant pointer-events-none">
                  lock_reset
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-xl bg-primary text-on-primary font-label-lg text-sm font-bold flex items-center justify-center gap-2 shadow-md hover:bg-primary-container ag-btn-interactive mt-2 cursor-pointer disabled:opacity-70 anim-auth-btn"
            >
              {loading ? (
                <>
                  <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <span className="material-symbols-outlined text-[18px]">check</span>
                </>
              )}
            </button>
          </form>

          {/* Link back to Login */}
          <div className="mt-4 text-center text-xs text-on-surface-variant anim-auth-btn">
            <span>Already have an account? </span>
            <button
              type="button"
              onClick={handleLoginNavigation}
              className="text-secondary font-bold hover:underline cursor-pointer"
            >
              Sign In
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
