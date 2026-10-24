import { TAX_SLABS } from '../constants/taxSlabs.js';

/**
 * Calculates Pakistan annual and monthly income tax based on annual gross income (gross * 12).
 * Strictly adheres to Section 3 of Saylani HCM Lite specifications.
 */
export function calculateIncomeTax(annualGross) {
  if (!annualGross || annualGross <= 600000) {
    return {
      annualTax: 0,
      monthlyTax: 0,
      effectiveRate: 0,
      slabTier: 1
    };
  }

  let matchedSlab = TAX_SLABS[0];
  let tierIndex = 1;

  for (let i = 0; i < TAX_SLABS.length; i++) {
    const slab = TAX_SLABS[i];
    if (annualGross > slab.min && annualGross <= slab.max) {
      matchedSlab = slab;
      tierIndex = i + 1;
      break;
    }
  }

  const taxableExcess = Math.max(0, annualGross - matchedSlab.threshold);
  const annualTax = Math.round(matchedSlab.fixedTax + taxableExcess * matchedSlab.rate);
  const monthlyTax = Math.round(annualTax / 12);
  const effectiveRate = Number(((annualTax / annualGross) * 100).toFixed(2));

  return {
    annualTax,
    monthlyTax,
    effectiveRate,
    slabTier: tierIndex
  };
}
