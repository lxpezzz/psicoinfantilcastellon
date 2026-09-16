# Patrón de código

Prioriza consistencia, legibilidad y facilidad de comprensión.

## Componentes nuevos
- Astro + HTML con clases descriptivas: bloque, bloque__elemento y bloque--variante.
- Orden del archivo: frontmatter, HTML, <style> y <script> cuando sea necesario.
- CSS específico y media queries dentro del <style> local.
- Reutiliza variables, contenedores y estilos compartidos.
- JavaScript nativo solo para interacciones necesarias.
- No introduzcas Tailwind ni CSS inline por iniciativa propia; admite inline para valores dinámicos necesarios.
- No comprimas código ni abstraigas para reducir líneas.

## Existentes
- Conserva el enfoque de cada componente: CSS local o Tailwind.
- En componentes mixtos, conserva las responsabilidades existentes.
- No migres componentes ni cambies arquitectura o librerías sin petición expresa.
- Si necesitas cambiar el enfoque sin autorización, explica el motivo y pide confirmación.
