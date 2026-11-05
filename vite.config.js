import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { cloudflare } from '@cloudflare/vite-plugin';
import { profile } from './server/data/profile.js';
import { seoPlugin } from './tools/seo-plugin.js';

export default defineConfig({
  // cloudflare() runs server/worker.js inside workerd, the same runtime used in
  // production, so `npm run dev` exercises the real Express-on-Workers path.
  plugins: [svelte(), cloudflare(), seoPlugin()],
  define: {
    // Lets the "API unavailable" screen still point somewhere useful.
    __LINKEDIN_URL__: JSON.stringify(profile.person.linkedin),
  },
});
