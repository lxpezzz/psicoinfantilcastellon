# Google Analytics 4 y consentimiento

ID facilitado: `G-WJFYNXS3TV`. Integración estática compatible con LucusHost, sin backend ni dependencias nuevas.

## Configuración definitiva: validación por función

**La medición mejorada no es un motivo de bloqueo por sí misma.** Se conserva con estas opciones, recogidas en `src/data/analytics-privacy.json`:

| Función | Configuración requerida | Fuente del evento |
| --- | --- | --- |
| Vistas de página | Activada, solo por carga de documento | `page_view` automático de `config`; ningún page_view manual |
| Cambios de historial | Desactivados en los ajustes avanzados de vistas | No hay ClientRouter/SPA; evitar URL/referrer sin filtrar en push/replace/popState |
| Desplazamientos | Activados | `scroll` automático al 90%, sin listener manual |
| Clics de salida | Activados tras auditar cada URL y sus atributos | `click` automático, solo destinos públicos revisados |
| Búsquedas internas | Desactivadas | No enviar `search_term` ni parámetros de búsqueda |
| Vídeos y descargas | Desactivados | No enviar URLs, títulos o nombres de archivos |
| Formularios automáticos | Desactivados | No enviar `form_start`, `form_submit`, `form_destination` ni textos asociados |
| Datos proporcionados por usuarios | Recopilación y detección automática desactivadas | No se inspeccionan campos ni se envía `user_data`; tampoco conversiones mejoradas ni User-ID |

En Administrar → Flujos de datos → flujo web → Medición mejorada, configurar cada opción. Revisar también Configurar ajustes de etiquetas → Gestionar detección automática de eventos: desactivar los detectores de formularios, vídeos, descargas e historial que no se utilizan. En Permitir funciones de datos proporcionados por usuarios, desactivar tanto la función como su detección automática.

Mantener desactivados Google Signals, personalización publicitaria, destinos/conexiones publicitarias y revisar el uso compartido. Las opciones remotas se cambian desde Google, no con `gtag('config')`: no se utilizan supuestos interruptores JS no documentados para desactivarlas.

### Comprobador específico y activación

```powershell
npm run build
node scripts/analytics-privacy.mjs G-WJFYNXS3TV
```

El comando consulta la etiqueta pública desde Node (no desde la web de un visitante) y analiza únicamente su JSON, sin ejecutar código remoto. Informa `pass`, `fail` o `unknown` para cada función, para los datos proporcionados por usuarios y para las conversiones genéricas. No rechaza vistas, scroll o salidas por estar activados. Audita también los enlaces reales del build; no imprime las URLs rechazadas, que podrían contener datos sensibles.

La etiqueta publicada no es una API estable ni sustituye la comprobación del panel. Un formato desconocido requiere revisión; los detectores y colectores se comprueban separadamente y no se deduce que un detector habilitado haya enviado ya un evento. El script es de solo lectura: no modifica Google ni aprueba la propiedad automáticamente.

`PUBLIC_GA_PRIVACY_REVIEWED` es la autorización final de una configuración concreta, no un requisito de desactivar toda la medición mejorada. Debe mantenerse en `false` en entornos aún no revisados. En el `.env` local ya está en `true` tras comprobar los ajustes públicos, las URLs, el consentimiento y la etiqueta real. Los problemas se resuelven en la función indicada; no se apaga el resto indiscriminadamente. Si una función remota no puede validarse, no se debe publicar una versión que la cargue: JavaScript no puede prometer filtrar sus eventos automáticos por enlace.

Tras validar el panel y las pruebas con la etiqueta real, una persona autorizada podrá aprobar la variable y recompilar. Cuando esté aprobada, el build **falla con un diagnóstico de clics de salida** si aparecen destinos/atributos no revisados. El chequeo remoto sigue siendo un paso explícito; no se hacen llamadas a Google durante los builds normales ni antes del consentimiento en el navegador. La variable se incorpora al build; LucusHost no la lee en tiempo de ejecución.

## Parámetros y enlaces de contacto

