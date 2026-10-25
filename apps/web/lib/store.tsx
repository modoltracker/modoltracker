'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  getSupabaseClient,
  type PlaceRow,
  type CheckinRow,
  type ReviewRow,
} from '@modoltracker/api-client';
import { calculateOverallRating } from '@modoltracker/core';
import type { Visibility, PlaceCategory, FeeType } from '@modoltracker/db-types';

export interface FriendItem {
  id: string;
  username: string;
  display_name: string;
  title: string;
  last_city: string;
  last_time: string;
  total_checkins: number;
  status: 'accepted' | 'pending';
}

export type GpsStatus = 'locating' | 'locked' | 'denied' | 'unsupported' | 'manual';

export type ReactionEmoji = '💩' | '😂' | '🫡' | '🤢';

interface ModolStoreContextValue {
  places: PlaceRow[];
  checkins: CheckinRow[];
  reviews: ReviewRow[];
  friends: FriendItem[];
  reactions: Record<string, Record<ReactionEmoji, number>>;
  myReactions: Record<string, ReactionEmoji | undefined>;
  toggleReaction: (checkinId: string, emoji: ReactionEmoji) => void;
  userLocation: { lat: number; lng: number };
  gpsAccuracyMeters: number | null;
  gpsStatus: GpsStatus;
  gpsRequestCount: number;
  refreshGpsLocation: () => void;
  setManualUserLocation: (lat: number, lng: number) => void;
  username: string;
  displayName: string;
  activeTitle: string;
  hasLinkedEmail: boolean;
  linkedEmailAddress: string | null;
  showEmailLinkReminder: boolean;
  dismissEmailLinkReminder: () => void;
  setAccountIdentity: (identity: {
    userId?: string | null;
    username: string;
    displayName: string;
    hasLinkedEmail?: boolean;
  }) => void;
  linkAccountToEmail: (email: string) => void;
  defaultVisibility: Visibility;
  feedDelayHours: number;
  privateZoneRadius: number;
  isCheckinSheetOpen: boolean;
  selectedPlaceForCheckin: PlaceRow | null;
  openCheckinSheet: (place?: PlaceRow | null) => void;
  closeCheckinSheet: () => void;
  addCheckin: (input: {
    place_id: string | null;
    lat: number;
    lng: number;
    visibility: Visibility;
    note?: string;
    city?: string;
  }) => CheckinRow;
  addReview: (input: {
    place_id: string;
    checkin_id?: string | null;
    rating_cleanliness: number;
    rating_water: number;
    rating_smell?: number | null;
    body?: string;
    facilities?: string[];
  }) => ReviewRow;
  addPlace: (input: {
    name: string;
    category: PlaceCategory;
    address: string;
    city: string;
    fee_type: FeeType;
    fee_amount: number | null;
    is_24h: boolean;
    facilities: string[];
  }) => PlaceRow;
  acceptFriend: (id: string) => void;
  updatePrivacySettings: (settings: {
    defaultVisibility: Visibility;
    feedDelayHours: number;
    privateZoneRadius: number;
  }) => void;
}

const ModolStoreContext = createContext<ModolStoreContextValue | null>(null);

