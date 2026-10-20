/**
 * The page in three languages. Spanish lives at /, English at /en/ and Czech
 * at /cs/ (see astro.config.mjs). Every component reads its copy with
 * `strings(Astro.currentLocale)`.
 */
import es from './es';
import en from './en';
import cs from './cs';

export type Strings = typeof es;
export type Lang = 'es' | 'en' | 'cs';

export const LANGS: { code: Lang; label: string; name: string }[] = [
  { code: 'es', label: 'ES', name: 'Español' },
  { code: 'en', label: 'EN', name: 'English' },
  { code: 'cs', label: 'CS', name: 'Čeština' },
];

const all: Record<Lang, Strings> = { es, en, cs };

export const lang = (locale: string | undefined): Lang => (locale === 'en' || locale === 'cs' ? locale : 'es');

export const strings = (locale: string | undefined) => all[lang(locale)];

/** The home of a language */
export const homeOf = (code: Lang) => (code === 'es' ? '/' : `/${code}/`);
