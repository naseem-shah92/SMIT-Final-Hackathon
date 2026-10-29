"use client";
import { Check } from 'lucide-react';

/** One product theme; compact legacy placements no longer offer a conflicting switch. */
export function ThemeToggle({compact=false}:{compact?:boolean}) {
 if(compact)return null;
 return <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1.5 text-sm text-ink"><Check className="h-4 w-4 text-brand-600"/>Light · Forest & sage</span>;
}
export function AccentPicker(){return <div className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-600 text-white"><Check className="h-4 w-4"/></span><div><p className="text-sm font-medium text-ink">Forest green</p><p className="text-xs text-ink-soft">One palette, from your first visit to your workspace.</p></div></div>;}
