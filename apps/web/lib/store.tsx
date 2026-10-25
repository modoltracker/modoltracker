'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  INITIAL_DEMO_PLACES,
  fetchPlaces,
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

export type GpsStatus = 'locating' | 'locked' | 'denied' | 'unsupported';

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
  refreshGpsLocation: () => void;
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

const INITIAL_CHECKINS: CheckinRow[] = [
  {
    id: 'chk-1',
    user_id: 'demo-user',
    place_id: '11111111-1111-4111-8111-111111111101',
    lat: -6.2245,
    lng: 106.8294,
    city: 'Jakarta Selatan',
    province: 'DKI Jakarta',
    visibility: 'friends',
    note: 'Penyelamat pagi hari sebelum macet Kuningan! Air kenceng.',
    in_private_zone: false,
    visible_at: '2026-10-24T08:00:00Z',
    created_at: '2026-10-24T06:00:00Z',
  },
  {
    id: 'chk-2',
    user_id: 'demo-user',
    place_id: '11111111-1111-4111-8111-111111111105',
    lat: -6.3641,
    lng: 107.3389,
    city: 'Karawang',
    province: 'Jawa Barat',
    visibility: 'public',
    note: 'Rest Area KM 57 selalu kinclong walau ramai.',
    in_private_zone: false,
    visible_at: '2026-10-20T12:00:00Z',
    created_at: '2026-10-20T10:00:00Z',
  },
  {
    id: 'chk-3',
    user_id: 'demo-user',
    place_id: '11111111-1111-4111-8111-111111111103',
    lat: -6.1952,
    lng: 106.8213,
    city: 'Jakarta Pusat',
    province: 'DKI Jakarta',
    visibility: 'friends',
    note: 'Toilet Sultan, wangi banget!',
    in_private_zone: false,
    visible_at: '2026-10-18T15:00:00Z',
    created_at: '2026-10-18T13:00:00Z',
  },
  {
    id: 'chk-friend-1',
    user_id: 'friend-1',
    place_id: '11111111-1111-4111-8111-111111111102',
    lat: -6.2351,
    lng: 106.7992,
    city: 'Jakarta Selatan',
    province: 'DKI Jakarta',
    visibility: 'friends',
    note: 'Mampir buang hajat di Masjid Al-Azhar habis macet-macetan, lega pol!',
    in_private_zone: false,
    visible_at: '2026-10-25T10:00:00Z',
    created_at: '2026-10-25T08:00:00Z',
  },
  {
    id: 'chk-friend-2',
    user_id: 'friend-2',
    place_id: '11111111-1111-4111-8111-111111111104',
    lat: -6.1767,
    lng: 106.8306,
    city: 'Jakarta Pusat',
    province: 'DKI Jakarta',
    visibility: 'friends',
    note: 'Numpang modol di Indomaret Gambir pas nunggu orderan ojol 😂',
    in_private_zone: false,
    visible_at: '2026-10-25T06:00:00Z',
    created_at: '2026-10-25T04:00:00Z',
  },
];

const INITIAL_REVIEWS: ReviewRow[] = [
  {
    id: 'rev-1',
    user_id: 'demo-user',
    place_id: '11111111-1111-4111-8111-111111111101',
    checkin_id: 'chk-1',
    rating_cleanliness: 5,
    rating_water: 5,
    rating_privacy: 4,
    rating_smell: 5,
    rating_supplies: 4,
    overall_rating: 4.6,
    body: 'Kamar mandi SPBU paling terawat di Rasuna Said. Ada sabun, jet washer kencang, dan mushola di sebelahnya.',
    is_location_verified: true,
    created_at: '2026-10-24T06:05:00Z',
    updated_at: '2026-10-24T06:05:00Z',
  },
  {
    id: 'rev-2',
    user_id: 'friend-1',
    place_id: '11111111-1111-4111-8111-111111111102',
    checkin_id: null,
    rating_cleanliness: 5,
    rating_water: 5,
    rating_privacy: 5,
    rating_smell: 5,
    rating_supplies: 4,
    overall_rating: 4.8,
    body: 'Airnya melimpah ruah dan adem banget. Kotak infaq di depan pintu.',
    is_location_verified: true,
    created_at: '2026-10-22T09:15:00Z',
    updated_at: '2026-10-22T09:15:00Z',
  },
];

