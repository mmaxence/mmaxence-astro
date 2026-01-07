/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      fontFamily: {
        'body': ['var(--font-body)', 'sans-serif'],
        'heading': ['var(--font-heading)', 'serif'],
        'mono': ['var(--font-heading)', 'monospace'], // Use CSS variable so it switches
        'sans': ['var(--font-body)', 'sans-serif'],
        'serif': ['var(--font-heading)', 'serif'],
      },
      fontSize: {
        'base': '1.125rem', // 18px
      },
      colors: {
        'text': '#1a1a1a',
        'text-muted': 'rgba(26, 26, 26, 0.6)',
        'text-light': 'rgba(26, 26, 26, 0.5)',
        'bg': '#ffffff',
        'bg-muted': '#f1f2f3',
        'accent': '#000000',
        'accent-hover': '#1a1a1a',
        'highlight': '#FBF1A9',
        'border': '#e5e7eb',
        'border-light': '#f1f2f3',
      },
    },
  },
  plugins: [],
}