- `page_location`: canonical pública generada por Astro, sin parámetros ni fragmentos; `page_referrer`: vacío. Se fijan tanto a nivel global como en `config`, para que los hereden también los eventos automáticos. El título es estático. Las campañas se mantienen neutras; no se copian UTMs ni datos del referrer.
- `link_url`: la medición mejorada transmite el enlace completo. Se revisan URLs exactas en `reviewedOutboundUrls`, no solo dominios. Los parámetros admitidos son constantes de idioma o del perfil público de la consulta, no valores del visitante. También se comprueban `link_id` y `link_classes`; no incluir nombres, emails, IDs de pacientes ni teléfonos en ellos. Cualquier enlace nuevo exige revisar de nuevo esta lista. No hay campos que creen enlaces dinámicos en la web actual; si se incorporan, hay que revisar la solución antes de medirlos.
- WhatsApp: los dos enlaces conservan su aspecto, accesibilidad y apertura en otra pestaña, pero apuntan a `/ir-a-whatsapp/`. Este salto estático tiene destino fijo, `noindex`, no usa Layout/Analytics, no reenvía query/hash y no figura en el sitemap. De esta forma el teléfono no aparece en un `link_url` automático y no se genera un `click` automático adicional al `click_whatsapp`. No se usa medición multidominio ni se decora el enlace con identificadores `_gl`.
- Teléfono: los enlaces `tel:` mantienen su destino. No son salidas HTTP a otro sitio; se mide únicamente `click_telefono`, sin número, URL ni texto.
- Formularios: Web3Forms se conserva. Solo su confirmación `response.ok && result.success === true` provoca `generate_lead`, una vez por envío. No se lee ningún campo para Analytics, ni se mide el clic en enviar o `/gracias/` como lead.

## Conversiones y duplicados

`config` se ejecuta una sola vez por documento aceptado (`started`), con `send_page_view:true`. Se ha eliminado el emisor manual de `page_view`. Reabrir el banner o volver a aceptar no vuelve a configurar la etiqueta. El scroll y las salidas no tienen un segundo emisor manual.

Marcar **solo `generate_lead` como evento clave de formulario**. No marcar como conversiones los genéricos `click`, `scroll`, `page_view`, `form_start` o `form_submit`; no crear reglas que conviertan un clic en `generate_lead`, ni duplicar este evento desde GTM, la página de gracias o reglas de creación de eventos. `click_whatsapp` y `click_telefono` se conservan como acciones de contacto; si se eligen como eventos clave, no marcar además una versión genérica del mismo clic. Esto se revisa en el panel, no se presupone desde el código.

La comprobación pública busca conversiones genéricas duplicadas, pero no permite certificar todas las reglas privadas, integraciones o destinos. Validar también estos ajustes en GA4.

### Otro punto detectado en la revisión de cookies

`ContactMap.astro` ya bloquea el iframe hasta una autorización específica: «Autorizar y cargar Google Maps». El permiso es independiente de Analytics, no se persiste y no se deduce del banner ni de preferencias anteriores. No hay iframe activo ni solicitud de Maps al hacer scroll, rechazar opcionales o aceptar estadísticas. «Desactivar mapa» retira el iframe; «Rechazar opcionales» también lo retira, incluida la sincronización entre pestañas. Se conserva el marco de 320/400px, la dirección y los enlaces externos. Sin JavaScript, solo quedan la información y los enlaces, nunca se carga Maps automáticamente. Las cookies de Google ya existentes no pueden borrarse desde este dominio.

Prueba: `node tests/maps-consent.browser.mjs` sobre el build. Intercepta Maps para comprobar la puerta de consentimiento, el aislamiento respecto a GA4, el teclado, la retirada, almacenamiento bloqueado y responsive. No certifica el inventario interno del servicio real. Ver textos y puntos de validación legal en `docs/privacy-review.md`.

## Funcionamiento

- Consent Mode v2 básico: cuatro consentimientos denegados por defecto; no se descarga gtag.js ni se envían pings sin aceptación. Solo `analytics_storage` pasa a `granted`; la publicidad permanece denegada.
- El banner conserva su aspecto y transiciones. Una comprobación síncrona inline en el head valida la preferencia antes del primer pintado y oculta el aviso solo si existe una elección válida. Sin elección, con datos inválidos o si falla el head, el HTML mantiene el aviso visible. Si falla el módulo principal, muestra una explicación y los controles permanecen deshabilitados, sin conceder consentimiento; el head permite abrir este respaldo desde «Configurar cookies». Las preferencias usan `psico_cookie_consent` (`all` / `necessary_only`) y una fecha en localStorage, con caducidad de 180 días. Se conserva compatibilidad con elecciones anteriores sin fecha. Las lecturas no asignan fechas, borran datos ni renuevan preferencias; solo las acciones explícitas escriben la elección y fecha.
- La retirada activa primero `ga-disable`, deniega el consentimiento, elimina cookies `_ga` y `_ga_*` accesibles en las rutas/dominios pertinentes y recarga para descargar totalmente gtag. No elimina datos históricos ya enviados a Google. Se sincroniza la elección entre pestañas.
- Un `page_view` automático por documento con consentimiento, sin emisión manual. La web usa navegación Astro estática, no ClientRouter.
- `click_whatsapp` y `click_telefono` son eventos personalizados sin texto, href, números ni mensajes predefinidos; WhatsApp utiliza el salto local descrito anteriormente.
- `generate_lead` se emite tras `response.ok` y `result.success === true` de Web3Forms, una vez por envío confirmado. No se mide como lead el clic en enviar, un error o la visita a `/gracias/`.
- Los eventos personalizados no admiten parámetros del usuario. Los automáticos de scroll y salida añaden solo sus parámetros técnicos previstos y los enlaces revisados. Se usa `referrerpolicy=no-referrer` en la descarga de gtag.js.
- Se desactivan Signals, señales publicitarias y conversiones mejoradas también en el código. Las cookies se limitan al host, a 180 días sin renovación en cada visita. GA4 sigue siendo un tratamiento de datos seudónimos y Google recibe la IP al establecer la conexión; no debe describirse como completamente anónimo.

