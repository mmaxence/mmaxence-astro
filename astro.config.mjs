// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  site: 'https://mmaxence.me', // Your custom domain
  base: '/', // Base path for GitHub Pages (use '/' for root or '/repo-name' for project pages)
  integrations: [react()],
  output: 'static', // Static site generation for GitHub Pages
});
