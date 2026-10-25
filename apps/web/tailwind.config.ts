import type { Config } from 'tailwindcss';
import modolPreset from '@modoltracker/config/tailwind-preset';

const config: Config = {
  presets: [modolPreset],
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './features/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
