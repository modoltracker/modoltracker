'use client';

import React, { useEffect, useRef, useState } from 'react';
import type { PlaceRow, CheckinRow } from '@modoltracker/api-client';
import { getPinColorByRating } from '@modoltracker/ui';

export function ToiletLeafletMap({
  places,
  checkins = [],
  mapMode = 'all_trails',
  selectedPlaceId,
  onSelectPlace,
  center = { lat: -6.2245, lng: 106.8294 },
}: {
  places: PlaceRow[];
  checkins?: CheckinRow[];
  mapMode?: 'my_trail' | 'all_trails' | 'toilet_info';
  selectedPlaceId: string | null;
  onSelectPlace: (place: PlaceRow) => void;
  center?: { lat: number; lng: number };
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const markersLayerRef = useRef<any>(null);
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    let isMounted = true;
    let resizeTimer: ReturnType<typeof setTimeout> | null = null;

    async function initMap() {
      if (!containerRef.current || mapRef.current) return;
      const L = (await import('leaflet')).default;

      if (!isMounted || !containerRef.current) return;
      const map = L.map(containerRef.current, {
        center: [center.lat, center.lng],
        zoom: 12,
        zoomControl: true,
      });

      // Gunakan OpenStreetMap resmi yang 100% gratis tanpa API key di localhost maupun domain publik
      const primaryTileUrl = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
      const fallbackTileUrl =
        'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

      const tileLayer = L.tileLayer(primaryTileUrl, {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19,
        crossOrigin: true,
      });

      let switchedToFallback = false;
      tileLayer.on('tileerror', () => {
        if (!switchedToFallback && mapRef.current) {
          switchedToFallback = true;
          L.tileLayer(fallbackTileUrl, {
            attribution: '&copy; OpenStreetMap &copy; CARTO',
            maxZoom: 19,
          }).addTo(mapRef.current);
        }
      });

      tileLayer.addTo(map);

      markersLayerRef.current = L.layerGroup().addTo(map);
      mapRef.current = map;
      setMapReady(true);

      // Pastikan ukuran kontainer dihitung ulang oleh Leaflet agar tile tidak abu-abu / kosong
      resizeTimer = setTimeout(() => {
        if (mapRef.current) {
          mapRef.current.invalidateSize();
        }
      }, 200);
    }

    initMap();
    return () => {
      isMounted = false;
      if (resizeTimer) clearTimeout(resizeTimer);
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    async function renderPins() {
      if (!mapReady || !mapRef.current || !markersLayerRef.current) return;
      const L = (await import('leaflet')).default;
      const layer = markersLayerRef.current;
      layer.clearLayers();

      if (mapMode === 'toilet_info') {
        places.forEach((place) => {
          const pinColor = getPinColorByRating(place.avg_rating);
          const isSelected = place.id === selectedPlaceId;
          const size = isSelected ? 46 : 38;
          const ratingText = place.avg_rating ? place.avg_rating.toFixed(1) : '★';

          const html = `
            <div style="
              width:${size}px;
              height:${size}px;
              border-radius:9999px;
              background:${pinColor.bg};
              border:3px solid #FFFFFF;
              box-shadow:0 4px 0 ${pinColor.shade};
              display:flex;
              align-items:center;
              justify-content:center;
              font-family:'Baloo 2',sans-serif;
              font-weight:800;
              font-size:13px;
              color:${place.avg_rating && place.avg_rating >= 3 && place.avg_rating < 4 ? '#3C2A1E' : '#FFFFFF'};
            ">
              ${ratingText}
            </div>
          `;

          const icon = L.divIcon({
            html,
            className: 'modol-custom-pin',
            iconSize: [size, size],
            iconAnchor: [size / 2, size / 2],
          });

          const marker = L.marker([place.lat, place.lng], { icon });
          marker.on('click', () => onSelectPlace(place));
          marker.addTo(layer);
        });
        return;
      }

      // Mode Fun Tracker: Render pin 💩 milik sendiri (emas) & teman (pink bubble)
      const filteredCheckins =
        mapMode === 'my_trail'
          ? checkins.filter((c) => !c.user_id.startsWith('friend-'))
          : checkins;

      filteredCheckins.forEach((chk) => {
        const isFriend = chk.user_id.startsWith('friend-');
        const bg = isFriend ? '#FF7EB6' : '#FFC800';
        const shade = isFriend ? '#E0609A' : '#E0A500';
        const linkedPlace = places.find((p) => p.id === chk.place_id);
        const isSelected = linkedPlace && linkedPlace.id === selectedPlaceId;
        const size = isSelected ? 48 : 40;

        const html = `
          <div style="
            width:${size}px;
            height:${size}px;
            border-radius:9999px;
            background:${bg};
            border:3px solid #FFFFFF;
            box-shadow:0 4px 0 ${shade};
            display:flex;
            align-items:center;
            justify-content:center;
            font-size:${isSelected ? '22px' : '18px'};
            transform:${isSelected ? 'translateY(-4px) scale(1.08)' : 'none'};
          ">
            💩
          </div>
        `;

        const icon = L.divIcon({
          html,
          className: 'modol-trail-pin',
          iconSize: [size, size],
          iconAnchor: [size / 2, size / 2],
        });

        const marker = L.marker([chk.lat, chk.lng], { icon });
        marker.on('click', () => {
          if (linkedPlace) onSelectPlace(linkedPlace);
        });
        marker.addTo(layer);
      });
    }

    renderPins();
  }, [mapReady, places, checkins, mapMode, selectedPlaceId, onSelectPlace]);

  useEffect(() => {
    if (!mapReady || !mapRef.current || !selectedPlaceId) return;
    const found = places.find((p) => p.id === selectedPlaceId);
    if (found) {
      mapRef.current.flyTo([found.lat, found.lng], 14, { duration: 0.45 });
    }
  }, [mapReady, selectedPlaceId, places]);

  return (
    <div
      ref={containerRef}
      style={{ height: '340px', width: '100%' }}
      className="w-full h-[340px] rounded-xl border-2 border-line overflow-hidden bg-sand z-0"
    />
  );
}
