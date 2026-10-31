/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#0A0C10',
          raised: '#11151C',
          sunken: '#070910',
        },
        hair: {
          DEFAULT: '#1C222C',
          strong: '#2A323F',
        },
        type: {
          DEFAULT: '#E8EAED',
          muted: '#8A93A3',
          faint: '#5B6475',
        },
        signal: {
          DEFAULT: '#7DA2FF',
          dim: '#4A6DC4',
          wash: 'rgba(125, 162, 255, 0.08)',
        },
        live: {
          DEFAULT: '#D9A441',
          wash: 'rgba(217, 164, 65, 0.10)',
        },
      },
      fontFamily: {
        sans: ['"IBM Plex Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      fontSize: {
        'display-xl': ['clamp(2.75rem, 7vw, 5.25rem)', { lineHeight: '0.95', letterSpacing: '-0.035em' }],
        'display-lg': ['clamp(2rem, 4.5vw, 3.25rem)', { lineHeight: '1.04', letterSpacing: '-0.028em' }],
        'display-md': ['clamp(1.5rem, 3vw, 2.125rem)', { lineHeight: '1.12', letterSpacing: '-0.02em' }],
        trace: ['0.8125rem', { lineHeight: '1.7', letterSpacing: '0.01em' }],
      },
      maxWidth: { measure: '68ch', wide: '82rem' },
      transitionTimingFunction: { out: 'cubic-bezier(0.22, 1, 0.36, 1)' },
      keyframes: {
        caret: { '0%, 49%': { opacity: '1' }, '50%, 100%': { opacity: '0' } },
        'pulse-ring': {
          '0%': { boxShadow: '0 0 0 0 rgba(217,164,65,0.45)' },
          '70%': { boxShadow: '0 0 0 7px rgba(217,164,65,0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(217,164,65,0)' },
        },
        drift: {
          '0%, 100%': { transform: 'translate3d(0,0,0)' },
          '50%': { transform: 'translate3d(0,-10px,0)' },
        },
      },
      animation: {
        caret: 'caret 1.05s step-end infinite',
        'pulse-ring': 'pulse-ring 2.2s ease-out infinite',
        drift: 'drift 9s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
