# Investigación del banner en LucusHost

## Evidencias y límites

Se probó directamente `https://psicoinfantilcastellon.com/` antes de modificar el código, con Chrome y contextos privados nuevos en 1440, 1280, 1024, 768, 430, 390 y 375px. En esas ejecuciones el aviso apareció, `data-initialized` estaba activo, `aria-hidden=false`, opacidad 1, sin `inert`, dentro de pantalla y con botones accesibles por hit testing. «Configurar cookies» reabrió el diálogo después de rechazar. No se observaron errores JS ni respuestas HTTP fallidas de assets del mismo origen. El tráfico externo se bloqueó para no enviar datos de prueba a Analytics.

No se ha reproducido la desaparición con las condiciones exactas del navegador de la persona usuaria. Por tanto, no se atribuye el incidente a LucusHost, caché o extensiones sin evidencia. Las pestañas privadas de una misma sesión comparten preferencias; esto puede explicar algunos casos, pero no se presupone como causa del incidente comunicado.

Sí se reprodujo un fallo de resiliencia: bloqueando la descarga de JavaScript, el banner anterior permanecía invisible (`opacity-0`, `aria-hidden=true`, `inert`) porque dependía de un módulo y un temporizador para mostrarse. La nueva prueba falló antes de corregirlo y pasa después. No se afirma que esta sea la causa confirmada del navegador afectado.

## Corrección acotada

- `CookieBanner.astro`: aviso visible en el HTML, sin permiso de Analytics implícito. Se conserva su diseño normal, clases de posición y z-index.
- El arranque espera al DOM cuando corresponde, es idempotente y no depende de un temporizador. Una elección válida oculta el banner; sin elección permanece visible.
- Los controles se habilitan solo al terminar de registrar sus listeners. Si falta JavaScript, el aviso informa del problema, los controles quedan deshabilitados y el enlace a la política sigue disponible. Las preferencias no pueden editarse sin JavaScript; no se simula una aceptación.
- No se cambia GA4, sus valores predeterminados ni su aprobación de privacidad.
- El consentimiento sigue en localStorage, no en cookies: claves `psico_cookie_consent` y `psico_cookie_consent_updated_at`. Las cookies `_ga` solo corresponden a Analytics tras aceptar. Se conservan expiración y recuperación ante almacenamiento bloqueado.

## Verificaciones del build corregido

`tests/cookie-banner.browser.mjs` comprueba visibilidad, controles, Footer, preferencias compartidas, almacenamiento bloqueado, fallo de scripts y existencia de los scripts referenciados por el HTML de `dist`.

Las regresiones de Analytics comprueban rechazo persistido y bloqueo, aceptación y activación, visitas posteriores, reapertura y retirada entre pestañas, sin envíos antes del permiso. Se ejecutó también el código real de gtag sobre los assets de producción con sus envíos interceptados: no se verifica recepción en la propiedad.

Astro Check y build ejecutados; sin errores ni advertencias, con 7 hints preexistentes. No se ha desplegado esta corrección.

## Al publicar manualmente

Subir el contenido completo del nuevo `dist`, incluidos HTML y todos los assets de `/_astro/` del mismo build; no mezclar HTML nuevo con scripts de otro build. Si se utiliza caché de hosting/CDN, invalidarla después. Repetir la prueba en una sesión privada nueva. Si persiste, recoger URL exacta, navegador/versión y los errores de Consola/Red del equipo afectado; si el aviso es ocultado por un filtro de contenidos, esta corrección no anula el filtro.

## Corrección posterior del parpadeo al navegar

La entrega visible por defecto resolvía el respaldo sin scripts, pero causaba FOUC: cada documento mostraba el aviso hasta que el módulo leía una preferencia válida. Ahora `CookieConsentHead.astro`, situado inmediatamente tras el charset en `Layout.astro`, ejecuta una comprobación síncrona inline, sin red, módulos, temporizadores ni esperas. Solo una elección válida añade `data-cookie-consent-known` al elemento raíz. Una regla CSS acotada impide pintar el banner mientras su módulo aún no se ha inicializado. Cuando se inicializa, toma el relevo el estado oculto habitual, conservando las transiciones de reapertura.

Las claves, los 180 días y la validación se comparten desde `cookie-consent-state.mjs`, cuya función pura se incorpora al script del head durante el build. No se duplica una regla distinta. Las lecturas son de solo lectura también en el módulo: no se migran fechas ni se borran entradas inválidas/caducadas. Estas últimas se consideran ausencia de permiso y muestran el banner. Las elecciones antiguas sin fecha mantienen compatibilidad; la siguiente elección explícita guarda fecha.

Si la lectura falla o no existe permiso válido, no se aplica la regla y el aviso sigue visible. Si funciona el head pero falla el módulo, «Configurar cookies» retira el marcador para mostrar el respaldo. Si todo JavaScript está deshabilitado, el HTML sigue siendo visible; los controles requieren JavaScript y no simulan una aceptación. No cambia la autorización de GA4 ni la autorización independiente de Maps.

Prueba adicional: `node tests/cookie-consent-head.browser.mjs`. Observa frames en escritorio/móvil al navegar por Inicio, Contacto y Privacidad y al recargar, con elección aceptada/rechazada, legacy, ausente, inválida, caducada, futura y corrupta. Incluye módulos bloqueados para comprobar que la ocultación sucede antes de que puedan intervenir, y módulos activos para comprobar que no hay flash durante el relevo. Verifica que los valores almacenados permanecen idénticos y que abrir preferencias no mueve el contenido principal (banner fijo, fuera del flujo). No se afirma que el CLS global de todas las páginas sea cero por factores ajenos al banner.
