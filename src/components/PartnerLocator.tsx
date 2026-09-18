import { useState, useEffect, useRef } from 'react';
import {
  Navigation,
  Building2,
  Banknote,
  Gauge,
  Check,
  X,
  Info,
  ArrowRight,
  RotateCcw,
  ExternalLink,
} from 'lucide-react';

import type { Language, SchemeMatch, RankedPartner } from '@/lib/types';
import { t, type TranslationKey } from '@/i18n/translations';
import { findPartners } from '@/lib/partnerLocator';
import { cityCoordinates } from '@/data/partners';
import L from 'leaflet';

interface PartnerLocatorProps {
  lang: Language;
  match: SchemeMatch;
  userCity: string | null;
  onProceed: () => void;
  onReset: () => void;
}

export function PartnerLocator({
  lang,
  match,
  userCity,
  onProceed,
  onReset,
}: PartnerLocatorProps) {
  const tr = (key: TranslationKey) => t(lang, key);

  const [selectedCity] = useState(userCity ?? '');
  const [results, setResults] = useState<RankedPartner[] | null>(null);
  const [searched, setSearched] = useState(false);

  // Actual browser GPS location.
  // If GPS is unavailable or permission is denied,
  // the selected city's coordinates are used as a fallback.
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lon: number;
  } | null>(null);

  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);

  // Get user's location and find suitable nearby partners.
  useEffect(() => {
  if (!selectedCity || !match.scheme_id) return;

  // Store the verified scheme ID so TypeScript knows
  // it is definitely available inside the callbacks.
  const schemeId = match.scheme_id;

  const fallbackCoords = cityCoordinates[selectedCity];

  if (!fallbackCoords) return;

  let isMounted = true;

    const searchPartners = (lat: number, lon: number) => {
  if (!isMounted) return;

  const partners = findPartners(
    schemeId,
    lat,
    lon
  );

  setResults(partners);
  setSearched(true);
};

    // Try to get the user's actual GPS location.
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          if (!isMounted) return;

          const coords = {
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          };

          setUserLocation(coords);
          searchPartners(coords.lat, coords.lon);
        },
        () => {
          // GPS permission denied or location unavailable.
          // Fall back to the selected city's coordinates.
          const coords = {
            lat: fallbackCoords.lat,
            lon: fallbackCoords.lon,
          };

          setUserLocation(coords);
          searchPartners(coords.lat, coords.lon);
        }
      );
    } else {
      // Browser does not support geolocation.
      const coords = {
        lat: fallbackCoords.lat,
        lon: fallbackCoords.lon,
      };

      setUserLocation(coords);
      searchPartners(coords.lat, coords.lon);
    }

    return () => {
      isMounted = false;
    };
  }, [selectedCity, match.scheme_id]);

  // Initialize/update the Leaflet map whenever
  // the partner results or user location changes.
  useEffect(() => {
    if (!results || results.length === 0 || !mapRef.current) {
      return;
    }

    const coords = userLocation ?? cityCoordinates[selectedCity];

    if (!coords) return;

    // Remove any previous map instance.
    if (mapInstance.current) {
      mapInstance.current.remove();
      mapInstance.current = null;
    }

    const map = L.map(mapRef.current).setView(
      [coords.lat, coords.lon],
      10
    );

    // OpenStreetMap tiles.
    L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        attribution: '© OpenStreetMap',
        maxZoom: 18,
      }
    ).addTo(map);

    // User location marker.
    const userIcon = L.divIcon({
      html: `
        <div
          style="
            width:20px;
            height:20px;
            background:#1b7bf5;
            border:3px solid white;
            border-radius:50%;
            box-shadow:0 2px 6px rgba(0,0,0,0.3);
          "
        ></div>
      `,
      className: '',
      iconSize: [20, 20],
      iconAnchor: [10, 10],
    });

    L.marker([coords.lat, coords.lon], {
      icon: userIcon,
    })
      .addTo(map)
      .bindPopup('Your location');

    // Partner markers.
    results.forEach((partner, idx) => {
      const markerColor =
        idx === 0 ? '#10b981' : '#64748b';

      const partnerIcon = L.divIcon({
        html: `
          <div
            style="
              width:28px;
              height:28px;
              background:${markerColor};
              border:2px solid white;
              border-radius:50%;
              display:flex;
              align-items:center;
              justify-content:center;
              color:white;
              font-weight:bold;
              font-size:12px;
              box-shadow:0 2px 6px rgba(0,0,0,0.3);
            "
          >
            ${idx + 1}
          </div>
        `,
        className: '',
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

      L.marker(
        [partner.latitude, partner.longitude],
        {
          icon: partnerIcon,
        }
      )
        .addTo(map)
        .bindPopup(
          `<strong>${partner.name}</strong><br/>` +
            `${partner.type}<br/>` +
            `${partner.distance_km} km away<br/>` +
            `NPA: ${partner.npa_ratio}%`
        );
    });

    // Fit the map so the user and all partner markers are visible.
    const bounds = L.latLngBounds([
      [coords.lat, coords.lon],
      ...results.map(
        (partner) =>
          [
            partner.latitude,
            partner.longitude,
          ] as [number, number]
      ),
    ]);

    map.fitBounds(bounds, {
      padding: [40, 40],
    });

    mapInstance.current = map;

    // Cleanup when the component/effect is removed.
    return () => {
      map.remove();

      if (mapInstance.current === map) {
        mapInstance.current = null;
      }
    };
  }, [
    results,
    selectedCity,
    userLocation,
  ]);

  return (
    <div className="card p-6 sm:p-8 animate-slide-up">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary-50">
          <Navigation className="w-7 h-7 text-primary-600" />
        </div>

        <div>
          <h2 className="text-xl font-bold text-slate-900">
            {tr('partnerLocator')}
          </h2>

          <p className="text-sm text-slate-500">
            {tr('partnerSubtitle')} —{' '}
            {cityCoordinates[selectedCity]?.label ??
              selectedCity}
          </p>
        </div>
      </div>

      {/* Map */}
      {searched &&
        results &&
        results.length > 0 && (
          <div
            ref={mapRef}
            className="w-full h-72 mb-5 rounded-xl border border-slate-200"
          />
        )}

      {/* Results */}
      {searched && (
        <div className="animate-fade-in">
          {results && results.length > 0 ? (
            <>
              <div className="flex items-center gap-2 mb-4">
                <Check className="w-5 h-5 text-success-600" />

                <p className="text-sm font-semibold text-slate-700">
                  {results.length}{' '}
                  {tr('partnersFound')}{' '}
                  {cityCoordinates[selectedCity]?.label ??
                    selectedCity}
                </p>
              </div>

              <div className="space-y-3">
                {results.map((partner, idx) => (
                  <div
                    key={partner.partner_id}
                    className="flex items-start gap-4 p-4 rounded-xl border border-slate-200/80 hover:border-primary-300 hover:shadow-sm transition-all duration-200 animate-slide-up"
                    style={{
                      animationDelay: `${idx * 80}ms`,
                    }}
                  >
                    {/* Ranking number */}
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary-100 text-primary-700 font-bold flex-shrink-0">
                      {idx + 1}
                    </div>

                    <div className="flex-1 min-w-0">
                      {/* Partner name + distance */}
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-bold text-slate-900 text-sm leading-snug">
                          {partner.name}
                        </h3>

                        <span className="text-xs font-semibold text-primary-700 bg-primary-50 px-2 py-1 rounded-full whitespace-nowrap">
                          {partner.distance_km}{' '}
                          {tr('kmAway')}
                        </span>
                      </div>

                      {/* Partner information */}
                      <div className="flex flex-wrap items-center gap-3 mt-2">
                        <span className="flex items-center gap-1 text-xs text-slate-500">
                          <Building2 className="w-3.5 h-3.5" />
                          {partner.type}
                        </span>

                        <span className="flex items-center gap-1 text-xs text-slate-500">
                          <Gauge className="w-3.5 h-3.5" />
                          NPA {partner.npa_ratio}%
                        </span>

                        <span className="flex items-center gap-1 text-xs text-success-600 font-medium">
                          <Banknote className="w-3.5 h-3.5" />
                          {tr('demoCapacity')}
                        </span>

                        <span className="flex items-center gap-1 text-xs text-success-600 font-medium">
                          <Check className="w-3.5 h-3.5" />
                          {tr('acceptingApps')}
                        </span>
                      </div>

                      {/* Directions */}
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${partner.latitude},${partner.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 mt-3 text-sm font-semibold text-primary-600 hover:text-primary-700"
                      >
                        <Navigation className="w-4 h-4" />
                        Get Directions
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>

              {/* Prototype/data note */}
              <div className="mt-4 flex items-start gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200/60">
                <Info className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />

                <p className="text-xs text-slate-500">
                  {tr('partnerFilterNote')}
                </p>
              </div>
            </>
          ) : (
            /* No partners */
            <div className="flex flex-col items-center text-center py-8">
              <div className="flex items-center justify-center w-14 h-14 rounded-full bg-warning-50 mb-3">
                <X className="w-7 h-7 text-warning-500" />
              </div>

              <p className="text-sm font-semibold text-slate-700">
                {tr('noPartners')}
              </p>

              <p className="text-xs text-slate-500 mt-1 max-w-sm">
                {tr('noPartnersDesc')}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Bottom buttons */}
      <div className="flex flex-col sm:flex-row gap-3 mt-6">
        {results && results.length > 0 && (
          <button
            onClick={onProceed}
            className="btn-primary flex-1"
          >
            {tr('proceedToChecklist')}
            <ArrowRight className="w-5 h-5" />
          </button>
        )}

        <button
          onClick={onReset}
          className="btn-secondary"
        >
          <RotateCcw className="w-4 h-4" />
          {tr('startOver')}
        </button>
      </div>
    </div>
  );
}