# REGLAS CSS GLOBALES — WORKSPACE

Estas reglas se aplican a TODO componente, página o archivo CSS nuevo o modificado dentro de este workspace.

El objetivo es mantener:

**diseño premium + CSS simple + código mantenible + responsive real**

Cada proyecto puede conservar su propia identidad visual, pero todos deben seguir esta filosofía de implementación.

---

## 1. PRINCIPIO GENERAL

No quiero que una interfaz visualmente sencilla termine teniendo cientos de líneas de HTML/CSS innecesarias.

Antes de crear código pregúntate:

> ¿Estoy construyendo algo mediante CSS que podría resolverse mejor con una imagen, asset o estructura mucho más simple?

Si la respuesta es sí:

**SIMPLIFICA.**

Cuando existan dos soluciones visualmente equivalentes, elige la que tenga:

1. menos código;
2. menos DOM;
3. menos CSS;
4. menos JavaScript;
5. menos dependencias;
6. mayor reutilización;
7. mejor mantenibilidad.

Nunca simplifiques si eso perjudica de forma perceptible:

- diseño;
- accesibilidad;
- responsive;
- rendimiento;
- funcionalidad.

---

## 2. IMÁGENES REALES ANTES QUE MOCKUPS CSS

Cuando exista o vaya a existir una imagen real de:

- página web;
- demo;
- producto;
- tarjeta;
- expositor;
- dispositivo;
- fotografía;
- mockup;

NO reconstruyas ese contenido mediante decenas de `<div>` y CSS.

Prefiero:

```astro
<Image ... />
```

antes que cientos de líneas simulando el objeto.

El código debe controlar:

- layout;
- tamaño;
- posición;
- responsive;
- transición;
- interacción.

La imagen debe contener el contenido visual.

---

## 3. NO CREAR WEBS FICTICIAS

Nunca dibujes mediante HTML/CSS:

- navegadores ficticios;
- landing pages ficticias;
- dashboards;
- tarjetas internas;
- menús falsos;
- móviles falsos;
- browser chrome;
- interfaces SaaS inventadas;

si podemos mostrar una captura real.

Las demos de los proyectos se cargarán mediante imágenes reales.

---

## 4. EVITAR HTML DECORATIVO

No crees elementos HTML únicamente para:

- un punto;
- glow;
- degradado;
- línea;
- viñeta;
- borde;
- overlay;
- efecto ambiental.

Si puede resolverse limpiamente mediante:

- `background`;
- `border`;
- `box-shadow`;
- `::before`;
- `::after`;

prefiere CSS.

Menos DOM.

---

## 5. EVITAR WRAPPERS INNECESARIOS

No utilices estructuras como:

```text
wrapper
→ container
→ inner
→ content
→ content-wrap
→ content-inner
```

si dos o tres elementos son suficientes.

Cada wrapper debe tener una función real:

- layout;
- posicionamiento;
- clipping;
- semántica;
- interacción.

Si un wrapper puede eliminarse sin cambiar el resultado:

**elimínalo.**

---

## 6. DRY

Evita repetir estilos de:

- botones;
- containers;
- headings;
- paddings;
- border-radius;
- transiciones;
- labels;
- enlaces;
- estados comunes.

Si una regla se utiliza en varios componentes, valora mover su base al sistema global.

Pero NO conviertas todo en una abstracción prematura.

Prioriza claridad.

---

## 7. CSS ESPECÍFICO SOLO CUANDO SEA NECESARIO

No quiero estructuras como:

```text
.product-web-header
.product-web-nav
.product-web-card
.product-qr-header
.product-qr-body
.product-card-front
.product-card-back
...
```

si todos pueden utilizar:

```text
.product-image
.product-visual
.product-slide
```

Los diferentes items deben compartir estructura siempre que sea posible.

---

## 8. DATA-DRIVEN

Para contenido repetible, prioriza datos.

Ejemplo:

```json
{
  "title": "...",
  "description": "...",
  "image": "..."
}
```

y un único componente reutilizable.

No crees HTML completamente diferente para cada item si solo cambian:

- título;
- descripción;
- imagen;
- enlace.

---

## 9. VARIABLES CSS

Utiliza variables CSS cuando representen decisiones globales o valores realmente reutilizados.

Buenos candidatos:

- colores principales;
- colores de texto;
- tipografía;
- escalas tipográficas;
- containers;
- padding global;
- separación entre componentes;
- radios;
- timings;
- easings.

NO conviertas cada valor CSS en una variable.

Un valor utilizado una sola vez puede permanecer directamente en el componente.

---

## 10. NO CREAR VARIABLES POR ANTICIPADO

No crees tokens "por si acaso".

Si una variable:

- no se utiliza;
- se utiliza una única vez sin aportar claridad;
- duplica otra;
- representa un estado que todavía no existe;

elimínala o no la crees.

---

## 11. NO DUPLICAR VARIABLES

