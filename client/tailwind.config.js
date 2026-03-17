/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#0066ff',
          hover: '#0052cc',
          light: '#e8f0ff',
        },
        surface: {
          primary: '#ffffff',
          secondary: '#f7f7f8',
          tertiary: '#f0f0f2',
        },
        border: {
          default: '#e8e8ec',
          strong: '#d0d0d8',
        },
        text: {
          primary: '#111118',
          secondary: '#52525e',
          muted: '#9898a6',
        },
        warning: {
          DEFAULT: '#ff6b00',
          light: '#fff3e8',
        },
        success: '#00a86b',
        danger: '#ff3355',
        rating: '#ffb800',
      },
      fontFamily: {
        display: ['Plus Jakarta Sans', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        pill: '9999px',
        pro: '12px',
        img: '8px',
      },
      boxShadow: {
        premium: '0 4px 24px rgba(0, 0, 0, 0.08)',
      },
      transitionProperty: {
        'smooth': 'all',
      },
      transitionDuration: {
        'smooth': '200ms',
      },
      transitionTimingFunction: {
        'smooth': 'ease-out',
      },
    },
  },
  plugins: [],
}
