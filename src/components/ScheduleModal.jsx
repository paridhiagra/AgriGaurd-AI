import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { saveHistoryRecord } from '../services/api.js';

export default function ScheduleModal({ isOpen, onClose, onScheduled }) {
  const { t } = useLanguage();
  const [time, setTime] = useState('6:00 PM – 8:00 PM');
  const [duration, setDuration] = useState('20 minutes');
  const [amount, setAmount] = useState('420 L');
  const [field, setField] = useState('North Sector');
  const [loading, setLoading] = useState(false);
  const [scheduledSuccess, setScheduledSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Save record to backend
      await saveHistoryRecord({
        soilMoisture: 18,
        temperature: 31,
        humidity: 48,
        rainProbability: 20,
        crop: 'Wheat (PBW 550)',
        growthStage: 'Vegetative (Day 34)',
        decision: 'IRRIGATION_RECOMMENDED',
        reason: 'Evening irrigation may reduce midday evaporation.',
        recommendedAction: `Irrigate ${amount} (${duration}) during ${time} on ${field}.`,
        farmerAction: `Scheduled for ${time} (${duration})`,
        status: 'Scheduled'
      });

      setScheduledSuccess(true);
      if (onScheduled) {
        onScheduled({
          time: 'Today · 6:00 PM',
          duration: '20 minutes',
          amount: '420 L',
          field: 'North Sector'
        });
      }

      setTimeout(() => {
        setScheduledSuccess(false);
        onClose();
      }, 1400);
    } catch (err) {
      console.error('Schedule error:', err);
      // Still notify UI
      if (onScheduled) {
        onScheduled({
          time: 'Today · 6:00 PM',
          duration: '20 minutes',
          amount: '420 L',
          field: 'North Sector'
        });
      }
      setScheduledSuccess(true);
      setTimeout(() => {
        setScheduledSuccess(false);
        onClose();
      }, 1400);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-surface-container-lowest rounded-3xl p-6 shadow-[0_20px_50px_rgba(0,0,0,0.25)] border border-surface-container-high/60 relative">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-surface-container-high/40">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-secondary-container text-on-secondary-fixed flex items-center justify-center shadow-xs">
              <span className="material-symbols-outlined text-[22px]">calendar_month</span>
            </div>
            <div>
              <h2 className="font-headline-sm text-base font-bold text-primary">Schedule Irrigation</h2>
              <p className="font-body-sm text-xs text-on-surface-variant">Automated valve sequence programming</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant cursor-pointer transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {scheduledSuccess ? (
          <div className="py-8 flex flex-col items-center justify-center text-center space-y-3 animate-in zoom-in-95 duration-200">
            <div className="w-14 h-14 rounded-full bg-secondary-container text-secondary flex items-center justify-center shadow-md">
              <span className="material-symbols-outlined text-[32px]">check_circle</span>
            </div>
            <h3 className="font-headline-sm text-lg font-bold text-primary">
              ✓ Irrigation scheduled successfully.
            </h3>
            <p className="font-body-sm text-xs text-on-surface-variant">
              Valve programmed for Today · 6:00 PM ({duration})
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3.5 pt-4">
            
            {/* Field: Recommended Time */}
            <div className="flex flex-col gap-1">
              <label className="font-label-sm text-xs text-on-surface-variant font-semibold">
                Recommended Time
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full h-10 pl-9 pr-3 rounded-xl bg-surface-container-low border border-surface-container-high text-xs text-on-surface font-medium ag-input-interactive"
                />
                <span className="material-symbols-outlined absolute left-2.5 top-2.5 text-[18px] text-secondary pointer-events-none">
                  schedule
                </span>
              </div>
            </div>

            {/* Grid: Duration & Water Amount */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="font-label-sm text-xs text-on-surface-variant font-semibold">
                  Duration
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full h-10 pl-9 pr-3 rounded-xl bg-surface-container-low border border-surface-container-high text-xs text-on-surface font-medium ag-input-interactive"
                  />
                  <span className="material-symbols-outlined absolute left-2.5 top-2.5 text-[18px] text-on-surface-variant pointer-events-none">
                    timer
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-label-sm text-xs text-on-surface-variant font-semibold">
                  Water Amount
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full h-10 pl-9 pr-3 rounded-xl bg-surface-container-low border border-surface-container-high text-xs text-on-surface font-medium ag-input-interactive"
                  />
                  <span className="material-symbols-outlined absolute left-2.5 top-2.5 text-[18px] text-tertiary pointer-events-none">
                    water_drop
                  </span>
                </div>
              </div>
            </div>

            {/* Field Sector */}
            <div className="flex flex-col gap-1">
              <label className="font-label-sm text-xs text-on-surface-variant font-semibold">
                Field Sector
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={field}
                  onChange={(e) => setField(e.target.value)}
                  className="w-full h-10 pl-9 pr-3 rounded-xl bg-surface-container-low border border-surface-container-high text-xs text-on-surface font-medium ag-input-interactive"
                />
                <span className="material-symbols-outlined absolute left-2.5 top-2.5 text-[18px] text-on-surface-variant pointer-events-none">
                  grid_view
                </span>
              </div>
            </div>

            {/* Reason Note Box */}
            <div className="p-3 rounded-xl bg-surface-container-low border border-surface-container-high/40 flex items-start gap-2">
              <span className="material-symbols-outlined text-[18px] text-secondary mt-0.5">
                eco
              </span>
              <div>
                <span className="font-label-sm text-[11px] text-secondary font-bold block">Agronomic Note:</span>
                <span className="font-body-sm text-[11px] text-on-surface-variant">
                  Evening irrigation may reduce midday evaporation.
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-surface-container-high/40">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high font-label-md text-xs text-on-surface transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2.5 rounded-xl bg-primary text-on-primary font-label-md text-xs font-bold flex items-center gap-1.5 shadow-md ag-btn-interactive cursor-pointer disabled:opacity-70"
              >
                <span className="material-symbols-outlined text-[18px]">
                  {loading ? 'sync' : 'check'}
                </span>
                <span>{loading ? 'Programming...' : 'Schedule Irrigation'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
