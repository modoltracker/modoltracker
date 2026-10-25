export const DESIGN_TOKENS = {
  colors: {
    sunny: { DEFAULT: '#FFC800', shade: '#E0A500' },
    choco: { DEFAULT: '#8A5A3B', shade: '#5C3A22' },
    splash: { DEFAULT: '#1CB0F6', shade: '#1593CF' },
    fresh: { DEFAULT: '#4CC764', shade: '#3AA14F' },
    cherry: { DEFAULT: '#FF4B4B', shade: '#D93636' },
    bubble: { DEFAULT: '#FF7EB6', shade: '#E0609A' },
    grape: { DEFAULT: '#A570FF', shade: '#8452DB' },
    ink: { DEFAULT: '#3C2A1E', soft: '#7A6656', faint: '#B3A393' },
    line: { DEFAULT: '#EADFCC', strong: '#D6C6AD' },
    cream: '#FFF8EC',
    paper: '#FFFFFF',
    sand: '#F6ECDA',
  },
  radius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
  },
  motion: {
    instant: 80,
    quick: 150,
    base: 250,
    bounce: 400,
    celebrate: 1200,
  },
} as const;

export function getPinColorByRating(rating: number | null | undefined): {
  bg: string;
  shade: string;
  label: string;
} {
  if (rating === null || rating === undefined) {
    return { bg: DESIGN_TOKENS.colors.ink.faint, shade: '#8C7C6D', label: 'Belum diulas' };
  }
  if (rating >= 4.0) {
    return { bg: DESIGN_TOKENS.colors.fresh.DEFAULT, shade: DESIGN_TOKENS.colors.fresh.shade, label: 'Kinclong' };
  }
  if (rating >= 3.0) {
    return { bg: DESIGN_TOKENS.colors.sunny.DEFAULT, shade: DESIGN_TOKENS.colors.sunny.shade, label: 'Lumayan' };
  }
  return { bg: DESIGN_TOKENS.colors.cherry.DEFAULT, shade: DESIGN_TOKENS.colors.cherry.shade, label: 'Kurang' };
}
