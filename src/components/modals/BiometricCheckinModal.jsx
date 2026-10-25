import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export default function BiometricCheckinModal() {
  const { isBiometricCheckinOpen, setIsBiometricCheckinOpen, clockInAction } = useApp();
  const [isVerifying, setIsVerifying] = useState(false);

  if (!isBiometricCheckinOpen) return null;

  const handleCheckin = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      clockInAction('Biometric Camera (Face + GPS)');
      setIsBiometricCheckinOpen(false);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-background/40 backdrop-blur-xs">
      <div className="bg-surface-container-lowest rounded-xl shadow-xl w-full max-w-md border border-surface-container-high overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="px-space-lg py-space-md bg-surface-container-low border-b border-surface-container flex items-center justify-between">
          <div className="flex items-center gap-space-sm">
            <span className="material-symbols-outlined text-secondary text-[22px]">photo_camera</span>
            <div>
              <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                Biometric Camera Verification
              </h3>
              <span className="font-label-sm text-label-sm text-outline">
                Face Telemetry &amp; GPS Geofence (150m)
              </span>
            </div>
          </div>
          <button
            onClick={() => setIsBiometricCheckinOpen(false)}
            className="text-on-surface-variant hover:text-on-surface p-1 rounded-lg hover:bg-surface-container"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="p-space-lg space-y-space-md">
          
          {/* Simulated Camera Window */}
          <div className="relative w-full h-56 bg-slate-900 rounded-xl overflow-hidden flex flex-col items-center justify-center border-2 border-slate-700">
            
            {/* Target Reticle Box */}
            <div className="w-36 h-44 border-2 border-emerald-400 rounded-2xl relative flex flex-col items-center justify-center bg-emerald-500/10 backdrop-blur-xs">
              <span className="material-symbols-outlined text-5xl text-emerald-400">face</span>
              <span className="absolute -top-3 px-2.5 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-wider font-data-tabular shadow-sm">
                Single Face Confirmed
              </span>
              <span className="absolute -bottom-2 text-[10px] font-data-tabular text-emerald-300 bg-slate-900 px-2 py-0.5 rounded border border-emerald-500/40">
                Confidence: 99.4%
              </span>
            </div>

            {/* GPS Overlay */}
            <div className="absolute bottom-2 left-2 right-2 bg-on-background/80 backdrop-blur-md rounded-lg p-2 flex items-center justify-between text-xs text-on-primary">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-on-tertiary-container text-[16px]">location_on</span>
                <span className="font-label-sm text-label-sm">Inside Geofence: 42m / 150m</span>
              </div>
              <span className="font-data-tabular text-data-tabular text-on-tertiary-container">±8m</span>
            </div>

          </div>

          {/* Verification Indicators */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-lg bg-surface-container-high text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-on-tertiary-container text-[18px]">check_circle</span>
              <div>
                <div className="font-semibold">Single Face</div>
                <div className="text-[10px] text-on-surface-variant">Validated in frame</div>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-surface-container-high text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-on-tertiary-container text-[18px]">check_circle</span>
              <div>
                <div className="font-semibold">GPS Perimeter</div>
                <div className="text-[10px] text-on-surface-variant">Within office radius</div>
              </div>
            </div>
          </div>

          {/* Action button */}
          <button
            onClick={handleCheckin}
            disabled={isVerifying}
            className="w-full h-11 bg-primary text-on-primary rounded-lg font-label-md text-label-md font-bold hover:bg-inverse-surface transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            {isVerifying ? (
              <>
                <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
                <span>Verifying Biometrics...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[18px]">verified</span>
                <span>Confirm Check-In Now</span>
              </>
            )}
          </button>
          
          <p className="text-[11px] text-outline text-center">
            Server stamps official timestamp. Late after 09:15 AM. Second check-in returns HTTP 409.
          </p>

        </div>
      </div>
    </div>
  );
}
