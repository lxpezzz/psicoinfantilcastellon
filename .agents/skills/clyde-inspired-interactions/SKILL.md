name: clyde-inspired-interactions
description: >
  Skill especializada en diseñar e implementar interfaces web premium inspiradas
  en el lenguaje visual e interactivo de https://joinclyde.com, especialmente su
  hero con producto central, halo orgánico animado, estados rotativos, indicadores
  editoriales y storytelling sticky controlado por scroll. Adaptada para TapNova.
---

# Clyde-Inspired Interactions

## Purpose

Esta skill define cómo analizar, diseñar e implementar una landing page premium inspirada en:

https://joinclyde.com

El objetivo NO es copiar Clyde.

El objetivo es extraer y reinterpretar los principios visuales y de interacción que hacen que Clyde sea especial:

- producto como protagonista absoluto
- composición editorial
- gran objeto central
- halo orgánico animado
- copy lateral contenido
- indicadores editoriales
- transiciones sincronizadas
- estados rotativos en el hero
- storytelling mediante scroll
- secciones sticky
- progreso visual
- grandes áreas de espacio negativo
- animaciones cinematográficas
- ritmo visual premium

Esta skill está especialmente orientada al proyecto:

# TapNova

---

# 1. PRIORIDAD

Cuando esta skill sea utilizada:

1. Lee completamente `.rules`.
2. Lee completamente `.agents`.
3. Lee las skills relevantes del proyecto.
4. Inspecciona la arquitectura existente.
5. Inspecciona todos los assets existentes.
6. Analiza todas las imágenes de referencia proporcionadas.
7. Analiza `https://joinclyde.com` si tienes acceso web.
8. Comprende la implementación actual antes de modificarla.

La prioridad es:

