export const modolTailwindPreset = {
  theme: {
    extend: {
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
      fontFamily: {
        display: ['var(--font-baloo)', '"Baloo 2"', 'system-ui', 'sans-serif'],
        sans: ['var(--font-nunito)', 'Nunito', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '24px',
      },
      boxShadow: {
        'lip-sm': '0 2px 0 var(--lip-color, #D6C6AD)',
        'lip-md': '0 4px 0 var(--lip-color, #D6C6AD)',
        'lip-lg': '0 6px 0 var(--lip-color, #E0A500)',
        sheet: '0 -8px 24px rgba(60,42,30,0.12)',
      },
    },
  },
};

export default modolTailwindPreset;
