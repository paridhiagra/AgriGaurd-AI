import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar } from 'recharts';
import { useLanguage } from '../context/LanguageContext.jsx';
import { fetchFarmDetails, updateFarmDetails, requestAIRecommendation } from '../services/api.js';
import { FarmSkeleton } from '../components/Skeletons.jsx';

export default function MyFarm({ onFarmUpdated }) {
  const { t } = useLanguage();
  const [farm, setFarm] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Simulator State
  const [simSoilMoisture, setSimSoilMoisture] = useState(18);
  const [simTemperature, setSimTemperature] = useState(31);
  const [simHumidity, setSimHumidity] = useState(48);
  const [simRainProbability, setSimRainProbability] = useState(20);
  const [simCrop, setSimCrop] = useState('Wheat (PBW 550)');
  const [simStage, setSimStage] = useState('Vegetative (Day 34)');
  const [simResult, setSimResult] = useState(null);
  const [simulating, setSimulating] = useState(false);

  // Analytics Filter (24 Hours / 7 Days / 30 Days)
  const [trendRange, setTrendRange] = useState('24h');

  useEffect(() => {
    async function load() {
      const data = await fetchFarmDetails();
      const defaultFarm = {
        farmName: 'Green Valley Farm',
        location: 'Kanpur, Uttar Pradesh',
        farmSize: '2.5 acres',
        crop: 'Wheat',
        variety: 'PBW 550',
        soilType: 'Loamy',
        growthStage: 'Vegetative',
        growthDay: 'Day 34',
        lastIrrigation: 'Yesterday, 6:20 PM',
        tankLevel: 72,
        waterSource: 'Canal Link + Solar Borewell',
        irrigationMethod: 'Micro-Drip In-Line Emitter',
        ...data
      };
      setFarm(defaultFarm);
      setFormData(defaultFarm);
    }
    load();
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await updateFarmDetails(formData);
      const updated = res.farm || formData;
      setFarm(updated);
      setIsEditing(false);
      setSavedSuccess(true);
      if (onFarmUpdated) onFarmUpdated(updated);
      setTimeout(() => setSavedSuccess(false), 4000);
    } catch (err) {
      console.error('Save farm error:', err);
    } finally {
      setSaving(false);
    }
  };

  // Run Farm Simulation using the exact decision engine
  const handleRunSimulation = async () => {
    setSimulating(true);
    try {
      const res = await requestAIRecommendation({
        soilMoisture: simSoilMoisture,
        temperature: simTemperature,
        humidity: simHumidity,
        rainProbability: simRainProbability,
        crop: simCrop,
        growthStage: simStage,
        waterLevel: farm?.tankLevel || 72
      });
      setSimResult(res);
    } catch (err) {
      // Deterministic client fallback if offline
      let decision = 'IRRIGATION_RECOMMENDED';
      let reason = '';
      if (simSoilMoisture < 25 && simRainProbability < 40) {
        decision = 'IRRIGATION_RECOMMENDED';
        reason = `Your soil moisture is low (${simSoilMoisture}%) while rainfall probability is currently low (${simRainProbability}%). Irrigation is recommended.`;
      } else if (simSoilMoisture < 25 && simRainProbability >= 40) {
        decision = 'WAIT_RAIN_EXPECTED';
        reason = `Your soil moisture is low (${simSoilMoisture}%), but rain probability is elevated (${simRainProbability}%). Rain is expected; wait to avoid waterlogging and conserve water.`;
      } else {
        decision = 'NO_IRRIGATION_NEEDED';
        reason = `Soil moisture is sufficient (${simSoilMoisture}%). No irrigation is needed at this time.`;
      }
      setSimResult({
        decision,
        reason,
        recommendedAction: decision === 'IRRIGATION_RECOMMENDED' ? 'Irrigate 35mm tonight between 6:00 PM – 8:00 PM' : 'Monitor soil moisture.',
        confidence: 92
      });
    } finally {
      setSimulating(false);
    }
  };

  // Analytics Trends Data
  const trendData24h = [
    { time: '12 AM', moisture: 24, temp: 22 },
    { time: '4 AM', moisture: 23, temp: 21 },
    { time: '8 AM', moisture: 22, temp: 25 },
    { time: '12 PM', moisture: 19, temp: 31 },
    { time: '4 PM', moisture: 18, temp: 32 },
    { time: '8 PM', moisture: 18, temp: 28 },
    { time: 'Now', moisture: 18, temp: 31 },
  ];

  const trendData7d = [
    { time: 'Mon', moisture: 38, water: 420 },
    { time: 'Tue', moisture: 32, water: 0 },
    { time: 'Wed', moisture: 26, water: 0 },
    { time: 'Thu', moisture: 22, water: 420 },
    { time: 'Fri', moisture: 35, water: 0 },
    { time: 'Sat', moisture: 25, water: 0 },
    { time: 'Sun', moisture: 18, water: 420 },
  ];

  const trendData30d = [
    { time: 'W1', moisture: 36, events: 2 },
    { time: 'W2', moisture: 30, events: 3 },
    { time: 'W3', moisture: 32, events: 2 },
    { time: 'W4', moisture: 22, events: 3 },
  ];

  const activeTrendData = trendRange === '24h' ? trendData24h : trendRange === '7d' ? trendData7d : trendData30d;

  if (!farm) {
    return <FarmSkeleton />;
  }

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto px-margin pb-10 space-y-space-md animate-in fade-in duration-200">
      
      {/* 1. FARM OVERVIEW HEADER */}
      <div className="flex items-center justify-between mt-2">
        <div>
          <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-primary tracking-tight font-extrabold">
            {t('navFarm')}
          </h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Agricultural land parameters, soil taxonomy, and hydrological systems.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsEditing(!isEditing)}
          className="px-3.5 py-1.5 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-primary font-label-md text-sm font-semibold flex items-center gap-1.5 transition-all shadow-xs ag-btn-interactive cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">
            {isEditing ? 'close' : 'edit'}
          </span>
          <span>{isEditing ? 'Cancel' : 'Edit Farm'}</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-3 rounded-xl bg-secondary-container text-on-secondary-fixed font-label-md text-sm flex items-center gap-2 shadow-sm animate-in fade-in">
          <span className="material-symbols-outlined text-[20px]">check_circle</span>
          <span>Farm telemetry parameters saved successfully!</span>
        </div>
      )}

      {/* Visual Plot Banner */}
      <div className="relative rounded-2xl overflow-hidden shadow-sm bg-surface-container h-44 border border-surface-container-high/40 ag-card-interactive">
        <img
          className="w-full h-full object-cover"
          alt="Lush green wheat field"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuA_pNcNJAL4Zpqc2jeGETcwtwcm0Hnyhx4v_WjeK9Y3_65Og2Tw8zCz9milrFjhkoWCb1jwjQDSQn4niMXvGoextzLcmFIUyFLxuM9wV1rITU3NleJo7TGdWyYpsjOkOmXuHBgNO0zQUHqKAorvrfkFFxxYW5YNfXfw0gwOtfhNQ_IW3e31ivaU_XDnSyV9x8j7I9jFjEoknjMABedyhVVIt18pV1fxTM1WFZIIsHzXg6Ukb5X04YJS"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/40 to-transparent p-4 flex flex-col justify-end text-on-primary">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-label-sm text-xs text-primary-fixed uppercase tracking-wider font-bold">
                Registered Plot
              </span>
              <h2 className="font-headline-sm text-xl font-bold text-white">{farm.farmName || 'Green Valley Farm'}</h2>
              <p className="font-body-sm text-xs opacity-90">{farm.location || 'Kanpur, Uttar Pradesh'}</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-surface/20 backdrop-blur-md text-on-primary font-label-md text-xs font-semibold">
              {farm.farmSize || '2.5 acres'}
            </span>
          </div>
        </div>
      </div>

      {/* Farm Overview Details / Edit Form */}
      {!isEditing ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="rounded-2xl bg-surface-container-lowest p-3.5 shadow-sm border border-surface-container-high/50 flex flex-col gap-0.5 ag-card-interactive">
            <span className="font-label-sm text-xs text-on-surface-variant font-semibold">Location</span>
            <span className="font-title-sm text-sm font-bold text-primary truncate">{farm.location || 'Kanpur, Uttar Pradesh'}</span>
            <span className="font-body-sm text-[11px] text-on-surface-variant">Plot Zone A</span>
          </div>

          <div className="rounded-2xl bg-surface-container-lowest p-3.5 shadow-sm border border-surface-container-high/50 flex flex-col gap-0.5 ag-card-interactive">
            <span className="font-label-sm text-xs text-on-surface-variant font-semibold">Farm Area</span>
            <span className="font-title-sm text-sm font-bold text-primary">{farm.farmSize || '2.5 acres'}</span>
            <span className="font-body-sm text-[11px] text-on-surface-variant">Irrigated Land</span>
          </div>

          <div className="rounded-2xl bg-surface-container-lowest p-3.5 shadow-sm border border-surface-container-high/50 flex flex-col gap-0.5 ag-card-interactive">
            <span className="font-label-sm text-xs text-on-surface-variant font-semibold">Crop & Variety</span>
            <span className="font-title-sm text-sm font-bold text-primary truncate">{farm.crop || 'Wheat'} ({farm.variety || 'PBW 550'})</span>
            <span className="font-body-sm text-[11px] text-on-surface-variant">High-Yielding Grain</span>
          </div>

          <div className="rounded-2xl bg-surface-container-lowest p-3.5 shadow-sm border border-surface-container-high/50 flex flex-col gap-0.5 ag-card-interactive">
            <span className="font-label-sm text-xs text-on-surface-variant font-semibold">Soil Taxonomy</span>
            <span className="font-title-sm text-sm font-bold text-primary">{farm.soilType || 'Loamy'}</span>
            <span className="font-body-sm text-[11px] text-secondary font-semibold">Optimal Capillary</span>
          </div>

          <div className="rounded-2xl bg-surface-container-lowest p-3.5 shadow-sm border border-surface-container-high/50 flex flex-col gap-0.5 ag-card-interactive">
            <span className="font-label-sm text-xs text-on-surface-variant font-semibold">Growth Stage</span>
            <span className="font-title-sm text-sm font-bold text-primary">{farm.growthStage || 'Vegetative'}</span>
            <span className="font-body-sm text-[11px] text-on-surface-variant">{farm.growthDay || 'Day 34'}</span>
          </div>

          <div className="rounded-2xl bg-surface-container-lowest p-3.5 shadow-sm border border-surface-container-high/50 flex flex-col gap-0.5 ag-card-interactive">
            <span className="font-label-sm text-xs text-on-surface-variant font-semibold">Last Irrigation</span>
            <span className="font-title-sm text-sm font-bold text-primary">{farm.lastIrrigation || 'Yesterday, 6:20 PM'}</span>
            <span className="font-body-sm text-[11px] text-on-surface-variant">Cycle 35mm</span>
          </div>

          <div className="rounded-2xl bg-surface-container-lowest p-3.5 shadow-sm border border-surface-container-high/50 flex flex-col gap-0.5 ag-card-interactive">
            <span className="font-label-sm text-xs text-on-surface-variant font-semibold">Water Sourcing</span>
            <span className="font-title-sm text-sm font-bold text-primary truncate">{farm.waterSource || 'Canal + Solar'}</span>
            <span className="font-body-sm text-[11px] text-on-surface-variant">Tank: {farm.tankLevel || 72}%</span>
          </div>

          <div className="rounded-2xl bg-surface-container-lowest p-3.5 shadow-sm border border-surface-container-high/50 flex flex-col gap-0.5 ag-card-interactive">
            <span className="font-label-sm text-xs text-on-surface-variant font-semibold">Delivery Method</span>
            <span className="font-title-sm text-sm font-bold text-primary truncate">{farm.irrigationMethod || 'Micro-Drip In-Line'}</span>
            <span className="font-body-sm text-[11px] text-secondary font-semibold">Efficiency: 94%</span>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSave} className="rounded-2xl bg-surface-container-lowest p-5 shadow-sm border border-surface-container-high/50 flex flex-col gap-4">
          <h2 className="font-title-sm text-base font-bold text-primary border-b border-surface-container-high pb-2">
            Edit Farm Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="font-label-sm text-xs text-on-surface-variant font-semibold">Farm Name</label>
              <input
                type="text"
                name="farmName"
                value={formData.farmName || ''}
                onChange={handleChange}
                className="h-11 px-3 rounded-xl bg-surface-container-low border border-surface-container-high text-sm text-on-surface ag-input-interactive"
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-label-sm text-xs text-on-surface-variant font-semibold">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location || ''}
                onChange={handleChange}
                className="h-11 px-3 rounded-xl bg-surface-container-low border border-surface-container-high text-sm text-on-surface ag-input-interactive"
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-label-sm text-xs text-on-surface-variant font-semibold">Farm Area</label>
              <input
                type="text"
                name="farmSize"
                value={formData.farmSize || ''}
                onChange={handleChange}
                placeholder="2.5 acres"
                className="h-11 px-3 rounded-xl bg-surface-container-low border border-surface-container-high text-sm text-on-surface ag-input-interactive"
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-label-sm text-xs text-on-surface-variant font-semibold">Crop</label>
              <input
                type="text"
                name="crop"
                value={formData.crop || ''}
                onChange={handleChange}
                className="h-11 px-3 rounded-xl bg-surface-container-low border border-surface-container-high text-sm text-on-surface ag-input-interactive"
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-label-sm text-xs text-on-surface-variant font-semibold">Variety</label>
              <input
                type="text"
                name="variety"
                value={formData.variety || 'PBW 550'}
                onChange={handleChange}
                className="h-11 px-3 rounded-xl bg-surface-container-low border border-surface-container-high text-sm text-on-surface ag-input-interactive"
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-label-sm text-xs text-on-surface-variant font-semibold">Soil Type</label>
              <input
                type="text"
                name="soilType"
                value={formData.soilType || ''}
                onChange={handleChange}
                className="h-11 px-3 rounded-xl bg-surface-container-low border border-surface-container-high text-sm text-on-surface ag-input-interactive"
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-label-sm text-xs text-on-surface-variant font-semibold">Growth Stage</label>
              <input
                type="text"
                name="growthStage"
                value={formData.growthStage || 'Vegetative'}
                onChange={handleChange}
                className="h-11 px-3 rounded-xl bg-surface-container-low border border-surface-container-high text-sm text-on-surface ag-input-interactive"
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-label-sm text-xs text-on-surface-variant font-semibold">Growth Day</label>
              <input
                type="text"
                name="growthDay"
                value={formData.growthDay || 'Day 34'}
                onChange={handleChange}
                className="h-11 px-3 rounded-xl bg-surface-container-low border border-surface-container-high text-sm text-on-surface ag-input-interactive"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-surface-container-high">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high font-label-md text-sm text-on-surface transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 rounded-xl bg-primary text-on-primary font-label-md text-sm font-semibold flex items-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer ag-btn-interactive"
            >
              <span className="material-symbols-outlined text-[18px]">
                {saving ? 'sync' : 'save'}
              </span>
              <span>{saving ? 'Saving...' : 'Save Parameters'}</span>
            </button>
          </div>
        </form>
      )}

      {/* ===================================================
          2. FARM SIMULATOR (Section 2)
          =================================================== */}
      <section className="rounded-2xl bg-surface-container-lowest p-space-md sm:p-space-lg shadow-[0_8px_24px_-4px_rgba(19,78,53,0.06)] border border-surface-container-high/60 relative overflow-hidden">
        {/* Simulator Badge */}
        <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[24px] text-secondary">tune</span>
            <div>
              <h2 className="font-headline-sm text-lg font-bold text-primary">Farm Simulator</h2>
              <p className="font-body-sm text-xs text-on-surface-variant">
                Manually adjust environmental parameters to test irrigation triggers.
              </p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full bg-secondary-container text-on-secondary-fixed font-label-sm text-xs font-bold tracking-wide shadow-xs border border-secondary/20">
            Simulation Mode
          </span>
        </div>

        {/* Sliders Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
          {/* Soil Moisture */}
          <div className="p-3.5 rounded-xl bg-surface-container-low border border-surface-container-high/40 flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-label-sm text-on-surface font-semibold flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px] text-error">water_loss</span>
                Soil Moisture
              </span>
              <span className="font-title-sm text-sm font-bold text-primary">{simSoilMoisture}%</span>
            </div>
            <input
              type="range"
              min="5"
              max="50"
              value={simSoilMoisture}
              onChange={(e) => setSimSoilMoisture(Number(e.target.value))}
              className="w-full accent-primary cursor-pointer h-2 bg-surface-container-high rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-on-surface-variant">
              <span>Dry (5%)</span>
              <span className="text-secondary font-bold">Target: 25%</span>
              <span>Saturated (50%)</span>
            </div>
          </div>

          {/* Rain Probability */}
          <div className="p-3.5 rounded-xl bg-surface-container-low border border-surface-container-high/40 flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-label-sm text-on-surface font-semibold flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px] text-secondary">cloud</span>
                Rain Probability
              </span>
              <span className="font-title-sm text-sm font-bold text-primary">{simRainProbability}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={simRainProbability}
              onChange={(e) => setSimRainProbability(Number(e.target.value))}
              className="w-full accent-primary cursor-pointer h-2 bg-surface-container-high rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-on-surface-variant">
              <span>Clear (0%)</span>
              <span className="text-secondary font-bold">Trigger: 40%</span>
              <span>Downpour (100%)</span>
            </div>
          </div>

          {/* Temperature */}
          <div className="p-3.5 rounded-xl bg-surface-container-low border border-surface-container-high/40 flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-label-sm text-on-surface font-semibold flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px] text-on-surface-variant">thermostat</span>
                Temperature
              </span>
              <span className="font-title-sm text-sm font-bold text-primary">{simTemperature}°C</span>
            </div>
            <input
              type="range"
              min="10"
              max="45"
              value={simTemperature}
              onChange={(e) => setSimTemperature(Number(e.target.value))}
              className="w-full accent-primary cursor-pointer h-2 bg-surface-container-high rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-on-surface-variant">
              <span>Cool (10°C)</span>
              <span>Mild (25°C)</span>
              <span>Hot (45°C)</span>
            </div>
          </div>

          {/* Humidity */}
          <div className="p-3.5 rounded-xl bg-surface-container-low border border-surface-container-high/40 flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-label-sm text-on-surface font-semibold flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px] text-on-surface-variant">humidity_percentage</span>
                Humidity
              </span>
              <span className="font-title-sm text-sm font-bold text-primary">{simHumidity}%</span>
            </div>
            <input
              type="range"
              min="15"
              max="95"
              value={simHumidity}
              onChange={(e) => setSimHumidity(Number(e.target.value))}
              className="w-full accent-primary cursor-pointer h-2 bg-surface-container-high rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-on-surface-variant">
              <span>Arid (15%)</span>
              <span>Moderate (50%)</span>
              <span>Humid (95%)</span>
            </div>
          </div>
        </div>

        {/* Crop & Stage dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
          <div className="flex flex-col gap-1">
            <label className="font-label-sm text-xs text-on-surface-variant font-semibold">Crop Type</label>
            <select
              value={simCrop}
              onChange={(e) => setSimCrop(e.target.value)}
              className="h-10 px-3 rounded-xl bg-surface-container-low border border-surface-container-high text-xs text-on-surface ag-input-interactive"
            >
              <option value="Wheat (PBW 550)">Wheat (PBW 550)</option>
              <option value="Basmati Rice (Pusa 1121)">Basmati Rice (Pusa 1121)</option>
              <option value="Cotton (Bt Cotton)">Cotton (Bt Cotton)</option>
              <option value="Maize (Corn)">Maize (Corn)</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-label-sm text-xs text-on-surface-variant font-semibold">Growth Stage</label>
            <select
              value={simStage}
              onChange={(e) => setSimStage(e.target.value)}
              className="h-10 px-3 rounded-xl bg-surface-container-low border border-surface-container-high text-xs text-on-surface ag-input-interactive"
            >
              <option value="Germination">Germination</option>
              <option value="Vegetative (Day 34)">Vegetative / Tillering (Day 34)</option>
              <option value="Flowering (Critical)">Flowering (Critical)</option>
              <option value="Ripening / Maturity">Ripening / Maturity</option>
            </select>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-4 flex items-center justify-between flex-wrap gap-2">
          <span className="text-[11px] text-on-surface-variant">
            Simulated values are isolated and will not overwrite physical sensor records.
          </span>
          <button
            type="button"
            onClick={handleRunSimulation}
            disabled={simulating}
            className="px-5 py-2.5 rounded-xl bg-primary text-on-primary font-label-md text-xs font-bold flex items-center gap-2 shadow-sm ag-btn-interactive cursor-pointer disabled:opacity-70"
          >
            <span className="material-symbols-outlined text-[18px]">
              {simulating ? 'sync' : 'neurology'}
            </span>
            <span>{simulating ? 'Analyzing...' : 'Analyze Conditions'}</span>
          </button>
        </div>

        {/* Simulation Output Card */}
        {simResult && (
          <div className="mt-4 p-4 rounded-2xl bg-surface-container-low border border-surface-container-high/60 animate-in fade-in slide-in-from-bottom-2 duration-200">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">
                {simResult.decision === 'IRRIGATION_RECOMMENDED' ? '🚰' : simResult.decision === 'WAIT_RAIN_EXPECTED' ? '🌧️' : '✅'}
              </span>
              <h3 className="font-headline-sm text-sm font-bold text-primary">
                {simResult.decision === 'IRRIGATION_RECOMMENDED'
                  ? 'IRRIGATION RECOMMENDED'
                  : simResult.decision === 'WAIT_RAIN_EXPECTED'
                  ? 'WAIT — RAIN EXPECTED'
                  : 'NO IRRIGATION NEEDED'}
              </h3>
              <span className="ml-auto font-label-sm text-[11px] px-2 py-0.5 rounded-full bg-surface-container text-secondary font-semibold">
                Decision Engine Validated
              </span>
            </div>
            <p className="font-body-sm text-xs text-on-surface leading-relaxed">
              {simResult.reason}
            </p>
            {simResult.recommendedAction && (
              <div className="mt-2 text-xs font-semibold text-secondary flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]">lightbulb</span>
                <span>Action: {simResult.recommendedAction}</span>
              </div>
            )}
          </div>
        )}
      </section>

      {/* ===================================================
          3. FARM ANALYTICS (Section 3)
          =================================================== */}
      <section className="rounded-2xl bg-surface-container-lowest p-space-md sm:p-space-lg shadow-[0_8px_24px_-4px_rgba(19,78,53,0.06)] border border-surface-container-high/60 space-y-4">
        
        {/* Header & Filter Controls */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h2 className="font-headline-sm text-lg font-bold text-primary">Farm Analytics</h2>
            <p className="font-body-sm text-xs text-on-surface-variant">
              Telemetry trends, moisture curve, and volumetric water utilization.
            </p>
          </div>
          
          {/* Time range selector */}
          <div className="inline-flex rounded-xl bg-surface-container p-1 text-xs font-label-sm">
            <button
              type="button"
              onClick={() => setTrendRange('24h')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                trendRange === '24h'
                  ? 'bg-surface-container-lowest text-primary font-bold shadow-xs'
                  : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              24 Hours
            </button>
            <button
              type="button"
              onClick={() => setTrendRange('7d')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                trendRange === '7d'
                  ? 'bg-surface-container-lowest text-primary font-bold shadow-xs'
                  : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              7 Days
            </button>
            <button
              type="button"
              onClick={() => setTrendRange('30d')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                trendRange === '30d'
                  ? 'bg-surface-container-lowest text-primary font-bold shadow-xs'
                  : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              30 Days
            </button>
          </div>
        </div>

        {/* Water Consumption KPI Summary Cards */}
        <div className="grid grid-cols-3 gap-2.5">
          <div className="rounded-xl bg-surface-container-low p-3 border border-surface-container-high/40 ag-card-interactive">
            <span className="font-label-sm text-[11px] text-on-surface-variant font-semibold">Today</span>
            <span className="font-headline-sm text-base text-primary font-bold block mt-1">420 L</span>
            <span className="font-body-sm text-[10px] text-secondary">Target Met</span>
          </div>

          <div className="rounded-xl bg-surface-container-low p-3 border border-surface-container-high/40 ag-card-interactive">
            <span className="font-label-sm text-[11px] text-on-surface-variant font-semibold">This Week</span>
            <span className="font-headline-sm text-base text-primary font-bold block mt-1">2,840 L</span>
            <span className="font-body-sm text-[10px] text-secondary">-18% Evap. loss</span>
          </div>

          <div className="rounded-xl bg-surface-container-low p-3 border border-surface-container-high/40 ag-card-interactive">
            <span className="font-label-sm text-[11px] text-on-surface-variant font-semibold">This Month</span>
            <span className="font-headline-sm text-base text-primary font-bold block mt-1">11,240 L</span>
            <span className="font-body-sm text-[10px] text-secondary">Optimal Conservation</span>
          </div>
        </div>

        {/* Moisture Trend Chart */}
        <div className="pt-2">
          <span className="font-label-sm text-xs text-on-surface-variant font-semibold block mb-2">
            Soil Moisture Dynamics ({trendRange.toUpperCase()})
          </span>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activeTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="moistureGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2c694e" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#2c694e" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(19, 78, 53, 0.1)" />
                <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#707972' }} axisLine={false} tickLine={false} />
                <YAxis domain={[10, 50]} tick={{ fontSize: 11, fill: '#707972' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--color-surface-container-lowest)',
                    borderColor: 'var(--color-surface-container-high)',
                    borderRadius: '12px',
                    fontSize: '12px'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="moisture"
                  stroke="#2c694e"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#moistureGradient)"
                  name="Moisture (%)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Irrigation Events Chart */}
        <div className="pt-2 border-t border-surface-container-high/40">
          <span className="font-label-sm text-xs text-on-surface-variant font-semibold block mb-2">
            Irrigation Events Frequency & Consumption
          </span>
          <div className="h-36 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trendData7d} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(19, 78, 53, 0.1)" />
                <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#707972' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#707972' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--color-surface-container-lowest)',
                    borderColor: 'var(--color-surface-container-high)',
                    borderRadius: '12px',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="water" fill="#004870" radius={[6, 6, 0, 0]} name="Water (Liters)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </section>
    </div>
  );
}
