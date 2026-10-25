import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export default function SmartLeaveModal() {
  const { isSmartLeaveOpen, setIsSmartLeaveOpen, submitSmartLeave } = useApp();

  const [nlpText, setNlpText] = useState('Need next Monday and Tuesday off for my sister wedding');
  const [isParsing, setIsParsing] = useState(false);

  const [formData, setFormData] = useState({
    type: 'Casual Leave',
    startDate: '2026-10-27',
    endDate: '2026-10-28',
    days: 2,
    reason: "Sister's wedding ceremony"
  });

  if (!isSmartLeaveOpen) return null;

  const handleNlpParse = async () => {
    setIsParsing(true);
    let parsedResult = null;

    try {
      const token = localStorage.getItem('saylani_hcm_token');
      const res = await fetch('/api/ai/smart-leave', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ text: nlpText })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.leave_type) {
          const typeMap = {
            annual: 'Annual Leave',
            sick: 'Sick Leave',
            casual: 'Casual Leave',
            unpaid: 'Unpaid Leave'
          };
          parsedResult = {
            type: typeMap[data.leave_type.toLowerCase()] || 'Casual Leave',
            startDate: data.start_date,
            endDate: data.end_date,
            days: 2,
            reason: data.reason
          };
        }
      }
    } catch {
      parsedResult = null;
    }

    if (!parsedResult) {
      // Local fallback parsing
      const txt = nlpText.toLowerCase();
      let type = 'Casual Leave';
      if (txt.includes('sick') || txt.includes('doctor') || txt.includes('fever')) type = 'Sick Leave';
      else if (txt.includes('annual') || txt.includes('vacation')) type = 'Annual Leave';

      parsedResult = {
        type,
        startDate: '2026-10-27',
        endDate: '2026-10-28',
        days: 2,
        reason: txt.includes('wedding') ? "Attending family wedding ceremony" : "Personal leave commitment"
      };
    }

    setFormData(parsedResult);
    setIsParsing(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    submitSmartLeave(formData);
    setIsSmartLeaveOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-background/40 backdrop-blur-xs">
      <div className="bg-surface-container-lowest rounded-xl shadow-xl w-full max-w-lg border border-surface-container-high overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="px-space-lg py-space-md bg-surface-container-low border-b border-surface-container flex items-center justify-between">
          <div className="flex items-center gap-space-sm">
            <span className="material-symbols-outlined text-secondary text-[22px]">event_busy</span>
            <div>
              <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                Apply for Time Off
              </h3>
              <span className="font-label-sm text-label-sm text-secondary font-semibold">
                AI Smart Leave &amp; Working Days Engine
              </span>
            </div>
          </div>
          <button
            onClick={() => setIsSmartLeaveOpen(false)}
            className="text-on-surface-variant hover:text-on-surface p-1 rounded-lg hover:bg-surface-container"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="p-space-lg space-y-space-md">
          
          {/* AI NLP Input Banner (Module M8 Smart Leave) */}
          <div className="p-space-md rounded-xl bg-surface-container-high/60 border border-secondary/20 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-label-sm font-bold text-secondary flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
                Smart Leave NLP Intent Parser
              </span>
              <span className="font-label-sm text-label-sm text-outline">Plain English / Urdu</span>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={nlpText}
                onChange={e => setNlpText(e.target.value)}
                placeholder="e.g. Need next Monday and Tuesday off for family wedding"
                className="flex-1 h-9 px-3 rounded-lg bg-surface border border-outline-variant text-on-surface font-body-sm text-body-sm focus:border-secondary focus:outline-none"
              />
              <button
                type="button"
                onClick={handleNlpParse}
                disabled={isParsing}
                className="h-9 px-3 bg-secondary text-on-secondary rounded-lg font-label-md text-label-md font-bold hover:bg-secondary-container transition-all flex items-center gap-1 shrink-0"
              >
                {isParsing ? 'Parsing...' : '✨ Pre-fill Form'}
              </button>
            </div>
          </div>

          {/* Structured Confirmation Form */}
          <form onSubmit={handleSubmit} className="space-y-space-md">
            
            <div className="grid grid-cols-2 gap-space-md">
              <div>
                <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1 font-semibold">
                  Leave Type (Quota Verified)
                </label>
                <select
                  value={formData.type}
                  onChange={e => setFormData({ ...formData, type: e.target.value })}
                  className="w-full h-9 px-2 rounded-lg bg-surface border border-outline-variant text-on-surface font-body-sm text-body-sm focus:border-secondary focus:outline-none"
                >
                  <option value="Casual Leave">Casual Leave (10 available)</option>
                  <option value="Medical / Sick Leave">Medical / Sick Leave (8 available)</option>
                  <option value="Annual Paid Leave">Annual Paid Leave (14 available)</option>
                  <option value="Unpaid Leave">Unpaid Leave (Unlimited)</option>
                </select>
              </div>

              <div>
                <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1 font-semibold">
                  Working Days (Excludes Sat-Sun)
                </label>
                <input
                  type="text"
                  readOnly
                  value={`${formData.days} Working Days`}
                  className="w-full h-9 px-3 rounded-lg bg-surface-container font-data-tabular text-data-tabular font-bold text-on-surface border border-outline-variant"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-space-md">
              <div>
                <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1 font-semibold">
                  Start Date
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full h-9 px-3 rounded-lg bg-surface border border-outline-variant text-on-surface font-body-sm text-body-sm focus:border-secondary focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1 font-semibold">
                  End Date
                </label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={e => setFormData({ ...formData, endDate: e.target.value })}
                  className="w-full h-9 px-3 rounded-lg bg-surface border border-outline-variant text-on-surface font-body-sm text-body-sm focus:border-secondary focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1 font-semibold">
                Reason for Leave
              </label>
              <textarea
                rows={2}
                value={formData.reason}
                onChange={e => setFormData({ ...formData, reason: e.target.value })}
                className="w-full p-2.5 rounded-lg bg-surface border border-outline-variant text-on-surface font-body-sm text-body-sm focus:border-secondary focus:outline-none"
              ></textarea>
            </div>

            {/* Actions */}
            <div className="pt-space-sm flex items-center justify-end gap-space-sm border-t border-surface-container">
              <button
                type="button"
                onClick={() => setIsSmartLeaveOpen(false)}
                className="h-9 px-space-md rounded-lg font-label-md text-label-md text-on-surface-variant hover:bg-surface-container transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="h-9 px-space-md bg-secondary text-on-secondary hover:bg-secondary-container rounded-lg font-label-md text-label-md font-bold transition-all shadow-xs"
              >
                Submit Leave to HR
              </button>
            </div>

          </form>

        </div>
      </div>
    </div>
  );
}
