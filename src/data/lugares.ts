/**
 * Latin American places in Prague tied to the season: restaurants, a café, a
 * shop and a mariachi band. Only places confirmed by their own website or a
 * published listing, checked on 2026-10-20; no sponsorship. Update every season.
 */
import type { Lang } from '../i18n';

type Text = Record<Lang, string>;

export interface Lugar {
  name: string;
  kind: Text;
  text: Text;
  /** Street addresses; empty for a band that plays around the city */
  addresses: string[];
  site?: string;
  sources: string[];
}

export const LUGARES: Lugar[] = [
  {
    name: 'Las Adelitas',
    kind: { es: 'Restaurante mexicano', en: 'Mexican restaurant', cs: 'Mexická restaurace' },
    text: {
      es: 'Celebra el Día de Muertos y coorganiza el festival del Museo Náprstek. Mariachi el jueves 22 de octubre en la sucursal de V Jámě.',
      en: 'It celebrates the Day of the Dead and co-organizes the festival at the Náprstek Museum. Mariachi on Thursday, October 22, at the V Jámě branch.',
      cs: 'Slaví Den mrtvých a spolupořádá festival v Náprstkově muzeu. Mariachi ve čtvrtek 22. října na pobočce V Jámě.',
    },
    addresses: ['V Jámě 9, Praha 1', 'Petrská 23, Praha 1', 'Americká 8, Praha 2', 'Lucemburská 6, Praha 3'],
    site: 'https://www.lasadelitas.cz/en/',
    sources: ['https://www.lasadelitas.cz/en/', 'https://www.mariachi.cz/kalendar-akci/'],
  },
  {
    name: 'Dorado Coffee',
    kind: { es: 'Café y galería colombiana', en: 'Colombian café and gallery', cs: 'Kolumbijská kavárna a galerie' },
    text: {
      es: 'Una familia colombiana que tuesta su propio café. Organiza conciertos, cine y exposiciones latinoamericanas, y apoya el festival del Náprstek, en el mismo edificio.',
      en: 'A Colombian family that roasts its own coffee. It hosts Latin American concerts, films and exhibitions, and supports the Náprstek festival, in the same building.',
      cs: 'Kolumbijská rodina, která si sama praží kávu. Pořádá latinskoamerické koncerty, promítání a výstavy a podporuje festival v Náprstkově muzeu ve stejné budově.',
    },
    addresses: ['Betlémské náměstí 269/1, Praha 1'],
    site: 'https://doradocoffee.cz/cs/events/',
    sources: ['https://doradocoffee.cz/cs/events/', 'https://diademuertos.cz/'],
  },
  {
    name: 'Mexicali',
    kind: { es: 'Tienda mexicana', en: 'Mexican shop', cs: 'Mexický obchod' },
    text: {
      es: 'Tortillas, chiles, salsas, frijoles, dulces y decoración mexicana: lo necesario para cocinar la comida de tu ofrenda. Cerca de la O2 Arena.',
      en: 'Tortillas, chiles, salsas, beans, sweets and Mexican decor: what you need to cook the food for your ofrenda. Near the O2 Arena.',
      cs: 'Tortilly, chilli papričky, salsy, fazole, sladkosti a mexické dekorace: vše na vaření jídla pro vaši ofrendu. Nedaleko O2 areny.',
    },
    addresses: ['Kovářská 939/4, Praha 9'],
    site: 'https://www.mexicali-mercado.eu/',
    sources: ['https://www.mexicali-mercado.eu/', 'https://www.expats.cz/czech-news/article/travel-the-world-without-leaving-home-specialty-food-shops-in-prague'],
  },
  {
    name: 'Mexická',
    kind: { es: 'Restaurante mexicano', en: 'Mexican restaurant', cs: 'Mexická restaurace' },
    text: {
      es: 'El restaurante mexicano más grande del país, en el antiguo pivovar de Holešovice. Noche de Día de Muertos con mariachi el sábado 31 de octubre.',
      en: 'The largest Mexican restaurant in the country, in the former Holešovice brewery. A Day of the Dead night with mariachi on Saturday, October 31.',
      cs: 'Největší mexická restaurace v zemi, v bývalém holešovickém pivovaru. Večer Dne mrtvých s mariachi v sobotu 31. října.',
    },
    addresses: ['U Průhonu 800/13, Praha 7'],
    sources: ['https://www.archiweb.cz/en/b/mexicka', 'https://www.mariachi.cz/kalendar-akci/'],
  },
  {
    name: 'Mariachi Azteca de Praga',
    kind: { es: 'Mariachi', en: 'Mariachi band', cs: 'Mariachi' },
    text: {
      es: 'El mariachi de Praga. Esta temporada toca en las fiestas de Día de Muertos de la ciudad, entre ellas la Holešovická tržnice el 5 de noviembre.',
      en: 'Prague’s mariachi band. This season they play at the city’s Day of the Dead parties, including Holešovice Market on November 5.',
      cs: 'Pražská mariachi kapela. Letos hraje na oslavách Dne mrtvých ve městě, mimo jiné 5. listopadu v Holešovické tržnici.',
    },
    addresses: [],
    site: 'https://www.mariachi.cz/kalendar-akci/',
    sources: ['https://www.mariachi.cz/kalendar-akci/'],
  },
];
