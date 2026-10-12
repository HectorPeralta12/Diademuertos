# Día de Muertos en Praga

Base estática con Astro. Por ahora solo está inicializado el proyecto: la landing, el recorrido, la animación del xolo y los idiomas todavía no están implementados.

## Desarrollo

Requiere Node.js 22.12 o posterior.

```sh
npm install
npm run dev
```

```sh
npm run build
npm run preview
```

## Imágenes

- Original del xolo: `assets/xolo/hero-pictorico-v1.png`.
- Altar actual aprobado y checkpoints: `assets/altar/checkpoints-pictoricos-v2/`.
- Versiones anteriores: `assets/altar/checkpoints/`.
- Copias WebP para la web: `public/images/`.
- Tamaños y correspondencia con originales: `public/images/manifest.json`.

```sh
npm run images:optimize
```

La conversión usa WebP con calidad 90 y conserva las dimensiones nativas, sin escalar ni sobrescribir los PNG originales. Los originales actuales rondan 1670 × 942 píxeles. Ampliarlos a 4K no equivale a recuperar detalle nativo.

## Alcance acordado para las siguientes fases

Entrada con el xolo a la derecha, parpadeo, estrellas sutiles y pétalos de cempasúchil cayendo. Recorrido del altar ligado al scroll, contenido en español, inglés y checo, seguido de eventos y negocios principalmente en Praga. Eventos y negocios se mantendrán como contenido sencillo de editar. Las fuentes culturales están documentadas en `assets/altar/checkpoints/README.md`.

Documentación de Astro: https://docs.astro.build/en/install-and-setup/
