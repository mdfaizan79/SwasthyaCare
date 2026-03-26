/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#ebf8fb',
          100: '#d1eff6',
          500: '#1188a3',
          600: '#0f7086',
          700: '#0d5f71',
          900: '#0a2d3a'
        },
        accent: {
          100: '#e9f4ff',
          300: '#9dc8f9',
          500: '#3e7cc5',
          700: '#254f88'
        },
        sand: '#f7f5f0'
      },
      fontFamily: {
        heading: ['Sora', 'ui-sans-serif', 'sans-serif'],
        body: ['Public Sans', 'ui-sans-serif', 'sans-serif']
      },
      boxShadow: {
        soft: '0 15px 45px -22px rgba(12, 110, 128, 0.4)'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' }
        },
        fadeSlideIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0px)' }
        }
      },
      animation: {
        float: 'float 4s ease-in-out infinite',
        fadeSlideIn: 'fadeSlideIn 0.4s ease-out forwards'
      }
    }
  },
  plugins: []
};
