import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

// Static presentation deck — copied into the pauldiazashot.com site (Vercel),
// served as flat files at pauldiazashot.com/project_aixot/. This mirrors the
// amadeo.run/project-aix-ot/ deck and is kept here as a backup host.
// https://astro.build/config
export default defineConfig({
  base: '/project_aixot/',
  output: 'static',
  integrations: [
    react(),
    // We author the editorial look in src/styles/global.css, which contains the
    // @tailwind directives, so we don't let the integration inject its own base.
    tailwind({ applyBaseStyles: false }),
  ],
});