const INITIAL_FRIENDS: FriendItem[] = [
  {
    id: 'friend-1',
    username: 'rizky_petualang',
    display_name: 'Rizky Pratama',
    title: 'Penjelajah SPBU',
    last_city: 'Bandung',
    last_time: '3 jam lalu',
    total_checkins: 34,
    status: 'accepted',
  },
  {
    id: 'friend-2',
    username: 'sari_ojol',
    display_name: 'Sari Wulandari',
    title: 'Ratu Toilet Gratis',
    last_city: 'Jakarta Selatan',
    last_time: 'Kemarin',
    total_checkins: 51,
    status: 'accepted',
  },
  {
    id: 'friend-3',
    username: 'budi_santoso',
    display_name: 'Budi Santoso',
    title: 'Sultan Toilet Mall',
    last_city: 'Semarang',
    last_time: '2 hari lalu',
    total_checkins: 19,
    status: 'pending',
  },
];

export function ModolStoreProvider({ children }: { children: React.ReactNode }) {
  const [places, setPlaces] = useState<PlaceRow[]>(INITIAL_DEMO_PLACES);
  const [checkins, setCheckins] = useState<CheckinRow[]>(INITIAL_CHECKINS);
  const [reviews, setReviews] = useState<ReviewRow[]>(INITIAL_REVIEWS);
  const [friends, setFriends] = useState<FriendItem[]>(INITIAL_FRIENDS);
  const [reactions, setReactions] = useState<Record<string, Record<ReactionEmoji, number>>>({
    'chk-1': { '💩': 4, '😂': 2, '🫡': 3, '🤢': 0 },
    'chk-friend-1': { '💩': 6, '😂': 5, '🫡': 2, '🤢': 0 },
    'chk-friend-2': { '💩': 3, '😂': 8, '🫡': 1, '🤢': 1 },
  });
  const [myReactions, setMyReactions] = useState<Record<string, ReactionEmoji | undefined>>({});
  const [authUserId, setAuthUserId] = useState<string | null>(null);
  const [authUsername, setAuthUsername] = useState<string>('pejuang_kebelet');
  const [authDisplayName, setAuthDisplayName] = useState<string>('Andi Pratama');
  const [hasLinkedEmail, setHasLinkedEmail] = useState<boolean>(false);
  const [linkedEmailAddress, setLinkedEmailAddress] = useState<string | null>(null);
  const [showEmailLinkReminder, setShowEmailLinkReminder] = useState<boolean>(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number }>({
    lat: -6.2245,
    lng: 106.8294,
  });
  const [gpsAccuracyMeters, setGpsAccuracyMeters] = useState<number | null>(null);
  const [gpsStatus, setGpsStatus] = useState<GpsStatus>('locating');
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
      },
      () => {
        setGpsStatus('denied');
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0, // Larang pakai lokasi cache lama!
      }
    );
  }, []);

  useEffect(() => {
    refreshGpsLocation();
    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      const watchId = navigator.geolocation.watchPosition(
        (pos) => {
          setUserLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
          setGpsAccuracyMeters(Math.round(pos.coords.accuracy));
          setGpsStatus('locked');
        },
        () => {
          // pertahankan state terakhir jika watch gagal sementara
        },
        {
          enableHighAccuracy: true,
          maximumAge: 0,
        }
      );
      return () => navigator.geolocation.clearWatch(watchId);
    }
    return undefined;
  }, [refreshGpsLocation]);

  useEffect(() => {
    fetchPlaces().then((remote) => {
      if (remote && remote.length > 0) {
        setPlaces(remote);
      }
    });

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
      }
    });
  }, []);

  const openCheckinSheet = (place?: PlaceRow | null) => {
    setSelectedPlaceForCheckin(place ?? places[0] ?? null);
    setIsCheckinSheetOpen(true);
  };

  const closeCheckinSheet = () => {
    setIsCheckinSheetOpen(false);
  };

  const addCheckin: ModolStoreContextValue['addCheckin'] = (input) => {
    const newCheckin: CheckinRow = {
      id: `chk-${Date.now()}`,
      user_id: authUserId ?? 'demo-user',
      place_id: input.place_id,
      lat: input.lat,
      lng: input.lng,
      city: input.city ?? 'Jakarta Selatan',
      province: 'DKI Jakarta',
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
          city: input.city ?? 'Jakarta Selatan',
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
      user_id: 'demo-user',
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
      city: input.city || 'Jakarta Selatan',
      province: 'DKI Jakarta',
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
      created_by: authUserId ?? 'demo-user',
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
        refreshGpsLocation,
        username: authUsername,
        displayName: authDisplayName,
        activeTitle: 'Raja SPBU',
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
