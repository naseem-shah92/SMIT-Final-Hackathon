/**
 * Pakistan Annual Income Tax Slabs as defined in Saylani HCM Lite Brief Section 3:
 * Tier 1: 0 to 600,000 -> 0%
 * Tier 2: 600,001 to 1,200,000 -> 5% of amount over 600,000
 * Tier 3: 1,200,001 to 2,400,000 -> 30,000 + 15% of amount over 1,200,000
 * Tier 4: 2,400,001 to 3,600,000 -> 210,000 + 25% of amount over 2,400,000
 * Tier 5: Above 3,600,000 -> 510,000 + 35% of amount over 3,600,000
 */
export const TAX_SLABS = [
  { min: 0, max: 600000, fixedTax: 0, rate: 0, threshold: 0 },
  { min: 600000, max: 1200000, fixedTax: 0, rate: 0.05, threshold: 600000 },
  { min: 1200000, max: 2400000, fixedTax: 30000, rate: 0.15, threshold: 1200000 },
  { min: 2400000, max: 3600000, fixedTax: 210000, rate: 0.25, threshold: 2400000 },
  { min: 3600000, max: Infinity, fixedTax: 510000, rate: 0.35, threshold: 3600000 }
];
