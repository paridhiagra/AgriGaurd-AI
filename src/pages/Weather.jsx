import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';

export default function Weather({ weatherData }) {
  const { t } = useLanguage();
  const [calibrated, setCalibrated] = useState(false);

  const data = weatherData || {
    temperature: 31,
    feelsLike: 33,
    tempHigh: 33,
    tempLow: 21,
    condition: 'Partly Cloudy',
    humidity: 48,
    wind: '12 km/h NE',
    solarRadiation: '680 W/m²',
    et0Demand: '4.8 mm/d',
    rainProbability: 20
  };

  const handleCalibrate = () => {
    setCalibrated(true);
    setTimeout(() => setCalibrated(false), 3000);
  };

  return (
    <div className="flex flex-col w-full px-margin space-y-space-md max-w-4xl mx-auto pb-6 animate-in fade-in duration-200">
      {/* Title & Header */}
      <div className="flex flex-col mt-2">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container-high text-on-secondary-fixed-variant">
            <span className="material-symbols-outlined text-[15px] text-secondary">farsight_digital</span>
            <span className="font-label-sm text-label-sm">Sector 4 IoT Mesh Active</span>
          </div>
          <span className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span> 5m ago
          </span>
        </div>
        <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-primary mt-1.5 tracking-tight font-extrabold">
          {t('microWeather')}
        </h1>
        <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
          {t('weatherSubtitle')}
        </p>
        <div className="flex items-center gap-1 mt-1 text-on-secondary-container">
          <span className="material-symbols-outlined text-[16px]">location_on</span>
          <span className="font-label-md text-label-md font-semibold">Green Valley Farm, Sector 4</span>
        </div>
      </div>

      {/* Current Conditions Card */}
      <div className="rounded-2xl bg-surface-container-lowest p-space-md shadow-[0_4px_20px_-2px_rgba(19,78,53,0.06)] border border-surface-container-high/50 relative overflow-hidden">
        <div className="flex items-start justify-between">
          <div className="flex flex-col">
            <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider font-bold">
              {t('currentConditions')}
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-headline-xl-mobile text-headline-xl-mobile text-primary tracking-tight font-extrabold">
                {data.temperature}°C
              </span>
              <span className="font-label-md text-label-md text-on-surface-variant font-medium">
                Feels {data.feelsLike}°C
              </span>
            </div>
            <div className="flex items-center gap-1.5 mt-0.5 text-on-surface">
              <span className="material-symbols-outlined text-[18px] text-secondary">partly_cloudy_day</span>
              <span className="font-title-sm text-title-sm font-semibold">{data.condition}</span>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1.5">
            <div className="px-2.5 py-1 rounded-full bg-surface-container text-on-secondary-container font-label-sm text-label-sm flex items-center gap-1 font-semibold">
              <span className="material-symbols-outlined text-[14px]">arrow_upward</span>{data.tempHigh}°
              <span className="material-symbols-outlined text-[14px] ml-1">arrow_downward</span>{data.tempLow}°
            </div>
            <div className="px-2.5 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm flex items-center gap-1 font-bold">
              <span className="material-symbols-outlined text-[14px]">water_drop</span> {data.rainProbability}% Rain
            </div>
          </div>
        </div>

        {/* Telemetry Grid */}
        <div className="grid grid-cols-2 gap-2 mt-space-md pt-space-sm bg-surface-container-low p-2.5 rounded-xl border border-surface-container-high/30">
          <div className="flex items-center gap-2 p-1.5 rounded-lg bg-surface-container-lowest shadow-xs">
            <div className="w-8 h-8 rounded-full bg-tertiary-fixed flex items-center justify-center text-tertiary">
              <span className="material-symbols-outlined text-[18px]">humidity_percentage</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-label-sm text-label-sm text-on-surface-variant">{t('humidity')}</span>
              <span className="font-title-sm text-title-sm text-on-surface font-bold">{data.humidity}%</span>
            </div>
          </div>

          <div className="flex items-center gap-2 p-1.5 rounded-lg bg-surface-container-lowest shadow-xs">
            <div className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center text-primary-container">
              <span className="material-symbols-outlined text-[18px]">air</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-label-sm text-label-sm text-on-surface-variant">Wind</span>
              <span className="font-title-sm text-title-sm text-on-surface font-bold">
                {data.wind}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 p-1.5 rounded-lg bg-surface-container-lowest shadow-xs">
            <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[18px]">wb_sunny</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-label-sm text-label-sm text-on-surface-variant">Solar Rad.</span>
              <span className="font-title-sm text-title-sm text-on-surface font-bold">{data.solarRadiation}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 p-1.5 rounded-lg bg-surface-container-lowest shadow-xs">
            <div className="w-8 h-8 rounded-full bg-primary-fixed flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[18px]">replace_video</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-label-sm text-label-sm text-on-surface-variant">ET₀ Demand</span>
              <span className="font-title-sm text-title-sm text-on-surface font-bold">{data.et0Demand}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Agro-Meteorological Insight banner */}
      <div className="rounded-2xl bg-primary-container text-on-primary p-space-md shadow-[0_8px_24px_-4px_rgba(19,78,53,0.18)] relative overflow-hidden">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-secondary-fixed text-primary flex items-center justify-center">
            <span className="material-symbols-outlined text-[17px]">lightbulb</span>
          </div>
          <span className="font-label-lg text-label-lg tracking-wide text-primary-fixed font-bold">
            Agro-Meteorological Insight
          </span>
        </div>
        <p className="font-body-md text-body-md mt-2 leading-relaxed text-surface-bright/95">
          With <strong className="text-white font-title-sm">31°C heat</strong> and moderate wind, evaporation will spike between 1:00 PM and 4:00 PM. High rain is <span className="text-secondary-fixed font-semibold underline decoration-secondary-fixed/50">NOT predicted</span> until Saturday evening.
        </p>
        <div className="mt-3 p-2.5 rounded-xl bg-surface-container-highest/20 flex items-start gap-2 border border-white/10">
          <span className="material-symbols-outlined text-[18px] text-primary-fixed-dim mt-0.5">warning</span>
          <p className="font-body-sm text-body-sm text-primary-fixed leading-snug">
            Delaying irrigation until tomorrow risks entering critical wheat root zone water stress.
          </p>
        </div>
      </div>

      {/* 24-Hour Micro Forecast */}
      <div className="flex flex-col space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[18px] text-secondary">schedule</span>
            <h2 className="font-title-md text-title-md text-primary font-bold">{t('twentyFourHourForecast')}</h2>
          </div>
          <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">Field Telemetry</span>
        </div>

        <div className="flex gap-2.5 overflow-x-auto pb-2 no-scrollbar">
          <div className="flex-shrink-0 w-24 rounded-2xl bg-surface-container-lowest p-3 flex flex-col items-center text-center shadow-sm border border-surface-container-high/40 ag-card-interactive">
            <span className="font-label-sm text-label-sm text-on-surface-variant">12 PM</span>
            <span className="material-symbols-outlined text-[24px] text-secondary my-1.5 anim-weather-sun">wb_sunny</span>
            <span className="font-title-sm text-title-sm text-primary font-bold">31°C</span>
            <div className="w-full bg-surface-container rounded-full h-1.5 mt-2 overflow-hidden">
              <div className="bg-tertiary-container h-full rounded-full" style={{ width: '10%' }}></div>
            </div>
            <span className="font-label-sm text-label-sm text-on-tertiary-fixed-variant mt-1 font-semibold">10% rain</span>
          </div>

          <div className="flex-shrink-0 w-24 rounded-2xl bg-surface-container-lowest p-3 flex flex-col items-center text-center shadow-sm border border-surface-container-high/40 ag-card-interactive">
            <span className="font-label-sm text-label-sm text-on-surface-variant">3 PM</span>
            <span className="material-symbols-outlined text-[24px] text-secondary my-1.5 anim-weather-sun">sunny</span>
            <span className="font-title-sm text-title-sm text-primary font-bold">33°C</span>
            <div className="w-full bg-surface-container rounded-full h-1.5 mt-2 overflow-hidden">
              <div className="bg-tertiary-container h-full rounded-full" style={{ width: '15%' }}></div>
            </div>
            <span className="font-label-sm text-label-sm text-on-tertiary-fixed-variant mt-1 font-semibold">15% rain</span>
          </div>

          <div className="flex-shrink-0 w-28 rounded-2xl bg-surface-container-high p-3 flex flex-col items-center text-center shadow-md relative border border-secondary/30 ag-card-interactive">
            <div className="absolute -top-1.5 bg-primary text-on-primary font-label-sm text-[9px] px-2 py-0.5 rounded-full shadow-sm font-bold tracking-wide">
              BEST WINDOW
            </div>
            <span className="font-label-sm text-label-sm text-primary font-bold">6 PM</span>
            <span className="material-symbols-outlined text-[24px] text-secondary my-1.5 anim-weather-cloud">partly_cloudy_day</span>
            <span className="font-title-sm text-title-sm text-primary font-bold">29°C</span>
            <div className="w-full bg-surface-container-lowest rounded-full h-1.5 mt-2 overflow-hidden">
              <div className="bg-secondary h-full rounded-full" style={{ width: '20%' }}></div>
            </div>
            <span className="font-label-sm text-label-sm text-primary mt-1 font-bold">20% • Irrigate</span>
          </div>

          <div className="flex-shrink-0 w-24 rounded-2xl bg-surface-container-lowest p-3 flex flex-col items-center text-center shadow-sm border border-surface-container-high/40 ag-card-interactive">
            <span className="font-label-sm text-label-sm text-on-surface-variant">9 PM</span>
            <span className="material-symbols-outlined text-[24px] text-secondary my-1.5">nights_stay</span>
            <span className="font-title-sm text-title-sm text-primary font-bold">25°C</span>
            <div className="w-full bg-surface-container rounded-full h-1.5 mt-2 overflow-hidden">
              <div className="bg-tertiary-container h-full rounded-full" style={{ width: '10%' }}></div>
            </div>
            <span className="font-label-sm text-label-sm text-on-tertiary-fixed-variant mt-1 font-semibold">10% rain</span>
          </div>

          <div className="flex-shrink-0 w-24 rounded-2xl bg-surface-container-lowest p-3 flex flex-col items-center text-center shadow-sm border border-surface-container-high/40 ag-card-interactive">
            <span className="font-label-sm text-label-sm text-on-surface-variant">12 AM</span>
            <span className="material-symbols-outlined text-[24px] text-secondary my-1.5">bedtime</span>
            <span className="font-title-sm text-title-sm text-primary font-bold">23°C</span>
            <div className="w-full bg-surface-container rounded-full h-1.5 mt-2 overflow-hidden">
              <div className="bg-tertiary-container h-full rounded-full" style={{ width: '5%' }}></div>
            </div>
            <span className="font-label-sm text-label-sm text-on-tertiary-fixed-variant mt-1 font-semibold">5% rain</span>
          </div>

          <div className="flex-shrink-0 w-24 rounded-2xl bg-surface-container-lowest p-3 flex flex-col items-center text-center shadow-sm border border-surface-container-high/40 ag-card-interactive">
            <span className="font-label-sm text-label-sm text-on-surface-variant">6 AM</span>
            <span className="material-symbols-outlined text-[24px] text-secondary my-1.5">wb_twilight</span>
            <span className="font-title-sm text-title-sm text-primary font-bold">21°C</span>
            <div className="w-full bg-surface-container rounded-full h-1.5 mt-2 overflow-hidden">
              <div className="bg-tertiary-container h-full rounded-full" style={{ width: '10%' }}></div>
            </div>
            <span className="font-label-sm text-label-sm text-on-tertiary-fixed-variant mt-1 font-semibold">10% rain</span>
          </div>
        </div>
      </div>

      {/* Soil Moisture Projection */}
      <div className="rounded-2xl bg-surface-container-lowest p-space-md shadow-[0_4px_20px_-2px_rgba(19,78,53,0.06)] border border-surface-container-high/50 flex flex-col space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[20px] text-secondary">analytics</span>
            <h2 className="font-title-md text-title-md text-primary font-bold">{t('soilMoistureProjection')}</h2>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-on-secondary-fixed-variant font-label-sm text-label-sm font-semibold">
            48-Hr Model
          </span>
        </div>
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          Depletion curve at root zone (0-30cm) based on ET₀ demand.
        </p>

        <div className="w-full bg-surface-container-low rounded-xl p-3 border border-surface-container-high/30">
          <svg aria-label="Soil Moisture vs Weather Projection" className="w-full h-28 overflow-visible" viewBox="0 0 320 120">
            <defs>
              <linearGradient id="optZone" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#b1f0ce" stopOpacity="0.45"></stop>
                <stop offset="100%" stopColor="#b1f0ce" stopOpacity="0.05"></stop>
              </linearGradient>
            </defs>
            <rect fill="url(#optZone)" height="48" rx="4" width="320" x="0" y="24"></rect>
            <line stroke="#99d3b2" strokeDasharray="3 3" strokeWidth="1" x1="0" x2="320" y1="24" y2="24"></line>
            <line stroke="#ba1a1a" strokeDasharray="3 3" strokeWidth="1" x1="0" x2="320" y1="72" y2="72"></line>
            <text fill="#134e35" fontSize="9" fontWeight="600" x="6" y="20">Optimal Field Capacity (65-80%)</text>
            <text fill="#ba1a1a" fontSize="8" fontWeight="600" x="6" y="82">Stress Threshold (45%)</text>
            
            {/* Stress trajectory without action */}
            <path d="M 10 38 Q 80 50 140 70 T 220 95 T 310 110" fill="none" stroke="#ba1a1a" strokeLinecap="round" strokeWidth="2.5"></path>
            
            {/* Recovery trajectory with irrigation */}
            <path d="M 10 38 Q 60 52 110 65 L 120 32 Q 200 40 260 48 T 310 52" fill="none" stroke="#2c694e" strokeLinecap="round" strokeWidth="3"></path>
            <circle cx="120" cy="32" fill="#134e35" r="4.5"></circle>
            <text fill="#134e35" fontSize="8.5" fontWeight="700" x="126" y="32">6 PM Irrigate (+28mm)</text>
          </svg>
          <div className="flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm mt-1 px-1">
            <span>Now (12 PM)</span>
            <span>6 PM Today</span>
            <span>Tomorrow</span>
            <span>Fri Morning</span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-4 pt-1 text-on-surface-variant font-label-sm text-label-sm">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-1 rounded-full bg-secondary"></span>
            <span>With Recommended Irrigation</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-1 rounded-full bg-error"></span>
            <span>Without Action (Stress)</span>
          </div>
        </div>
      </div>

      {/* ===================================================
          Section 11: Weather Alerts
          =================================================== */}
      <div className="flex flex-col gap-2">
        <h2 className="font-title-md text-title-md text-primary font-bold flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[20px] text-error">notification_important</span>
          <span>Weather Alerts</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <div className="p-3 rounded-2xl bg-surface-container-lowest border border-surface-container-high/50 shadow-xs flex flex-col gap-1 ag-card-interactive">
            <div className="flex items-center gap-2">
              <span className="text-lg">🌧️</span>
              <span className="font-label-md text-xs font-bold text-primary">Rain Expected</span>
            </div>
            <p className="font-body-sm text-[12px] text-on-surface-variant">
              Rain probability is high during the next few hours (weekend radar spikes to 85%).
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-surface-container-lowest border border-surface-container-high/50 shadow-xs flex flex-col gap-1 ag-card-interactive">
            <div className="flex items-center gap-2">
              <span className="text-lg">🌡️</span>
              <span className="font-label-md text-xs font-bold text-primary">High Temperature</span>
            </div>
            <p className="font-body-sm text-[12px] text-on-surface-variant">
              High temperature (31°C–33°C) may increase crop water demand and evapotranspiration.
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-surface-container-lowest border border-surface-container-high/50 shadow-xs flex flex-col gap-1 ag-card-interactive">
            <div className="flex items-center gap-2">
              <span className="text-lg">💧</span>
              <span className="font-label-md text-xs font-bold text-primary">Low Water Availability</span>
            </div>
            <p className="font-body-sm text-[12px] text-on-surface-variant">
              Water tank level is currently at 72%. Alert triggers if level drops below 30%.
            </p>
          </div>
        </div>
      </div>

      {/* ===================================================
          Section 10: How Weather Affects Your Farm
          =================================================== */}
      <div className="rounded-2xl bg-surface-container-lowest p-space-md shadow-sm border border-surface-container-high/50 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[22px] text-secondary">psychology</span>
            <h2 className="font-title-md text-title-md text-primary font-bold">How Weather Affects Your Farm</h2>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-fixed text-[11px] font-bold">
            Irrigation Nexus
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {/* Example 1: Low Rain Condition */}
          <div className="p-3.5 rounded-xl bg-surface-container-low border border-surface-container-high/40 flex flex-col gap-1.5 ag-card-interactive">
            <div className="flex items-center justify-between text-xs font-bold text-primary">
              <span>Current Condition: Clear / Low Rain</span>
              <span className="px-2 py-0.5 rounded bg-surface-container text-secondary">Rain: 20%</span>
            </div>
            <div className="text-xs text-on-surface">
              <strong className="text-on-surface-variant">Impact: </strong>
              Low rainfall expected. Solar radiation is driving regular root uptake.
            </div>
            <div className="text-xs text-secondary font-semibold">
              <strong>Recommendation: </strong>
              Current weather conditions do not indicate significant rainfall. Proceed with scheduled evening irrigation.
            </div>
          </div>

          {/* Example 2: High Rain Threshold */}
          <div className="p-3.5 rounded-xl bg-surface-container-low border border-surface-container-high/40 flex flex-col gap-1.5 ag-card-interactive">
            <div className="flex items-center justify-between text-xs font-bold text-primary">
              <span>Threshold Simulation: High Rain</span>
              <span className="px-2 py-0.5 rounded bg-tertiary-fixed text-on-tertiary-fixed">Rain: 82%</span>
            </div>
            <div className="text-xs text-on-surface">
              <strong className="text-on-surface-variant">Impact: </strong>
              High chance of rainfall. Natural precipitation will saturate topsoil.
            </div>
            <div className="text-xs text-primary font-semibold">
              <strong>Recommendation: </strong>
              Consider delaying irrigation. Natural rainwater will recharge root zone without pumping electricity cost.
            </div>
          </div>
        </div>
      </div>

      {/* 7-Day Farm Forecast */}
      <div className="rounded-2xl bg-surface-container-lowest p-space-md shadow-[0_4px_20px_-2px_rgba(19,78,53,0.06)] border border-surface-container-high/50 flex flex-col space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[20px] text-secondary">calendar_month</span>
            <h2 className="font-title-md text-title-md text-primary font-bold">{t('sevenDayFarmForecast')}</h2>
          </div>
          <span className="font-label-sm text-label-sm text-on-secondary-container font-semibold">Agronomic Schedule</span>
        </div>

        <div className="divide-y divide-transparent space-y-2">
          {/* Today */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-surface-container-low">
            <div className="flex items-center gap-2.5 min-w-[100px]">
              <span className="material-symbols-outlined text-[20px] text-secondary">partly_cloudy_day</span>
              <div className="flex flex-col">
                <span className="font-label-md text-label-md text-on-surface font-semibold">Today (Wed)</span>
                <span className="font-body-sm text-body-sm text-on-surface-variant">31° / 21°</span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-on-surface-variant font-label-sm text-label-sm">
              <span className="material-symbols-outlined text-[15px] text-tertiary">water_drop</span> 20%
            </div>
            <span className="px-2.5 py-1 rounded-full bg-secondary text-on-secondary font-label-sm text-label-sm font-semibold flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">water_ph</span> Irrigate
            </span>
          </div>

          {/* Thu */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-surface-container-lowest">
            <div className="flex items-center gap-2.5 min-w-[100px]">
              <span className="material-symbols-outlined text-[20px] text-secondary">sunny</span>
              <div className="flex flex-col">
                <span className="font-label-md text-label-md text-on-surface">Thu</span>
                <span className="font-body-sm text-body-sm text-on-surface-variant">32° / 22°</span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-on-surface-variant font-label-sm text-label-sm">
              <span className="material-symbols-outlined text-[15px] text-tertiary">water_drop</span> 10%
            </div>
            <span className="px-2.5 py-1 rounded-full bg-surface-container-high text-on-secondary-fixed-variant font-label-sm text-label-sm">
              Normal
            </span>
          </div>

          {/* Fri */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-surface-container-lowest">
            <div className="flex items-center gap-2.5 min-w-[100px]">
              <span className="material-symbols-outlined text-[20px] text-on-surface-variant">cloud</span>
              <div className="flex flex-col">
                <span className="font-label-md text-label-md text-on-surface">Fri</span>
                <span className="font-body-sm text-body-sm text-on-surface-variant">30° / 20°</span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-on-surface-variant font-label-sm text-label-sm">
              <span className="material-symbols-outlined text-[15px] text-tertiary">water_drop</span> 40%
            </div>
            <span className="px-2.5 py-1 rounded-full bg-surface-container-high text-tertiary-container font-label-sm text-label-sm font-semibold">
              Monitor
            </span>
          </div>

          {/* Sat */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-tertiary-fixed text-on-tertiary-fixed shadow-sm">
            <div className="flex items-center gap-2.5 min-w-[100px]">
              <span className="material-symbols-outlined text-[20px] text-tertiary">rainy</span>
              <div className="flex flex-col">
                <span className="font-label-md text-label-md text-on-tertiary-fixed font-bold">Sat</span>
                <span className="font-body-sm text-body-sm text-on-tertiary-fixed-variant">26° / 19°</span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-on-tertiary-fixed-variant font-label-sm text-label-sm font-bold">
              <span className="material-symbols-outlined text-[15px] text-tertiary">water_drop</span> 85%
            </div>
            <span className="px-2.5 py-1 rounded-full bg-tertiary text-on-tertiary font-label-sm text-label-sm flex items-center gap-1 font-semibold">
              <span className="material-symbols-outlined text-[14px]">block</span> Skip (Rain)
            </span>
          </div>

          {/* Sun */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-surface-container-lowest">
            <div className="flex items-center gap-2.5 min-w-[100px]">
              <span className="material-symbols-outlined text-[20px] text-tertiary">rainy_light</span>
              <div className="flex flex-col">
                <span className="font-label-md text-label-md text-on-surface">Sun</span>
                <span className="font-body-sm text-body-sm text-on-surface-variant">27° / 19°</span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-on-surface-variant font-label-sm text-label-sm">
              <span className="material-symbols-outlined text-[15px] text-tertiary">water_drop</span> 60%
            </div>
            <span className="px-2.5 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant font-label-sm text-label-sm font-semibold">
              Skip
            </span>
          </div>

          {/* Mon */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-surface-container-lowest">
            <div className="flex items-center gap-2.5 min-w-[100px]">
              <span className="material-symbols-outlined text-[20px] text-secondary">sunny</span>
              <div className="flex flex-col">
                <span className="font-label-md text-label-md text-on-surface">Mon</span>
                <span className="font-body-sm text-body-sm text-on-surface-variant">29° / 20°</span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-on-surface-variant font-label-sm text-label-sm">
              <span className="material-symbols-outlined text-[15px] text-tertiary">water_drop</span> 15%
            </div>
            <span className="px-2.5 py-1 rounded-full bg-surface-container-high text-on-secondary-fixed-variant font-label-sm text-label-sm">
              Normal
            </span>
          </div>

          {/* Tue */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-surface-container-lowest">
            <div className="flex items-center gap-2.5 min-w-[100px]">
              <span className="material-symbols-outlined text-[20px] text-secondary">wb_sunny</span>
              <div className="flex flex-col">
                <span className="font-label-md text-label-md text-on-surface">Tue</span>
                <span className="font-body-sm text-body-sm text-on-surface-variant">30° / 21°</span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-on-surface-variant font-label-sm text-label-sm">
              <span className="material-symbols-outlined text-[15px] text-tertiary">water_drop</span> 10%
            </div>
            <span className="px-2.5 py-1 rounded-full bg-surface-container-high text-on-secondary-fixed-variant font-label-sm text-label-sm">
              Normal
            </span>
          </div>
        </div>
      </div>

      {/* In-situ LoRaWAN Stations */}
      <div className="p-space-md rounded-2xl bg-surface-container flex items-center justify-between border border-surface-container-high/60">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-full bg-surface-container-lowest flex items-center justify-center text-primary shadow-sm">
            <span className="material-symbols-outlined text-[22px]">sensors</span>
          </div>
          <div className="flex flex-col">
            <span className="font-label-md text-label-md text-primary font-bold">In-situ LoRaWAN Stations</span>
            <span className="font-body-sm text-body-sm text-on-surface-variant">
              {calibrated ? '4 nodes recalibrated successfully' : '4 active nodes in Sector 4'}
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={handleCalibrate}
          className="px-3 py-1.5 rounded-xl bg-primary text-on-primary font-label-sm text-label-sm shadow-sm active:scale-95 transition-all font-semibold"
        >
          {calibrated ? 'Calibrated' : 'Calibrate'}
        </button>
      </div>
    </div>
  );
}
