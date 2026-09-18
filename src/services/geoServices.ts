export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface GeoPartner {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
}

export function calculateDistance(
  from: Coordinates,
  to: Coordinates
): number {
  const R = 6371; // Earth's radius in km

  const dLat = ((to.latitude - from.latitude) * Math.PI) / 180;
  const dLon = ((to.longitude - from.longitude) * Math.PI) / 180;

  const lat1 = (from.latitude * Math.PI) / 180;
  const lat2 = (to.latitude * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) *
      Math.cos(lat2) *
      Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

export function findNearestPartners(
  userLocation: Coordinates,
  partners: GeoPartner[]
) {
  return partners
    .map((partner) => ({
      ...partner,
      distance: calculateDistance(userLocation, {
        latitude: partner.latitude,
        longitude: partner.longitude,
      }),
    }))
    .sort((a, b) => a.distance - b.distance);
}