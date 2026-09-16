# Astro y arquitectura

## Astro primero
- Estático por defecto: Astro + HTML + CSS.
- Frameworks, client:* y JavaScript cliente solo si la funcionalidad lo necesita.
- Interacciones sencillas con JavaScript nativo junto al componente.
- Contenido esencial disponible sin JavaScript.
- Sigue rules-codigo.md para estilos.

## Estructura
- Páginas: src/pages/. Layouts: src/layouts/.
- Header, Footer y navegación: src/components/layout/.
- Reutilizables: src/components/ui/. Home: src/components/home/.
- Otros específicos: agrupados por página o feature.
- Imágenes importadas: src/images/, agrupadas por sección.
- Datos compartidos y listas: src/data/.
- Estilos globales: src/styles/, para bases, tokens y utilidades compartidas.
- Conserva estructura existente; evita monolitos, microcomponentes y abstracciones anticipadas.

## Validación
- Refactors: actualiza imports y comprueba rutas afectadas.
- Build para cambios de implementación; astro check para componentes o TypeScript.
- Lint solo si existe script configurado.
- Cambios visuales: verifica responsive y ausencia de cambios fuera del alcance.
- Documentación: revisa coherencia y diff; no requiere build salvo necesidad.
- No afirmes comprobaciones no ejecutadas; indica limitaciones.
- Sigue AGENTS.md para gestionar el servidor.
