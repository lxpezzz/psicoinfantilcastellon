REGLA ASTRO-FIRST

Todo componente debe ser estático por defecto.

No añadas:
- client:load
- client:visible
- client:idle
- React/Vue/Svelte
- JavaScript en cliente

salvo que exista una interacción que realmente lo necesite.

Para contenido, layout, imágenes, cards, navegación estática y secciones visuales:
usa Astro + HTML + CSS.

Si necesitas JavaScript para una interacción sencilla, utiliza JavaScript nativo y limita el código al propio componente.

Objetivo:
enviar al navegador la menor cantidad posible de JavaScript.

# Arquitectura base para proyectos Astro

- Organiza el proyecto por responsabilidad y dominio.
- Evita componentes monolíticos.
- Los componentes específicos de una página deben agruparse por página o feature.
- Los componentes reutilizables deben ir en `src/components/ui/`.
- Header, Footer y navegación deben ir en `src/components/layout/`.
- Las páginas deben vivir en `src/pages/`.
- Los layouts generales deben ir en `src/layouts/`.
- Las imágenes deben agruparse por sección o feature dentro de `src/images/`.
- Los datos repetitivos o listas de contenido deben extraerse a `src/data/`.
- Los estilos globales deben limitarse a reset, tipografía, tokens y utilidades compartidas.
- Los estilos específicos deben permanecer junto al componente cuando sea posible.
- Evita duplicar datos, estilos o componentes.
- Si un bloque se repite en dos o más lugares, valora convertirlo en componente reutilizable.
- No fragmentes componentes pequeños sin necesidad.
- Mantén una estructura simple y escalable.

Estructura recomendada:

src/
├─ components/
│  ├─ layout/
│  ├─ ui/
│  └─ [feature o página]/
├─ layouts/
├─ pages/
├─ images/
├─ styles/
└─ data/

Antes de terminar cualquier refactor:
- actualizar imports
- comprobar rutas
- ejecutar build
- ejecutar lint
- confirmar que no cambia el diseño ni el comportamiento salvo que se haya pedido.


En webs corporativas o de servicios con Home complejo, agrupa las secciones del Home en `src/components/home/`.