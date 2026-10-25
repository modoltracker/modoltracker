import { z } from 'zod';

export const placeCategorySchema = z.enum([
  'gas_station',
  'minimarket',
  'mosque',
  'mall',
  'restaurant',
  'cafe',
  'rest_area',
  'public_toilet',
  'office',
  'hospital',
  'station',
  'airport',
  'campus',
  'other',
]);

export const visibilitySchema = z.enum(['public', 'friends', 'private']);
export const feeTypeSchema = z.enum(['free', 'paid', 'donation', 'unknown']);

export const createPlaceSchema = z.object({
  name: z.string().min(3, 'Nama tempat minimal 3 karakter').max(100),
  category: placeCategorySchema,
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  address: z.string().max(250).optional(),
  city: z.string().max(100).optional(),
  province: z.string().max(100).optional(),
  fee_type: feeTypeSchema.default('unknown'),
  fee_amount: z.number().int().min(0).max(100000).nullable().optional(),
  is_24h: z.boolean().default(false),
  has_squat: z.boolean().default(false),
  has_sitting: z.boolean().default(false),
  has_jet_washer: z.boolean().default(false),
  has_bucket: z.boolean().default(false),
  has_tissue: z.boolean().default(false),
  has_soap: z.boolean().default(false),
  has_sink: z.boolean().default(false),
  is_accessible: z.boolean().default(false),
  has_baby_change: z.boolean().default(false),
  has_shower: z.boolean().default(false),
  has_prayer_room: z.boolean().default(false),
  gender_separated: z.boolean().default(false),
});

export type CreatePlaceInput = z.infer<typeof createPlaceSchema>;

export const createCheckinSchema = z.object({
  place_id: z.string().uuid().nullable(),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  visibility: visibilitySchema.default('friends'),
  note: z.string().max(280, 'Catatan maksimal 280 karakter').optional(),
});

export type CreateCheckinInput = z.infer<typeof createCheckinSchema>;

export const createReviewSchema = z.object({
  place_id: z.string().uuid(),
  checkin_id: z.string().uuid().nullable().optional(),
  rating_cleanliness: z.number().int().min(1).max(5),
  rating_water: z.number().int().min(1).max(5),
  rating_privacy: z.number().int().min(1).max(5).nullable().optional(),
  rating_smell: z.number().int().min(1).max(5).nullable().optional(),
  rating_supplies: z.number().int().min(1).max(5).nullable().optional(),
  body: z.string().max(1000, 'Ulasan maksimal 1000 karakter').optional(),
  facilities: z.array(z.string()).optional(),
});

export type CreateReviewInput = z.infer<typeof createReviewSchema>;

export const profileUpdateSchema = z.object({
  username: z
    .string()
    .regex(/^[a-z0-9_]{3,20}$/, 'Username 3-20 karakter (huruf kecil, angka, underscore)'),
  display_name: z.string().max(50).optional(),
  bio: z.string().max(160).optional(),
  is_private: z.boolean().default(false),
  default_visibility: visibilitySchema.default('friends'),
  feed_delay_hours: z.number().int().min(0).max(24).default(2),
});

export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;

export const registerUsernameSchema = z
  .object({
    display_name: z.string().min(2, 'Nama minimal 2 karakter').max(50),
    username: z
      .string()
      .trim()
      .toLowerCase()
      .regex(
        /^[a-z0-9_]{3,20}$/,
        'Username 3-20 karakter (huruf kecil, angka, atau garis bawah _)'
      ),
    password: z.string().min(6, 'Password minimal 6 karakter'),
    confirm_password: z.string().min(6, 'Konfirmasi password minimal 6 karakter'),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: 'Password dan Konfirmasi Password tidak sama!',
    path: ['confirm_password'],
  });

export type RegisterUsernameInput = z.infer<typeof registerUsernameSchema>;

export const loginUsernameSchema = z.object({
  username: z.string().trim().toLowerCase().min(3, 'Masukkan username kamu'),
  password: z.string().min(1, 'Masukkan password kamu'),
});

export type LoginUsernameInput = z.infer<typeof loginUsernameSchema>;

/**
 * Mengubah username menjadi format email internal Supabase Auth
 * agar user bisa daftar & login cukup dengan Username + Password tanpa wajib email di awal.
 */
export function usernameToInternalAuthEmail(username: string): string {
  const clean = username.trim().toLowerCase().replace(/[^a-z0-9_]/g, '');
  return `${clean}@akun.modoltracker.web.id`;
}

