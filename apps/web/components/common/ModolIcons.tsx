'use client';

import React from 'react';
import {
  GasPump,
  Storefront,
  Mosque,
  ShoppingBag,
  Signpost,
  ForkKnife,
  Coffee,
  Toilet,
  Buildings,
  FirstAidKit,
  Train,
  AirplaneTilt,
  GraduationCap,
  MapPin,
  Drop,
  ToiletPaper,
  HandSoap,
  Wheelchair,
  Baby,
  Shower,
  UsersThree,
  GlobeHemisphereEast,
  LockSimple,
  Sparkle,
} from '@phosphor-icons/react';
import type { PlaceCategory } from '@modoltracker/db-types';

export function CategoryIcon({
  category,
  size = 24,
  weight = 'bold',
  className = '',
}: {
  category: PlaceCategory;
  size?: number;
  weight?: 'bold' | 'fill' | 'duotone';
  className?: string;
}) {
  const props = { size, weight, className };
  switch (category) {
    case 'gas_station':
      return <GasPump {...props} />;
    case 'minimarket':
      return <Storefront {...props} />;
    case 'mosque':
      return <Mosque {...props} />;
    case 'mall':
      return <ShoppingBag {...props} />;
    case 'rest_area':
      return <Signpost {...props} />;
    case 'restaurant':
      return <ForkKnife {...props} />;
    case 'cafe':
      return <Coffee {...props} />;
    case 'public_toilet':
      return <Toilet {...props} />;
    case 'office':
      return <Buildings {...props} />;
    case 'hospital':
      return <FirstAidKit {...props} />;
    case 'station':
      return <Train {...props} />;
    case 'airport':
      return <AirplaneTilt {...props} />;
    case 'campus':
      return <GraduationCap {...props} />;
    default:
      return <MapPin {...props} />;
  }
}

export function FacilityIcon({
  facilityKey,
  size = 20,
  weight = 'bold',
  className = '',
}: {
  facilityKey: string;
  size?: number;
  weight?: 'bold' | 'fill';
  className?: string;
}) {
  const props = { size, weight, className };
  switch (facilityKey) {
    case 'has_squat':
    case 'has_sitting':
      return <Toilet {...props} />;
    case 'has_jet_washer':
    case 'has_bucket':
    case 'has_sink':
      return <Drop {...props} />;
    case 'has_tissue':
      return <ToiletPaper {...props} />;
    case 'has_soap':
      return <HandSoap {...props} />;
    case 'is_accessible':
      return <Wheelchair {...props} />;
    case 'has_baby_change':
      return <Baby {...props} />;
    case 'has_shower':
      return <Shower {...props} />;
    case 'has_prayer_room':
      return <Mosque {...props} />;
    case 'gender_separated':
      return <UsersThree {...props} />;
    default:
      return <Sparkle {...props} />;
  }
}

export function VisibilityIcon({
  visibility,
  size = 18,
}: {
  visibility: 'public' | 'friends' | 'private';
  size?: number;
}) {
  if (visibility === 'public') return <GlobeHemisphereEast size={size} weight="bold" />;
  if (visibility === 'private') return <LockSimple size={size} weight="bold" />;
  return <UsersThree size={size} weight="bold" />;
}
