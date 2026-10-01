import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { requestAIRecommendation, saveHistoryRecord } from '../services/api.js';

export default function AIDecisions({ farmData, onOpenCopilot }) {
  const { t } = useLanguage();

  // Simulator State
  const [moisture, setMoisture] = useState(18);
  const [rain, setRain] = useState(20);
  const [temp, setTemp] = useState(31);
  const [humidity, setHumidity] = useState(48);
  const [tank, setTank] = useState(72);
  const [crop, setCrop] = useState('wheat');
  const [stage, setStage] = useState('flowering');
  const [activePreset, setActivePreset] = useState('dry');

  // Simulated AI Output
  const [simOutput, setSimOutput] = useState({
    decision: 'IRRIGATION_RECOMMENDED',
    confidence: 96,
    headline: 'IRRIGATION RECOMMENDED',
    badgeLabel: 'Critical Water Deficit',
    icon: 'water_drop',
    explanation: 'Root moisture level (18%) is below optimal limit for wheat during the flowering stage. Low rain chance (20%) requires active replenishment.',
    styleClass: 'bg-error-container text-on-error-container'
  });

  const [applied, setApplied] = useState(false);

  // Recalculate Simulator Output
  useEffect(() => {
    let decision = 'IRRIGATION_RECOMMENDED';
    let headline = 'IRRIGATION RECOMMENDED';
    let badgeLabel = 'Critical Water Deficit';
    let icon = 'water_drop';
    let confidence = 92 + (moisture % 6);
    let styleClass = 'bg-error-container text-on-error-container';
    let explanation = '';

    const cropName = crop === 'wheat' ? 'wheat' : crop === 'rice' ? 'rice' : crop === 'cotton' ? 'cotton' : 'maize';
    const tankWarn = tank < 30 ? ` Warning: Main storage tank is low (${tank}%).` : '';

    if (rain >= 55 || (moisture < 25 && rain >= 40)) {
      decision = 'WAIT_RAIN_EXPECTED';
      headline = 'WAIT — RAIN EXPECTED';
      badgeLabel = 'Forecast Precaution';
      confidence = 88 + (rain % 10);
      icon = 'water_voc';
      styleClass = 'bg-tertiary-fixed text-on-tertiary-fixed border border-tertiary/20';
      explanation = `Meteorological radar shows ${rain}% chance of substantial precipitation. Irrigating now risks root waterlogging and excessive leaching. Keep valves locked.`;
    } else if (moisture < 25) {
      decision = 'IRRIGATION_RECOMMENDED';
      headline = 'IRRIGATION RECOMMENDED';
      badgeLabel = 'Critical Water Deficit';
      confidence = 92 + (moisture % 6);
      icon = 'water_drop';
      styleClass = 'bg-error-container text-on-error-container';
      explanation = `Root moisture level (${moisture}%) is below optimal limit for ${cropName} during the ${stage} stage. Low rain chance (${rain}%) requires active replenishment.${tankWarn}`;
    } else {
      decision = 'NO_IRRIGATION_NEEDED';
      headline = 'NO IRRIGATION NEEDED';
      badgeLabel = 'Hydrological Balance';
      confidence = 94 + (moisture % 5);
      icon = 'check_circle';
      styleClass = 'bg-secondary-container text-on-secondary-fixed border border-secondary/20';
      explanation = `Field capacity is well-balanced at ${moisture}% for ${cropName}. Evaporation rate is nominal at ${temp}°C and current soil capillary tension remains healthy.`;
    }

    setSimOutput({
      decision,
      headline,
      badgeLabel,
      confidence,
      icon,
      styleClass,
      explanation
    });
  }, [moisture, rain, temp, humidity, tank, crop, stage]);

  const handleApplyPreset = (preset) => {
    setActivePreset(preset);
    if (preset === 'dry') {
      setMoisture(18);
      setRain(20);
      setTemp(34);
      setHumidity(40);
      setTank(75);
      setCrop('wheat');
      setStage('flowering');
    } else if (preset === 'rain') {
      setMoisture(26);
      setRain(85);
      setTemp(24);
      setHumidity(82);
      setTank(60);
      setCrop('wheat');
      setStage('vegetative');
    } else if (preset === 'optimal') {
      setMoisture(36);
      setRain(15);
      setTemp(28);
      setHumidity(55);
      setTank(90);
      setCrop('wheat');
      setStage('filling');
    }
  };

  const handleReset = () => {
    setActivePreset('dry');
    setMoisture(18);
    setRain(20);
    setTemp(31);
    setHumidity(48);
    setTank(72);
    setCrop('wheat');
    setStage('flowering');
  };

  const handleApplyRecommendation = async () => {
    setApplied(true);
    await saveHistoryRecord({
      soilMoisture: moisture,
      temperature: temp,
      humidity,
      rainProbability: rain,
      crop: farmData?.crop || 'Wheat (PBW 550)',
      growthStage: stage,
      decision: simOutput.decision,
      reason: simOutput.explanation,
      recommendedAction: 'Schedule 45m deep drip cycle via LoRaWAN station.',
      farmerAction: 'Applied via Condition Simulator',
      status: 'Scheduled (45m)'
    });
    setTimeout(() => setApplied(false), 4000);
  };

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto pb-6 animate-in fade-in duration-200">
      <div className="px-margin pt-space-sm pb-space-lg flex flex-col gap-space-md">
        {/* Page Title & Micro Status */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container-high text-on-secondary-fixed-variant font-label-sm text-label-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>
              {t('activeDecisionMatrix')}
            </span>
            <span className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">update</span>
              8m ago
            </span>
          </div>
          <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-primary tracking-tight font-extrabold mt-1">
            {t('navAiDecisions')}
          </h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Understand what your farm data means and simulate micro-climate conditions in real-time.
          </p>
        </div>

        {/* Active Recommendation Card (Decision Anchor) */}
        <div className="bg-surface-container-lowest rounded-2xl p-space-md shadow-[0_12px_32px_-4px_rgba(19,78,53,0.08)] border border-surface-container-high/50 flex flex-col gap-space-sm relative overflow-hidden">
          {/* Top Soft Tint Header Bar */}
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-container text-on-secondary-fixed font-label-sm text-label-sm font-semibold">
              <span className="material-symbols-outlined text-[15px] text-secondary">verified_user</span>
              <span>AI Engine: High Confidence 96%</span>
            </div>
            <span className="font-label-sm text-label-sm text-on-surface-variant">Zone 1 • Root Depth 25cm</span>
          </div>

          {/* Action Core */}
          <div className="flex items-start gap-space-sm pt-1">
            <div className="w-12 h-12 rounded-xl bg-error-container text-error flex items-center justify-center flex-shrink-0 shadow-sm">
              <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                water_drop
              </span>
            </div>
            <div className="flex flex-col min-w-0">
              <div className="font-label-sm text-label-sm text-error uppercase tracking-wider font-bold">
                Action Directive
              </div>
              <h2 className="font-headline-sm text-headline-sm text-primary leading-tight font-bold">
                IRRIGATION RECOMMENDED
              </h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                Soil moisture is below threshold (<strong className="text-error font-label-md">18%</strong> vs 28% optimal) and rainfall probability remains low.
              </p>
            </div>
          </div>

          {/* AI Natural-Language Reasoning Box */}
          <div className="bg-surface-container-low rounded-xl p-space-sm flex flex-col gap-1.5 border border-surface-container-high/30">
            <div className="flex items-center gap-1.5 text-primary font-label-md text-label-md font-bold">
              <span className="material-symbols-outlined text-[16px] text-secondary">psychology_alt</span>
              <span>Agronomic Rationale</span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface leading-relaxed">
              Current field conditions indicate that root-zone soil is relatively dry. Since the probability of rainfall is under 20% over the next 36 hours, withholding water could stress the wheat during its critical <em>tillering phase</em>. Consider irrigating during cooler evening hours <strong>(6:00–8:00 PM)</strong> to avoid ~30% solar evaporation loss.
            </p>
          </div>

          {/* Dual Hydrology Progress Telemetry */}
          <div className="grid grid-cols-2 gap-space-sm pt-1">
            <div className="bg-surface-container rounded-lg p-2.5 flex flex-col gap-1">
              <div className="flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm">
                <span>{t('soilSaturation')}</span>
                <span className="text-error font-bold">18%</span>
              </div>
              <div className="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden">
                <div className="bg-error h-full rounded-full" style={{ width: '18%' }}></div>
              </div>
              <span className="font-label-sm text-[10px] text-on-surface-variant">Min Target: 28%</span>
            </div>

            <div className="bg-surface-container rounded-lg p-2.5 flex flex-col gap-1">
              <div className="flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm">
                <span>{t('rainProbability')}</span>
                <span className="text-primary font-bold">20%</span>
              </div>
              <div className="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden">
                <div className="bg-secondary h-full rounded-full" style={{ width: '20%' }}></div>
              </div>
              <span className="font-label-sm text-[10px] text-on-surface-variant">48-Hr Forecast</span>
            </div>
          </div>

          {/* Action Triggers */}
          <div className="pt-2 flex flex-col gap-2">
            <button
              type="button"
              onClick={handleApplyRecommendation}
              className={`w-full h-12 rounded-xl font-label-lg text-label-lg flex items-center justify-center gap-2 active:scale-98 transition-all shadow-[0_4px_14px_rgba(19,78,53,0.25)] ${
                applied
                  ? 'bg-secondary text-on-secondary'
                  : 'bg-primary-container text-on-primary hover:bg-primary'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">
                {applied ? 'check_circle' : 'play_circle'}
              </span>
              <span>{applied ? 'Scheduled (45m Cycle Active)' : t('applyRecommendation')}</span>
            </button>

            <div className="flex items-center justify-between px-1">
              <span className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping"></span>
                Sensors synchronizing via LoRaWAN
              </span>
              <button
                type="button"
                onClick={onOpenCopilot}
                className="font-label-md text-label-md text-secondary hover:text-primary flex items-center gap-0.5 font-semibold"
              >
                <span>Manual Override</span>
                <span className="material-symbols-outlined text-[14px]">tune</span>
              </button>
            </div>
          </div>
        </div>

        {/* Farm Visual Context Tile */}
        <div className="relative rounded-2xl overflow-hidden shadow-sm bg-surface-container h-36 border border-surface-container-high/40">
          <img
            className="w-full h-full object-cover"
            alt="Expansive green wheat field in early golden hour morning with automated drip irrigation spray lines"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCLQyROsTSy2RGKvQEY_Ta6KJNyUOy_CYww6fZ124aUIJFc_r9LRCz0acNB4EQ1rqkN8WAKJSkNwiJ50bQviDeZJp7VjfeVq--OzH0D6lSEJVGkbCskD310rV403xN0MZfW3MW-52kVf38PNz38dvNuqISSMBrvFTU8Ah_8rMqiYvaisRYGN97MDx7R7k5ON1agP6uD0DKGzq6Tj0rOXpPT-K6HEEyg7UXKAW8FQ5z8QQOTIDhw-cjh"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/85 via-primary/30 to-transparent p-space-sm flex flex-col justify-end text-on-primary">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="font-label-sm text-label-sm text-primary-fixed-dim uppercase tracking-wider font-semibold">
                  Field Sector A-2
                </span>
                <span className="font-title-sm text-title-sm font-bold">Green Valley Punjab Plot</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-surface/20 backdrop-blur-md text-on-primary font-label-sm text-label-sm font-semibold">
                4.8 Hectares
              </span>
            </div>
          </div>
        </div>

        {/* Farm Condition Simulator */}
        <section
          className="bg-surface-container-lowest rounded-2xl p-space-md shadow-[0_8px_24px_-4px_rgba(19,78,53,0.06)] border border-surface-container-high/50 flex flex-col gap-space-md"
          id="simulator-section"
        >
          {/* Section Header */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[20px]">science</span>
                </div>
                <h2 className="font-headline-sm text-headline-sm text-primary font-bold">
                  {t('farmConditionSimulator')}
                </h2>
              </div>
              <button
                type="button"
                onClick={handleReset}
                className="font-label-sm text-label-sm text-on-surface-variant hover:text-error flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface-container hover:bg-error-container transition-colors font-semibold"
              >
                <span className="material-symbols-outlined text-[14px]">restart_alt</span>
                <span>{t('reset')}</span>
              </button>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              {t('simulatorSubtitle')}
            </p>
          </div>

          {/* Preset Scenarios (Quick Pills) */}
          <div className="flex flex-col gap-1.5">
            <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-bold">
              {t('quickPresets')}
            </label>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              <button
                type="button"
                onClick={() => handleApplyPreset('dry')}
                className={`whitespace-nowrap px-3.5 py-1.5 rounded-full font-label-md text-label-md flex items-center gap-1.5 transition-all shadow-sm ${
                  activePreset === 'dry'
                    ? 'bg-surface-container-high text-primary font-bold border border-primary/20'
                    : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                }`}
              >
                <span>☀️</span>
                <span>{t('drySunny')}</span>
              </button>

              <button
                type="button"
                onClick={() => handleApplyPreset('rain')}
                className={`whitespace-nowrap px-3.5 py-1.5 rounded-full font-label-md text-label-md flex items-center gap-1.5 transition-all shadow-sm ${
                  activePreset === 'rain'
                    ? 'bg-surface-container-high text-primary font-bold border border-primary/20'
                    : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                }`}
              >
                <span>🌧️</span>
                <span>{t('highRain')}</span>
              </button>

              <button
                type="button"
                onClick={() => handleApplyPreset('optimal')}
                className={`whitespace-nowrap px-3.5 py-1.5 rounded-full font-label-md text-label-md flex items-center gap-1.5 transition-all shadow-sm ${
                  activePreset === 'optimal'
                    ? 'bg-surface-container-high text-primary font-bold border border-primary/20'
                    : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                }`}
              >
                <span>🌿</span>
                <span>{t('sufficientMoisture')}</span>
              </button>
            </div>
          </div>

          {/* Real-time Dynamic AI Output Box */}
          <div className={`rounded-xl p-space-sm transition-all duration-300 flex flex-col gap-1.5 shadow-sm ${simOutput.styleClass}`}>
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-label-sm uppercase tracking-wide opacity-80 font-bold">
                {simOutput.badgeLabel}
              </span>
              <span className="font-label-sm text-label-sm font-bold bg-surface/30 px-2 py-0.5 rounded-full">
                {simOutput.confidence}% Model Agreement
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[24px]">
                {simOutput.icon}
              </span>
              <span className="font-title-md text-title-md font-bold">
                {simOutput.headline}
              </span>
            </div>
            <p className="font-body-sm text-body-sm leading-snug">
              {simOutput.explanation}
            </p>
          </div>

          {/* Crop & Stage Selector Row */}
          <div className="grid grid-cols-2 gap-space-sm">
            <div className="flex flex-col gap-1">
              <label className="font-label-sm text-label-sm text-on-surface-variant font-semibold">
                {t('cropType')}
              </label>
              <div className="relative">
                <select
                  value={crop}
                  onChange={(e) => { setCrop(e.target.value); setActivePreset(''); }}
                  className="w-full h-11 px-3 bg-surface-container-low rounded-lg font-label-md text-label-md text-on-surface appearance-none focus:outline-none border border-surface-container-high cursor-pointer"
                >
                  <option value="wheat">Wheat (HD-2967)</option>
                  <option value="rice">Rice (Basmati)</option>
                  <option value="cotton">Cotton (Bt)</option>
                  <option value="maize">Maize (Hybrid)</option>
                </select>
                <span className="material-symbols-outlined absolute right-2.5 top-2.5 pointer-events-none text-on-surface-variant text-[20px]">
                  expand_more
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-label-sm text-label-sm text-on-surface-variant font-semibold">
                {t('growthStage')}
              </label>
              <div className="relative">
                <select
                  value={stage}
                  onChange={(e) => { setStage(e.target.value); setActivePreset(''); }}
                  className="w-full h-11 px-3 bg-surface-container-low rounded-lg font-label-md text-label-md text-on-surface appearance-none focus:outline-none border border-surface-container-high cursor-pointer"
                >
                  <option value="vegetative">Vegetative / Tillering</option>
                  <option value="flowering">Flowering (Critical)</option>
                  <option value="filling">Grain Filling</option>
                  <option value="maturity">Ripening / Harvest</option>
                </select>
                <span className="material-symbols-outlined absolute right-2.5 top-2.5 pointer-events-none text-on-surface-variant text-[20px]">
                  expand_more
                </span>
              </div>
            </div>
          </div>

          {/* Sliders List */}
          <div className="flex flex-col gap-space-md pt-1">
            {/* Soil Moisture Slider */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="font-label-md text-label-md text-primary flex items-center gap-1.5 font-semibold">
                  <span className="material-symbols-outlined text-[16px] text-secondary">opacity</span>
                  {t('moisture')}
                </span>
                <span className="font-title-sm text-title-sm font-bold text-primary">
                  {moisture}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={moisture}
                onChange={(e) => { setMoisture(Number(e.target.value)); setActivePreset(''); }}
                className="w-full h-2 bg-surface-container-high rounded-lg appearance-none cursor-pointer accent-secondary"
              />
              <div className="flex justify-between font-label-sm text-[10px] text-on-surface-variant px-0.5">
                <span className="text-error font-medium">0% (Wilting)</span>
                <span className="text-secondary font-medium">28% Optimal</span>
                <span>100% (Saturated)</span>
              </div>
            </div>

            {/* Rain Probability Slider */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="font-label-md text-label-md text-primary flex items-center gap-1.5 font-semibold">
                  <span className="material-symbols-outlined text-[16px] text-tertiary">rainy</span>
                  {t('rainProbability')} (24h)
                </span>
                <span className="font-title-sm text-title-sm font-bold text-primary">
                  {rain}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={rain}
                onChange={(e) => { setRain(Number(e.target.value)); setActivePreset(''); }}
                className="w-full h-2 bg-surface-container-high rounded-lg appearance-none cursor-pointer accent-secondary"
              />
              <div className="flex justify-between font-label-sm text-[10px] text-on-surface-variant px-0.5">
                <span>0% Dry Sky</span>
                <span>50% Probable</span>
                <span className="text-secondary font-medium">100% Imminent</span>
              </div>
            </div>

            {/* Temperature Slider */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="font-label-md text-label-md text-primary flex items-center gap-1.5 font-semibold">
                  <span className="material-symbols-outlined text-[16px] text-amber-700">thermostat</span>
                  {t('ambientTemperature')}
                </span>
                <span className="font-title-sm text-title-sm font-bold text-primary">
                  {temp}°C
                </span>
              </div>
              <input
                type="range"
                min="15"
                max="45"
                value={temp}
                onChange={(e) => { setTemp(Number(e.target.value)); setActivePreset(''); }}
                className="w-full h-2 bg-surface-container-high rounded-lg appearance-none cursor-pointer accent-secondary"
              />
              <div className="flex justify-between font-label-sm text-[10px] text-on-surface-variant px-0.5">
                <span>15°C Cool</span>
                <span>30°C Seasonal</span>
                <span>45°C Extreme Heat</span>
              </div>
            </div>

            {/* Humidity & Water Tank Matrix */}
            <div className="grid grid-cols-2 gap-space-sm pt-1">
              <div className="flex flex-col gap-1.5 bg-surface-container-low p-2.5 rounded-lg border border-surface-container-high/40">
                <div className="flex items-center justify-between">
                  <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">Air Humidity</span>
                  <span className="font-label-md text-label-md font-bold text-primary">{humidity}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={humidity}
                  onChange={(e) => setHumidity(Number(e.target.value))}
                  className="w-full h-1.5 bg-surface-container-highest rounded-lg appearance-none cursor-pointer accent-secondary"
                />
              </div>

              <div className="flex flex-col gap-1.5 bg-surface-container-low p-2.5 rounded-lg border border-surface-container-high/40">
                <div className="flex items-center justify-between">
                  <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">{t('tankLevel')}</span>
                  <span className="font-label-md text-label-md font-bold text-primary">{tank}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={tank}
                  onChange={(e) => setTank(Number(e.target.value))}
                  className="w-full h-1.5 bg-surface-container-highest rounded-lg appearance-none cursor-pointer accent-secondary"
                />
              </div>
            </div>
          </div>
        </section>

        {/* AI Model Explainability & Feature Weights */}
        <div className="bg-surface-container-lowest rounded-2xl p-space-md shadow-[0_4px_20px_-2px_rgba(19,78,53,0.04)] border border-surface-container-high/50 flex flex-col gap-space-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-secondary">insights</span>
              <h3 className="font-title-sm text-title-sm text-primary font-bold">
                {t('modelDecisionWeights')}
              </h3>
            </div>
            <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">Random Forest + LSTM</span>
          </div>

          <p className="font-body-sm text-body-sm text-on-surface-variant">
            How the neural agro-engine calculates confidence for the recommendation:
          </p>

          {/* Weight Bars */}
          <div className="flex flex-col gap-2.5 pt-1">
            <div className="flex flex-col gap-1">
              <div className="flex justify-between font-label-sm text-label-sm">
                <span className="text-on-surface font-medium">Root Soil Moisture Tension</span>
                <span className="text-primary font-bold">45%</span>
              </div>
              <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
                <div className="bg-primary-container h-full rounded-full" style={{ width: '45%' }}></div>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex justify-between font-label-sm text-label-sm">
                <span className="text-on-surface font-medium">24-72h Radar Precipitation</span>
                <span className="text-primary font-bold">30%</span>
              </div>
              <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
                <div className="bg-secondary h-full rounded-full" style={{ width: '30%' }}></div>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex justify-between font-label-sm text-label-sm">
                <span className="text-on-surface font-medium">Evapotranspiration (ET₀) &amp; Temp</span>
                <span className="text-primary font-bold">15%</span>
              </div>
              <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
                <div className="bg-tertiary-container h-full rounded-full" style={{ width: '15%' }}></div>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex justify-between font-label-sm text-label-sm">
                <span className="text-on-surface font-medium">Crop Phenology &amp; Phenotype Stage</span>
                <span className="text-primary font-bold">10%</span>
              </div>
              <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
                <div className="bg-surface-tint h-full rounded-full" style={{ width: '10%' }}></div>
              </div>
            </div>
          </div>

          {/* Verification Badge */}
          <div className="mt-2 p-2.5 rounded-xl bg-surface-container-high flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[22px] text-secondary flex-shrink-0">workspace_premium</span>
            <div className="flex flex-col min-w-0">
              <span className="font-label-sm text-label-sm font-bold text-primary">
                {t('agronomistValidated')}
              </span>
              <span className="font-body-sm text-[12px] text-on-surface-variant truncate">
                Trained on local ICAR models &amp; IMD doppler radar telemetry.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
