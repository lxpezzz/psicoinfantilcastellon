# Interacciones y JavaScript

## Solución sencilla
- Prioridad: HTML nativo, CSS, APIs del navegador, JavaScript pequeño y librerías necesarias.
- Usa details/summary, botones y enlaces cuando resuelvan la interacción.
- No añadas librerías para hover, fades, acordeones, scroll sencillo o sticky.
- Reutiliza el sistema existente; no añadas otro sistema motion por iniciativa propia.

## Estado y estructura
- Una fuente de verdad por estado; deriva texto, visual y atributos.
- Centraliza actualizaciones para clic, scroll y teclado del mismo estado.
- Clases o data attributes para estados; inline dinámico solo cuando sea necesario.
- Evita estructuras duplicadas para animar; conserva paneles separados si contenido o accesibilidad lo requieren.

## Ciclo de vida
- Evita listeners, observers y timers duplicados. Protege inicializaciones que puedan repetirse.
- Eventos de navegación Astro solo cuando se utilice esa navegación.
- Con transiciones de navegación, limpia listeners, observers y timers al desmontar o sustituir elementos.
- No prepares ciclos de vida para sistemas no utilizados.

## Scroll y animación
- IntersectionObserver para visibilidad y CSS sticky para fijación sencilla.
- Para progreso continuo, agrupa actualizaciones con requestAnimationFrame; evita trabajo pesado y lecturas/escrituras layout intercaladas.
- Evita scroll excesivo, bloqueos artificiales y reflows forzados para animaciones sencillas.
- Prioriza transform y opacity.
- No uses hidden inmediatamente para transición de salida; al terminar, lo oculto no debe ser interactivo.
- Timers con motivo concreto; prefiere eventos de fin de transición o animación cuando correspondan.

## Accesibilidad y verificación
- Conserva teclado, focus y ARIA necesario sin duplicar HTML nativo.
- No uses elementos no interactivos como botones.
- Móvil y reduced motion sin perder funcionalidad; contenido esencial si falla JavaScript.
- Revisa duplicación y complejidad, sin porcentajes arbitrarios de reducción.
- Elimina implementación sustituida solo tras comprobar desuso.
- No cambies diseño o comportamiento fuera del alcance autorizado.