Si dos variables tienen:

- el mismo valor;
- la misma función;

utiliza una sola.

Ejemplo incorrecto:

```css
--ease-normal: cubic-bezier(...);
--ease-norma: cubic-bezier(...);
```

si ambas son iguales.

Preferir:

```css
--ease-default: cubic-bezier(...);
```

---

## 12. RESPONSABILIDAD SEMÁNTICA DE VARIABLES

No utilices una misma variable para conceptos distintos únicamente porque actualmente tienen el mismo valor.

Ejemplo incorrecto:

```css
--page-inset: 64px;

.page-wrapper {
  padding: var(--page-inset);
}

.content-stack {
  gap: var(--page-inset);
}
```

El padding exterior y la separación entre componentes son conceptos diferentes.

Preferir:

```css
--page-inset: ...;
--section-gap: ...;
```

Cada variable debe representar una decisión de diseño clara.

---

## 13. SPACING

Mantén separados conceptualmente:

- espacio respecto al viewport;
- separación entre componentes;
- padding interno;
- separación local entre elementos.

Ejemplo:

```css
--page-inset: ...;
--section-gap: ...;
--container-padding: ...;
```

No crees una variable para cada `margin`, `gap` o `padding` pequeño.

---

## 14. CONTAINERS

Mantén pocos tamaños globales de container.

Solo crea distintos containers si existe una razón visual real.

Ejemplo válido:

```css
--container-hero: ...;
--container-wide: ...;
--container-content: ...;
```

si el Hero necesita ser más expansivo que el resto del contenido.

Evita containers con diferencias mínimas que compliquen el sistema.

---

## 15. FALLBACKS DE VARIABLES

Si una variable está garantizada en `:root`, no repitas innecesariamente su valor como fallback.

Preferir:

```css
background: var(--bg-canvas-light);
```

frente a:

```css
background: var(--bg-canvas-light, #f3f3f0);
```

Utiliza fallback únicamente cuando exista una posibilidad real de que la variable no esté definida.

---

## 16. CLAMP

Utiliza `clamp()` cuando un valor deba escalar de forma fluida entre móvil y desktop.

Buenos candidatos:

- `font-size`;
- page inset;
- section gap;
- container padding;
- radios grandes;
- determinados gaps.

No utilices `clamp()` automáticamente para cualquier valor.

Si un valor fijo funciona correctamente, utiliza un valor fijo.

---

## 17. GLOBAL.CSS

`global.css` debe contener principalmente:

- reset;
- estilos base de `html` y `body`;
- tipografía global;
- enlaces;
- botones base;
- imágenes;
- `focus-visible`;
- containers compartidos;
- reduced motion;
- utilidades verdaderamente globales.

NO introduzcas estilos específicos de:

- Hero;
- ProductLoop;
- products;
- FAQ;
- Testimonials;
- otras secciones.

Los estilos específicos deben permanecer en sus componentes.

---

## 18. CSS GLOBAL VS LOCAL

Si una regla se utiliza realmente en varios componentes, considera mover su base a global.

Ejemplos:

- botón principal;
- container;
- tipografía común;
- radius;
- spacing estructural.

No centralices una regla utilizada una sola vez.

Evita tanto:

- duplicación;

como:

- abstracción prematura.

---

## 19. JAVASCRIPT

Mantén JavaScript al mínimo.

Antes de añadir una librería pregúntate si puede resolverse mediante:

- CSS;
- HTML;
- `IntersectionObserver`;
- pequeño JavaScript nativo.

NO añadir:

- GSAP;
- Swiper;
- Splide;
- librerías de animación;
- librerías de carrusel;

para interacciones sencillas.

---

## 20. TRANSICIONES

No utilices:

```css
transition: all;
```

por defecto.

Anima únicamente las propiedades necesarias.

Preferir:

```css
transition:
  opacity 300ms var(--ease-default),
  transform 300ms var(--ease-default);
```

cuando corresponda.

---

## 21. ANIMACIONES

Prioriza propiedades eficientes:

- `transform`;
- `opacity`.

Evita filtros costosos como:

```css
filter: blur(...);
```

si no aportan una diferencia visual importante.

Una animación sencilla debe tener una implementación sencilla.

---

## 22. SOMBRAS Y BORDES

Evita efectos duplicados.

Si existe:

```css
border: 1px solid ...;
```

no añadas además:

```css
box-shadow: 0 0 0 1px ...;
```

si solo produce prácticamente el mismo borde.

Mantén sombras multicapa únicamente cuando exista una diferencia visual clara.

---

## 23. GLASS Y BACKDROP FILTER

No crees sistemas completos de glassmorphism salvo que sean realmente necesarios.

Evita crear automáticamente:

```css
--glass-bg
--glass-bg-hover
--glass-bg-active
--glass-border
--glass-border-hover
--glass-blur
```

si solo se utilizan uno o dos valores.

