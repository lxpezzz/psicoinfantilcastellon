## Gestión de iconos SVG

- Usa `lucide-astro` como sistema principal para iconos genéricos de interfaz.
- No conviertas iconos de Lucide a `sprite.svg`.

- Los SVG personalizados reutilizables deben centralizarse en:
  `public/icons/sprite.svg`

- Usa `<symbol>` + `<use>` para esos iconos.

- Los IDs deben ser semánticos:
  `icon-whatsapp`
  `icon-google`
  `icon-nfc`
  `icon-instagram`

- Si el SVG es monocromático y técnicamente seguro, usa:
  `fill="currentColor"` o `stroke="currentColor"`
  para poder controlarlo con Tailwind mediante `text-*`.

- No fuerces a sprite:
  - logos complejos
  - SVG con gradientes
  - ilustraciones
  - SVG con máscaras o filtros complejos
  - SVG usados una sola vez cuando no aporte beneficio

- Mantén esos assets complejos como SVG independientes.

- Antes de crear un nuevo archivo SVG, comprueba si el icono ya existe en:
  1. `lucide-astro`
  2. `public/icons/sprite.svg`

- Evita duplicar iconos SVG dentro del proyecto.

- Cuando se elimine el último uso de un icono del sprite, elimina también su `<symbol>` si ya no se utiliza.

- Mantén siempre el `viewBox` original de cada SVG.

- Los SVG decorativos deben usar `aria-hidden="true"`.
- Los SVG con significado deben mantener una etiqueta accesible adecuada.


## Assets

Iconos de interfaz genéricos:
→ `lucide-astro`

Iconos SVG personalizados reutilizables:
→ `public/icons/sprite.svg`

Logos SVG:
→ `public/images/logos/`

Ilustraciones SVG complejas:
→ `src/images/` o `public/images/`

Fotografías e imágenes:
→ preferentemente WebP/AVIF mediante `astro:assets`