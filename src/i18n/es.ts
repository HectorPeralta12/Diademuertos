/**
 * Spanish: the original copy. Its shape is the contract the other languages
 * follow (see ./index.ts). Proper names (Nahuatl feasts, institutions, the
 * titles of the sources) stay as they are in every language.
 */
export default {
  meta: {
    lang: 'es',
    ogLocale: 'es_MX',
    title: 'Día de Muertos · La ofrenda',
    description:
      'Recorre una ofrenda de Día de Muertos nivel por nivel: qué significa cada elemento, de dónde vienen sus fechas y por qué el cempasúchil marca el camino. Con información del INAH y la UNESCO, y los eventos en Praga.',
  },
  ui: {
    skip: 'Saltar al contenido',
    brand: 'Día de Muertos',
    chapters: { ofrenda: 'Ofrenda', elementos: 'Elementos', historia: 'Historia', eventos: 'En Praga', preguntas: 'Preguntas' },
    chaptersLabel: 'Capítulos',
    languageLabel: 'Idioma',
    source: 'Fuente',
    aiImage: 'Imagen generada con IA.',
  },
  inicio: {
    kicker: '1 y 2 de noviembre',
    title: ['Día de', 'Muertos'],
    lead: ['Una ofrenda para quienes vuelven a casa.', 'Recórrela nivel por nivel.'],
    cta: 'Recorrer la ofrenda',
    proof: 'Con información del INAH y la UNESCO',
  },
  ofrenda: {
    views: [
      {
        label: 'La ofrenda',
        title: 'Un altar para recibirlos',
        text: 'Unos días antes del 1 de noviembre, muchas casas levantan su ofrenda para que esté lista cuando lleguen las ánimas. Es una de las costumbres más extendidas de la fiesta.',
      },
      {
        label: 'Flores, velas y copal',
        title: 'Luz y aroma para encontrar el camino',
        text: 'Las veladoras guían a las ánimas hasta la ofrenda. El cempasúchil marca el camino desde la entrada de la casa, y el incienso y el copal aromatizan y alejan a los malos espíritus.',
      },
      {
        label: 'Comida y agua',
        title: 'Para el hambre y la sed del viaje',
        text: 'Se sirve comida y agua para saciar el hambre y la sed que traen las ánimas después de su largo recorrido. No faltan el pan de muerto ni las calaveritas de azúcar.',
      },
      {
        label: 'Retratos y papel picado',
        title: 'Sus rostros, en lo más alto',
        text: 'El retrato dice a quién se honra. El papel picado da color y representa el viento. Se suman objetos que la persona quería; para los niños, sus juguetes favoritos.',
      },
    ],
    source: 'Fuente: INAH, «Ofrendas para los muertos»',
  },
  lema: {
    lines: ['Mientras alguien los recuerde,', 'siguen encontrando', 'el camino a casa.'],
  },
  elementos: {
    kicker: 'Elementos de la ofrenda',
    title: 'Siete cosas que comparten casi todas las ofrendas',
    text: 'Hay variaciones en cada región, pero según el INAH estos elementos aparecen en la mayoría de los altares.',
    items: [
      { name: 'Retratos', text: 'Dicen a quién se honra en la ofrenda.' },
      { name: 'Veladoras', text: 'Guían a las ánimas hacia la ofrenda.' },
      { name: 'Comida y agua', text: 'Sacian el hambre y la sed que traen las ánimas después de su largo recorrido.' },
      { name: 'Cempasúchil', text: 'Sus flores marcan el camino desde la entrada de la casa hasta el altar.' },
      { name: 'Incienso y copal', text: 'Aromatizan el espacio y alejan a los malos espíritus.' },
      { name: 'Papel picado', text: 'Aporta color a la ofrenda y representa el viento.' },
      { name: 'Calaveritas y pan de muerto', text: 'Aparecen en casi cualquier ofrenda, sin importar la región.' },
    ],
    source: 'Fuente: INAH, «Ofrendas para los muertos»',
  },
  papel: {
    word: 'el viento',
    title: 'El viento',
    text: 'El papel picado da color a la ofrenda y representa el viento.',
    source: 'Fuente: INAH, «Ofrendas para los muertos»',
  },
  camino: {
    alt: 'Una casa con su farol encendido y un camino de pétalos de cempasúchil que lleva, bajo la luna, hasta un altar lleno de flores y veladoras',
    beats: [
      { kicker: 'El camino', title: 'De la puerta de la casa al altar', text: 'Las flores de cempasúchil marcan el camino desde la entrada de la casa hasta la ofrenda.', source: 'Fuente: INAH' },
      { kicker: 'El color', title: 'Un pedazo de sol en el suelo', text: 'Su amarillo se asocia con el sol, que guía el alma de los difuntos.', source: 'Fuente: Secretaría de Cultura' },
      { kicker: 'La llegada', title: 'Y las veladoras las reciben', text: 'Las veladoras guían a las ánimas hasta la ofrenda.', source: 'Fuente: INAH' },
    ],
  },
  calendario: {
    months: ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'],
    nov: '1–2 NOV',
    intro: {
      kicker: 'Antes de noviembre',
      title: 'Los mexicas recordaban a sus muertos en otras fechas',
      text: 'Su calendario solar de 365 días se dividía en 18 veintenas. Varias estaban dedicadas a los difuntos, según cómo habían muerto.',
    },
    feasts: [
      { when: 'Agosto y septiembre', text: 'La fiesta menor de los muertos, dedicada a los niños que morían.' },
      { when: 'Agosto y septiembre', text: 'La fiesta mayor, para los guerreros muertos que moraban en la casa del Sol.' },
      { when: 'Octubre y noviembre', text: 'Dedicada a los cerros y a las deidades del agua. Se hacían imágenes de quienes morían ahogados o por enfermedades ligadas al agua.' },
      { when: 'Desde el solsticio de invierno', text: 'Cerraba el año solar. Se hacían imágenes de quienes tuvieron muerte natural, cuyo destino era el Mictlan, y luego se quemaban.' },
    ],
    catholic: {
      kicker: '1 y 2 de noviembre',
      title: 'Las fechas de hoy vienen de otro calendario',
      text: 'Para el arqueólogo Víctor Joel Santos Ramírez, del INAH, estas veintenas no dieron origen al Día de Muertos novohispano: sus fechas llegaron con la Iglesia católica.',
      source: 'Fuente: INAH, «El origen del Día de Muertos» (2023)',
    },
  },
  historia: {
    milestones: [
      'El papa Bonifacio IV consagra el Panteón de Agripa a Santa María y a todos los mártires. Es el antecedente de Todos los Santos.',
      'El papa Gregorio IV fija la fiesta de Todos los Santos el 1 de noviembre.',
      'Odilón, abad de Cluny, instituye el Día de los Fieles Difuntos el 2 de noviembre.',
      'Las fiestas llegan con los franciscanos. Entre 1535 y 1540, fray Toribio de Benavente, Motolinía, describe ofrendas de maíz, mantas, comida, pan, gallinas y cacao.',
      'El gobierno de Juárez seculariza los cementerios. En ese siglo, ir al panteón se vuelve una fiesta con comida, pulque y música.',
      'Entre 1934 y 1940 la fiesta se reinventa con un sentido nacionalista y laico, según la historiadora Elsa Malvido.',
      'La UNESCO proclama «Las fiestas indígenas dedicadas a los muertos» obra maestra del patrimonio oral e inmaterial.',
      'La fiesta entra en la Lista Representativa del Patrimonio Cultural Inmaterial de la Humanidad.',
    ],
  },
  eventos: {
    kicker: 'En Praga',
    title: 'Dónde vivir el Día de Muertos en Praga',
    text: 'La comunidad mexicana en Chequia y la Embajada de México celebran la fiesta en la ciudad. Estos son los eventos de este año.',
    when: 'Cuándo',
    where: 'Dónde',
    price: 'Entrada',
    map: 'Ver en el mapa',
    site: 'Sitio del evento',
    checked: 'Datos revisados el 20 de octubre de 2026. Confirma horarios y precios en el sitio de cada evento antes de ir.',
    weekdays: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
    months: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
  },
  preguntas: {
    kicker: 'Preguntas',
    title: 'Lo que suele preguntarse sobre la ofrenda',
    faqs: [
      { q: '¿Cuándo se pone la ofrenda?', a: 'Unos días antes del 1 de noviembre, para que esté lista cuando lleguen las ánimas. Así lo describe el INAH.' },
      { q: '¿Qué no puede faltar en una ofrenda?', a: 'Según el INAH, la mayoría comparte retratos, veladoras, comida y agua, flores de cempasúchil, incienso o copal, papel picado, calaveritas de azúcar y pan de muerto.' },
      { q: '¿Hay una sola forma correcta de ponerla?', a: 'No. Cada región tiene sus variantes, aunque casi todas comparten esos elementos. Lo importante es que la ofrenda hable de quien recuerdas.' },
      { q: '¿Puedo poner cosas que le gustaban a la persona?', a: 'Sí. Se suelen poner objetos que le gustaban o que la representaban. Para los niños, sus juguetes favoritos.' },
      { q: '¿Por qué se sirve comida y agua?', a: 'Para saciar el hambre y la sed que traen las ánimas después de su largo recorrido.' },
      { q: '¿El Día de Muertos es de origen prehispánico?', a: 'Es un debate. La UNESCO lo describe como una fusión de ritos prehispánicos con fiestas católicas llegadas en el siglo XVI. El arqueólogo Víctor Joel Santos Ramírez, del INAH, sostiene que sus fechas vienen del calendario católico y que las veintenas mexicas dedicadas a los muertos no le dieron origen.' },
      { q: '¿Es patrimonio de la humanidad?', a: 'Sí. La UNESCO proclamó «Las fiestas indígenas dedicadas a los muertos» en 2003 y las inscribió en la Lista Representativa del Patrimonio Cultural Inmaterial en 2008.' },
      { q: '¿Qué días se celebra?', a: 'Las fechas centrales son el 1 de noviembre, Todos los Santos, y el 2 de noviembre, Fieles Difuntos. La UNESCO señala que las fiestas ocurren entre finales de octubre y principios de noviembre.' },
    ],
  },
  cierre: {
    alt: 'Un xoloitzcuintle sentado junto a velas y cempasúchil, frente a una ciudad al anochecer',
    title: ['Hasta el próximo', 'noviembre.'],
    cta: 'Recorrer la ofrenda otra vez',
    sources: 'Fuentes',
    sourceLabels: [
      'INAH, «Ofrendas para los muertos»',
      'INAH, «El origen del Día de Muertos» (2023)',
      'UNESCO, «Las fiestas indígenas dedicadas a los muertos»',
      'Secretaría de Cultura, el culto a los muertos',
    ],
    credit: 'Ilustraciones creadas con IA para este proyecto · 2026',
  },
};
