# REGLA DE INTERACCIONES, JAVASCRIPT Y MOTION

Esta regla se aplica a cualquier componente con:

- interacción;
- tabs;
- sliders;
- accordions;
- sticky;
- scroll effects;
- navegación dinámica;
- animaciones;
- estados activos;
- contenido que cambia en cliente.

Objetivo:

**interacciones premium con JavaScript mínimo, una arquitectura simple y buen rendimiento.**

---

## 1. PRINCIPIO GENERAL

Una interacción visualmente sencilla debe tener una implementación sencilla.

Orden de prioridad:

`HTML nativo → CSS → APIs nativas del navegador → JavaScript pequeño → librería externa`

No uses JavaScript si CSS puede resolver correctamente el comportamiento.

No uses una librería si JavaScript nativo puede resolverlo de forma limpia.

---

## 2. UNA ÚNICA FUENTE DE VERDAD

Cuando exista un estado activo, mantener una única fuente de verdad.

Preferir:

```js
let activeIndex = 0;
```

y derivar de ese estado:

- elemento activo;
- texto;
- visual;
- progreso;
- atributos ARIA.

No mantener sistemas paralelos independientes.

Evitar:

```text
activeTab
activePanel
activeDescription
activeVisual
activeProgress
```

si todos representan exactamente la misma selección.

---

## 3. ESTADOS MEDIANTE DATA ATTRIBUTES

Cuando sea apropiado, controlar variantes visuales mediante:

```html
data-active="0"
```

y CSS:

```css
[data-active="0"] .visual--one {
  opacity: 1;
}
```

Preferir esto frente a modificar muchas propiedades inline desde JavaScript.

JavaScript decide el estado.

CSS decide cómo se ve ese estado.

---

## 4. NO DUPLICAR CONTENIDO PARA ANIMAR

No crees múltiples estructuras completas si cambia únicamente su contenido o estado.

Preferir:

```text
1 estructura
+ varios estados
```

frente a:

```text
4 estructuras completas ocultándose entre ellas
```

Especialmente para:

- tabs;
- showcases;
- pasos;
- visualizadores;
- criterios;
- productos;
- procesos.

---

## 5. EVENT LISTENERS

Evitar listeners duplicados.

Antes de inicializar una interacción comprobar si ya fue inicializada.

Ejemplo:

```js
if (root.dataset.initialized) return;

root.dataset.initialized = 'true';
```

Especialmente importante con:

```js
astro:page-load
```

No registrar dos veces los mismos:

- scroll listeners;
- observers;
- click handlers;
- timers.

---

## 6. ASTRO PAGE LOAD

Si el proyecto utiliza navegación/transiciones de Astro, las interacciones deben poder reinicializarse sin duplicarse.

No utilizar simultáneamente:

```js
init();
document.addEventListener('astro:page-load', init);
```

sin una protección contra dobles inicializaciones.

Toda inicialización debe ser idempotente.

---

## 7. SCROLL

No ejecutar lógica pesada directamente en cada evento `scroll`.

Para casos sencillos:

```js
requestAnimationFrame()
```

o:

```js
IntersectionObserver
```

Preferir `IntersectionObserver` cuando solo sea necesario saber:

- si algo entra;
- si algo sale;
- qué elemento está visible.

Utilizar cálculo continuo de scroll únicamente cuando realmente necesitemos progreso continuo.

---

## 8. STICKY ANTES QUE PINNING JS

Si una composición puede resolverse con:

```css
position: sticky;
```

utiliza CSS.

No simules sticky mediante JavaScript.

No introduzcas GSAP ScrollTrigger únicamente para mantener un elemento fijo durante parte del scroll.

---

## 9. INTERACCIONES DE SCROLL COMPACTAS

No crear distancias de scroll excesivas únicamente para activar estados.

Evitar por defecto:

```css
height: 300vh;
height: 400vh;
height: 500vh;
```

Para experiencias sencillas de 3–5 estados, utiliza la mínima distancia necesaria para que la transición se perciba correctamente.

El scroll nunca debe sentirse artificialmente largo.

---

## 10. CLIC + SCROLL

Si un componente permite controlar el mismo estado mediante:

- scroll;
- click;
- teclado;

todos deben actualizar la misma función.

Ejemplo:

```js
function setActive(index) {
  // actualizar todo desde aquí
}
```

No escribas una lógica distinta para cada método de interacción.

---

## 11. ANIMACIONES

Prioriza:

```css
opacity
transform
```

Evita animar continuamente:

- width;
- height;
- top;
- left;
- margin;
- padding;

si puede conseguirse el mismo resultado mediante transform.

No utilizar:

```css
transition: all;
```

Animar únicamente propiedades concretas.

---

## 12. REFLOW

No fuerces reflows manualmente salvo necesidad clara.

Evitar patrones como:

```js
void element.offsetHeight;
```

utilizados únicamente para reiniciar una animación sencilla.

Busca primero una implementación basada en:

- clases;
- data attributes;
- keyframes;
- transition.

---

## 13. HIDDEN Y TRANSICIONES

No utilizar inmediatamente:

```js
element.hidden = true;
```

si se pretende realizar un fade-out.

`hidden` elimina el elemento inmediatamente del render.

