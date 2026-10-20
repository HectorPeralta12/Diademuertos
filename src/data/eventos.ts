/**
 * Día de Muertos events in Prague, 2026. Only events confirmed by their
 * organizers or a published listing, checked on 2026-10-20; each keeps the
 * link it was confirmed from. Update this list every season.
 */
import type { Lang } from '../i18n';

type Text = Record<Lang, string>;

export interface Evento {
  name: Text;
  /** Days, as ISO dates (YYYY-MM-DD) */
  days: string[];
  hours: string;
  venue: string;
  address: string;
  summary: Text;
  price: Text;
  site: string;
  /** Where the details were confirmed */
  sources: string[];
}

export const EVENTOS: Evento[] = [
  {
    name: {
      es: 'Festival Día de Muertos en el Náprstek',
      en: 'Día de Muertos Festival at the Náprstek Museum',
      cs: 'Festival Día de Muertos v Náprstkově muzeu',
    },
    days: ['2026-10-31', '2026-11-01'],
    hours: '10:00–21:30',
    venue: 'Náprstkovo muzeum',
    address: 'Betlémské náměstí 269/1, Praha 1',
    summary: {
      es: 'Talleres, música, danza, arte, cine y comida para toda la familia. Lo organiza la comunidad mexicana en Chequia con el apoyo de la Embajada de México, el Museo Náprstek, Las Adelitas y Dorado Café.',
      en: 'Workshops, music, dance, art, cinema and food for the whole family. Organized by the Mexican community in Czechia with the support of the Embassy of Mexico, the Náprstek Museum, Las Adelitas and Dorado Café.',
      cs: 'Dílny, hudba, tanec, umění, film a jídlo pro celou rodinu. Pořádá mexická komunita v Česku s podporou mexického velvyslanectví, Náprstkova muzea, Las Adelitas a Dorado Café.',
    },
    price: {
      es: 'Consulta el programa y la entrada en su sitio.',
      en: 'See the program and admission on their website.',
      cs: 'Program a vstupné najdete na jejich webu.',
    },
    site: 'https://diademuertos.cz/',
    sources: ['https://diademuertos.cz/'],
  },
  {
    name: {
      es: 'Día de Muertos en la Holešovická tržnice',
      en: 'Día de Muertos at Holešovice Market',
      cs: 'Día de Muertos v Holešovické tržnici',
    },
    days: ['2026-11-05'],
    hours: '11:00–22:00',
    venue: 'Holešovická tržnice',
    address: 'Bubenské nábřeží 306/13, Praha 7',
    summary: {
      es: 'Ofrenda preparada por la Embajada de México, comida mexicana, mariachi, desfile y un mercado mexicano en la Hala 13. Carnaval para niños en la Hala 11, de 13:00 a 19:00.',
      en: 'An ofrenda prepared by the Embassy of Mexico, Mexican food, mariachi, a parade and a Mexican market in Hall 13. A kids’ carnival in Hall 11, from 13:00 to 19:00.',
      cs: 'Ofrenda od mexického velvyslanectví, mexické jídlo, mariachi, průvod a mexický trh v Hale 13. Dětský karneval v Hale 11 od 13:00 do 19:00.',
    },
    price: {
      es: 'Entrada libre. Programa infantil: 100 Kč por persona.',
      en: 'Free entry. Kids’ program: CZK 100 per person.',
      cs: 'Vstup zdarma. Dětský program: 100 Kč za osobu.',
    },
    site: 'https://www.holesovickatrznice.cz/program/dia-de-muertos',
    sources: ['https://praguemorning.cz/dia-de-muertos-prague-2026/', 'https://www.holesovickatrznice.cz/program/dia-de-muertos'],
  },
];