export function ModolStoreProvider({ children }: { children: React.ReactNode }) {
  // Mulai dari 0 (kosong bersih) tanpa titik dummy!
  const [places, setPlaces] = useState<PlaceRow[]>([]);
  const [checkins, setCheckins] = useState<CheckinRow[]>([]);
  const [reviews, setReviews] = useState<ReviewRow[]>([]);
  const [friends, setFriends] = useState<FriendItem[]>([]);
  const [reactions, setReactions] = useState<Record<string, Record<ReactionEmoji, number>>>({});
  const [myReactions, setMyReactions] = useState<Record<string, ReactionEmoji | undefined>>({});

  const [authUserId, setAuthUserId] = useState<string | null>(null);
  const [authUsername, setAuthUsername] = useState<string>('pejuang_modol');
  const [authDisplayName, setAuthDisplayName] = useState<string>('Pejuang Modol');
  const [hasLinkedEmail, setHasLinkedEmail] = useState<boolean>(false);
  const [linkedEmailAddress, setLinkedEmailAddress] = useState<string | null>(null);
  const [showEmailLinkReminder, setShowEmailLinkReminder] = useState<boolean>(false);

  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number }>({
    lat: -6.2088,
    lng: 106.8456,
  });
  const [gpsAccuracyMeters, setGpsAccuracyMeters] = useState<number | null>(null);
  const [gpsStatus, setGpsStatus] = useState<GpsStatus>('locating');
  const [gpsRequestCount, setGpsRequestCount] = useState<number>(0);

  const [defaultVisibility, setDefaultVisibility] = useState<Visibility>('friends');
  const [feedDelayHours, setFeedDelayHours] = useState<number>(2);
  const [privateZoneRadius, setPrivateZoneRadius] = useState<number>(500);
  const [isCheckinSheetOpen, setIsCheckinSheetOpen] = useState<boolean>(false);
  const [selectedPlaceForCheckin, setSelectedPlaceForCheckin] = useState<PlaceRow | null>(null);

  const refreshGpsLocation = React.useCallback(() => {
    if (typeof window === 'undefined' || !('geolocation' in navigator)) {
      setGpsStatus('unsupported');
      return;
    }
    setGpsStatus('locating');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setGpsAccuracyMeters(Math.round(pos.coords.accuracy));
        setGpsStatus('locked');
        setGpsRequestCount((c) => c + 1);
      },
      () => {
        setGpsStatus('denied');
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  }, []);

  const setManualUserLocation = React.useCallback((lat: number, lng: number) => {
    setUserLocation({ lat, lng });
    setGpsAccuracyMeters(5);
    setGpsStatus('manual');
    setGpsRequestCount((c) => c + 1);
  }, []);

  useEffect(() => {
    refreshGpsLocation();
  }, [refreshGpsLocation]);

  // Ambil data asli milik user yang sedang login dari Supabase
  useEffect(() => {
    const sb = getSupabaseClient();
    if (!sb) return;

    sb.auth.getSession().then(async ({ data }) => {
      const user = data.session?.user;
      if (user) {
        setAuthUserId(user.id);
        const isInternalEmail = Boolean(
          user.email && user.email.endsWith('@akun.modoltracker.web.id')
        );
        setHasLinkedEmail(!isInternalEmail);
        setLinkedEmailAddress(!isInternalEmail ? user.email ?? null : null);
        if (isInternalEmail) {
          setShowEmailLinkReminder(true);
        }

        const meta = user.user_metadata;
        if (meta?.username) setAuthUsername(meta.username);
        if (meta?.display_name) setAuthDisplayName(meta.display_name);

        const { data: prof } = await sb
          .from('profiles')
          .select('username, display_name')
          .eq('id', user.id)
          .single();
        if (prof) {
          const p = prof as { username: string; display_name: string | null };
          setAuthUsername(p.username);
          if (p.display_name) setAuthDisplayName(p.display_name);
        }

        // Load checkins milik user tersebut dari Supabase
        const { data: userCheckins } = await sb
          .from('checkins')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (userCheckins && userCheckins.length > 0) {
          setCheckins(userCheckins as CheckinRow[]);

          const placeIds = Array.from(
            new Set(
              (userCheckins as CheckinRow[])
                .map((c) => c.place_id)
                .filter((id): id is string => Boolean(id))
            )
          );
          if (placeIds.length > 0) {
            const { data: placeRows } = await sb
              .from('places')
              .select('*')
              .in('id', placeIds);
            if (placeRows) {
              setPlaces(placeRows as PlaceRow[]);
            }
          }
        }
      }
    });
  }, []);

  const openCheckinSheet = (place?: PlaceRow | null) => {
    setSelectedPlaceForCheckin(place ?? null);
    setIsCheckinSheetOpen(true);
  };

  const closeCheckinSheet = () => {
    setIsCheckinSheetOpen(false);
  };

  const addCheckin: ModolStoreContextValue['addCheckin'] = (input) => {
    const newCheckin: CheckinRow = {
      id: `chk-${Date.now()}`,
      user_id: authUserId ?? 'current-user',
      place_id: input.place_id,
      lat: input.lat,
      lng: input.lng,
      city: input.city ?? 'Lokasi GPS',
      province: 'Indonesia',
      visibility: input.visibility,
      note: input.note ?? null,
      in_private_zone: input.place_id === null,
      visible_at: new Date(Date.now() + feedDelayHours * 3600 * 1000).toISOString(),
      created_at: new Date().toISOString(),
    };
    setCheckins((prev) => [newCheckin, ...prev]);
    if (input.place_id) {
      setPlaces((prev) =>
        prev.map((p) =>
          p.id === input.place_id ? { ...p, checkin_count: p.checkin_count + 1 } : p
        )
      );
    }

    const sb = getSupabaseClient();
    if (sb && authUserId) {
      sb.from('checkins')
        .insert({
          user_id: authUserId,
          place_id: input.place_id,
          lat: input.lat,
          lng: input.lng,
          city: input.city ?? 'Lokasi GPS',
          visibility: input.visibility,
          note: input.note ?? null,
        } as never)
        .then(() => {});
    }

    return newCheckin;
  };

  const addReview: ModolStoreContextValue['addReview'] = (input) => {
    const overall = calculateOverallRating({
      rating_cleanliness: input.rating_cleanliness,
      rating_water: input.rating_water,
      rating_smell: input.rating_smell,
    });
    const newReview: ReviewRow = {
      id: `rev-${Date.now()}`,
      user_id: authUserId ?? 'current-user',
      place_id: input.place_id,
      checkin_id: input.checkin_id ?? null,
      rating_cleanliness: input.rating_cleanliness,
      rating_water: input.rating_water,
      rating_privacy: 4,
      rating_smell: input.rating_smell ?? 4,
      rating_supplies: 4,
      overall_rating: overall,
      body: input.body ?? null,
      is_location_verified: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setReviews((prev) => [newReview, ...prev]);
    setPlaces((prev) =>
      prev.map((p) => {
        if (p.id !== input.place_id) return p;
        const count = p.review_count + 1;
        const nextAvg =
          Math.round(
            (((p.avg_rating ?? overall) * p.review_count + overall) / count) * 10
          ) / 10;
        return {
          ...p,
          review_count: count,
          avg_rating: nextAvg,
          avg_cleanliness: input.rating_cleanliness,
          avg_water: input.rating_water,
        };
      })
    );

    const sb = getSupabaseClient();
    if (sb && authUserId) {
      sb.from('reviews')
        .upsert({
          user_id: authUserId,
          place_id: input.place_id,
          checkin_id: input.checkin_id ?? null,
          rating_cleanliness: input.rating_cleanliness,
          rating_water: input.rating_water,
          rating_smell: input.rating_smell ?? 4,
          overall_rating: overall,
          body: input.body ?? null,
          is_location_verified: true,
        } as never)
        .then(() => {});
    }

    return newReview;
  };

  const addPlace: ModolStoreContextValue['addPlace'] = (input) => {
    const fac = new Set(input.facilities);
    const slug = `${input.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now().toString().slice(-4)}`;
    const newPlace: PlaceRow = {
      id: `place-${Date.now()}`,
      name: input.name,
      slug,
      category: input.category,
      lat: userLocation.lat,
      lng: userLocation.lng,
      address: input.address,
      city: input.city || 'Lokasi GPS',
      province: 'Indonesia',
      status: 'unverified',
      source: 'user',
      osm_id: null,
      has_squat: fac.has('has_squat'),
      has_sitting: fac.has('has_sitting'),
      has_jet_washer: fac.has('has_jet_washer'),
      has_bucket: fac.has('has_bucket'),
      has_tissue: fac.has('has_tissue'),
      has_soap: fac.has('has_soap'),
      has_sink: fac.has('has_sink'),
      is_accessible: fac.has('is_accessible'),
      has_baby_change: fac.has('has_baby_change'),
      has_shower: fac.has('has_shower'),
      has_prayer_room: fac.has('has_prayer_room'),
      gender_separated: fac.has('gender_separated'),
      fee_type: input.fee_type,
      fee_amount: input.fee_amount,
      is_24h: input.is_24h,
      opening_hours: null,
      avg_rating: null,
      avg_cleanliness: null,
      avg_water: null,
      review_count: 0,
      checkin_count: 1,
      claimed_by: null,
      is_verified_clean: false,
      created_by: authUserId ?? 'current-user',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setPlaces((prev) => [newPlace, ...prev]);

    const sb = getSupabaseClient();
    if (sb && authUserId) {
      sb.from('places')
        .insert({
          name: newPlace.name,
          slug: newPlace.slug,
          category: newPlace.category,
          lat: newPlace.lat,
          lng: newPlace.lng,
          address: newPlace.address,
          city: newPlace.city,
          province: newPlace.province,
          fee_type: newPlace.fee_type,
          fee_amount: newPlace.fee_amount,
          is_24h: newPlace.is_24h,
          has_squat: newPlace.has_squat,
          has_sitting: newPlace.has_sitting,
          has_jet_washer: newPlace.has_jet_washer,
          has_bucket: newPlace.has_bucket,
          has_tissue: newPlace.has_tissue,
          has_soap: newPlace.has_soap,
          has_sink: newPlace.has_sink,
          is_accessible: newPlace.is_accessible,
          has_baby_change: newPlace.has_baby_change,
          has_shower: newPlace.has_shower,
          has_prayer_room: newPlace.has_prayer_room,
          gender_separated: newPlace.gender_separated,
          created_by: authUserId,
        } as never)
        .then(() => {});
    }

    return newPlace;
  };

  const toggleReaction = (checkinId: string, emoji: ReactionEmoji) => {
    const prevEmoji = myReactions[checkinId];
    setMyReactions((prev) => ({
      ...prev,
      [checkinId]: prevEmoji === emoji ? undefined : emoji,
    }));
    setReactions((prev) => {
      const current = prev[checkinId] ?? { '💩': 0, '😂': 0, '🫡': 0, '🤢': 0 };
      const next = { ...current };
      if (prevEmoji) {
        next[prevEmoji] = Math.max(0, next[prevEmoji] - 1);
      }
      if (prevEmoji !== emoji) {
        next[emoji] = (next[emoji] ?? 0) + 1;
      }
      return { ...prev, [checkinId]: next };
    });
  };

  const acceptFriend = (id: string) => {
    setFriends((prev) =>
      prev.map((f) => (f.id === id ? { ...f, status: 'accepted' } : f))
    );
  };

  const updatePrivacySettings: ModolStoreContextValue['updatePrivacySettings'] = (s) => {
    setDefaultVisibility(s.defaultVisibility);
    setFeedDelayHours(s.feedDelayHours);
    setPrivateZoneRadius(s.privateZoneRadius);
  };

  const dismissEmailLinkReminder = () => {
    setShowEmailLinkReminder(false);
  };

  const setAccountIdentity: ModolStoreContextValue['setAccountIdentity'] = (identity) => {
    if (identity.userId !== undefined) setAuthUserId(identity.userId);
    setAuthUsername(identity.username);
    setAuthDisplayName(identity.displayName);
    // Saat daftar akun baru, mulai dengan jejak kosong bersih (0 titik)
    setCheckins([]);
    setPlaces([]);
    setReviews([]);
    setFriends([]);
    const linked = Boolean(identity.hasLinkedEmail);
    setHasLinkedEmail(linked);
    setShowEmailLinkReminder(!linked);
  };

  const linkAccountToEmail = (email: string) => {
    setHasLinkedEmail(true);
    setLinkedEmailAddress(email);
    setShowEmailLinkReminder(false);
    const sb = getSupabaseClient();
    if (sb) {
      sb.auth.updateUser({ email }).catch(() => {});
    }
  };

  return (
    <ModolStoreContext.Provider
      value={{
        places,
        checkins,
        reviews,
        friends,
        reactions,
        myReactions,
        toggleReaction,
        userLocation,
        gpsAccuracyMeters,
        gpsStatus,
        gpsRequestCount,
        refreshGpsLocation,
        setManualUserLocation,
        username: authUsername,
        displayName: authDisplayName,
        activeTitle: 'Pejuang Baru',
        hasLinkedEmail,
        linkedEmailAddress,
        showEmailLinkReminder,
        dismissEmailLinkReminder,
        setAccountIdentity,
        linkAccountToEmail,
        defaultVisibility,
        feedDelayHours,
        privateZoneRadius,
        isCheckinSheetOpen,
        selectedPlaceForCheckin,
        openCheckinSheet,
        closeCheckinSheet,
        addCheckin,
        addReview,
        addPlace,
        acceptFriend,
        updatePrivacySettings,
      }}
    >
      {children}
    </ModolStoreContext.Provider>
  );
}

export function useModolStore(): ModolStoreContextValue {
  const ctx = useContext(ModolStoreContext);
  if (!ctx) {
    throw new Error('useModolStore must be used inside ModolStoreProvider');
  }
  return ctx;
}
