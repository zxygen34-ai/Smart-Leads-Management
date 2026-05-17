import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Space Grotesk"', 'ui-sans-serif', 'system-ui'],
        body: ['"Spline Sans"', 'ui-sans-serif', 'system-ui']
      },
      colors: {
        base: 'var(--bg)',
        surface: 'var(--surface)',
        ink: 'var(--ink)',
        muted: 'var(--muted)',
        accent: 'var(--accent)',
        accent2: 'var(--accent-2)',
        accent3: 'var(--accent-3)',
        ring: 'var(--ring)'
      },
      boxShadow: {
        soft: '0 18px 40px -32px rgba(15, 23, 42, 0.45)',
        glow: '0 0 30px rgba(15, 118, 110, 0.2)',
        lift: '0 20px 60px rgba(15, 23, 42, 0.18)'
      }
    }
  },
  plugins: []
} satisfies Config;
