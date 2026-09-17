/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Outfit"', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
        display: ['"Space Grotesk"', '"Outfit"', 'sans-serif'],
      },
      colors: {
        space: {
          950: '#030712',
          900: '#070b19',
          850: '#0c1224',
          800: '#111936',
          700: '#1e2952',
          600: '#2d3e75',
        },
        cyber: {
          cyan: '#00f2fe',
          blue: '#4facfe',
          purple: '#7928ca',
          magenta: '#ff0080',
          emerald: '#10b981',
          amber: '#f59e0b',
          rose: '#f43f5e',
          violet: '#8b5cf6',
          teal: '#14b8a6',
        }
      },
      boxShadow: {
        'glow-cyan': '0 0 30px -5px rgba(0, 242, 254, 0.4)',
        'glow-purple': '0 0 30px -5px rgba(121, 40, 202, 0.4)',
        'glow-magenta': '0 0 30px -5px rgba(255, 0, 128, 0.4)',
        'glow-amber': '0 0 30px -5px rgba(245, 158, 11, 0.4)',
        'glass-card': '0 8px 32px 0 rgba(0, 0, 0, 0.45)',
        'glass-inner': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.12)',
      },
      animation: {
        'float-slow': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'spin-slow': 'spin 20s linear infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.04)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      }
    },
  },
  plugins: [],
}
