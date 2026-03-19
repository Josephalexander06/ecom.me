/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#1859ff',
          hover: '#0f43ca',
          light: '#e8f0ff',
        },
        surface: {
          primary: '#f8f9fc',
          secondary: '#eef1f7',
          tertiary: '#e6eaf3',
        },
        border: {
          default: '#dbe0eb',
          strong: '#b8c0d0',
        },
        text: {
          primary: '#111827',
          secondary: '#334155',
          muted: '#64748b',
        },
        warning: {
          DEFAULT: '#f97316',
          light: '#ffedd5',
        },
        success: '#16a34a',
        danger: '#e11d48',
        rating: '#f59e0b',
      },
      fontFamily: {
        display: ['Sora', 'sans-serif'],
        body: ['Manrope', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        pill: '9999px',
        pro: '14px',
        img: '10px',
      },
      boxShadow: {
        premium: '0 18px 42px -24px rgba(17, 24, 39, 0.48)',
      },
      transitionProperty: {
        smooth: 'all',
      },
      transitionDuration: {
        smooth: '200ms',
      },
      transitionTimingFunction: {
        smooth: 'ease-out',
      },
    },
  },
  plugins: [],
};
