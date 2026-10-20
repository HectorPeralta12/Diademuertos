// @ts-check
import { defineConfig, fontProviders } from 'astro/config';

export default defineConfig({
  output: 'static',
  // Spanish at /, English at /en/, Czech at /cs/ (copy in src/i18n)
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en', 'cs'],
    routing: { prefixDefaultLocale: false },
  },
  // A single page: inlining the CSS saves the round trip that blocks the first paint
  build: { inlineStylesheets: 'always' },
  fonts: [
    {
      provider: fontProviders.google(),
      name: 'Jost',
      cssVariable: '--font-jost',
      weights: ['300 600'],
      styles: ['normal'],
      subsets: ['latin', 'latin-ext'],
      fallbacks: ['Futura', 'sans-serif'],
    },
    {
      provider: fontProviders.google(),
      name: 'Geist Mono',
      cssVariable: '--font-geist-mono',
      weights: [400, 500],
      styles: ['normal'],
      subsets: ['latin', 'latin-ext'],
      fallbacks: ['ui-monospace', 'monospace'],
    },
  ],
});
