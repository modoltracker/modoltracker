export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type PlaceCategory =
  | 'gas_station'
  | 'minimarket'
  | 'mosque'
  | 'mall'
  | 'restaurant'
  | 'cafe'
  | 'rest_area'
  | 'public_toilet'
  | 'office'
  | 'hospital'
  | 'station'
  | 'airport'
  | 'campus'
  | 'other';

export type PlaceStatus = 'unverified' | 'verified' | 'closed' | 'removed';
export type Visibility = 'public' | 'friends' | 'private';
export type FriendStatus = 'pending' | 'accepted' | 'declined';
export type FeeType = 'free' | 'paid' | 'donation' | 'unknown';
export type ReportTarget = 'place' | 'review' | 'checkin' | 'photo' | 'profile' | 'comment';
export type ReportStatus = 'open' | 'reviewing' | 'resolved' | 'rejected';
export type LiveStatus = 'no_water' | 'long_queue' | 'cleaning' | 'closed' | 'out_of_order' | 'very_clean';
export type UserRole = 'user' | 'moderator' | 'admin';
export type ClaimStatus = 'pending' | 'approved' | 'rejected';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string;
          display_name: string | null;
          avatar_url: string | null;
          bio: string | null;
          role: UserRole;
          is_private: boolean;
          default_visibility: Visibility;
          feed_delay_hours: number;
          locale: string;
          active_title: string | null;
          is_premium: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database['public']['Tables']['profiles']['Row']> & {
          id: string;
          username: string;
        };
        Update: Partial<Database['public']['Tables']['profiles']['Row']>;
      };
      places: {
        Row: {
          id: string;
          name: string;
          slug: string | null;
          category: PlaceCategory;
          lat: number;
          lng: number;
          address: string | null;
          city: string | null;
          province: string | null;
          status: PlaceStatus;
          source: string;
          osm_id: string | null;
          has_squat: boolean | null;
          has_sitting: boolean | null;
          has_jet_washer: boolean | null;
          has_bucket: boolean | null;
          has_tissue: boolean | null;
          has_soap: boolean | null;
          has_sink: boolean | null;
          is_accessible: boolean | null;
          has_baby_change: boolean | null;
          has_shower: boolean | null;
          has_prayer_room: boolean | null;
          gender_separated: boolean | null;
          fee_type: FeeType;
          fee_amount: number | null;
          is_24h: boolean | null;
          opening_hours: Json | null;
          avg_rating: number | null;
          avg_cleanliness: number | null;
          avg_water: number | null;
          review_count: number;
          checkin_count: number;
          claimed_by: string | null;
          is_verified_clean: boolean;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database['public']['Tables']['places']['Row']> & {
          name: string;
          category: PlaceCategory;
          lat: number;
          lng: number;
        };
        Update: Partial<Database['public']['Tables']['places']['Row']>;
      };
      checkins: {
        Row: {
          id: string;
          user_id: string;
          place_id: string | null;
          lat: number;
          lng: number;
          city: string | null;
          province: string | null;
          visibility: Visibility;
          note: string | null;
          in_private_zone: boolean;
          visible_at: string;
          created_at: string;
        };
        Insert: Partial<Database['public']['Tables']['checkins']['Row']> & {
          user_id: string;
          lat: number;
          lng: number;
        };
        Update: Partial<Database['public']['Tables']['checkins']['Row']>;
      };
      reviews: {
        Row: {
          id: string;
          user_id: string;
          place_id: string;
          checkin_id: string | null;
          rating_cleanliness: number;
          rating_water: number;
          rating_privacy: number | null;
          rating_smell: number | null;
          rating_supplies: number | null;
          overall_rating: number;
          body: string | null;
          is_location_verified: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database['public']['Tables']['reviews']['Row']> & {
          user_id: string;
          place_id: string;
          rating_cleanliness: number;
          rating_water: number;
        };
        Update: Partial<Database['public']['Tables']['reviews']['Row']>;
      };
      friendships: {
        Row: {
          id: string;
          requester_id: string;
          addressee_id: string;
          status: FriendStatus;
          created_at: string;
          responded_at: string | null;
        };
        Insert: {
          requester_id: string;
          addressee_id: string;
          status?: FriendStatus;
        };
        Update: {
          status?: FriendStatus;
          responded_at?: string | null;
        };
      };
      private_zones: {
        Row: {
          id: string;
          user_id: string;
          label: string;
          lat: number;
          lng: number;
          radius_m: number;
          created_at: string;
        };
        Insert: {
          user_id: string;
          label?: string;
          lat: number;
          lng: number;
          radius_m?: number;
        };
        Update: Partial<Database['public']['Tables']['private_zones']['Row']>;
      };
      feature_flags: {
        Row: {
          key: string;
          enabled: boolean;
          rollout_pct: number;
          allowed_roles: UserRole[];
          description: string | null;
          updated_at: string;
        };
        Insert: Partial<Database['public']['Tables']['feature_flags']['Row']> & {
          key: string;
        };
        Update: Partial<Database['public']['Tables']['feature_flags']['Row']>;
      };
    };
  };
}
