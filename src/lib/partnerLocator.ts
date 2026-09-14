import type { RankedPartner } from '@/lib/types';
import { partners } from '@/data/partners';

export interface PartnerFilterConfig {
  maxNpa: number;
  requireFunds: boolean;
  requireAccepting: boolean;
  topN: number;
}

export const defaultFilterConfig: PartnerFilterConfig = {
  maxNpa: 8.0,
  requireFunds: true,
  requireAccepting: true,
  topN: 5,
};

function haversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function findPartners(
  schemeId: string,
  userLat: number,
  userLon: number,
  config: PartnerFilterConfig = defaultFilterConfig,
): RankedPartner[] {
  const eligible = partners.filter((p) => {
    if (!p.schemes_handled.includes(schemeId)) return false;
    if (config.requireAccepting && !p.accepting_applications) return false;
    if (config.requireFunds && !p.funds_available) return false;
    if (p.npa_ratio > config.maxNpa) return false;
    return true;
  });

  const ranked: RankedPartner[] = eligible.map((p) => ({
    ...p,
    distance_km: Math.round(haversine(userLat, userLon, p.latitude, p.longitude) * 10) / 10,
  }));

  ranked.sort((a, b) => a.distance_km - b.distance_km);
  return ranked.slice(0, config.topN);
}
