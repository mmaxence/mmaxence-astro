/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      fontFamily: {
        'body': ['var(--font-body)', 'sans-serif'],
        'heading': ['var(--font-heading)', 'serif'],
        'mono': ['var(--font-heading)', 'monospace'],
        'sans': ['var(--font-body)', 'sans-serif'],
        'serif': ['var(--font-heading)', 'serif'],
      },
      fontSize: {
        'base': '1.125rem',
      },
      colors: {
        'theme-text': 'var(--theme-text)',
        'theme-text-muted': 'var(--theme-text-muted)',
        'theme-bg': 'var(--theme-bg)',
        'theme-accent': 'var(--theme-accent)',
        'theme-border': 'var(--theme-border)',
        'theme-highlight': 'var(--theme-highlight)',
      },
      boxShadow: {
        'theme': 'var(--theme-shadow)',
        'theme-hover': 'var(--shadow-hover)',
      },
      borderRadius: {
        'card': 'var(--radius-card)',
        'card-image': 'var(--radius-card-image)',
        'card-inner': 'var(--radius-card-inner)',
      },
    },
  },
  plugins: [],
}