```text
.rules
↓
.agents
↓
skills del proyecto
↓
arquitectura existente
↓
esta skill
↓
decisiones propias
Si esta skill contradice .rules, prevalece .rules.
No empieces a programar antes de haber realizado este análisis.
2. PRINCIPIO FUNDAMENTAL
NO interpretes Clyde como:
fondo oscuro + glow + H1 grande

Eso es incorrecto.
La estructura visual que define el sistema Clyde es:
copy contenido
+
producto central sobredimensionado
+
halo orgánico
+
indicadores editoriales
+
transiciones sincronizadas
+
scroll storytelling
El producto debe ser normalmente el primer punto de atención.
El texto debe apoyar al producto.
No competir con él.
3. OBJETIVO VISUAL
El resultado debe sentirse:
- premium
- editorial
- tecnológico
- cinematográfico
- minimalista
- limpio
- sofisticado
- intencional
- muy visual
Evita:
- plantilla SaaS
- grid de cards repetitivas
- dashboards falsos
- exceso de badges
- glassmorphism gratuito
- gradientes por todas partes
- blobs decorativos
- glows arbitrarios
- layouts excesivamente simétricos
- sliders convencionales
- texto centrado constantemente
- animaciones sin función
- apariencia generada por IA
4. REFERENCIA VISUAL
Referencia principal:
https://joinclyde.com
Cuando existan capturas adjuntas:
- analízalas visualmente
- estudia proporciones
- estudia posicionamiento
- estudia espacio negativo
- estudia escala del producto
- estudia jerarquía del copy
- estudia halo
- estudia indicadores
- estudia transiciones
- estudia comportamiento sticky
Las capturas representan una referencia prioritaria para:
- composición
- escala
- distribución
- ritmo
- interaction design
No copies:
- branding
- logos
- nombres
- clientes
- textos
- assets
- fotografías
- iconografía propietaria
5. TRADUCCIÓN A TAPNOVA
TapNova conecta productos físicos de hostelería con acciones digitales.
Narrativa principal:
mesa
↓
producto físico
↓
tap / scan
↓
acción
↓
reseña
↓
Google
↓
visibilidad local
Productos principales:
Portacuentas QR + NFC
Expositores QR / NFC
Tarjetas NFC
Tarjetas QR
Pegatinas
SEO Local
La web no debe parecer una tienda de códigos QR.
Debe parecer una marca tecnológica especializada en hostelería.
6. HERO — ELEMENTO PRINCIPAL
El hero debe tratarse como una escena interactiva.
NO como una landing convencional.
Estructura desktop aproximada:
LEFT              CENTER                RIGHT

copy              halo +                indicadores
contenido         producto               editoriales

CTA               protagonista           estado
Jerarquía:
1. Producto
2. Halo
3. Composición
4. Indicadores
5. Copy
6. CTA
7. HERO — ERROR QUE NO SE DEBE REPETIR
NO crear:
H1 gigante
+
texto comercial
+
foto rectangular
+
glow detrás
+
tabs inferiores
Eso NO reproduce la experiencia de Clyde.
Crear:
copy lateral contenido
+
objeto central aislado
+
halo orgánico
+
indicadores laterales
+
autoplay
+
transiciones sincronizadas
8. HERO — COPY
El copy debe tener menos peso visual que el producto.
Preferir:
- eyebrow corto
- titular moderado
- descripción breve
- un CTA
Evitar:
- H1 gigantesco
- párrafos largos
- múltiples CTA compitiendo
- texto dominante
Ejemplo conceptual:
RESEÑAS EN EL MOMENTO ADECUADO

QR y NFC integrados en un objeto que ya forma parte del servicio.

Ver portacuentas
No es obligatorio utilizar este texto literalmente.
9. HERO — PRODUCTO CENTRAL
El producto debe:
- estar recortado
- estar aislado
- estar suspendido
- verse nítido
- ser grande
- tener presencia física
- ocupar una parte importante del viewport
Evitar:
- card
- marco
- fotografía rectangular evidente
- fondo fotográfico innecesario
- contenedor ecommerce
El producto debe parecer integrado dentro de la escena.
Productos recomendados:
01 Portacuentas QR + NFC
02 Expositor QR / NFC
03 Tarjeta NFC
04 Pegatina
05 Tarjeta QR
SEO Local puede reservarse para secciones posteriores.
10. HERO — HALO ORGÁNICO
El halo es un componente obligatorio.
NO puede ser únicamente:
box-shadow
ni:
background: radial-gradient(...);
estático.
Debe sentirse como:
una membrana luminosa, translúcida y orgánica que envuelve el producto.

Características:
- forma irregular
- varias capas
- centro más oscuro
- bordes iluminados
- profundidad
- transparencia
- degradados complejos
- movimiento lento
- deformación orgánica
- respiración
- ligera rotación
- pequeñas variaciones de escala
11. HALO — POSIBLE ESTRUCTURA
Ejemplo conceptual:
<div class="product-stage">
  <div class="halo halo--outer"></div>
  <div class="halo halo--middle"></div>
  <div class="halo halo--inner"></div>

  <img class="product-stage__product" />
</div>
No es obligatorio utilizar esta estructura.
Respeta .rules.
12. HALO — IMPLEMENTACIÓN
Se puede utilizar:
- HTML layers
- pseudo-elements
- CSS gradients
- border-radius orgánico
- SVG
- SVG filters
- GSAP
- CSS animations
- mix-blend-mode
- blur controlado
Prioriza rendimiento.
13. HALO — MOVIMIENTO
El movimiento debe ser lento y orgánico.
Ejemplo:
scale 0.97 → 1.03
rotate -2deg → 2deg
border-radius cambiante
drift de capas
variación de opacidad
Las capas no deben compartir exactamente la misma duración.
Ejemplo:
outer  → 17s
middle → 23s
inner  → 13s
Evitar loops mecánicos.
14. HALO — PERFORMANCE
Priorizar:
transform
opacity
Controlar:
filter
blur
large SVG filters
No crear diez capas gigantes con blur.
No animar continuamente propiedades que generen layout.
Comprobar rendimiento en móvil.
15. MICROANIMACIÓN DEL PRODUCTO
El producto puede tener una animación independiente muy sutil.
Ejemplo:
translateY: -4px → 4px
rotate: -0.4deg → 0.4deg
Nunca debe parecer un videojuego.
16. HERO ROTATIVO
El hero debe tener varios estados.
Cada estado debe actualizar:
producto
eyebrow
headline
description
CTA
indicador
label lateral
halo
La transición debe sentirse como una nueva escena.
No como un simple cambio de src.
17. DATOS DEL HERO
Preferir una estructura data-driven.
Ejemplo:
const heroSlides = [
  {
    id: "portacuentas",
    eyebrow: "EN EL MOMENTO ADECUADO",
    title: "La reseña empieza en la mesa.",
    description:
      "QR y NFC integrados en un producto que ya forma parte del servicio.",
    image: "...",
    cta: "Ver portacuentas",
    href: "#portacuentas"
  }
];
Evitar duplicar markup innecesariamente.
18. HERO — TIMING
Recomendación inicial:
visible:
4000–5000ms

transition:
800–1200ms
Debe sentirse pausado.
Premium.
No rápido.
19. HERO — TIMELINE
Transición conceptual:
progress termina
↓
copy fade
↓
producto escala ligeramente
↓
producto sale
↓
halo se contrae / deforma
↓
nuevo producto entra
↓
nuevo copy aparece
↓
indicador cambia
↓
halo recupera amplitud
El producto, halo, copy e indicador deben sentirse sincronizados.
20. HERO — GSAP
GSAP está recomendado para:
- transición de producto
- timeline
- sincronización
- cambio de copy
- transición del halo
- indicador
No utilizar GSAP para cada hover pequeño.
CSS sigue siendo preferible para interacciones simples.
21. HERO — INDICADORES
Utilizar indicadores editoriales.
Preferencia:
—   —   —   —   —
La activa puede:
- iluminarse
- crecer
- llenarse
- mostrar progreso
Evitar:
- dots tradicionales
- flechas grandes
- tabs ecommerce
- botones de carrusel convencionales
Los indicadores deben ser clicables.
22. AUTOPLAY
El autoplay debe:
- arrancar automáticamente
- tener una única fuente de estado
- no duplicar timers
- permitir selección manual
- reanudar correctamente
- pausar cuando sea apropiado
Gestionar:
visibilitychange
si mejora el comportamiento.
23. HERO MOBILE
No eliminar el concepto.
Layout preferido:
copy
↓
halo + producto
↓
indicadores
↓
CTA
Requisitos:
- producto protagonista
- halo visible
- sin overflow
- touch targets correctos
- animaciones simplificadas si hace falta
- buena performance
24. RESPONSIVE HERO
Validar:
360px
390px
430px
768px
1024px
1280px
1440px
1920px
Revisar específicamente:
- halo clipping
- producto
- copy
- indicadores
- CTA
- overflow horizontal
- altura
- z-index
25. SEGUNDO PATRÓN — STICKY EXPLAINER
La segunda interacción fundamental es un storytelling controlado por scroll.
Concepto:
visual persistente
+
copy cambiante
+
scroll
+
progreso
Debe sentirse como un explicador.
No como tres secciones independientes.
26. ESTRUCTURA DESKTOP
Ejemplo:
LEFT                     RIGHT

visual grande            eyebrow
cambiante                título

                         descripción

                         indicador
                         vertical
Utilizar:
wrapper alto
+
sticky viewport
+
scroll progress
+
states
27. STICKY
Ejemplo orientativo:
.story-wrapper {
  min-height: 260vh;
}

.story-sticky {
  position: sticky;
  top: 0;
  min-height: 100vh;
}
No copiar ciegamente estos valores.
Ajustarlos al proyecto.
28. NO SCROLL HIJACKING
Nunca bloquear manualmente:
- rueda
- trackpad
- touch scroll
El documento debe conservar scroll natural.
La escena simplemente responde al progreso del usuario.
29. ESTADOS TAPNOVA
Usar tres estados principales:
01 MOMENTO
02 INTERACCIÓN
03 VISIBILIDAD
30. ESTADO 01 — MOMENTO
Eyebrow:
EN EL MOMENTO ADECUADO
Headline:
La reseña aparece cuando más sentido tiene.
Concepto:
TapNova integra QR y NFC dentro de objetos que ya forman parte del servicio.
Visual:
- portacuentas
- restaurante
- producto protagonista
31. ESTADO 02 — INTERACCIÓN
Eyebrow:
SIN FRICCIÓN
Headline:
Acercar. Escanear. Listo.
Concepto:
El cliente utiliza NFC o QR directamente desde su móvil.
Visual:
producto
+
móvil
+
NFC / QR
Puede incluir microanimación.
32. ESTADO 03 — VISIBILIDAD
Eyebrow:
DESPUÉS DEL TAP
Headline:
La reputación también se trabaja.
Concepto:
TapNova conecta el mundo físico con SEO Local.
Visual:
producto físico
↓
reseña
↓
Maps
↓
visibilidad local
No copiar Google Business Profile pixel-perfect.
33. PROGRESO DE SCROLL
Mapear el progreso.
Ejemplo:
0–33%   → 01
33–66%  → 02
66–100% → 03
Cuando cambia el estado:
- cambia visual
- cambia eyebrow
- cambia headline
- cambia copy
- cambia CTA si existe
- cambia indicador
- puede cambiar iluminación
34. INDICADOR VERTICAL
Inspirarse en el lenguaje editorial de Clyde.
Ejemplo:
01
│
│
│
03
Debe incluir progreso real.
Puede ser:
track
+
fill
sincronizado con scroll.
No debe ser decorativo.
35. SCROLLTRIGGER
GSAP ScrollTrigger está recomendado para:
- calcular progreso
- controlar states
- sincronizar visual
- animar copy
- animar indicador
- controlar entrada / salida
Registrar correctamente:
gsap.registerPlugin(ScrollTrigger);
si se utiliza.
36. TRANSICIÓN ENTRE ESTADOS
Preferir:
opacity
transform
clip-path
mask
scale
con moderación.
Evitar cambios instantáneos.
Las transiciones deben ser suaves.
37. VISUAL DEL EXPLAINER
El visual debe ocupar gran parte de la pantalla.
No colocarlo dentro de una card pequeña.
Desktop:
45–55%
aproximadamente.
Cada estado puede:
- cambiar completamente
- transformar el visual existente
- añadir/quitar capas
- variar iluminación
38. MOBILE EXPLAINER
No forzar sticky si perjudica UX.
Fallback recomendado:
01
visual
copy

02
visual
copy

03
visual
copy
Mantener:
- composición editorial
- jerarquía
- grandes visuales
- reveals suaves
No convertir en cards genéricas.
39. SALIDA DEL STICKY
La sección debe liberar el scroll naturalmente.
Evitar:
- saltos
- huecos
- solapamientos
- quedarse pegada
- superponer siguiente sección
La transición debe ser limpia.
40. PRODUCT SHOWCASE
Las secciones posteriores deben conservar la filosofía Clyde.
No hacer:
card card card
card card card
Preferir:
- productos grandes
- layouts asimétricos
- imágenes protagonistas
- fondos variables
- alternancia
- tipografía editorial
- gran espacio negativo
41. PORTACUENTAS
El portacuentas es prioritario para TapNova.
Debe comunicar:
QR
+
NFC
+
personalización
+
momento de entrega de cuenta
Debe ser uno de los visuales más fuertes.
42. EXPOSITORES
Mostrar integrados en contextos como:
- barra
- mostrador
- recepción
- caja
- sobremesa
43. TARJETAS
Para NFC y QR:
Tap
Scan
Action
Mantener comunicación simple.
No inventar capacidades.
44. PEGATINAS
Mostrar en contexto:
- escaparate
- puerta
- mostrador
- caja
No tratarlas únicamente como ecommerce.
45. SEO LOCAL
Debe diferenciarse visualmente.
Concepto:
El producto facilita la reseña.
TapNova trabaja lo que ocurre después.
Puede hablar de:
- Google Business Profile
- Maps
- reseñas
- presencia local
- datos del negocio
- contenido
- seguimiento
No garantizar posiciones.
No inventar métricas.
46. TIPOGRAFÍA
Debe sentirse editorial.
Reglas:
- pocas escalas
- jerarquía clara
- titulares cortos
- body contenido
- line-height adecuado
- evitar H1 desproporcionado
- producto primero
47. COLOR
Modelo recomendado:
fondo oscuro neutro
+
texto controlado
+
halo luminoso
+
producto brillante
+
acento limitado
No extender gradientes saturados por toda la página.
48. MOTION DESIGN
Movimiento:
- deliberado
- suave
- lento
- legible
- sincronizado
- físicamente plausible
Evitar:
- bounce
- cartoon easing
- escalados agresivos
- parallax aleatorio
- floating excesivo
- gimmicks
Easing recomendado:
power2
power3
sine
expo
con moderación.
49. REDUCED MOTION
Implementar:
@media (prefers-reduced-motion: reduce)
Hero:
- transiciones mediante opacity
- halo simplificado
- menos movimiento
Explainer:
- contenido legible
- sin depender de animación
50. IMÁGENES
Raster:
.webp
salvo reglas distintas.
SVG:
- logos
- iconos
- vectoriales
Requisitos:
- width
- height
- alt
- aspect-ratio
- object-fit
- no CLS
- hero LCP no lazy si es crítico
51. PERFORMANCE
Prioridad alta.
Evitar:
- hydration innecesaria
- JS excesivo
- filtros pesados
- múltiples loops caros
- demasiadas capas animadas
Priorizar:
transform
opacity
Comprobar:
- LCP
- CLS
- INP
- scroll fluido
- mobile
52. ACCESSIBILITY
Implementar:
- focus visible
- navegación teclado
- botones reales
- links reales
- contraste
- ARIA cuando haga falta
- reduced motion
- targets táctiles
- menú móvil accesible
53. ANTI-AI LOOK
Antes de terminar revisar:
¿Parece una plantilla SaaS?
Si sí:
corregir.
¿Tiene demasiadas cards?
Si sí:
corregir.
¿El H1 domina más que el producto?
Si sí:
corregir.
¿El halo parece simplemente un glow?
Si sí:
corregir.
¿El sticky parece tres cards?
Si sí:
corregir.
54. VALIDACIÓN CONTRA CLYDE
Comparar el resultado con:
https://joinclyde.com
No comparar solo colores.
Comparar:
Hero
- escala
- jerarquía
- producto
- halo
- copy
- distribución
- indicadores
- timing
- transición
Explainer
- sticky
- progresión
- estados
- visual
- copy
- indicador
- entrada
- salida
55. BROWSER VALIDATION
No validar únicamente leyendo código.
Abrir la web.
Revisar:
390x844
1440x900
y después:
360
430
768
1024
1280
1920
Hacer scroll completo.
Corregir:
- clipping
- overflow
- z-index
- timing
- sticky
- halo
- producto
- texto
- responsive
56. BUILD
Ejecutar:
npm run build
Si existen:
lint
typecheck
test
ejecutarlos.
No marcar terminado con errores conocidos.
57. ACCEPTANCE TEST — HERO
No finalizar hasta que:
- producto esté aislado
- producto domine la composición
- halo sea orgánico
- halo esté animado
- existan varios productos
- productos cambien automáticamente
- transición esté animada
- copy cambie
- indicador cambie
- navegación manual funcione
- autoplay funcione
- móvil funcione
58. ACCEPTANCE TEST — STICKY
No finalizar hasta que:
- desktop sticky funcione
- existan 3 estados
- scroll controle estados
- copy cambie
- visual cambie
- indicador avance
- transición sea suave
- salida sea natural
- mobile tenga fallback correcto
59. ACCEPTANCE TEST — CALIDAD
No finalizar hasta que:
- no haya AI-look evidente
- no haya console errors
- no haya assets rotos
- no haya overflow horizontal
- no haya CLS grave
- reduced motion funcione
- build pase
- diseño se sienta premium
- influencia Clyde sea claramente reconocible
60. FILOSOFÍA DE IMPLEMENTACIÓN
No imites únicamente una captura.
Comprende el sistema.
Workflow obligatorio:
analizar referencia
↓
extraer sistema visual
↓
extraer interaction model
↓
diseñar
↓
implementar
↓
abrir navegador
↓
comparar
↓
corregir
↓
validar
No detenerse en:
"se parece aproximadamente"
Buscar:
alta fidelidad en composición, jerarquía, movimiento e interacción, manteniendo branding y contenido propios de TapNova.

61. INSTRUCCIÓN FINAL
Cuando esta skill se invoque para TapNova:
1. Lee .rules.
2. Lee .agents.
3. Lee las demás skills relevantes.
4. Analiza las imágenes de referencia.
5. Analiza https://joinclyde.com.
6. Inspecciona la implementación existente.
7. Implementa.
8. Valida en navegador.
9. Compara visualmente.
10. Corrige hasta alcanzar alta fidelidad.
La prioridad visual es:
PRODUCTO
+
HALO
+
MOTION
+
STORYTELLING
No:
H1
+
CARD
+
GLOW
El resultado final debe reinterpretar el lenguaje de Clyde para:
TapNova
y comunicar:
producto físico
→
tap / scan
→
reseña
→
reputación
→
visibilidad local