## Pruebas antes de publicar

1. Perfil nuevo: ni solicitudes a gtag/GA4 ni cookies `_ga`. Repetir tras rechazar y tras cerrar el banner.
2. Aceptar en un entorno de revisión con etiqueta real: un `page_view` automático, un `scroll` al 90% y un `click` por salida revisada; sin formularios automáticos, búsquedas, descargas, vídeos ni datos proporcionados por usuarios. Revisar Tiempo real/DebugView con acceso a la propiedad; no activar debug desde parámetros de URL arbitrarios.
3. Navegar y recargar: elección persistida, un page_view por documento y ninguna etiqueta duplicada. Probar fechas caducadas, almacenamiento bloqueado y cambio desde otra pestaña.
4. Retirar: recarga, cookies de GA eliminadas, ninguna nueva medición al interactuar o navegar.
5. Probar enlaces y envíos válidos/erróneos con Web3Forms interceptado, nunca mandar datos de prueba personales al servicio real. Inspeccionar la red con datos ficticios en query/hash/referrer y formulario: no deben aparecer en los eventos.
6. Comprobar en la red `page_location`, `page_referrer`, `link_url`, `link_id`, `link_classes` y la ausencia de campos del formulario o valores `user_data`, emails, teléfonos e información clínica. Probar query/hash/referrer con datos ficticios; también atributos HTML, salidas y envíos erróneos. Confirmar que ningún clic de contacto genera dos conversiones y que solo un envío confirmado genera un lead.