Si se necesita animación de salida:

- usa clases;
- opacity;
- visibility;
- pointer-events;

y elimina/oculta posteriormente solo si realmente es necesario.

---

## 14. TIMERS

No utilizar `setTimeout()` para coordinar interacciones salvo que exista una razón real.

Evitar timers utilizados para:

- esperar una transición;
- bloquear scroll artificialmente;
- sincronizar estados que deberían depender de un único estado.

Las animaciones deben coordinarse preferentemente mediante CSS.

---

## 15. MICROINTERACCIONES

Hover, focus y pequeños movimientos deben resolverse con CSS.

Ejemplos:

```css
transform: translateY(-2px);
opacity: .7;
border-color: ...;
```

No utilizar JavaScript para un simple hover.

---

## 16. GSAP

GSAP solo debe utilizarse cuando exista una ventaja clara.

Casos válidos:

- timelines complejas;
- animaciones secuenciales;
- storytelling avanzado por scroll;
- pinning complejo;
- sincronización de múltiples elementos;
- transforms avanzados difíciles de mantener con CSS.

NO usar GSAP para:

- hover;
- fades básicos;
- tabs;
- accordions;
- pequeños reveals;
- sticky sencillo;
- cambiar una clase activa.

Si GSAP se propone, justificar primero por qué CSS + JS nativo no es suficiente.

---

## 17. NO INSTALAR DOS SISTEMAS DE MOTION

No combinar innecesariamente:

- GSAP;
- Motion;
- Anime.js;
- AOS;
- otras librerías de animación.

Si el proyecto ya utiliza un sistema de motion, reutilízalo.

---

## 18. ACCESIBILIDAD DE INTERACCIONES

Toda interacción debe poder utilizarse sin ratón.

Utilizar elementos nativos:

```html
<button>
<a>
```

No:

```html
<div onclick>
```

Cuando corresponda, mantener:

- `aria-selected`;
- `aria-expanded`;
- `aria-controls`;
- `aria-current`.

No añadir ARIA si HTML nativo ya resuelve correctamente la semántica.

---

## 19. TECLADO

Para patrones como tabs:

permitir cuando corresponda:

- Tab;
- Enter;
- Space;
- ArrowLeft;
- ArrowRight;
- ArrowUp;
- ArrowDown.

Pero no implementar manualmente navegación compleja si el componente no la necesita.

---

## 20. MOBILE

No trasladar automáticamente interacciones desktop a móvil.

Sticky largo, hover o scroll storytelling pueden simplificarse en pantallas pequeñas.

En móvil priorizar:

- scroll natural;
- tap;
- poco movimiento;
- contenido inmediato;
- targets táctiles adecuados.

Una interacción premium en desktop puede convertirse en una interacción mucho más sencilla en móvil.

---

## 21. PREFERS REDUCED MOTION

Toda animación significativa debe respetar:

```css
@media (prefers-reduced-motion: reduce)
```

Al reducir motion:

- eliminar desplazamientos innecesarios;
- eliminar parallax;
- eliminar animaciones largas;
- mantener contenido y funcionalidad.

---

## 22. PROGRESSIVE ENHANCEMENT

El contenido importante debe seguir existiendo aunque JavaScript falle.

JavaScript mejora la experiencia.

No debe ser necesario para comprender información esencial salvo que la funcionalidad lo requiera expresamente.

---

## 23. NO INVENTAR DATOS EN MICROVISUALES

Los visuales decorativos no deben mostrar como hechos reales métricas inventadas como:

```text
99 Lighthouse
0.3 s
180 KB
+42 % conversión
```

si no existen datos comprobados.

Para representaciones visuales utilizar mejor:

```text
SPEED
LOAD
WEIGHT
```

sin valores falsos.

---

## 24. MICROVISUALES

No construir microvisuales mediante decenas de elementos HTML.

Utilizar primero:

- pocos elementos;
- CSS Grid;
- pseudoelementos;
- backgrounds;
- borders;
- transforms.

Si el visual empieza a necesitar demasiada estructura, considerar:

- SVG;
- asset;
- imagen real.

El DOM debe ser proporcional a la importancia del visual.

---

## 25. LIMPIEZA

Cuando se sustituya una interacción:

eliminar completamente:

- listeners antiguos;
- clases antiguas;
- IDs antiguos;
- timers;
- observers;
- keyframes;
- estilos;
- wrappers.

No mantener dos implementaciones simultáneas.

---

## 26. CRITERIO FINAL

Antes de terminar una interacción comprobar:

- ¿Existe una sola fuente de verdad?
- ¿Hay listeners duplicados?
- ¿Estoy usando JS donde CSS sería suficiente?
- ¿Estoy forzando reflows?
- ¿Hay estados duplicados?
- ¿Hay demasiados elementos ocultos?
- ¿El scroll es más largo de lo necesario?
- ¿Funciona con teclado?
- ¿Funciona bien en móvil?
- ¿Respeta reduced motion?
- ¿Funciona con Astro sin inicializaciones duplicadas?
- ¿Podría reducir la lógica un 30–50 % sin perder comportamiento?

Si la respuesta a la última pregunta es sí:

**simplificar antes de finalizar.**