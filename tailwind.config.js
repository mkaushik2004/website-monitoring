/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#EBF5FF',
          100: '#D6EBFF',
          200: '#ADD6FF',
          300: '#84C0FF',
          400: '#5AAAFF',
          500: '#0A84FF',  // Apple blue
          600: '#0074E0',
          700: '#0064C2',
          800: '#0055A3',
          900: '#004585',
        },
        success: {
          50: '#E7F9EF',
          100: '#D0F4DF',
          200: '#A0E9BF',
          300: '#71DE9F',
          400: '#51D483',
          500: '#30D158',  // Apple green
          600: '#28B84C',
          700: '#239F41',
          800: '#1E8637',
          900: '#196D2D',
        },
        warning: {
          50: '#FFFBE6',
          100: '#FFF7CC',
          200: '#FFEF99',
          300: '#FFE766',
          400: '#FFDF33',
          500: '#FFD60A',  // Apple yellow
          600: '#E6BF00',
          700: '#CCA800',
          800: '#B39200',
          900: '#997B00',
        },
        danger: {
          50: '#FEEAE9',
          100: '#FDD5D3',
          200: '#FBABA7',
          300: '#F9817B',
          400: '#F7584F',
          500: '#FF453A',  // Apple red
          600: '#E63B31',
          700: '#CC332B',
          800: '#B32C25',
          900: '#99251F',
        },
        slate: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',
          950: '#020617',
        },
      },
      fontFamily: {
        sans: [
          'SF Pro Display',
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
      },
      boxShadow: {
        'apple': '0 0 10px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.07)',
        'apple-md': '0 0 15px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.08)',
        'apple-lg': '0 10px 25px rgba(0, 0, 0, 0.1), 0 3px 6px rgba(0, 0, 0, 0.05)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      transitionTimingFunction: {
        'apple': 'cubic-bezier(0.2, 0.8, 0.2, 1)',
      },
      gridTemplateColumns: {
        'auto-fill-200': 'repeat(auto-fill, minmax(200px, 1fr))',
        'auto-fill-300': 'repeat(auto-fill, minmax(300px, 1fr))',
      },
    },
  },
  plugins: [],
};