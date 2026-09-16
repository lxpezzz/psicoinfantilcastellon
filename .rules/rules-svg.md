# Iconos y SVG

- lucide-astro para iconos genéricos; no los conviertas a sprite.
- SVG personalizados reutilizados en public/icons/sprite.svg mediante symbol y use.
- Comprueba Lucide y sprite antes de crear iconos. IDs semánticos: icon-whatsapp, icon-google.
- SVG monocromáticos compatibles: currentColor en fill o stroke, color controlado mediante CSS.
- Conserva viewBox. aria-hidden para decoración y etiqueta accesible para significado.
- No fuerces al sprite logos complejos, gradientes, máscaras, filtros, ilustraciones o SVG único cuando no aporte valor.
- Logos nuevos con URL directa: public/images/logos/. Conserva ubicaciones existentes.
- Ilustraciones importadas: src/images/. URL directa: public/images/.
- Elimina símbolos solo tras comprobar ausencia de referencias. Sigue rules-assets.md para fotografías.
