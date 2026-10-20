import type { Strings } from './index';

/**
 * Czech. Drafted from the Spanish copy; worth a pass by a native speaker
 * before publishing.
 */
const cs: Strings = {
  meta: {
    lang: 'cs',
    ogLocale: 'cs_CZ',
    title: 'Den mrtvých · Ofrenda',
    description:
      'Projděte si mexický oltář ke Dni mrtvých patro po patře: co znamená každý prvek, odkud pocházejí data svátku a proč cestu značí aksamitníky. Podle INAH a UNESCO, s letošními akcemi v Praze.',
  },
  ui: {
    skip: 'Přejít na obsah',
    brand: 'Día de Muertos',
    chapters: { ofrenda: 'Ofrenda', elementos: 'Prvky', historia: 'Historie', eventos: 'V Praze', preguntas: 'Otázky' },
    chaptersLabel: 'Kapitoly',
    languageLabel: 'Jazyk',
    source: 'Zdroj',
    aiImage: 'Obrázek vytvořený pomocí AI.',
  },
  inicio: {
    kicker: '1. a 2. listopadu',
    title: ['Den', 'mrtvých'],
    lead: ['Oltář pro ty, kdo se vracejí domů.', 'Projděte si ho patro po patře.'],
    cta: 'Prohlédnout oltář',
    proof: 'Podle INAH a UNESCO',
  },
  ofrenda: {
    views: [
      {
        label: 'Ofrenda',
        title: 'Oltář, který je přivítá',
        text: 'Několik dní před 1. listopadem staví mnoho domácností svou ofrendu, aby byla připravená, až duše dorazí. Je to jeden z nejrozšířenějších zvyků celého svátku.',
      },
      {
        label: 'Květiny, svíčky a kopál',
        title: 'Světlo a vůně, aby našli cestu',
        text: 'Svíčky vedou duše až k ofrendě. Aksamitníky značí cestu od vchodu do domu a kadidlo a kopál provoní prostor a odhánějí zlé duchy.',
      },
      {
        label: 'Jídlo a voda',
        title: 'Na hlad a žízeň z dlouhé cesty',
        text: 'Podává se jídlo a voda, aby duše utišily hlad a žízeň po dlouhé cestě. Nikdy nechybí pan de muerto ani cukrové lebky.',
      },
      {
        label: 'Portréty a papel picado',
        title: 'Jejich tváře úplně nahoře',
        text: 'Portrét říká, koho ofrenda uctívá. Papel picado dodává barvu a představuje vítr. Přidávají se i věci, které měl zesnulý rád; u dětí jejich oblíbené hračky.',
      },
    ],
    source: 'Zdroj: INAH, «Ofrendas para los muertos» (španělsky)',
  },
  lema: {
    lines: ['Dokud na ně někdo vzpomíná,', 'stále nacházejí', 'cestu domů.'],
  },
  elementos: {
    kicker: 'Prvky ofrendy',
    title: 'Sedm věcí, které mají skoro všechny ofrendy',
    text: 'Každý region má své varianty, ale podle INAH se tyto prvky objevují na většině oltářů.',
    items: [
      { name: 'Portréty', text: 'Říkají, koho ofrenda uctívá.' },
      { name: 'Svíčky', text: 'Vedou duše k ofrendě.' },
      { name: 'Jídlo a voda', text: 'Utišují hlad a žízeň, se kterými duše přicházejí po dlouhé cestě.' },
      { name: 'Aksamitníky', text: 'Květy cempasúchilu značí cestu od vchodu do domu až k oltáři.' },
      { name: 'Kadidlo a kopál', text: 'Provoní prostor a odhánějí zlé duchy.' },
      { name: 'Papel picado', text: 'Vystřihovaný papír dodává ofrendě barvu a představuje vítr.' },
      { name: 'Cukrové lebky a pan de muerto', text: 'Objevují se téměř na každé ofrendě, ať je odkudkoli.' },
    ],
    source: 'Zdroj: INAH, «Ofrendas para los muertos» (španělsky)',
  },
  papel: {
    word: 'vítr',
    title: 'Vítr',
    text: 'Papel picado dodává ofrendě barvu a představuje vítr.',
    source: 'Zdroj: INAH, «Ofrendas para los muertos» (španělsky)',
  },
  camino: {
    alt: 'Dům s rozsvícenou lucernou a cestička z okvětních lístků aksamitníku, která pod měsícem vede k oltáři plnému květin a svíček',
    beats: [
      { kicker: 'Cesta', title: 'Ode dveří domu až k oltáři', text: 'Květy aksamitníku značí cestu od vchodu do domu až k ofrendě.', source: 'Zdroj: INAH' },
      { kicker: 'Barva', title: 'Kousek slunce na zemi', text: 'Jejich žlutá barva se pojí se sluncem, které vede duše zemřelých.', source: 'Zdroj: mexické ministerstvo kultury' },
      { kicker: 'Příchod', title: 'A svíčky je vítají', text: 'Svíčky vedou duše až k ofrendě.', source: 'Zdroj: INAH' },
    ],
  },
  calendario: {
    months: ['LED', 'ÚNO', 'BŘE', 'DUB', 'KVĚ', 'ČER', 'ČVC', 'SRP', 'ZÁŘ', 'ŘÍJ', 'LIS', 'PRO'],
    nov: '1.–2. LIS',
    intro: {
      kicker: 'Před listopadem',
      title: 'Mexikové si své mrtvé připomínali v jiných dnech',
      text: 'Jejich sluneční kalendář o 365 dnech se dělil na 18 dvacetidenních období. Několik z nich bylo zasvěceno zemřelým, podle toho, jak zemřeli.',
    },
    feasts: [
      { when: 'Srpen a září', text: 'Menší svátek mrtvých, zasvěcený zemřelým dětem.' },
      { when: 'Srpen a září', text: 'Velký svátek, pro padlé válečníky, kteří přebývali v domě Slunce.' },
      { when: 'Říjen a listopad', text: 'Zasvěcený horám a božstvům vody. Vyráběly se podoby těch, kdo se utopili nebo zemřeli na nemoci spojené s vodou.' },
      { when: 'Od zimního slunovratu', text: 'Uzavíral sluneční rok. Vyráběly se podoby těch, kdo zemřeli přirozenou smrtí a mířili do Mictlanu, a pak se pálily.' },
    ],
    catholic: {
      kicker: '1. a 2. listopadu',
      title: 'Dnešní data pocházejí z jiného kalendáře',
      text: 'Podle archeologa Víctora Joela Santose Ramíreze z INAH tato období Den mrtvých koloniální doby nezaložila: jeho data přinesla katolická církev.',
      source: 'Zdroj: INAH, «El origen del Día de Muertos» (2023, španělsky)',
    },
  },
  historia: {
    milestones: [
      'Papež Bonifác IV. zasvěcuje Agrippův Pantheon Panně Marii a všem mučedníkům. Je to předchůdce svátku Všech svatých.',
      'Papež Řehoř IV. stanovuje svátek Všech svatých na 1. listopadu.',
      'Odilo, opat z Cluny, zavádí Památku všech věrných zemřelých (Dušičky) na 2. listopadu.',
      'Svátky přicházejí s františkány. Mezi lety 1535 a 1540 popisuje fray Toribio de Benavente, Motolinía, obětiny z kukuřice, přikrývek, jídla, chleba, slepic a kakaa.',
      'Juárezova vláda zesvětšťuje hřbitovy. V tom století se z návštěvy hřbitova stává oslava s jídlem, pulque a hudbou.',
      'Mezi lety 1934 a 1940 se svátek podle historičky Elsy Malvido proměňuje a dostává národní a světský význam.',
      'UNESCO prohlašuje «Domorodé slavnosti zasvěcené mrtvým» za mistrovské dílo ústního a nehmotného dědictví.',
      'Svátek je zapsán na Reprezentativní seznam nehmotného kulturního dědictví lidstva.',
    ],
  },
  eventos: {
    kicker: 'V Praze',
    title: 'Kde oslavit Den mrtvých v Praze',
    text: 'Mexická komunita v Česku a mexické velvyslanectví slaví svátek i tady. Toto jsou letošní akce.',
    when: 'Kdy',
    where: 'Kde',
    price: 'Vstupné',
    map: 'Otevřít v mapě',
    site: 'Web akce',
    checked: 'Údaje ověřeny 20. října 2026. Časy a ceny si před návštěvou potvrďte na webu akce.',
    weekdays: ['neděle', 'pondělí', 'úterý', 'středa', 'čtvrtek', 'pátek', 'sobota'],
    months: ['ledna', 'února', 'března', 'dubna', 'května', 'června', 'července', 'srpna', 'září', 'října', 'listopadu', 'prosince'],
    lugares: {
      kicker: 'Latinskoamerická místa',
      title: 'Ať si sezónu užijete celý rok',
      text: 'Restaurace, kavárna, obchod a pražská mariachi kapela: latinskoamerická místa v Praze, která slaví s komunitou.',
      site: 'Web',
      noSponsor: 'Bez sponzorství: jen místa, která jsme ověřili na jejich vlastním webu nebo ve zveřejněném zdroji.',
    },
  },
  preguntas: {
    kicker: 'Otázky',
    title: 'Na co se lidé na ofrendu často ptají',
    faqs: [
      { q: 'Kdy se ofrenda staví?', a: 'Několik dní před 1. listopadem, aby byla připravená, až duše dorazí. Tak to popisuje INAH.' },
      { q: 'Co na ofrendě nesmí chybět?', a: 'Podle INAH má většina ofrend portréty, svíčky, jídlo a vodu, květy aksamitníku, kadidlo nebo kopál, papel picado, cukrové lebky a pan de muerto.' },
      { q: 'Existuje jen jeden správný způsob, jak ji postavit?', a: 'Ne. Každý region má své varianty, i když téměř všechny sdílejí tyto prvky. Důležité je, aby ofrenda vyprávěla o tom, na koho vzpomínáte.' },
      { q: 'Můžu přidat věci, které měl zesnulý rád?', a: 'Ano. Obvykle se přidávají předměty, které měl rád nebo které ho vystihovaly. U dětí jejich oblíbené hračky.' },
      { q: 'Proč se podává jídlo a voda?', a: 'Aby duše utišily hlad a žízeň, se kterými přicházejí po dlouhé cestě.' },
      { q: 'Má Den mrtvých předkolumbovský původ?', a: 'O tom se vedou debaty. UNESCO ho popisuje jako spojení předkolumbovských obřadů s katolickými svátky, které přišly v 16. století. Archeolog Víctor Joel Santos Ramírez z INAH tvrdí, že jeho data pocházejí z katolického kalendáře a že mexická období zasvěcená mrtvým ho nezaložila.' },
      { q: 'Je součástí dědictví lidstva?', a: 'Ano. UNESCO vyhlásilo «Domorodé slavnosti zasvěcené mrtvým» v roce 2003 a v roce 2008 je zapsalo na Reprezentativní seznam nehmotného kulturního dědictví.' },
      { q: 'Které dny se slaví?', a: 'Hlavní data jsou 1. listopadu, svátek Všech svatých, a 2. listopadu, Památka zesnulých. UNESCO uvádí, že oslavy probíhají od konce října do začátku listopadu.' },
    ],
  },
  cierre: {
    alt: 'Xoloitzcuintle sedí u svíček a aksamitníků naproti městu za soumraku',
    title: ['Na shledanou', 'příští listopad.'],
    cta: 'Projít oltář znovu',
    sources: 'Zdroje',
    sourceLabels: [
      'INAH, «Ofrendas para los muertos» (španělsky)',
      'INAH, «El origen del Día de Muertos» (2023, španělsky)',
      'UNESCO, «Indigenous festivity dedicated to the dead» (anglicky)',
      'Mexické ministerstvo kultury, kult mrtvých (španělsky)',
    ],
    credit: 'Ilustrace vytvořené pomocí AI pro tento projekt · 2026',
  },
};

export default cs;
