"use client";
import { createContext, useContext, useEffect, useState } from 'react';

export type ChartColors = { brand: string; brandSoft: string; brandDeep: string; grid: string; axis: string; ink: string; surface: string; line: string };
type ThemeState = { mode: 'light'; accent: 'forest'; resolved: 'light'; colors: ChartColors };
const FALLBACK: ChartColors = { brand: '#214e43', brandSoft: '#d5e3bf', brandDeep: '#193e35', grid: '#edf1e7', axis: '#6b7c75', ink: '#183d38', surface: '#ffffff', line: '#dce3d2' };
const ThemeCtx = createContext<ThemeState | null>(null);

// Apply the shared theme before paint, including for browsers with legacy saved preferences.
// DOM changes must still happen when localStorage is unavailable.
export const themeBootScript = `(function(){var r=document.documentElement;r.classList.remove('dark');r.setAttribute('data-accent','forest');r.style.colorScheme='light';try{localStorage.setItem('hcm-theme','light');localStorage.setItem('hcm-accent','forest');}catch(e){}})();`;

export function ThemeProvider({children}:{children:React.ReactNode}) {
 const [colors,setColors]=useState<ChartColors>(FALLBACK);
 useEffect(()=>{
  const root=document.documentElement;
  root.classList.remove('dark');root.setAttribute('data-accent','forest');
  const css=getComputedStyle(root);
  const read=(name:string,fallback:string)=>css.getPropertyValue(name).trim()||fallback;
  setColors({brand:read('--brand-600',FALLBACK.brand),brandSoft:read('--brand-200',FALLBACK.brandSoft),brandDeep:read('--brand-800',FALLBACK.brandDeep),grid:read('--surface-muted',FALLBACK.grid),axis:read('--ink-soft',FALLBACK.axis),ink:read('--ink',FALLBACK.ink),surface:read('--surface',FALLBACK.surface),line:read('--line',FALLBACK.line)});
 },[]);
 return <ThemeCtx.Provider value={{mode:'light',accent:'forest',resolved:'light',colors}}>{children}</ThemeCtx.Provider>;
}
export function useTheme(){const value=useContext(ThemeCtx);if(!value)throw new Error('useTheme outside ThemeProvider');return value;}
