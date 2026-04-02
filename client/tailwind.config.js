/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
          700: '#0e7490',
          800: '#155e75',
          900: '#0c4a6e',
          950: '#082f49'
        },
        violet: {
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9'
        },
        sand: '#f8fafc'
      },
      fontFamily: {
        heading: ['Sora', 'ui-sans-serif', 'sans-serif'],
        body: ['Inter', 'Public Sans', 'ui-sans-serif', 'sans-serif']
      },
      boxShadow: {
        soft: '0 20px 60px -15px rgba(8, 145, 178, 0.28)',
        card: '0 1px 3px rgba(0,0,0,0.04), 0 10px 40px -10px rgba(8, 145, 178, 0.1)',
        glow: '0 0 28px rgba(6, 182, 212, 0.45), 0 4px 18px rgba(6, 182, 212, 0.2)',
        'glow-lg': '0 0 55px rgba(6, 182, 212, 0.5), 0 8px 32px rgba(6, 182, 212, 0.25)',
        'glow-violet': '0 0 28px rgba(139, 92, 246, 0.45)',
        'inner-glow': 'inset 0 1px 0 rgba(255,255,255,0.12)'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        fadeSlideIn: {
          '0%': { opacity: '0', transform: 'translateY(14px)' },
          '100%': { opacity: '1', transform: 'translateY(0px)' }
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' }
        },
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' }
        },
        glowPulse: {
          '0%, 100%': { opacity: '0.55' },
          '50%': { opacity: '1' }
        },
        orb: {
          '0%, 100%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(40px, -40px) scale(1.06)' },
          '66%': { transform: 'translate(-24px, 24px) scale(0.94)' }
        },
        ping: {
          '75%, 100%': { transform: 'scale(2)', opacity: '0' }
        }
      },
      animation: {
        float: 'float 5s ease-in-out infinite',
        fadeSlideIn: 'fadeSlideIn 0.45s ease-out forwards',
        shimmer: 'shimmer 2.5s linear infinite',
        gradientShift: 'gradientShift 6s ease infinite',
        glowPulse: 'glowPulse 3s ease-in-out infinite',
        orb: 'orb 10s ease-in-out infinite',
        'orb-slow': 'orb 14s ease-in-out infinite reverse'
      }
    }
  },
  plugins: []
};
