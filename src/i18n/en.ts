import type { Strings } from './index';

const en: Strings = {
  meta: {
    lang: 'en',
    ogLocale: 'en_US',
    title: 'Day of the Dead · The ofrenda',
    description:
      'Walk through a Day of the Dead altar level by level: what each element means, where its dates come from and why marigolds mark the way. Based on INAH and UNESCO, with this year’s events in Prague.',
  },
  ui: {
    skip: 'Skip to content',
    brand: 'Día de Muertos',
    chapters: { ofrenda: 'Ofrenda', elementos: 'Elements', historia: 'History', eventos: 'In Prague', preguntas: 'Questions' },
    chaptersLabel: 'Chapters',
    languageLabel: 'Language',
    source: 'Source',
    aiImage: 'AI generated image.',
  },
  inicio: {
    kicker: 'November 1 and 2',
    title: ['Day of', 'the Dead'],
    lead: ['An altar for those who come back home.', 'Explore it level by level.'],
    cta: 'Explore the ofrenda',
    proof: 'Based on INAH and UNESCO',
  },
  ofrenda: {
    views: [
      {
        label: 'The ofrenda',
        title: 'An altar to welcome them',
        text: 'A few days before November 1, many homes set up their ofrenda so it is ready when the souls arrive. It is one of the most widespread customs of the celebration.',
      },
      {
        label: 'Flowers, candles and copal',
        title: 'Light and scent to find the way',
        text: 'Candles guide the souls to the ofrenda. Marigolds mark the path from the door of the house, and incense and copal perfume the air and keep evil spirits away.',
      },
      {
        label: 'Food and water',
        title: 'For the hunger and thirst of the journey',
        text: 'Food and water are served to ease the hunger and thirst the souls bring after their long journey. Pan de muerto and sugar skulls are never missing.',
      },
      {
        label: 'Portraits and papel picado',
        title: 'Their faces, at the very top',
        text: 'The portrait tells who is being honored. Papel picado adds color and represents the wind. Objects the person loved are added too; for children, their favorite toys.',
      },
    ],
    source: 'Source: INAH, «Ofrendas para los muertos» (in Spanish)',
  },
  lema: {
    lines: ['As long as someone remembers them,', 'they keep finding', 'their way home.'],
  },
  elementos: {
    kicker: 'Elements of the ofrenda',
    title: 'Seven things almost every ofrenda shares',
    text: 'Each region has its own variations, but according to INAH these elements appear on most altars.',
    items: [
      { name: 'Portraits', text: 'They tell who is honored on the ofrenda.' },
      { name: 'Candles', text: 'They guide the souls to the ofrenda.' },
      { name: 'Food and water', text: 'They ease the hunger and thirst the souls bring after their long journey.' },
      { name: 'Marigolds', text: 'Cempasúchil flowers mark the path from the door of the house to the altar.' },
      { name: 'Incense and copal', text: 'They perfume the space and keep evil spirits away.' },
      { name: 'Papel picado', text: 'Cut paper banners add color to the ofrenda and represent the wind.' },
      { name: 'Sugar skulls and pan de muerto', text: 'They appear on almost any ofrenda, whatever the region.' },
    ],
    source: 'Source: INAH, «Ofrendas para los muertos» (in Spanish)',
  },
  papel: {
    word: 'the wind',
    title: 'The wind',
    text: 'Papel picado adds color to the ofrenda and represents the wind.',
    source: 'Source: INAH, «Ofrendas para los muertos» (in Spanish)',
  },
  camino: {
    alt: 'A house with its lantern lit and a path of marigold petals that leads, under the moon, to an altar full of flowers and candles',
    beats: [
      { kicker: 'The path', title: 'From the front door to the altar', text: 'Marigold flowers mark the path from the entrance of the house to the ofrenda.', source: 'Source: INAH' },
      { kicker: 'The color', title: 'A piece of sun on the ground', text: 'Their yellow is associated with the sun, which guides the souls of the dead.', source: 'Source: Mexican Ministry of Culture' },
      { kicker: 'The arrival', title: 'And the candles welcome them', text: 'Candles guide the souls all the way to the ofrenda.', source: 'Source: INAH' },
    ],
  },
  calendario: {
    months: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'],
    nov: 'NOV 1–2',
    intro: {
      kicker: 'Before November',
      title: 'The Mexica remembered their dead on other dates',
      text: 'Their 365 day solar calendar was divided into 18 periods of twenty days. Several were devoted to the dead, according to how they had died.',
    },
    feasts: [
      { when: 'August and September', text: 'The lesser feast of the dead, devoted to children who had died.' },
      { when: 'August and September', text: 'The great feast, for the dead warriors who dwelt in the house of the Sun.' },
      { when: 'October and November', text: 'Devoted to the mountains and the water deities. Images were made of those who had drowned or died of illnesses tied to water.' },
      { when: 'From the winter solstice', text: 'It closed the solar year. Images were made of those who died a natural death, bound for Mictlan, and then burned.' },
    ],
    catholic: {
      kicker: 'November 1 and 2',
      title: 'Today’s dates come from another calendar',
      text: 'For INAH archaeologist Víctor Joel Santos Ramírez, these Mexica periods did not give rise to the colonial Day of the Dead: its dates arrived with the Catholic Church.',
      source: 'Source: INAH, «El origen del Día de Muertos» (2023, in Spanish)',
    },
  },
  historia: {
    milestones: [
      'Pope Boniface IV consecrates the Pantheon of Agrippa to Saint Mary and all the martyrs. It is the forerunner of All Saints’ Day.',
      'Pope Gregory IV sets the feast of All Saints on November 1.',
      'Odilo, abbot of Cluny, establishes All Souls’ Day on November 2.',
      'The feasts arrive with the Franciscans. Between 1535 and 1540, friar Toribio de Benavente, Motolinía, describes offerings of maize, blankets, food, bread, hens and cacao.',
      'Juárez’s government secularizes the cemeteries. During that century, going to the cemetery becomes a party with food, pulque and music.',
      'Between 1934 and 1940 the celebration is reinvented with a nationalist and secular meaning, according to historian Elsa Malvido.',
      'UNESCO proclaims the «Indigenous festivity dedicated to the dead» a masterpiece of the oral and intangible heritage.',
      'The celebration is inscribed on the Representative List of the Intangible Cultural Heritage of Humanity.',
    ],
  },
  eventos: {
    kicker: 'In Prague',
    title: 'Where to celebrate the Day of the Dead in Prague',
    text: 'The Mexican community in Czechia and the Embassy of Mexico celebrate in the city. These are this year’s events.',
    when: 'When',
    where: 'Where',
    price: 'Admission',
    map: 'Open in maps',
    site: 'Event website',
    checked: 'Details checked on October 20, 2026. Confirm times and prices on each event’s website before you go.',
    weekdays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    lugares: {
      kicker: 'Latin places',
      title: 'To live the season all year round',
      text: 'Restaurants, a café, a shop and the city’s mariachi: Latin places in Prague that celebrate with the community.',
      site: 'Website',
      noSponsor: 'Not sponsored: only places we confirmed through their own website or a published source.',
    },
  },
  preguntas: {
    kicker: 'Questions',
    title: 'What people often ask about the ofrenda',
    faqs: [
      { q: 'When is the ofrenda set up?', a: 'A few days before November 1, so it is ready when the souls arrive. That is how INAH describes it.' },
      { q: 'What can’t be missing from an ofrenda?', a: 'According to INAH, most share portraits, candles, food and water, marigold flowers, incense or copal, papel picado, sugar skulls and pan de muerto.' },
      { q: 'Is there only one right way to set it up?', a: 'No. Every region has its own variations, although almost all share those elements. What matters is that the ofrenda speaks of the person you remember.' },
      { q: 'Can I add things the person loved?', a: 'Yes. People usually add objects the person loved or that represented them. For children, their favorite toys.' },
      { q: 'Why are food and water served?', a: 'To ease the hunger and thirst the souls bring after their long journey.' },
      { q: 'Does the Day of the Dead come from before the Spanish conquest?', a: 'It is debated. UNESCO describes it as a fusion of pre-Hispanic rites with Catholic feasts that arrived in the 16th century. INAH archaeologist Víctor Joel Santos Ramírez argues that its dates come from the Catholic calendar and that the Mexica periods devoted to the dead did not give rise to it.' },
      { q: 'Is it World Heritage?', a: 'Yes. UNESCO proclaimed the «Indigenous festivity dedicated to the dead» in 2003 and inscribed it on the Representative List of the Intangible Cultural Heritage in 2008.' },
      { q: 'Which days is it celebrated?', a: 'The central dates are November 1, All Saints’ Day, and November 2, All Souls’ Day. UNESCO notes that the festivities take place between late October and early November.' },
    ],
  },
  cierre: {
    alt: 'A xoloitzcuintle sitting by candles and marigolds, facing a town at dusk',
    title: ['Until next', 'November.'],
    cta: 'Explore the ofrenda again',
    sources: 'Sources',
    sourceLabels: [
      'INAH, «Ofrendas para los muertos» (in Spanish)',
      'INAH, «El origen del Día de Muertos» (2023, in Spanish)',
      'UNESCO, «Indigenous festivity dedicated to the dead»',
      'Mexican Ministry of Culture, the cult of the dead (in Spanish)',
    ],
    credit: 'Illustrations created with AI for this project · 2026',
  },
};

export default en;