Referencias: [Consent Mode](https://developers.google.com/tag-platform/security/guides/consent), [page_view manual](https://developers.google.com/analytics/devguides/collection/ga4/views), [datos proporcionados por usuarios](https://support.google.com/analytics/answer/14078702).

## Prueba automatizada local

Usa Chrome, Puppeteer y Vite ya disponibles en el proyecto; no añade paquetes. Desde la raíz:

```powershell
npm run build
node tests/analytics.browser.mjs --approved-build
```

El test sirve el build normal y comprueba su activación tras aceptar con `--approved-build`; sin esa opción exige un build bloqueado por falta de revisión. Además prueba la rama aprobada en un bundle en memoria, sin cambiar `.env`. La etiqueta simulada emite automáticamente vistas, scroll y salidas, de modo que un emisor manual duplicado haría fallar la prueba. Google y Web3Forms se interceptan: los datos ficticios no salen de la prueba. Se prueban también configuraciones remotas permitidas, prohibidas y desconocidas. Esto no confirma la recepción en la propiedad real ni sustituye una captura de red con sus ajustes definitivos. Puede configurarse `CHROME_PATH` si Chrome está en otra ubicación.

### Prueba con el código real de Google

```powershell
node tests/analytics.real-tag.mjs
# Tras aprobar la variable y compilar, probar los assets exactos de dist:
node tests/analytics.real-tag.mjs --production-build
```

Descarga la etiqueta pública actual y ejecuta ese código, sin sustituir su lógica por un simulador. Sin opciones, la aprobación del módulo local se aplica solo en memoria; `.env` no cambia. Con `--production-build` no se sustituye ningún módulo de la web: se prueba el JavaScript exacto de `dist`. Se interceptan las solicitudes de recogida de GA4 y se responden localmente, por lo que los eventos no llegan a la propiedad. Web3Forms y el destino de salida también se interceptan; los demás destinos externos se bloquean. La descarga inicial de la etiqueta sí contacta con Google desde Node, no desde el visitante sin consentimiento.

Comprueba consentimiento/rechazo, reaceptación, visita única, scroll, salida, contactos, error/éxito del formulario, parámetros, cambios de historial, navegación entre documentos y retirada. Usa pausas para permitir los lotes reales de gtag. No certifica la recepción en Tiempo real/DebugView ni todas las reglas privadas de eventos clave.

## Verificación y pendientes

- Astro Check y build: correctos; 7 hints preexistentes de elementos no utilizados.
- Pruebas en Chrome con tráfico simulado: ausencia de tráfico/cookies sin permiso y tras rechazo/cierre, visita automática única, scroll único, salidas revisadas, WhatsApp sin teléfono en Analytics, lead solo tras éxito, ausencia de datos ficticios en URL/referrer/formulario, retirada y sincronización entre pestañas, preferencias caducadas y almacenamiento bloqueado.
- El banner tiene comprobación síncrona en head contra FOUC, respaldo visible ante fallos de JavaScript y arranque protegido por DOMContentLoaded. La retirada de GA4 y los enlaces de WhatsApp conservan su funcionamiento.
- El comprobador remoto es de solo lectura. Los ajustes que sigan fallando deben cambiarse por función en Google; no se ha accedido al panel ni certificado sus ajustes privados.
- Última consulta pública tras desactivar el historial: todas las comprobaciones pasan, incluidos vistas, scroll, salidas, historial desactivado, búsqueda desactivada, vídeos/descargas/formularios desactivados y datos proporcionados por usuarios desactivados. La auditoría de URLs y atributos del build pasa. No se detectaron conversiones genéricas en la configuración pública, sin que eso certifique las reglas privadas.
- Historial: la web usa documentos estáticos, sin `ClientRouter`, `pushState` ni `replaceState` en su implementación. Los listeners `astro:page-load` de algunos componentes no convierten la navegación en SPA. No necesita detección de historial. La etiqueta declara `vtp_enableHistoryEvents:false` y ya no incluye `__ccd_em_page_view`. El comprobador se ha corregido para no exigir ese colector para la visita por carga: `vtp_enablePageView:true` y `config(send_page_view:true)` siguen habilitados. La visita se ha corroborado con el código real, sin añadir emisión manual.
- Prueba con gtag real: sin carga antes del consentimiento o tras rechazo; una visita, un scroll, una salida, un evento por contacto y un lead solo tras éxito. No aparecieron los marcadores ficticios de URL/referrer/formulario en los eventos inspeccionados. `pushState`, `replaceState` y un `popstate` sintético no generaron visitas adicionales ni filtraron el marcador de prueba en esta ejecución. Navegar a `/contacto/` generó una sola visita adicional; la retirada eliminó las cookies y no produjo nuevas solicitudes. Los envíos se interceptaron: no se certifica recepción en la propiedad.
- Google Signals desactivado: confirmado por la responsable y deshabilitado también en `config`. Los datos granulares de ubicación/dispositivo activados no equivalen a Google Signals ni a datos introducidos en formularios. No se han cambiado; conviene justificar su necesidad y valorar desactivarlos por minimización en esta web. Su configuración y alcance no se certifican desde la etiqueta pública.
- El salto a WhatsApp se ha probado en Chrome interceptando su destino: solicita únicamente el destino fijo, sin query/hash del visitante ni cabecera de procedencia; no contacta con WhatsApp real durante la prueba.
- `PUBLIC_GA_PRIVACY_REVIEWED=true` en el `.env` local (ignorado por Git); `.env.example` conserva el valor seguro `false`. Build de producción generado y probado con gtag real y los assets exactos de `dist`: solo se activa tras aceptar estadísticas, sin solicitudes ni cookies GA antes de aceptar o tras rechazar, sin duplicados y con retirada efectiva. No hay bloqueo técnico detectado en estas pruebas. Si se compila en otro entorno, hay que configurar allí la variable y repetir las comprobaciones.
- Pendientes de panel/puesta en servicio: comprobar recepción en Tiempo real/DebugView con una sesión controlada, revisar que solo `generate_lead` sea el evento clave de formulario y que no existan reglas privadas que dupliquen contactos/leads; revisar retención, uso compartido y destinos conectados. Estas comprobaciones requieren acceso privado y no se certifican por la etiqueta pública. La puerta de consentimiento de Maps ya está implementada y probada. Los textos legales y el inventario de cookies del proveedor requieren la validación descrita en `docs/privacy-review.md`. No se ha publicado en LucusHost.
