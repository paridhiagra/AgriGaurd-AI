import React, { useState, useEffect, useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { fetchHistory } from '../services/api.js';

// Realistic demo history data as specified in requirement 6
const DEMO_HISTORY_DATA = [
  {
    id: 'demo-1',
    date: 'Today',
    time: '6:00 PM',
    crop: 'Wheat',
    soilMoisture: 18,
    rainProbability: 20,
    temperature: 31,
    humidity: 48,
    growthStage: 'Vegetative / Tillering',
    decision: 'IRRIGATION RECOMMENDED',
    duration: '35 min',
    reason: 'Soil moisture is low (18%) and rainfall probability is currently low (20%). Irrigation is recommended to prevent root stress during critical tillering phase.',
    farmerAction: 'Farmer: Programmed for 6:00 PM',
    status: 'Scheduled'
  },
  {
    id: 'demo-2',
    date: 'Yesterday',
    time: '4:30 PM',
    crop: 'Wheat',
    soilMoisture: 21,
    rainProbability: 78,
    temperature: 29,
    humidity: 78,
    growthStage: 'Vegetative / Tillering',
    decision: 'WAIT — RAIN EXPECTED',
    duration: '-',
    reason: 'Meteorological radar shows 78% chance of substantial precipitation. Irrigating now risks root waterlogging and nutrient leaching. Rain will recharge root zones naturally.',
    farmerAction: 'Farmer: Deferred • Saved 18,000L',
    status: '18,000 L Saved'
  },
  {
    id: 'demo-3',
    date: 'Sep 29',
    time: '7:00 AM',
    crop: 'Wheat',
    soilMoisture: 46,
    rainProbability: 15,
    temperature: 27,
    humidity: 52,
    growthStage: 'Vegetative / Tillering',
    decision: 'NO IRRIGATION NEEDED',
    duration: '-',
    reason: 'Field capacity is well-balanced at 46% moisture. Evaporative demand is nominal and current soil capillary tension remains healthy. Zero water replenishment required.',
    farmerAction: 'Farmer: Adhered • Zero water used',
    status: 'Conserved'
  }
];

export default function History() {
  const { t } = useLanguage();

  // Component states
  const [historyList, setHistoryList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [isDemoFallback, setIsDemoFallback] = useState(false);
  const [filterType, setFilterType] = useState('all'); // 'all' | 'irrigation' | 'wait' | 'no-irrigation'
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [downloaded, setDownloaded] = useState(false);
  const [customStats, setCustomStats] = useState(null);

  // Normalize record so both API format and demo format render consistently
  const normalizeRecord = (item, idx) => {
    if (!item) return null;
    const rawDecision = item.decision || 'IRRIGATION RECOMMENDED';
    const isIrrigate = rawDecision === 'IRRIGATION_RECOMMENDED' || rawDecision === 'IRRIGATION RECOMMENDED';
    const isWait = rawDecision === 'WAIT_RAIN_EXPECTED' || rawDecision === 'WAIT — RAIN EXPECTED' || rawDecision === 'WAIT - RAIN EXPECTED';
    const isNoNeed = rawDecision === 'NO_IRRIGATION_NEEDED' || rawDecision === 'NO IRRIGATION NEEDED';

    let normalizedDecision = 'IRRIGATION RECOMMENDED';
    if (isWait) normalizedDecision = 'WAIT — RAIN EXPECTED';
    else if (isNoNeed) normalizedDecision = 'NO IRRIGATION NEEDED';

    // Extract date and time
    let dateStr = item.date;
    let timeStr = item.time;
    if (!dateStr && item.displayDate) {
      const parts = item.displayDate.split(',');
      dateStr = parts[0]?.trim() || 'Recent';
      timeStr = parts[1]?.trim() || '';
    }
    if (!dateStr) dateStr = 'Recent';
    if (!timeStr) timeStr = isIrrigate ? '6:00 PM' : '7:00 AM';

    return {
      id: item.id || `hist_${idx}_${Date.now()}`,
      date: dateStr,
      time: timeStr,
      crop: item.crop || 'Wheat',
      soilMoisture: typeof item.soilMoisture === 'number' ? item.soilMoisture : 18,
      rainProbability: typeof item.rainProbability === 'number' ? item.rainProbability : 20,
      temperature: typeof item.temperature === 'number' ? item.temperature : 31,
      humidity: typeof item.humidity === 'number' ? item.humidity : (item.soilMoisture ? Math.min(95, item.soilMoisture * 2.2) : 48),
      growthStage: item.growthStage || 'Vegetative (Day 34)',
      decision: normalizedDecision,
      rawDecision: rawDecision,
      duration: item.duration || (isIrrigate ? '35 min' : '-'),
      reason: item.reason || (isIrrigate ? 'Soil moisture below threshold. Irrigation recommended.' : isWait ? 'Precipitation expected in forecast. Wait to conserve water.' : 'Soil moisture level is optimal. No irrigation needed.'),
      farmerAction: item.farmerAction || (isIrrigate ? 'Scheduled by Farmer' : isWait ? 'Deferred by Farmer' : 'Adhered • Zero water used'),
      status: item.status || (isIrrigate ? 'Scheduled' : isWait ? 'Deferred' : 'Conserved')
    };
  };

  // Safe data loading with comprehensive error handling
  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      setLoading(true);
      setErrorMessage('');

      try {
        const response = await fetchHistory();
        if (!isMounted) return;

        const rawList = Array.isArray(response?.history) ? response.history : [];
        if (response?.stats) {
          setCustomStats(response.stats);
        }

        if (rawList.length > 0) {
          const sanitized = rawList.map(normalizeRecord).filter(Boolean);
          setHistoryList(sanitized);
          setIsDemoFallback(false);
        } else {
          // If the backend returns an empty list, keep historyList empty so empty state can render
          // (unless user is in demo mode or backend is empty, user requested realistic demo fallback when API fails)
          setHistoryList([]);
          setIsDemoFallback(false);
        }
      } catch (err) {
        if (!isMounted) return;
        console.warn('History API request failed, engaging safe demo fallback:', err?.message || err);
        // Error state: "Unable to load recommendation history. Showing demo history instead."
        setErrorMessage('Unable to load recommendation history.');
        setIsDemoFallback(true);
        const demoNormalized = DEMO_HISTORY_DATA.map(normalizeRecord).filter(Boolean);
        setHistoryList(demoNormalized);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  // Safe array guarantee (Requirement 14)
  const safeHistory = useMemo(() => {
    return Array.isArray(historyList) ? historyList : [];
  }, [historyList]);

  // Compute stats safely
  const stats = useMemo(() => {
    const list = safeHistory.length > 0 ? safeHistory : DEMO_HISTORY_DATA;
    const irrigationCount = list.filter(h => h.decision === 'IRRIGATION RECOMMENDED').length;
    const waitCount = list.filter(h => h.decision === 'WAIT — RAIN EXPECTED').length;
    const noIrrigationCount = list.filter(h => h.decision === 'NO IRRIGATION NEEDED').length;

    return {
      irrigationCount,
      waitCount,
      noIrrigationCount,
      decisionsCount: list.length,
      totalWaterSaved: customStats?.totalWaterSaved || '142k L',
      healthScore: customStats?.healthScore || '94%'
    };
  }, [safeHistory, customStats]);

  // Filtered items based on filterType (Requirement 8)
  const filteredItems = useMemo(() => {
    return safeHistory.filter(item => {
      if (filterType === 'all') return true;
      if (filterType === 'irrigation') return item.decision === 'IRRIGATION RECOMMENDED';
      if (filterType === 'wait') return item.decision === 'WAIT — RAIN EXPECTED';
      if (filterType === 'no-irrigation') return item.decision === 'NO IRRIGATION NEEDED';
      return true;
    });
  }, [safeHistory, filterType]);

  // Filter counters
  const counts = useMemo(() => {
    return {
      all: safeHistory.length,
      irrigation: safeHistory.filter(h => h.decision === 'IRRIGATION RECOMMENDED').length,
      wait: safeHistory.filter(h => h.decision === 'WAIT — RAIN EXPECTED').length,
      noIrrigation: safeHistory.filter(h => h.decision === 'NO IRRIGATION NEEDED').length,
    };
  }, [safeHistory]);

  const handleDownload = () => {
    setDownloaded(true);
    const listToExport = safeHistory.length > 0 ? safeHistory : DEMO_HISTORY_DATA;
    const content = `AgriGuard AI - Recommendation History Audit\n` +
      `Generated: ${new Date().toLocaleString()}\n` +
      `Farm: Green Valley Farm\n` +
      `Total Decisions: ${stats.decisionsCount}\n` +
      `Water Saved: ${stats.totalWaterSaved}\n\n` +
      `Date,Time,Crop,Soil Moisture,Rain Probability,Temperature,Decision,Duration,Reason\n` +
      listToExport.map(h => `"${h.date}","${h.time}","${h.crop}","${h.soilMoisture}%","${h.rainProbability}%","${h.temperature}°C","${h.decision}","${h.duration}","${h.reason.replace(/"/g, '""')}"`).join('\n');

    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AgriGuard_History_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    setTimeout(() => setDownloaded(false), 3000);
  };

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto pb-8 animate-in fade-in duration-200">
      <div className="px-margin space-y-space-md pt-2">
        
        {/* ===================================================
            HEADER & SUBTITLE (Requirement 8)
            =================================================== */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-primary tracking-tight font-extrabold">
              Recommendation History
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container-high text-primary font-label-sm text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
              Audit Synced
            </span>
          </div>
          <p className="font-body-sm text-sm text-on-surface-variant leading-relaxed">
            Review your previous irrigation decisions.
          </p>
        </div>

        {/* ===================================================
            SAFE STATE: ERROR STATE (Requirement 5 & 6)
            =================================================== */}
        {errorMessage && isDemoFallback && (
          <div className="p-3.5 rounded-2xl bg-surface-container-high border border-secondary/30 flex items-start gap-3 shadow-xs animate-in fade-in">
            <span className="material-symbols-outlined text-[22px] text-secondary flex-shrink-0 mt-0.5">
              info
            </span>
            <div className="flex flex-col">
              <span className="font-label-md text-sm font-bold text-primary">
                Unable to load recommendation history.
              </span>
              <span className="font-body-sm text-xs text-on-surface-variant">
                Showing demo history instead.
              </span>
            </div>
          </div>
        )}

        {/* ===================================================
            SEASONAL IMPACT SUMMARY (Preserved Visual Identity)
            =================================================== */}
        <div className="bg-surface-container-lowest rounded-2xl p-space-md shadow-[0_4px_20px_-2px_rgba(19,78,53,0.05)] border border-surface-container-high/50">
          <div className="flex items-center justify-between pb-3 border-b border-surface-container-high/30">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  eco
                </span>
              </div>
              <div>
                <span className="font-label-md text-xs text-on-surface uppercase tracking-wider block font-bold">
                  {t('seasonalStewardship')}
                </span>
                <span className="font-label-sm text-xs text-on-surface-variant">Active Zone: Wheat • Sector B</span>
              </div>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-fixed font-label-sm text-xs font-bold">
              32% Reduced Runoff
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-3">
            {/* Metric 1: Water Saved */}
            <div className="bg-surface-container-low rounded-xl p-2.5 flex flex-col justify-between border border-surface-container-high/30 ag-card-interactive">
              <div className="flex items-center gap-1 text-tertiary">
                <span className="material-symbols-outlined text-[16px]">water_drop</span>
                <span className="font-label-sm text-xs text-on-surface-variant font-medium">{t('waterSaved')}</span>
              </div>
              <div className="mt-1.5">
                <span className="font-headline-md text-lg text-primary leading-none block font-extrabold">
                  {stats.totalWaterSaved}
                </span>
                <span className="font-label-sm text-[11px] text-secondary font-medium mt-0.5 block truncate">
                  vs fixed sched.
                </span>
              </div>
            </div>

            {/* Metric 2: AI Events */}
            <div className="bg-surface-container-low rounded-xl p-2.5 flex flex-col justify-between border border-surface-container-high/30 ag-card-interactive">
              <div className="flex items-center gap-1 text-primary">
                <span className="material-symbols-outlined text-[16px]">psychology</span>
                <span className="font-label-sm text-xs text-on-surface-variant font-medium">{t('decisions')}</span>
              </div>
              <div className="mt-1.5">
                <span className="font-headline-md text-lg text-primary leading-none block font-extrabold">
                  {stats.decisionsCount}
                </span>
                <span className="font-label-sm text-[11px] text-on-surface-variant mt-0.5 block truncate">
                  {stats.irrigationCount} run • {stats.waitCount} wait
                </span>
              </div>
            </div>

            {/* Metric 3: Soil Health */}
            <div className="bg-surface-container-low rounded-xl p-2.5 flex flex-col justify-between border border-surface-container-high/30 ag-card-interactive">
              <div className="flex items-center gap-1 text-secondary">
                <span className="material-symbols-outlined text-[16px]">psychiatry</span>
                <span className="font-label-sm text-xs text-on-surface-variant font-medium">{t('healthScore')}</span>
              </div>
              <div className="mt-1.5">
                <span className="font-headline-md text-lg text-primary leading-none block font-extrabold">
                  {stats.healthScore}
                </span>
                <span className="font-label-sm text-[11px] text-secondary mt-0.5 block truncate font-medium">
                  Optimal Range
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ===================================================
            VISUAL TREND CHART: 14-Day Moisture Overlay
            =================================================== */}
        <div className="bg-surface-container-lowest rounded-2xl p-space-md shadow-[0_4px_20px_-2px_rgba(19,78,53,0.05)] border border-surface-container-high/50">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h2 className="font-title-sm text-sm text-primary font-bold">Soil Moisture Dynamics</h2>
              <p className="font-body-sm text-xs text-on-surface-variant">14-day telemetry showing trigger events</p>
            </div>
            <div className="flex items-center gap-1.5 bg-surface-container px-2.5 py-1 rounded-full text-on-surface-variant font-label-sm text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-primary"></span>
              Optimal 25-45%
            </div>
          </div>

          <div className="w-full relative mt-1">
            <svg aria-label="Moisture chart" className="w-full h-24 overflow-visible" preserveAspectRatio="none" viewBox="0 0 340 120">
              <defs>
                <linearGradient id="optimalZone" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#b1f0ce" stopOpacity="0.3"></stop>
                  <stop offset="100%" stopColor="#ecfef3" stopOpacity="0.1"></stop>
                </linearGradient>
                <linearGradient id="moistureLine" x1="0" x2="1" y1="0" y2="0">
                  <stop offset="0%" stopColor="#134e35"></stop>
                  <stop offset="100%" stopColor="#2c694e"></stop>
                </linearGradient>
              </defs>
              <rect fill="url(#optimalZone)" height="34" rx="4" width="340" x="0" y="38"></rect>
              <line stroke="#99d3b2" strokeDasharray="2 2" strokeWidth="0.8" x1="0" x2="340" y1="38" y2="38"></line>
              <line stroke="#99d3b2" strokeDasharray="2 2" strokeWidth="0.8" x1="0" x2="340" y1="72" y2="72"></line>
              <path
                d="M 0,62 C 25,68 45,78 70,82 C 85,85 92,44 110,48 C 130,52 145,60 170,72 C 185,78 195,30 220,34 C 245,38 260,54 285,62 C 305,68 320,80 340,78"
                fill="none"
                stroke="url(#moistureLine)"
                strokeLinecap="round"
                strokeWidth="2.5"
              ></path>
              <circle cx="85" cy="85" fill="#134e35" r="4"></circle>
              <circle cx="185" cy="78" fill="#004870" r="4"></circle>
              <circle cx="285" cy="62" fill="#2c694e" r="3.5"></circle>
              <circle cx="340" cy="78" fill="#ba1a1a" r="4"></circle>
            </svg>
            <div className="flex justify-between items-center text-on-surface-variant font-label-sm text-[11px] mt-1 px-1">
              <span>Sep 15</span>
              <span className="inline-flex items-center gap-1 text-primary">
                <span className="w-1.5 h-1.5 rounded-full bg-primary"></span> Sep 21 (Drip)
              </span>
              <span className="inline-flex items-center gap-1 text-tertiary">
                <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span> Sep 24 (Rain)
              </span>
              <span className="font-bold text-on-surface">Today</span>
            </div>
          </div>
        </div>

        {/* ===================================================
            FILTER BUTTONS (Requirement 8)
            - All
            - Irrigation
            - Wait
            - No Irrigation
            =================================================== */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between">
            <span className="font-label-md text-xs text-on-surface font-bold uppercase tracking-wider">
              Filter Decisions
            </span>
            <span className="font-label-sm text-xs text-on-surface-variant">
              Showing {filteredItems.length} of {safeHistory.length}
            </span>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar" role="tablist">
            <button
              type="button"
              onClick={() => setFilterType('all')}
              className={`flex-shrink-0 px-3.5 py-1.5 rounded-full font-label-md text-xs font-semibold shadow-xs transition-all cursor-pointer ag-btn-interactive ${
                filterType === 'all'
                  ? 'bg-primary text-on-primary font-bold shadow-sm'
                  : 'bg-surface-container-lowest text-on-surface hover:bg-surface-container-high'
              }`}
            >
              All {counts.all > 0 && `(${counts.all})`}
            </button>

            <button
              type="button"
              onClick={() => setFilterType('irrigation')}
              className={`flex-shrink-0 px-3.5 py-1.5 rounded-full font-label-md text-xs font-semibold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer ag-btn-interactive ${
                filterType === 'irrigation'
                  ? 'bg-primary text-on-primary font-bold shadow-sm'
                  : 'bg-surface-container-lowest text-on-surface hover:bg-surface-container-high'
              }`}
            >
              <span>🚰</span>
              <span>Irrigation {counts.irrigation > 0 && `(${counts.irrigation})`}</span>
            </button>

            <button
              type="button"
              onClick={() => setFilterType('wait')}
              className={`flex-shrink-0 px-3.5 py-1.5 rounded-full font-label-md text-xs font-semibold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer ag-btn-interactive ${
                filterType === 'wait'
                  ? 'bg-primary text-on-primary font-bold shadow-sm'
                  : 'bg-surface-container-lowest text-on-surface hover:bg-surface-container-high'
              }`}
            >
              <span>🌧️</span>
              <span>Wait {counts.wait > 0 && `(${counts.wait})`}</span>
            </button>

            <button
              type="button"
              onClick={() => setFilterType('no-irrigation')}
              className={`flex-shrink-0 px-3.5 py-1.5 rounded-full font-label-md text-xs font-semibold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer ag-btn-interactive ${
                filterType === 'no-irrigation'
                  ? 'bg-primary text-on-primary font-bold shadow-sm'
                  : 'bg-surface-container-lowest text-on-surface hover:bg-surface-container-high'
              }`}
            >
              <span>✅</span>
              <span>No Irrigation {counts.noIrrigation > 0 && `(${counts.noIrrigation})`}</span>
            </button>
          </div>
        </div>

        {/* ===================================================
            SAFE STATE: LOADING STATE (Requirement 5)
            "Loading recommendation history..."
            =================================================== */}
        {loading && (
          <div className="py-12 px-4 rounded-2xl bg-surface-container-lowest border border-surface-container-high/50 flex flex-col items-center justify-center text-center space-y-3">
            <span className="material-symbols-outlined text-[36px] text-secondary animate-spin">
              progress_activity
            </span>
            <span className="font-label-md text-sm font-semibold text-primary">
              Loading recommendation history...
            </span>
            <span className="font-body-sm text-xs text-on-surface-variant">
              Retrieving telemetry logs and agronomic audit records
            </span>
          </div>
        )}

        {/* ===================================================
            SAFE STATE: EMPTY STATE (Requirement 5)
            "No irrigation decisions yet."
            "Your future AI recommendations will appear here."
            =================================================== */}
        {!loading && filteredItems.length === 0 && safeHistory.length === 0 && !isDemoFallback && (
          <div className="py-12 px-6 rounded-2xl bg-surface-container-lowest border border-surface-container-high/50 flex flex-col items-center justify-center text-center space-y-3 shadow-xs">
            <div className="w-14 h-14 rounded-2xl bg-surface-container flex items-center justify-center text-primary shadow-xs">
              <span className="material-symbols-outlined text-[32px] text-secondary">
                history_toggle_off
              </span>
            </div>
            <div className="space-y-1">
              <h3 className="font-headline-sm text-base font-bold text-primary">
                No irrigation decisions yet.
              </h3>
              <p className="font-body-sm text-xs text-on-surface-variant max-w-sm mx-auto">
                Your future AI recommendations will appear here.
              </p>
            </div>
          </div>
        )}

        {/* Empty filter state (when history exists, but current filter has 0 items) */}
        {!loading && filteredItems.length === 0 && safeHistory.length > 0 && (
          <div className="py-8 px-4 rounded-2xl bg-surface-container-lowest border border-surface-container-high/50 text-center space-y-2">
            <p className="font-label-md text-sm font-semibold text-primary">
              No decisions match this filter.
            </p>
            <button
              type="button"
              onClick={() => setFilterType('all')}
              className="text-xs text-secondary font-bold hover:underline cursor-pointer"
            >
              Reset to All Decisions
            </button>
          </div>
        )}

        {/* ===================================================
            HISTORY CARDS LIST (Requirement 8)
            - Date/time
            - Crop
            - Soil moisture
            - Rain probability
            - Temperature
            - AI decision
            - Irrigation duration when applicable
            =================================================== */}
        {!loading && filteredItems.length > 0 && (
          <div className="space-y-3">
            {filteredItems.map((item, index) => {
              const isWait = item.decision === 'WAIT — RAIN EXPECTED';
              const isNoNeed = item.decision === 'NO IRRIGATION NEEDED';
              const isIrrigate = item.decision === 'IRRIGATION RECOMMENDED';

              return (
                <div
                  key={item.id || index}
                  className="bg-surface-container-lowest rounded-2xl p-4 shadow-[0_4px_20px_-2px_rgba(19,78,53,0.06)] border border-surface-container-high/50 transition-all hover:border-secondary/40 ag-card-interactive"
                >
                  {/* Top Bar: Decision Badge & Date/Time */}
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-label-sm text-xs font-bold tracking-tight shadow-xs ${
                        isWait
                          ? 'bg-tertiary-fixed text-tertiary border border-tertiary/20'
                          : isNoNeed
                          ? 'bg-secondary-container text-on-secondary-fixed border border-secondary/20'
                          : 'bg-error-container text-on-error-container border border-error/20'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                        {isWait ? 'cloudy_snowing' : isNoNeed ? 'check_circle' : 'water_drop'}
                      </span>
                      <span>{item.decision}</span>
                    </div>

                    <div className="flex items-center gap-1 text-on-surface-variant font-label-sm text-xs font-medium">
                      <span className="material-symbols-outlined text-[15px]">schedule</span>
                      <span>{item.date} • {item.time}</span>
                    </div>
                  </div>

                  {/* Core Telemetry Grid: Crop, Moisture, Rain, Temp, Duration */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 my-3 p-3 rounded-xl bg-surface-container-low border border-surface-container-high/30 text-xs">
                    {/* Crop */}
                    <div className="flex flex-col">
                      <span className="font-label-sm text-on-surface-variant text-[11px] font-medium">Crop</span>
                      <span className="font-title-sm text-xs font-bold text-primary truncate mt-0.5">
                        {item.crop}
                      </span>
                    </div>

                    {/* Soil Moisture */}
                    <div className="flex flex-col">
                      <span className="font-label-sm text-on-surface-variant text-[11px] font-medium">Soil Moisture</span>
                      <span
                        className={`font-title-sm text-xs font-bold mt-0.5 ${
                          item.soilMoisture < 25 ? 'text-error' : 'text-primary'
                        }`}
                      >
                        {item.soilMoisture}%{' '}
                        <span className="font-normal text-[10px] text-on-surface-variant">
                          {item.soilMoisture < 22 ? '(<22%)' : '(Optimal)'}
                        </span>
                      </span>
                    </div>

                    {/* Rain Chance */}
                    <div className="flex flex-col">
                      <span className="font-label-sm text-on-surface-variant text-[11px] font-medium">Rain Chance</span>
                      <span className="font-title-sm text-xs font-bold text-on-surface mt-0.5">
                        {item.rainProbability}% {item.rainProbability >= 70 && '🌧️'}
                      </span>
                    </div>

                    {/* Temperature */}
                    <div className="flex flex-col">
                      <span className="font-label-sm text-on-surface-variant text-[11px] font-medium">Temperature</span>
                      <span className="font-title-sm text-xs font-bold text-on-surface mt-0.5">
                        {item.temperature}°C
                      </span>
                    </div>
                  </div>

                  {/* Duration Highlight (Requirement 8: Irrigation duration when applicable) */}
                  {isIrrigate && item.duration && item.duration !== '-' && (
                    <div className="mb-3 px-3 py-1.5 rounded-lg bg-surface-container flex items-center justify-between text-xs border border-surface-container-high/30">
                      <span className="font-label-sm text-primary font-semibold flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[15px] text-secondary">timer</span>
                        <span>Irrigation Duration Window:</span>
                      </span>
                      <span className="font-bold text-primary">{item.duration}</span>
                    </div>
                  )}

                  {/* Concise AI Rationale Excerpt */}
                  <div className="bg-surface-container rounded-xl p-2.5 flex items-start gap-2 border border-surface-container-high/40">
                    <span className="material-symbols-outlined text-[17px] text-secondary flex-shrink-0 mt-0.5">
                      psychology
                    </span>
                    <p className="font-body-sm text-xs text-on-surface leading-relaxed line-clamp-2">
                      {item.reason}
                    </p>
                  </div>

                  {/* Card Bottom: Action Tag & "View Details" (Requirement 9) */}
                  <div className="mt-3 pt-2.5 flex items-center justify-between border-t border-surface-container-high/30 flex-wrap gap-2">
                    <div className="flex items-center gap-1.5 text-xs text-on-surface font-medium truncate">
                      <span className="material-symbols-outlined text-[16px] text-secondary">
                        {isNoNeed ? 'verified' : isWait ? 'savings' : 'schedule'}
                      </span>
                      <span className="truncate">{item.farmerAction}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedRecord(item)}
                      className="px-3 py-1.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-primary font-label-md text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all shadow-xs ag-btn-interactive"
                    >
                      <span>View Details</span>
                      <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ===================================================
            VIEW DETAILS MODAL (Requirement 9)
            Shows:
            - Soil moisture
            - Temperature
            - Humidity if available
            - Rain probability
            - Crop
            - Growth stage if available
            - Decision
            - Reason for decision
            =================================================== */}
        {selectedRecord && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
            <div className="w-full max-w-md bg-surface-container-lowest rounded-3xl p-6 shadow-2xl border border-surface-container-high/60 space-y-4 max-h-[90vh] overflow-y-auto">
              
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-3 border-b border-surface-container-high/40">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">
                    {selectedRecord.decision === 'IRRIGATION RECOMMENDED' ? '🚰' : selectedRecord.decision === 'WAIT — RAIN EXPECTED' ? '🌧️' : '✅'}
                  </span>
                  <div>
                    <h3 className="font-headline-sm text-base font-bold text-primary">
                      {selectedRecord.decision}
                    </h3>
                    <span className="font-body-sm text-xs text-on-surface-variant">
                      {selectedRecord.date} • {selectedRecord.time}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedRecord(null)}
                  className="w-8 h-8 rounded-full bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant cursor-pointer transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>

              {/* Requirement 9 Specific Fields Grid */}
              <div className="grid grid-cols-2 gap-2.5 p-3 rounded-2xl bg-surface-container-low border border-surface-container-high/40 text-xs">
                {/* Crop */}
                <div className="p-2 rounded-xl bg-surface-container-lowest">
                  <span className="text-on-surface-variant block text-[11px] font-medium">Crop</span>
                  <span className="font-bold text-primary text-xs mt-0.5 block truncate">
                    {selectedRecord.crop}
                  </span>
                </div>

                {/* Growth Stage */}
                <div className="p-2 rounded-xl bg-surface-container-lowest">
                  <span className="text-on-surface-variant block text-[11px] font-medium">Growth Stage</span>
                  <span className="font-bold text-primary text-xs mt-0.5 block truncate">
                    {selectedRecord.growthStage || 'Vegetative (Day 34)'}
                  </span>
                </div>

                {/* Soil Moisture */}
                <div className="p-2 rounded-xl bg-surface-container-lowest">
                  <span className="text-on-surface-variant block text-[11px] font-medium">Soil Moisture</span>
                  <span className="font-bold text-primary text-sm mt-0.5 block">
                    {selectedRecord.soilMoisture}%
                  </span>
                </div>

                {/* Rain Probability */}
                <div className="p-2 rounded-xl bg-surface-container-lowest">
                  <span className="text-on-surface-variant block text-[11px] font-medium">Rain Probability</span>
                  <span className="font-bold text-primary text-sm mt-0.5 block">
                    {selectedRecord.rainProbability}%
                  </span>
                </div>

                {/* Temperature */}
                <div className="p-2 rounded-xl bg-surface-container-lowest">
                  <span className="text-on-surface-variant block text-[11px] font-medium">Temperature</span>
                  <span className="font-bold text-primary text-sm mt-0.5 block">
                    {selectedRecord.temperature}°C
                  </span>
                </div>

                {/* Humidity if available */}
                <div className="p-2 rounded-xl bg-surface-container-lowest">
                  <span className="text-on-surface-variant block text-[11px] font-medium">Humidity</span>
                  <span className="font-bold text-primary text-sm mt-0.5 block">
                    {selectedRecord.humidity ? `${selectedRecord.humidity}%` : '48%'}
                  </span>
                </div>
              </div>

              {/* Decision & Duration */}
              <div className="p-3 rounded-2xl bg-surface-container flex items-center justify-between text-xs">
                <div>
                  <span className="text-on-surface-variant block text-[11px] font-medium">AI Decision</span>
                  <span className="font-bold text-primary">{selectedRecord.decision}</span>
                </div>
                {selectedRecord.duration && selectedRecord.duration !== '-' && (
                  <div className="text-right">
                    <span className="text-on-surface-variant block text-[11px] font-medium">Duration</span>
                    <span className="font-bold text-secondary">{selectedRecord.duration}</span>
                  </div>
                )}
              </div>

              {/* Reason for Decision */}
              <div className="space-y-1.5 text-xs">
                <span className="font-bold text-primary block flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-secondary">psychology</span>
                  <span>Reason for Decision:</span>
                </span>
                <p className="font-body-sm text-xs text-on-surface leading-relaxed p-3.5 rounded-2xl bg-surface-container-low border border-surface-container-high/40">
                  {selectedRecord.reason}
                </p>
              </div>

              {/* Farmer Action */}
              <div className="p-3 rounded-2xl bg-surface-container-low border border-surface-container-high/30 flex items-center gap-2 text-xs">
                <span className="material-symbols-outlined text-[18px] text-secondary">check_circle</span>
                <div className="flex flex-col">
                  <span className="font-bold text-on-surface">Farmer Execution Record</span>
                  <span className="text-on-surface-variant">{selectedRecord.farmerAction}</span>
                </div>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setSelectedRecord(null)}
                className="w-full h-11 rounded-xl bg-primary text-on-primary font-label-md text-xs font-bold shadow-md cursor-pointer hover:bg-primary-container transition-colors ag-btn-interactive"
              >
                Close Details
              </button>
            </div>
          </div>
        )}

        {/* ===================================================
            EXPORT AGRONOMIC AUDIT REPORT
            =================================================== */}
        <div className="pt-2 pb-4">
          <button
            type="button"
            onClick={handleDownload}
            className="w-full h-12 rounded-xl bg-primary text-on-primary font-label-lg text-sm font-bold flex items-center justify-center gap-2 shadow-[0_6px_20px_-3px_rgba(19,78,53,0.3)] active:scale-95 transition-all hover:bg-primary-container cursor-pointer ag-btn-interactive"
          >
            <span className="material-symbols-outlined text-[20px]">
              {downloaded ? 'check_circle' : 'download'}
            </span>
            <span>
              {downloaded ? 'Audit Report Downloaded' : 'Download Recommendation History (CSV)'}
            </span>
          </button>
          <p className="text-center font-label-sm text-[11px] text-on-surface-variant mt-2">
            Exported data formatted for compliance, crop insurance audits, and water authority reporting.
          </p>
        </div>

      </div>
    </div>
  );
}
