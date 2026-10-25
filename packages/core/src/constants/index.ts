import type { PlaceCategory, FeeType, Visibility } from '@modoltracker/db-types';

export const PLACE_CATEGORIES: {
  id: PlaceCategory;
  labelKey: string;
  iconName: string;
}[] = [
  { id: 'gas_station', labelKey: 'categories.gas_station', iconName: 'GasPump' },
  { id: 'minimarket', labelKey: 'categories.minimarket', iconName: 'Storefront' },
  { id: 'mosque', labelKey: 'categories.mosque', iconName: 'Mosque' },
  { id: 'mall', labelKey: 'categories.mall', iconName: 'ShoppingBag' },
  { id: 'rest_area', labelKey: 'categories.rest_area', iconName: 'Signpost' },
  { id: 'restaurant', labelKey: 'categories.restaurant', iconName: 'ForkKnife' },
  { id: 'cafe', labelKey: 'categories.cafe', iconName: 'Coffee' },
  { id: 'public_toilet', labelKey: 'categories.public_toilet', iconName: 'Toilet' },
  { id: 'office', labelKey: 'categories.office', iconName: 'Buildings' },
  { id: 'hospital', labelKey: 'categories.hospital', iconName: 'FirstAidKit' },
  { id: 'station', labelKey: 'categories.station', iconName: 'Train' },
  { id: 'airport', labelKey: 'categories.airport', iconName: 'AirplaneTilt' },
  { id: 'campus', labelKey: 'categories.campus', iconName: 'GraduationCap' },
  { id: 'other', labelKey: 'categories.other', iconName: 'MapPin' },
];

export const FACILITY_KEYS = [
  { key: 'has_squat', labelKey: 'facilities.has_squat', iconName: 'Toilet' },
  { key: 'has_sitting', labelKey: 'facilities.has_sitting', iconName: 'Toilet' },
  { key: 'has_jet_washer', labelKey: 'facilities.has_jet_washer', iconName: 'Drop' },
  { key: 'has_bucket', labelKey: 'facilities.has_bucket', iconName: 'Drop' },
  { key: 'has_tissue', labelKey: 'facilities.has_tissue', iconName: 'ToiletPaper' },
  { key: 'has_soap', labelKey: 'facilities.has_soap', iconName: 'HandSoap' },
  { key: 'has_sink', labelKey: 'facilities.has_sink', iconName: 'Drop' },
  { key: 'is_accessible', labelKey: 'facilities.is_accessible', iconName: 'Wheelchair' },
  { key: 'has_baby_change', labelKey: 'facilities.has_baby_change', iconName: 'Baby' },
  { key: 'has_shower', labelKey: 'facilities.has_shower', iconName: 'Shower' },
  { key: 'has_prayer_room', labelKey: 'facilities.has_prayer_room', iconName: 'Mosque' },
  { key: 'gender_separated', labelKey: 'facilities.gender_separated', iconName: 'UsersThree' },
] as const;

export type FacilityKey = (typeof FACILITY_KEYS)[number]['key'];

export const VISIBILITY_OPTIONS: {
  id: Visibility;
  labelKey: string;
  iconName: string;
}[] = [
  { id: 'friends', labelKey: 'visibility.friends', iconName: 'UsersThree' },
  { id: 'public', labelKey: 'visibility.public', iconName: 'GlobeHemisphereEast' },
  { id: 'private', labelKey: 'visibility.private', iconName: 'LockSimple' },
];

export const FEE_OPTIONS: {
  id: FeeType;
  labelKey: string;
}[] = [
  { id: 'free', labelKey: 'fees.free' },
  { id: 'paid', labelKey: 'fees.paid' },
  { id: 'donation', labelKey: 'fees.donation' },
  { id: 'unknown', labelKey: 'fees.unknown' },
];

export const REACTION_EMOJIS = ['💩', '😂', '🫡', '🤢'] as const;

export const RATING_LABELS: Record<number, string> = {
  1: 'rating.level_1',
  2: 'rating.level_2',
  3: 'rating.level_3',
  4: 'rating.level_4',
  5: 'rating.level_5',
};