No abuses de:

```css
backdrop-filter
filter: blur(...)
```

cuando:

- background;
- gradient;
- transparencia;

puedan producir un resultado equivalente.

---

## 24. PROPIEDADES NO JUSTIFICADAS

No añadas propiedades poco comunes simplemente porque parezcan avanzadas.

Ejemplos:

```css
font-feature-settings
text-rendering
```

Solo deben utilizarse si existe una razón concreta y comprobada.

---

## 25. COMENTARIOS CSS

Evita comentarios decorativos largos como:

```css
/* ==========================================================================
   Section
   ========================================================================== */
```

Preferir:

```css
/* Hero */
```

o ningún comentario si el código ya es autoexplicativo.

---

## 26. RESPONSIVE

Simplificar código NO significa ignorar responsive.

Cada componente debe funcionar correctamente en:

- 1440px;
- 1280px;
- 1024px;
- 768px;
- 430px;
- 390px;
- 375px.

No crees una versión duplicada del componente para móvil salvo que sea absolutamente necesario.

Prefiere:

- Grid;
- Flexbox;
- `clamp()`;
- `min()`;
- `max()`;
- `aspect-ratio`;
- media queries simples.

---

## 27. MOBILE

No utilices valores mínimos excesivos en:

- page inset;
- section padding;
- card padding;
- gaps;

que reduzcan demasiado el espacio útil en móvil.

Mobile debe diseñarse deliberadamente.

No quiero desktop comprimido.

---

## 28. FOCUS

Mantén siempre:

```css
:focus-visible
```

El estado de focus debe verse correctamente tanto sobre:

- fondos oscuros;
- fondos claros.

No utilices un focus blanco global si desaparece sobre superficies claras.

---

## 29. REDUCED MOTION

Todo proyecto con animaciones debe respetar:

```css
@media (prefers-reduced-motion: reduce)
```

Mantén la implementación lo más simple posible.

---

## 30. PERFORMANCE

Prioriza:

- pocas dependencias;
- poco JavaScript;
- imágenes optimizadas;
- dimensiones explícitas;
- Astro Image;
- lazy loading fuera del Hero;
- prioridad para el LCP;
- cero CLS evitable;
- poco DOM.

---

## 31. CSS MUERTO

Cada vez que modifiques un componente:

elimina:

- clases antiguas;
- selectores sin uso;
- animaciones sin uso;
- keyframes sin uso;
- wrappers antiguos;
- variables locales innecesarias;
- estilos de implementaciones anteriores.

No dejes restos de código.

No elimines una regla si no puedes confirmar que no se utiliza.

---

## 32. REFACTORIZACIÓN SEGURA

Cuando simplifiques CSS existente:

1. entiende primero qué hace;
2. identifica duplicación y código muerto;
3. modifica únicamente lo necesario;
4. elimina selectores y variables sin uso;
5. comprueba responsive;
6. ejecuta el build;
7. confirma que no existe un cambio visual involuntario.

Una refactorización CSS NO es un rediseño.

---

## 33. IDENTIDAD VISUAL POR PROYECTO

Estas reglas se aplican a todos los proyectos del workspace.

Eso NO significa que todos deban compartir:

- colores;
- fuentes;
- radios;
- tamaños;
- spacing exacto;
- estética.

Cada proyecto conserva su identidad visual.

Lo que comparten es:

- simplicidad;
- mantenibilidad;
- ausencia de duplicación innecesaria;
- responsive real;
- código proporcional a la interfaz.

---

## 34. LÍMITE DE COMPLEJIDAD

No existe un límite rígido de líneas.

Pero si una sección visualmente simple termina necesitando:

- cientos de líneas de CSS;
- decenas de clases específicas;
- muchas capas de wrappers;
- múltiples sistemas de tokens;

DETENTE y revisa la arquitectura.

Antes de continuar, pregúntate:

- ¿puedo usar un asset real?
- ¿puedo reutilizar una estructura?
- ¿puedo eliminar wrappers?
- ¿hay CSS duplicado?
- ¿estoy creando estilos demasiado específicos?
- ¿realmente necesito esta animación o efecto?

Una sección simple debe tener una implementación proporcionalmente simple.

---

## 35. NO OBSESIONARSE CON EL NÚMERO DE LÍNEAS

Una clase con 8, 10 o 15 propiedades puede ser perfectamente correcta.

No reduzcas CSS únicamente para disminuir el número de líneas.

El objetivo es:

**eliminar lo innecesario, no eliminar lo necesario.**

---

## 36. PRIORIDAD FINAL

Cuando tengas dos soluciones visualmente equivalentes:

elige siempre la que tenga:

1. menos código;
2. menos DOM;
3. menos JavaScript;
4. menos dependencias;
5. mayor reutilización;
6. mejor mantenibilidad.

Objetivo:

**diseño premium con código sorprendentemente simple.**