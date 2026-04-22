import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      /* ============================================
         FONTS — Lufga (all weights) + Cinzel
         ============================================ */
      fontFamily: {
        lufga: ['Lufga', 'Georgia', 'serif'],
        cinzel: ['Cinzel', 'serif'],
      },

      /* ============================================
         COLORS — All brand tokens
         ============================================ */
      colors: {
        // Neutrals & backgrounds
        ink: 'var(--ink)',
        surface: 'var(--surface)',
        'surface-2': 'var(--surface-2)',

        // Accents
        gold: 'var(--gold)',
        'gold-light': 'var(--gold-light)',
        'gold-pale': 'var(--gold-pale)',

        // Text & content
        cream: 'var(--cream)',
        muted: 'var(--muted)',

        // Emotions
        wine: 'var(--wine)',
        rose: 'var(--rose)',

        // Structural
        border: 'var(--border)',
        'border-hover': 'var(--border-hover)',

        // Semantic
        background: 'var(--background)',
        foreground: 'var(--foreground)',
      },

      /* ============================================
         BORDER RADIUS — Max 8px except pill
         ============================================ */
      borderRadius: {
        none: '0',
        sm: '2px',
        md: '4px',
        lg: '6px',
        xl: '8px',
        pill: '9999px',
      },

      /* ============================================
         CUSTOM ANIMATIONS
         ============================================ */
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        scrollLine: {
          '0%': {
            transform: 'scaleY(0)',
            transformOrigin: 'top',
          },
          '50%': {
            transform: 'scaleY(1)',
            transformOrigin: 'top',
          },
          '51%': {
            transformOrigin: 'bottom',
          },
          '100%': {
            transform: 'scaleY(0)',
            transformOrigin: 'bottom',
          },
        },
        fadeIn: {
          'from': { opacity: '0' },
          'to': { opacity: '1' },
        },
      },

      animation: {
        marquee: 'marquee 30s linear infinite',
        'scroll-line': 'scrollLine 2s ease-in-out infinite',
        fadeIn: 'fadeIn 0.3s ease-in-out',
      },

      /* ============================================
         CUSTOM UTILITIES
         ============================================ */
      spacing: {
        gutter: 'var(--gutter, 24px)',
      },

      maxWidth: {
        container: '1440px',
      },

      /* ============================================
         TRANSITIONS & DURATIONS
         ============================================ */
      transitionTimingFunction: {
        premium: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
}

export default config
