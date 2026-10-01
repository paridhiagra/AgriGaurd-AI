import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { saveHistoryRecord } from '../services/api.js';
import AnimatedCounter from '../components/AnimatedCounter.jsx';
import { DashboardSkeleton } from '../components/Skeletons.jsx';
import ScheduleModal from '../components/ScheduleModal.jsx';

export default function Dashboard({
  farmData,
  weatherData,
  recommendation,
  onOpenCopilot,
  onOpenVoice,
  onNavigate,
  loading = false
}) {
  const { t, lang } = useLanguage();
  const { user } = useAuth();
  const [scheduled, setScheduled] = useState(false);
  const [scheduledDetails, setScheduledDetails] = useState(null);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);

  // Stepped AI analysis reveal animation (Section 6)
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [analysisStep, setAnalysisStep] = useState(0);

  const analysisSteps = [
    'Analyzing farm conditions...',
    'Checking soil moisture...',
    'Checking weather...',
    'Generating recommendation...'
  ];

  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      current += 1;
      if (current < analysisSteps.length) {
        setAnalysisStep(current);
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setIsAnalyzing(false);
        }, 350);
      }
    }, 420);

    return () => clearInterval(interval);
  }, [recommendation?.decision]);

  if (loading || (!farmData && !recommendation)) {
    return <DashboardSkeleton />;
  }

  const handleScheduleClick = async () => {
    setScheduleLoading(true);
    try {
      await saveHistoryRecord({
        soilMoisture: recommendation?.keyFactors ? 18 : 18,
        temperature: weatherData?.temperature || 31,
        humidity: weatherData?.humidity || 48,
        rainProbability: weatherData?.rainProbability || 20,
        crop: farmData?.crop || 'Wheat (PBW 550)',
        growthStage: farmData?.growthStage || 'Vegetative (Day 34)',
        decision: recommendation?.decision || 'IRRIGATION_RECOMMENDED',
        reason: recommendation?.reason || 'Soil moisture below threshold with low rain chance.',
        recommendedAction: 'Irrigate 35mm tonight between 6:00 PM – 8:00 PM.',
        farmerAction: 'Programmed by Farmer for 6:00 PM',
        status: 'Scheduled'
      });
      setScheduled(true);
      setTimeout(() => setScheduled(false), 5000);
    } catch (err) {
      console.warn('Schedule record failed:', err);
    } finally {
      setScheduleLoading(false);
    }
  };

  const isRainWait = recommendation?.decision === 'WAIT_RAIN_EXPECTED';
  const isNoIrrigation = recommendation?.decision === 'NO_IRRIGATION_NEEDED';

  return (
    <div className="flex flex-col w-full px-margin pb-6 gap-y-5 max-w-4xl mx-auto animate-in fade-in duration-200">
      {/* Farmer Greeting & Farm Context Card */}
      <div className="flex flex-col gap-2 mt-1">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-primary tracking-tight font-extrabold">
              {t('goodMorning')}, {user?.name?.split(' ')[0] || 'Ramesh'}
            </h1>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              {t('dashboardSubtitle')}
            </p>
          </div>
          <div className="w-12 h-12 rounded-full bg-secondary-container/50 flex items-center justify-center text-primary shadow-sm flex-shrink-0">
            <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              eco
            </span>
          </div>
        </div>

        {/* Farm Meta Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-high text-on-secondary-fixed-variant flex-shrink-0 shadow-sm">
            <span className="material-symbols-outlined text-[15px] text-secondary">agriculture</span>
            <span className="font-label-sm text-label-sm">{farmData?.farmName || 'Green Valley Farm'}</span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-high text-on-secondary-fixed-variant flex-shrink-0 shadow-sm">
            <span className="material-symbols-outlined text-[15px] text-secondary">grain</span>
            <span className="font-label-sm text-label-sm">{farmData?.crop || 'Wheat (PBW 550)'}</span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-high text-on-secondary-fixed-variant flex-shrink-0 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
            <span className="font-label-sm text-label-sm">{farmData?.growthStage || 'Vegetative (Day 34)'}</span>
          </div>
        </div>
      </div>

      {/* MAIN AI RECOMMENDATION HERO CARD */}
      <section className="relative w-full rounded-2xl bg-surface-container-lowest p-space-md sm:p-space-lg shadow-[0_12px_32px_-4px_rgba(19,78,53,0.08)] border border-surface-container-high/50 overflow-hidden">
        {/* Subtle Ambient Backdrop Gradient Accent */}
        <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full bg-secondary-fixed/40 blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col gap-3.5">
          {/* Badge: AI Engine Live */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary-container text-on-secondary-fixed font-label-sm text-label-sm tracking-wide shadow-sm">
              <span className="material-symbols-outlined text-[16px] animate-spin" style={{ animationDuration: '6s' }}>
                smart_toy
              </span>
              <span>{t('aiEngineLive')}</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-surface-container text-secondary font-label-sm text-label-sm">
              <span className="w-2 h-2 rounded-full bg-secondary animate-ping"></span>
              <span>{recommendation?.confidence ? `Live Analysis • ${recommendation.confidence}% Conf.` : t('liveAnalysis')}</span>
            </div>
          </div>

          {/* Recommendation Content with Stepped Analysis (Section 6) */}
          {isAnalyzing ? (
            <div className="py-7 px-4 flex flex-col items-center justify-center text-center space-y-3 animate-in fade-in duration-200">
              <div className="w-12 h-12 rounded-2xl bg-secondary-container text-on-secondary-fixed flex items-center justify-center shadow-sm">
                <span className="material-symbols-outlined text-[26px] animate-spin">
                  progress_activity
                </span>
              </div>
              <div className="space-y-1">
                <span className="font-headline-sm text-base text-primary font-bold block animate-in fade-in duration-200">
                  {analysisSteps[analysisStep]}
                </span>
                <span className="font-body-sm text-xs text-on-surface-variant block">
                  Processing LoRaWAN node telemetry and Doppler radar
                </span>
              </div>
              <div className="w-48 bg-surface-container-high h-1.5 rounded-full overflow-hidden mt-2">
                <div
                  className="bg-secondary h-full transition-all duration-300"
                  style={{ width: `${((analysisStep + 1) / analysisSteps.length) * 100}%` }}
                ></div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-3.5 animate-in fade-in slide-in-from-bottom-2 duration-300">
              {/* Recommendation Title */}
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span
                    className={`material-symbols-outlined text-[26px] ${
                      isRainWait ? 'text-tertiary' : isNoIrrigation ? 'text-secondary' : 'text-primary'
                    }`}
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    {isRainWait ? 'cloudy_snowing' : isNoIrrigation ? 'check_circle' : 'water_drop'}
                  </span>
                  <h2 className="font-headline-sm text-headline-sm text-primary font-bold">
                    {isRainWait
                      ? t('waitRainExpected')
                      : isNoIrrigation
                      ? t('noIrrigationNeeded')
                      : t('irrigationRecommended')}
                  </h2>
                </div>
                <p className="font-label-md text-label-md text-secondary mt-0.5">
                  {isRainWait
                    ? 'बारिश का पूर्वानुमान • Defer Irrigation'
                    : isNoIrrigation
                    ? 'पर्याप्त नमी • Field Capacity Optimal'
                    : t('hindiActionSubtitle')}
                </p>
              </div>

              {/* Core Reason Box */}
              <p className="font-body-md text-body-md text-on-surface leading-relaxed">
                {recommendation?.reason || (
                  <>
                    Your soil moisture is low (<span className="font-label-lg text-error font-bold">18%</span>) and rainfall probability is currently low (<span className="font-label-lg text-primary">20%</span>). Delaying risks crop stress.
                  </>
                )}
              </p>

              {/* Suggested Action Pill */}
              <div className="p-3 rounded-xl bg-surface-container-low flex items-start gap-2.5 border border-surface-container-high/40">
                <span className="material-symbols-outlined text-[20px] text-primary flex-shrink-0 mt-0.5">
                  lightbulb
                </span>
                <div className="flex flex-col">
                  <span className="font-label-md text-label-md text-primary font-bold">
                    {t('suggestedAction')}
                  </span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                    {recommendation?.recommendedAction || (
                      <>
                        Irrigate <strong>35mm</strong> tonight between <strong>6:00 PM – 8:00 PM</strong> to minimize midday evaporative loss.
                      </>
                    )}
                  </span>
                </div>
              </div>

              {/* Expandable Breakdown: Why this recommendation? */}
              <div className="rounded-xl bg-surface-container overflow-hidden transition-all">
                <button
                  type="button"
                  onClick={() => setDetailsOpen(!detailsOpen)}
                  className="w-full flex items-center justify-between p-3 text-left font-label-md text-label-md text-primary select-none cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-primary">analytics</span>
                    <span>{t('whyThisRecommendation')}</span>
                  </div>
                  <span
                    className={`material-symbols-outlined text-[20px] text-primary transition-transform duration-200 ${
                      detailsOpen ? 'rotate-180' : ''
                    }`}
                  >
                    expand_more
                  </span>
                </button>

                {detailsOpen && (
                  <div className="px-3 pb-3 pt-1 flex flex-col gap-2 font-body-sm text-body-sm text-on-surface-variant animate-in fade-in duration-150">
                    <div className="flex items-center justify-between py-1 bg-surface-container-lowest/60 px-2.5 rounded-lg">
                      <span className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[16px] text-error">water_ph</span>
                        <span>Soil Moisture</span>
                      </span>
                      <span className="font-label-md text-label-md text-error font-bold">18% (Critical: &lt; 22%)</span>
                    </div>
                    <div className="flex items-center justify-between py-1 bg-surface-container-lowest/60 px-2.5 rounded-lg">
                      <span className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[16px] text-primary">rainy</span>
                        <span>Rain Probability</span>
                      </span>
                      <span className="font-label-md text-label-md text-on-surface">20% (Low next 48h)</span>
                    </div>
                    <div className="flex items-center justify-between py-1 bg-surface-container-lowest/60 px-2.5 rounded-lg">
                      <span className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[16px] text-on-surface-variant">thermostat</span>
                        <span>Temperature</span>
                      </span>
                      <span className="font-label-md text-label-md text-on-surface">31°C (Warm daytime)</span>
                    </div>
                    <div className="flex items-center justify-between py-1 bg-surface-container-lowest/60 px-2.5 rounded-lg">
                      <span className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[16px] text-on-surface-variant">humidity_percentage</span>
                        <span>Humidity</span>
                      </span>
                      <span className="font-label-md text-label-md text-on-surface">48% (Moderate ET₀ 4.8mm)</span>
                    </div>
                    <div className="flex items-center justify-between py-1 bg-surface-container-lowest/60 px-2.5 rounded-lg">
                      <span className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[16px] text-secondary">psychology_alt</span>
                        <span>Crop Stage Need</span>
                      </span>
                      <span className="font-label-md text-label-md text-secondary font-medium">High Transpiration (Vegetative)</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 mt-1">
            <button
              id="scheduleBtn"
              type="button"
              onClick={() => setIsScheduleModalOpen(true)}
              className={`flex-1 h-12 rounded-xl font-label-lg text-label-lg flex items-center justify-center gap-2 active:scale-98 shadow-md transition-all cursor-pointer ag-btn-interactive ${
                scheduled
                  ? 'bg-secondary text-on-secondary'
                  : 'bg-primary text-on-primary hover:bg-primary-container'
              }`}
            >
              <span className={`material-symbols-outlined text-[20px] ${scheduled ? 'animate-bounce' : ''}`}>
                {scheduled ? 'done_all' : 'calendar_today'}
              </span>
              <span>
                {scheduled ? 'Valve Programmed: 6:00 PM' : t('scheduleIrrigation')}
              </span>
            </button>

            <button
              type="button"
              onClick={onOpenCopilot}
              className="flex-1 h-12 rounded-xl bg-surface-container-high text-primary font-label-lg text-label-lg flex items-center justify-center gap-2 active:scale-98 hover:bg-surface-container-highest transition-all cursor-pointer ag-btn-interactive"
            >
              <span className="material-symbols-outlined text-[20px]">chat</span>
              <span>{t('askCopilot')}</span>
            </button>
          </div>

          {/* Section 7: Next Irrigation Display */}
          {(scheduledDetails || scheduled) && (
            <div className="p-3 rounded-xl bg-secondary-container text-on-secondary-fixed flex items-center justify-between text-xs font-semibold animate-in fade-in">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">alarm_on</span>
                <span>Next Irrigation: {scheduledDetails?.time || 'Today · 6:00 PM'} ({scheduledDetails?.duration || '20 minutes'})</span>
              </div>
              <span className="text-[10px] bg-secondary text-on-secondary px-2 py-0.5 rounded-full font-bold">✓ Scheduled</span>
            </div>
          )}
        </div>
      </section>

      {/* FARM METRICS TELEMETRY GRID */}
      <section className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between px-0.5">
          <h3 className="font-title-sm text-title-sm text-primary flex items-center gap-1.5 font-bold">
            <span className="material-symbols-outlined text-[18px]">sensors</span>
            <span>{t('realTimeSensorMatrix')}</span>
          </h3>
          <span className="font-label-sm text-label-sm text-on-surface-variant">Synced 4m ago</span>
        </div>

        {/* 4 Compact Metric Cards */}
        <div className="grid grid-cols-2 gap-2.5">
          {/* Soil Moisture */}
          <div className="rounded-xl bg-surface-container-lowest p-3 flex flex-col justify-between shadow-sm border border-surface-container-high/40 ag-card-interactive">
            <div className="flex items-center justify-between">
              <span className="text-error flex items-center gap-1 font-label-md text-label-md font-semibold">
                <span className="material-symbols-outlined text-[18px]">water_loss</span>
                {t('moisture')}
              </span>
              <span className="px-1.5 py-0.5 rounded bg-error-container text-on-error-container font-label-sm text-label-sm font-bold">
                {t('low')}
              </span>
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="font-headline-md text-headline-md text-primary font-bold">
                <AnimatedCounter value={18} suffix="%" />
              </span>
              <span className="font-label-sm text-label-sm text-error flex items-center">
                <span className="material-symbols-outlined text-[14px]">arrow_downward</span>3%
              </span>
            </div>
            <div className="w-full bg-surface-container-high h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-error h-full rounded-full transition-all duration-500" style={{ width: '18%' }}></div>
            </div>
          </div>

          {/* Temperature */}
          <div className="rounded-xl bg-surface-container-lowest p-3 flex flex-col justify-between shadow-sm border border-surface-container-high/40 ag-card-interactive">
            <div className="flex items-center justify-between">
              <span className="text-on-surface-variant flex items-center gap-1 font-label-md text-label-md font-semibold">
                <span className="material-symbols-outlined text-[18px]">thermostat</span>
                {t('temp')}
              </span>
              <span className="px-1.5 py-0.5 rounded bg-surface-container-high text-on-secondary-fixed-variant font-label-sm text-label-sm">
                {t('warm')}
              </span>
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="font-headline-md text-headline-md text-primary font-bold">
                <AnimatedCounter value={weatherData?.temperature || 31} suffix="°C" />
              </span>
              <span className="font-label-sm text-label-sm text-secondary flex items-center">
                <span className="material-symbols-outlined text-[14px]">arrow_upward</span>1°C
              </span>
            </div>
            <div className="w-full bg-surface-container-high h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-secondary h-full rounded-full transition-all duration-500" style={{ width: '65%' }}></div>
            </div>
          </div>

          {/* Humidity */}
          <div className="rounded-xl bg-surface-container-lowest p-3 flex flex-col justify-between shadow-sm border border-surface-container-high/40 ag-card-interactive">
            <div className="flex items-center justify-between">
              <span className="text-on-surface-variant flex items-center gap-1 font-label-md text-label-md font-semibold">
                <span className="material-symbols-outlined text-[18px]">humidity_percentage</span>
                {t('humidity')}
              </span>
              <span className="px-1.5 py-0.5 rounded bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm">
                {t('moderate')}
              </span>
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="font-headline-md text-headline-md text-primary font-bold">
                <AnimatedCounter value={weatherData?.humidity || 48} suffix="%" />
              </span>
              <span className="font-label-sm text-label-sm text-on-surface-variant">{t('steady')}</span>
            </div>
            <div className="w-full bg-surface-container-high h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-primary h-full rounded-full transition-all duration-500" style={{ width: '48%' }}></div>
            </div>
          </div>

          {/* Rain Chance */}
          <div className="rounded-xl bg-surface-container-lowest p-3 flex flex-col justify-between shadow-sm border border-surface-container-high/40 ag-card-interactive">
            <div className="flex items-center justify-between">
              <span className="text-on-surface-variant flex items-center gap-1 font-label-md text-label-md font-semibold">
                <span className="material-symbols-outlined text-[18px]">cloud</span>
                {t('rain')}
              </span>
              <span className="px-1.5 py-0.5 rounded bg-surface-container text-secondary font-label-sm text-label-sm font-semibold">
                {t('low')}
              </span>
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="font-headline-md text-headline-md text-primary font-bold">
                <AnimatedCounter value={weatherData?.rainProbability || 20} suffix="%" />
              </span>
              <span className="font-label-sm text-label-sm text-on-surface-variant">{t('clearSkies')}</span>
            </div>
            <div className="w-full bg-surface-container-high h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-secondary h-full rounded-full transition-all duration-500" style={{ width: '20%' }}></div>
            </div>
          </div>
        </div>

        {/* Water Storage Reservoir Card */}
        <div className="rounded-xl bg-surface-container-lowest p-3.5 shadow-sm flex flex-col gap-2 border border-surface-container-high/40 ag-card-interactive">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  water
                </span>
              </div>
              <div>
                <div className="font-label-md text-label-md text-primary font-bold">{t('farmWaterTankStorage')}</div>
                <div className="font-body-sm text-body-sm text-on-surface-variant">{t('canalLinkActive')}</div>
              </div>
            </div>
            <div className="text-right">
              <span className="font-headline-sm text-headline-sm text-primary font-bold">
                <AnimatedCounter value={farmData?.tankLevel || 72} suffix="%" />
              </span>
            </div>
          </div>
          <div className="w-full bg-surface-container-high h-2.5 rounded-full overflow-hidden">
            <div className="bg-primary h-full rounded-full transition-all duration-500" style={{ width: '72%' }}></div>
          </div>
          <div className="flex items-center justify-between font-label-sm text-label-sm text-on-surface-variant">
            <span>42,000L {t('available')}</span>
            <span className="text-secondary font-bold">{t('sufficientCycles')}</span>
          </div>
        </div>
      </section>

      {/* WEATHER SUMMARY & 24H TREND */}
      <section className="rounded-2xl bg-surface-container-lowest p-space-md shadow-sm flex flex-col gap-3 border border-surface-container-high/40">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-title-sm text-title-sm text-primary font-bold">{t('microWeatherTelemetry')}</h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant">Today: 31°C, Partly Cloudy • Wind 12 km/h NE</p>
          </div>
          <span className="material-symbols-outlined text-[24px] text-secondary">partly_cloudy_day</span>
        </div>

        {/* Hourly Horizontal Scroll Strip */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pt-1 pb-1">
          <div className="flex flex-col items-center justify-center min-w-[70px] p-2.5 rounded-xl bg-surface-container-low text-center flex-shrink-0 ag-card-interactive">
            <span className="font-label-sm text-label-sm text-on-surface-variant">12 PM</span>
            <span className="material-symbols-outlined text-[22px] text-primary my-1 anim-weather-sun">wb_sunny</span>
            <span className="font-label-md text-label-md text-primary font-semibold">31°C</span>
            <span className="font-label-sm text-label-sm text-secondary">10% rain</span>
          </div>
          <div className="flex flex-col items-center justify-center min-w-[70px] p-2.5 rounded-xl bg-surface-container-low text-center flex-shrink-0 ag-card-interactive">
            <span className="font-label-sm text-label-sm text-on-surface-variant">3 PM</span>
            <span className="material-symbols-outlined text-[22px] text-primary my-1 anim-weather-sun">sunny</span>
            <span className="font-label-md text-label-md text-primary font-semibold">32°C</span>
            <span className="font-label-sm text-label-sm text-secondary">15% rain</span>
          </div>
          <div className="flex flex-col items-center justify-center min-w-[70px] p-2.5 rounded-xl bg-secondary-container text-center flex-shrink-0 shadow-sm border border-secondary/30 ag-card-interactive">
            <span className="font-label-sm text-label-sm text-on-secondary-fixed font-bold">6 PM</span>
            <span className="material-symbols-outlined text-[22px] text-primary my-1 anim-weather-cloud" style={{ fontVariationSettings: "'FILL' 1" }}>
              wb_cloudy
            </span>
            <span className="font-label-md text-label-md text-primary font-bold">28°C</span>
            <span className="font-label-sm text-label-sm text-primary font-bold">20% rain</span>
          </div>
          <div className="flex flex-col items-center justify-center min-w-[70px] p-2.5 rounded-xl bg-surface-container-low text-center flex-shrink-0 ag-card-interactive">
            <span className="font-label-sm text-label-sm text-on-surface-variant">9 PM</span>
            <span className="material-symbols-outlined text-[22px] text-primary my-1">nights_stay</span>
            <span className="font-label-md text-label-md text-primary font-semibold">25°C</span>
            <span className="font-label-sm text-label-sm text-secondary">10% rain</span>
          </div>
          <div className="flex flex-col items-center justify-center min-w-[70px] p-2.5 rounded-xl bg-surface-container-low text-center flex-shrink-0 ag-card-interactive">
            <span className="font-label-sm text-label-sm text-on-surface-variant">12 AM</span>
            <span className="material-symbols-outlined text-[22px] text-primary my-1">bedtime</span>
            <span className="font-label-md text-label-md text-primary font-semibold">22°C</span>
            <span className="font-label-sm text-label-sm text-secondary">5% rain</span>
          </div>
        </div>
      </section>

      {/* FIELD PHOTO PREVIEW & IRRIGATION STATUS CARD */}
      <section className="grid grid-cols-1 gap-2.5">
        {/* Irrigation Status Card */}
        <div className="rounded-2xl bg-surface-container-lowest p-space-md shadow-sm flex flex-col gap-3 border border-surface-container-high/40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[22px] text-primary">valve</span>
              <h3 className="font-title-sm text-title-sm text-primary font-bold">{t('irrigationStatus')}</h3>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface font-label-sm text-label-sm font-semibold">
              Zone 1 • North Sector
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2 py-1">
            <div className="flex flex-col p-2.5 rounded-xl bg-surface-container-low">
              <span className="font-label-sm text-label-sm text-on-surface-variant">{t('todaysCycle')}</span>
              <span className="font-label-md text-label-md text-error mt-1 font-bold">{t('pending')}</span>
            </div>
            <div className="flex flex-col p-2.5 rounded-xl bg-surface-container-low">
              <span className="font-label-sm text-label-sm text-on-surface-variant">{t('lastActive')}</span>
              <span className="font-label-md text-label-md text-on-surface mt-1 font-medium">Y'day 6:30 PM</span>
            </div>
            <div className="flex flex-col p-2.5 rounded-xl bg-secondary-fixed/50 border border-secondary/20">
              <span className="font-label-sm text-label-sm text-primary font-bold">{t('optimalWindow')}</span>
              <span className="font-label-md text-label-md text-primary mt-1 font-bold">6:00 – 8:00 PM</span>
            </div>
          </div>
        </div>

        {/* Visual Field Context */}
        <div className="relative w-full h-36 rounded-2xl overflow-hidden shadow-sm">
          <img
            className="w-full h-full object-cover"
            alt="Vibrant healthy wheat farm in Punjab India during golden hour, lush green rows of PBW 550 wheat in vegetative stage"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuA_pNcNJAL4Zpqc2jeGETcwtwcm0Hnyhx4v_WjeK9Y3_65Og2Tw8zCz9milrFjhkoWCb1jwjQDSQn4niMXvGoextzLcmFIUyFLxuM9wV1rITU3NleJo7TGdWyYpsjOkOmXuHBgNO0zQUHqKAorvrfkFFxxYW5YNfXfw0gwOtfhNQ_IW3e31ivaU_XDnSyV9x8j7I9jFjEoknjMABedyhVVIt18pV1fxTM1WFZIIsHzXg6Ukb5X04YJS"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/85 via-primary/30 to-transparent flex items-end p-3.5">
            <div className="flex items-center justify-between w-full text-on-primary">
              <div>
                <div className="font-label-md text-label-md font-bold">Zone 1: Sensor Station Alpha</div>
                <div className="font-label-sm text-label-sm opacity-90">Root Depth Monitoring: 15cm & 30cm</div>
              </div>
              <span className="material-symbols-outlined text-[20px]">center_focus_strong</span>
            </div>
          </div>
        </div>
      </section>

      {/* RECENT DECISIONS LOG */}
      <section className="rounded-2xl bg-surface-container-lowest p-space-md shadow-sm flex flex-col gap-3 border border-surface-container-high/40">
        <div className="flex items-center justify-between">
          <h3 className="font-title-sm text-title-sm text-primary flex items-center gap-1.5 font-bold">
            <span className="material-symbols-outlined text-[18px]">history</span>
            <span>{t('recentAiDecisionsLog')}</span>
          </h3>
          <button
            type="button"
            onClick={() => onNavigate?.('history')}
            className="font-label-sm text-label-sm text-secondary hover:underline font-semibold"
          >
            {t('viewAll')}
          </button>
        </div>

        <div className="flex flex-col gap-2">
          {/* Item 1: Today */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-surface-container-low">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center text-primary flex-shrink-0">
                <span className="material-symbols-outlined text-[18px]">water_drop</span>
              </div>
              <div className="flex flex-col">
                <span className="font-label-md text-label-md text-primary font-bold">Today: Irrigation Recommended</span>
                <span className="font-body-sm text-body-sm text-on-surface-variant">Moisture 18% • Rain 20%</span>
              </div>
            </div>
            <span className="font-label-sm text-label-sm text-error font-bold">Action Needed</span>
          </div>

          {/* Item 2: Yesterday */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-surface-container-low">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-secondary flex-shrink-0">
                <span className="material-symbols-outlined text-[18px]">check_circle</span>
              </div>
              <div className="flex flex-col">
                <span className="font-label-md text-label-md text-primary font-semibold">Yesterday: No Irrigation Needed</span>
                <span className="font-body-sm text-body-sm text-on-surface-variant">Moisture 36% • Rain 15%</span>
              </div>
            </div>
            <span className="font-label-sm text-label-sm text-secondary font-medium">Skipped (Saved 3k L)</span>
          </div>

          {/* Item 3: Sep 24 */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-surface-container-low">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant flex-shrink-0">
                <span className="material-symbols-outlined text-[18px]">thunderstorm</span>
              </div>
              <div className="flex flex-col">
                <span className="font-label-md text-label-md text-primary font-semibold">Sep 24: Wait — Rain Expected</span>
                <span className="font-body-sm text-body-sm text-on-surface-variant">Moisture 22% • Rain 85%</span>
              </div>
            </div>
            <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">Rain Received 18mm</span>
          </div>
        </div>
      </section>

      {/* QUICK VOICE QUERY SNIPPET */}
      <div className="rounded-xl bg-primary-container p-3 text-on-primary shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <span className="material-symbols-outlined text-[20px] text-on-primary-container">contact_support</span>
          <div className="truncate">
            <div className="font-label-sm text-label-sm opacity-80">{t('tryAsking')}</div>
            <div className="font-label-md text-label-md truncate font-medium">
              {lang === 'hi' ? '"क्या मुझे आज शाम गेहूं में पानी देना चाहिए?"' : '"Should I irrigate my wheat field today?"'}
            </div>
          </div>
        </div>
        <button
          aria-label="Mic Trigger"
          onClick={() => onOpenVoice?.(lang === 'hi' ? 'क्या मुझे आज शाम गेहूं में पानी देना चाहिए?' : 'Should I irrigate my wheat field today?')}
          className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary flex-shrink-0 active:scale-95 transition-all shadow"
          type="button"
        >
          <span className="material-symbols-outlined text-[18px]">mic</span>
        </button>
      </div>

      {/* Schedule Irrigation Modal */}
      <ScheduleModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        onScheduled={(details) => {
          setScheduled(true);
          setScheduledDetails(details);
        }}
      />
    </div>
  );
}
