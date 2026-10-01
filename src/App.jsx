import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import Header from './components/Header.jsx';
import Navigation from './components/Navigation.jsx';
import AskAgriGuardModal from './components/AskAgriGuardModal.jsx';
import VoiceAssistantModal from './components/VoiceAssistantModal.jsx';
import Dashboard from './pages/Dashboard.jsx';
import AIDecisions from './pages/AIDecisions.jsx';
import Weather from './pages/Weather.jsx';
import History from './pages/History.jsx';
import MyFarm from './pages/MyFarm.jsx';
import Settings from './pages/Settings.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import { useAuth } from './context/AuthContext.jsx';
import { fetchFarmDetails, fetchWeather, requestAIRecommendation } from './services/api.js';

export default function App() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Farm and environmental telemetry states
  const [farmData, setFarmData] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [recommendation, setRecommendation] = useState(null);
  const [dataLoading, setDataLoading] = useState(false);

  // Modals
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);
  const [voiceQuery, setVoiceQuery] = useState('');

  // Map route path to active navigation tab
  const getActiveTab = () => {
    const path = location.pathname;
    if (path.startsWith('/my-farm')) return 'farm';
    if (path.startsWith('/ai-recommendations')) return 'ai-decisions';
    if (path.startsWith('/weather')) return 'weather';
    if (path.startsWith('/history')) return 'history';
    if (path.startsWith('/settings')) return 'settings';
    return 'dashboard';
  };

  const handleTabChange = (tab) => {
    switch (tab) {
      case 'dashboard':
        navigate('/dashboard');
        break;
      case 'farm':
        navigate('/my-farm');
        break;
      case 'ai-decisions':
        navigate('/ai-recommendations');
        break;
      case 'weather':
        navigate('/weather');
        break;
      case 'history':
        navigate('/history');
        break;
      case 'settings':
        navigate('/settings');
        break;
      default:
        navigate('/dashboard');
    }
  };

  // Initial data loading on authentication
  useEffect(() => {
    async function initData() {
      setDataLoading(true);
      try {
        const [farm, weather] = await Promise.all([
          fetchFarmDetails(),
          fetchWeather()
        ]);
        setFarmData(farm);
        setWeatherData(weather);

        // Fetch initial AI recommendation from backend
        const rec = await requestAIRecommendation({
          soilMoisture: 18,
          temperature: weather?.temperature || 31,
          humidity: weather?.humidity || 48,
          rainProbability: weather?.rainProbability || 20,
          waterLevel: farm?.tankLevel || 72,
          crop: farm?.crop || 'Wheat (PBW 550)',
          growthStage: farm?.growthStage || 'Vegetative (Day 34)'
        });
        setRecommendation(rec);
      } catch (err) {
        console.warn('Initial data load error:', err);
      } finally {
        setDataLoading(false);
      }
    }

    if (isAuthenticated) {
      initData();
    }
  }, [isAuthenticated]);

  if (authLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-surface text-primary">
        <div className="flex flex-col items-center gap-3">
          <span className="material-symbols-outlined text-[40px] animate-spin text-secondary">
            progress_activity
          </span>
          <span className="font-label-md text-sm font-semibold tracking-wide">
            Initializing AgriGuard AI...
          </span>
        </div>
      </div>
    );
  }

  const handleOpenVoice = (initialText) => {
    setVoiceQuery(typeof initialText === 'string' ? initialText : '');
    setIsVoiceOpen(true);
  };

  const farmContextForChat = {
    farmName: farmData?.farmName,
    crop: farmData?.crop,
    growthStage: farmData?.growthStage,
    soilMoisture: 18,
    temperature: weatherData?.temperature || 31,
    humidity: weatherData?.humidity || 48,
    rainProbability: weatherData?.rainProbability || 20,
    tankLevel: farmData?.tankLevel || 72,
    currentDecision: recommendation?.decision || 'IRRIGATION_RECOMMENDED'
  };

  return (
    <Routes>
      {/* Public Authentication Routes */}
      <Route
        path="/login"
        element={
          isAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Login onSwitchToSignup={() => navigate('/signup')} />
          )
        }
      />
      <Route
        path="/signup"
        element={
          isAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Signup onSwitchToLogin={() => navigate('/login')} />
          )
        }
      />

      {/* Protected Routes Container */}
      <Route
        path="/*"
        element={
          !isAuthenticated ? (
            <Navigate to="/login" replace />
          ) : (
            <div className="bg-surface font-body-md text-body-md text-on-surface antialiased flex flex-col min-h-screen selection:bg-secondary-container selection:text-on-secondary-fixed">
              {/* Top Header */}
              <Header
                onOpenVoice={() => handleOpenVoice()}
                onNavigate={(tab) => handleTabChange(tab)}
              />

              {/* Main App Content Viewport */}
              <main className="flex flex-col relative w-full pt-20 pb-36 bg-surface min-h-screen">
                <Routes>
                  <Route
                    path="/dashboard"
                    element={
                      <Dashboard
                        farmData={farmData}
                        weatherData={weatherData}
                        recommendation={recommendation}
                        onOpenCopilot={() => setIsCopilotOpen(true)}
                        onOpenVoice={handleOpenVoice}
                        onNavigate={(tab) => handleTabChange(tab)}
                        loading={dataLoading}
                      />
                    }
                  />

                  <Route
                    path="/my-farm"
                    element={
                      <MyFarm
                        onFarmUpdated={(updated) => setFarmData(updated)}
                      />
                    }
                  />

                  <Route
                    path="/ai-recommendations"
                    element={
                      <AIDecisions
                        farmData={farmData}
                        onOpenCopilot={() => setIsCopilotOpen(true)}
                      />
                    }
                  />

                  <Route
                    path="/weather"
                    element={<Weather weatherData={weatherData} />}
                  />

                  <Route path="/history" element={<History />} />

                  <Route path="/settings" element={<Settings />} />

                  {/* Fallback to /dashboard */}
                  <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
              </main>

              {/* Floating Action Button: "Ask AgriGuard AI" */}
              <div className="fixed bottom-20 inset-x-0 z-40 flex justify-center pointer-events-none px-margin mb-2">
                <button
                  type="button"
                  onClick={() => setIsCopilotOpen(true)}
                  className="pointer-events-auto inline-flex items-center gap-2 h-11 px-4 rounded-full bg-primary-container text-on-primary shadow-[0_8px_20px_-4px_rgba(19,78,53,0.35)] active:scale-95 transition-all hover:bg-primary cursor-pointer border border-white/10 ag-btn-interactive"
                >
                  <span className="material-symbols-outlined text-[18px] text-on-primary-container">smart_toy</span>
                  <span className="font-label-md text-label-md tracking-wide font-bold">Ask AgriGuard AI</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-on-primary-container animate-ping"></span>
                </button>
              </div>

              {/* Bottom Navigation */}
              <Navigation
                activeTab={getActiveTab()}
                onTabChange={handleTabChange}
              />

              {/* Copilot Drawer / Modal */}
              <AskAgriGuardModal
                isOpen={isCopilotOpen}
                onClose={() => setIsCopilotOpen(false)}
                farmContext={farmContextForChat}
              />

              {/* Voice Assistant Modal */}
              <VoiceAssistantModal
                isOpen={isVoiceOpen}
                onClose={() => setIsVoiceOpen(false)}
                initialQuery={voiceQuery}
                farmContext={farmContextForChat}
              />
            </div>
          )
        }
      />
    </Routes>
  );
}
