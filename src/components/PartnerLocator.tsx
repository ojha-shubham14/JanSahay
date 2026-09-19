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

import type {
  Language,
  SchemeMatch,
  RankedPartner,
} from '@/lib/types';
import { t, type TranslationKey } from '@/i18n/translations';
import { findPartners } from '@/lib/partnerLocator';
import { cityCoordinates } from '@/data/partners';
import L from 'leaflet';

interface PartnerLocatorProps {
  lang: Language;
  match: SchemeMatch;
  userCity: string | null;
  userLatitude: number | null;
  userLongitude: number | null;
  onProceed: (partner: RankedPartner) => void;
  onReset: () => void;
}

export function PartnerLocator({
  lang,
  match,
  userCity,
  userLatitude,
  userLongitude,
  onProceed,
  onReset,
}: PartnerLocatorProps) {
  const tr = (key: TranslationKey) => t(lang, key);

  const [selectedCity] = useState(userCity ?? '');
  const [results, setResults] = useState<RankedPartner[] | null>(null);
  const [searched, setSearched] = useState(false);

  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);

  // Find suitable nearby partners using the user's GPS coordinates.
  useEffect(() => {
    if (!match.scheme_id) return;

    if (userLatitude == null || userLongitude == null) {
      return;
    }

    const nearbyPartners = findPartners(
      match.scheme_id,
      userLatitude,
      userLongitude
    );

    setResults(nearbyPartners);
    setSearched(true);
  }, [
    match.scheme_id,
    userLatitude,
    userLongitude,
  ]);

  // Initialize/update Leaflet map.
  useEffect(() => {
    if (
      !results ||
      results.length === 0 ||
      !mapRef.current
    ) {
      return;
    }

    const coords =
      userLatitude != null && userLongitude != null
        ? {
            lat: userLatitude,
            lon: userLongitude,
          }
        : cityCoordinates[selectedCity];

    if (!coords) return;

    // Remove previous map instance.
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

    // Fit map around user + all partners.
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

    return () => {
      map.remove();

      if (mapInstance.current === map) {
        mapInstance.current = null;
      }
    };
  }, [
    results,
    selectedCity,
    userLatitude,
    userLongitude,
  ]);

  const handleProceed = () => {
    if (!results || results.length === 0) return;

    // The first result is the highest-ranked nearby eligible partner.
    const recommendedPartner = results[0];

    onProceed(recommendedPartner);
  };

  return (
    <div className="portal-section p-5 sm:p-6 animate-slide-up">

      {/* Header */}
      <div className="flex items-start gap-3 mb-6">
        <div className="flex items-center justify-center w-11 h-11 rounded-md bg-primary-50 flex-shrink-0">
          <Navigation className="w-6 h-6 text-primary-700" />
        </div>

        <div>
          <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">
            {tr('partnerLocator')}
          </h2>

          <p className="text-sm text-slate-500 mt-1">
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
          <div className="mb-6">
            <div
              ref={mapRef}
              className="w-full h-72 sm:h-80 rounded-md border border-slate-200 overflow-hidden"
            />
          </div>
        )}

      {/* Results */}
      {searched && (
        <div className="animate-fade-in">

          {results && results.length > 0 ? (
            <>
              {/* Result summary */}
              <div className="portal-notice mb-4">
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-success-600" />

                  <p className="text-sm font-semibold text-slate-700">
                    {results.length}{' '}
                    {tr('partnersFound')}{' '}
                    {cityCoordinates[selectedCity]?.label ??
                      selectedCity}
                  </p>
                </div>
              </div>

              {/* Partner list */}
              <div className="space-y-3">
                {results.map((partner, idx) => (
                  <div
                    key={partner.partner_id}
                    className={`border rounded-md p-4 transition-colors duration-150 ${
                      idx === 0
                        ? 'border-primary-300 bg-primary-50/30'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start gap-4">

                      {/* Ranking number */}
                      <div
                        className={`flex items-center justify-center w-9 h-9 rounded-md font-semibold flex-shrink-0 ${
                          idx === 0
                            ? 'bg-primary-700 text-white'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {idx + 1}
                      </div>

                      <div className="flex-1 min-w-0">

                        {/* Name + distance */}
                        <div className="flex items-start justify-between gap-3">
                          <h3 className="font-semibold text-slate-900 text-sm leading-snug">
                            {partner.name}
                          </h3>

                          <span className="text-xs font-semibold text-primary-700 bg-primary-50 border border-primary-100 px-2 py-1 rounded-md whitespace-nowrap">
                            {partner.distance_km}{' '}
                            {tr('kmAway')}
                          </span>
                        </div>

                        {/* Partner information */}
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3">

                          <span className="flex items-center gap-1 text-xs text-slate-500">
                            <Building2 className="w-3.5 h-3.5" />
                            {partner.type}
                          </span>

                          <span className="flex items-center gap-1 text-xs text-slate-500">
                            <Gauge className="w-3.5 h-3.5" />
                            NPA {partner.npa_ratio}%
                          </span>

                          <span className="flex items-center gap-1 text-xs text-success-700 font-medium">
                            <Banknote className="w-3.5 h-3.5" />
                            {tr('demoCapacity')}
                          </span>

                          <span className="flex items-center gap-1 text-xs text-success-700 font-medium">
                            <Check className="w-3.5 h-3.5" />
                            {tr('acceptingApps')}
                          </span>

                        </div>

                        {/* Directions */}
                        <a
                          href={`https://www.google.com/maps/dir/?api=1&destination=${partner.latitude},${partner.longitude}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 mt-3 text-sm font-semibold text-primary-700 hover:text-primary-800"
                        >
                          <Navigation className="w-4 h-4" />
                          Get Directions
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>

                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Data note */}
              <div className="portal-notice mt-4">
                <div className="flex items-start gap-2">
                  <Info className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {tr('partnerFilterNote')}
                  </p>
                </div>
              </div>
            </>
          ) : (
            /* No partners */
            <div className="flex flex-col items-center text-center py-8 border border-slate-200 rounded-md bg-slate-50">
              <div className="flex items-center justify-center w-14 h-14 rounded-full bg-warning-50 mb-3">
                <X className="w-7 h-7 text-warning-500" />
              </div>

              <p className="text-sm font-semibold text-slate-700">
                {tr('noPartners')}
              </p>

              <p className="text-xs text-slate-500 mt-1 max-w-sm px-4">
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
            onClick={handleProceed}
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