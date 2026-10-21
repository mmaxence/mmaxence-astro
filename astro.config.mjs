// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://mmaxence.me', // Your custom domain
  base: '/', // Base path for GitHub Pages (use '/' for root or '/repo-name' for project pages)
  integrations: [react(), mdx(), sitemap()],
  output: 'static', // Static site generation for GitHub Pages
  vite: {
    // Builds must not replace the React runtime used by a running dev server.
    cacheDir: `./node_modules/.vite/${process.env.NODE_ENV === 'production' ? 'production' : 'development'}`,
  },
});
