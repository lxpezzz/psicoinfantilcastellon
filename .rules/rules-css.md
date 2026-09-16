# CSS: claridad y consistencia

## 1. Prioridades
Claridad, consistencia, accesibilidad y mantenimiento. Entre soluciones igualmente claras y funcionales, elige la más sencilla.
No comprimas código, reduzcas líneas artificialmente ni traslades complejidad al HTML. Conserva diseño fuera del alcance solicitado.

## 2. Organización
Sigue rules-codigo.md. CSS específico junto al componente.
Orden: base del bloque, elementos, variantes, estados, responsive y reduced motion.
Comentarios breves para decisiones relevantes; evita separadores decorativos largos.

## 3. Compartido
Global para reset, bases, tipografía, tokens, botones y utilidades realmente compartidas.
No añadas estilos de sección a global. Extrae patrones con reutilización real, sin abstraer cada parecido.

## 4. Variables
Reutiliza tokens. No crees variables anticipadas o para cada valor de único uso.
Unifica igual función y valor; separa conceptos distintos. Evita fallbacks redundantes.

## 5. Layout y responsive
Grid, Flexbox y contenedores existentes. Anchos nuevos cuando el contenido lo justifique.
clamp(), min(), max() y aspect-ratio cuando aporten valor. Media queries claras, sin duplicar estructura móvil por comodidad.
Verifica cambios visuales en 1440, 1280, 1024, 768, 430, 390 y 375 px y breakpoints afectados cuando corresponda.

## 6. DOM y decoración
Wrappers con función concreta de layout, semántica, posicionamiento o interacción.
Prefiere fondos, bordes y pseudo-elementos para decoración sencilla.
No elimines wrappers necesarios ni conviertas contenido funcional en imágenes. Sigue rules-assets.md.

## 7. Cascada
Evita !important para conflictos: revisa cascada, especificidad y responsabilidades.
Permítelo en accesibilidad y casos justificados.
Evita sobrescribir numerosos estilos internos del hijo desde el padre; usa variantes explícitas para necesidades reales.

## 8. Accesibilidad
Focus visible en fondos claros y oscuros. Reduced motion conservando funcionalidad.
No dependas solo de hover o color para comunicar información.

## 9. Animación y rendimiento
Propiedades concretas; evita transition: all por defecto. Prioriza transform y opacity.
Filtros, blur, sombras multicapa y glass solo con aportación visual concreta.
Reserva dimensiones de imágenes y optimízalas cuando corresponda. No prometas rendimiento sin medir.
Sigue rules-simplicity.md para interacciones.

## 10. Limpieza segura
Elimina restos sustituidos solo tras confirmar desuso. No amplíes tareas pequeñas a limpieza general.
Valida según rules-astro.md. Refactorizar no autoriza rediseñar.
