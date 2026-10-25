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
  center = { lat: -6.2088, lng: 106.8456 },
  gpsRequestCount = 0,
  onManualPickLocation,
  isFullScreen = false,
}: {
  places: PlaceRow[];
  checkins?: CheckinRow[];
  mapMode?: 'my_trail' | 'all_trails' | 'toilet_info';
  selectedPlaceId: string | null;
  onSelectPlace: (place: PlaceRow) => void;
  center?: { lat: number; lng: number };
  gpsRequestCount?: number;
  onManualPickLocation?: (lat: number, lng: number) => void;
  isFullScreen?: boolean;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const markersLayerRef = useRef<any>(null);
  const userMarkerLayerRef = useRef<any>(null);
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    let isMounted = true;
    let resizeTimer: ReturnType<typeof setTimeout> | null = null;
    let resizeObserver: ResizeObserver | null = null;

    async function initMap() {
      if (!containerRef.current || mapRef.current) return;
      const L = (await import('leaflet')).default;

      if (!isMounted || !containerRef.current) return;
      const map = L.map(containerRef.current, {
        center: [center.lat, center.lng],
        zoom: 15,
        zoomControl: true,
      });

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
      userMarkerLayerRef.current = L.layerGroup().addTo(map);

      // Izinkan user klik di peta untuk mengoreksi titik lokasi jika GPS laptop/gedung meleset
      map.on('click', (e: any) => {
        if (onManualPickLocation && e?.latlng) {
          onManualPickLocation(e.latlng.lat, e.latlng.lng);
        }
      });

      mapRef.current = map;
      setMapReady(true);

      if (typeof ResizeObserver !== 'undefined' && containerRef.current) {
        resizeObserver = new ResizeObserver(() => {
          if (mapRef.current) {
            mapRef.current.invalidateSize({ animate: false });
          }
        });
        resizeObserver.observe(containerRef.current);
      }

      resizeTimer = setTimeout(() => {
        if (mapRef.current) {
          mapRef.current.invalidateSize({ animate: false });
        }
      }, 200);
    }

    initMap();
    return () => {
      isMounted = false;
      if (resizeTimer) clearTimeout(resizeTimer);
      if (resizeObserver) resizeObserver.disconnect();
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Setiap kali GPS terkunci / diperbarui atau user klik peta, gerakkan kamera ke center dan gambar Pin Biru Posisi User
  useEffect(() => {
    async function updateUserPositionMarker() {
      if (!mapReady || !mapRef.current || !userMarkerLayerRef.current) return;
      const L = (await import('leaflet')).default;
      const uLayer = userMarkerLayerRef.current;
      uLayer.clearLayers();

      const userHtml = `
        <div style="
          position:relative;
          width:26px;
          height:26px;
          display:flex;
          align-items:center;
          justify-content:center;
        ">
          <div style="
            position:absolute;
            inset:0;
            border-radius:9999px;
            background:rgba(28,176,246,0.32);
            border:2px solid #1CB0F6;
          "></div>
          <div style="
            width:14px;
            height:14px;
            border-radius:9999px;
            background:#1CB0F6;
            border:3px solid #FFFFFF;
            box-shadow:0 2px 4px rgba(0,0,0,0.3);
            position:relative;
            z-index:2;
          "></div>
        </div>
      `;

      const userIcon = L.divIcon({
        html: userHtml,
        className: 'modol-user-gps-pin',
        iconSize: [26, 26],
        iconAnchor: [13, 13],
      });

      const userMarker = L.marker([center.lat, center.lng], {
        icon: userIcon,
        draggable: true,
      });

      userMarker.bindTooltip('📍 Posisi Kamu (Klik peta / geser pin jika GPS kurang pas)', {
        direction: 'top',
        offset: [0, -10],
      });

      userMarker.on('dragend', (ev: any) => {
        const pos = ev.target.getLatLng();
        if (pos && onManualPickLocation) {
          onManualPickLocation(pos.lat, pos.lng);
        }
      });

      userMarker.addTo(uLayer);

      // Terbangkan kamera peta tepat ke lokasi user
      mapRef.current.flyTo([center.lat, center.lng], 16, { duration: 0.6 });
    }

    updateUserPositionMarker();
  }, [mapReady, center.lat, center.lng, gpsRequestCount]);

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

  // Recalculate ukuran kanvas Leaflet & pusatkan kembali saat pengguna toggle mode Full Screen
  useEffect(() => {
    if (!mapReady || !mapRef.current) return;
    const syncMapSize = () => {
      if (!mapRef.current) return;
      mapRef.current.invalidateSize({ animate: false });
      mapRef.current.setView(
        [center.lat, center.lng],
        mapRef.current.getZoom() || 16,
        { animate: false }
      );
    };
    syncMapSize();
    const t1 = setTimeout(syncMapSize, 50);
    const t2 = setTimeout(syncMapSize, 200);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [mapReady, isFullScreen, center.lat, center.lng]);

  return (
    <div
      style={{
        position: 'relative',
        zIndex: 0,
        height: isFullScreen ? 'calc(100vh - 126px)' : '360px',
        width: '100%',
      }}
      className={`relative z-0 w-full bg-sand cursor-crosshair overflow-hidden ${
        isFullScreen ? 'border-0 rounded-none' : 'rounded-xl border-2 border-line'
      }`}
    >
      <div ref={containerRef} style={{ height: '100%', width: '100%' }} />
    </div>
  );
}
