# Revisión acotada: Google Maps y textos de GA4

## Alcance y resultado técnico

Se revisaron `ContactMap.astro`, `PrivacyPolicy.astro` y `CookiesPolicy.astro`. No se ha modificado la integración ni la configuración de GA4; `PUBLIC_GA_PRIVACY_REVIEWED=true` se conserva. No se publica en LucusHost.

Maps tenía `src` y carga diferida sin consentimiento. Ahora el iframe permanece en un template inerte y sin `src` hasta pulsar «Autorizar y cargar Google Maps». La información previa explica la conexión con Google y las posibles cookies. El permiso solo dura en el documento actual y es independiente de estadísticas: aceptar GA4 no carga Maps, y cargar Maps no acepta GA4. La dirección y los enlaces externos siguen disponibles sin mapa ni JavaScript.

«Desactivar mapa» elimina el iframe y devuelve el foco al botón de autorización. Rechazar opcionales también lo elimina, incluidas otras pestañas; al abandonar el documento se retira. No se borran datos históricos ni cookies de dominios de Google. Se conserva el marco, sus dimensiones responsive y el resto de la sección. Solo se añade el estado de consentimiento dentro del marco y el control de retirada.

Las políticas ya informaban de finalidad estadística, consentimiento previo, visitas/scroll/salidas/contactos/leads, exclusión de campos de formulario, seudonimización, proveedor, cookies `_ga` y `_ga_*` hasta 180 días y retirada. Se han completado con ubicación aproximada/dispositivo/navegador, ausencia de solicitud de geolocalización precisa, datos proporcionados por usuarios desactivados y la autorización independiente de Maps. Se distingue duración de cookies de retención en servidores. No se cambian los ajustes de Google.

## Textos que requieren validación legal antes de publicar

La coherencia técnica no equivale a una certificación de cumplimiento. La responsable o su asesoría debe cerrar estos puntos:

| Texto / ubicación | Qué falta validar |
| --- | --- |
| Privacidad → «Analítica opcional»: «la conservación en los servidores de Google depende de la propiedad…» | Consultar el plazo real de retención de eventos/usuarios y su renovación en la propiedad. Sustituir la nota de revisión por el plazo o criterios definitivos. Los 180 días son cookies, no una certificación de retención de GA4. |
| Privacidad → «Transferencias internacionales» y condiciones de Google | Confirmar entidad contractual, roles, países/destinatarios, mecanismo de transferencia vigente realmente aplicable, garantías y forma de obtener copia. Un enlace a condiciones generales no cierra por sí solo este deber informativo. No se ha inventado una adhesión o garantía contractual. Maps y Analytics no deben presumirse sometidos al mismo acuerdo. |
| Ambas políticas → proveedor Google Ireland Limited | Corroborar la entidad y condiciones aplicables a la cuenta y al mapa integrado, así como encargados/subencargados y alcance de las transferencias. |
| Ambas políticas → ubicación aproximada y datos de dispositivo | Validar necesidad y proporcionalidad de los ajustes granulares habilitados. No se han desactivado ni modificado. Considerar especialmente el contexto de psicología infantil: visitar páginas temáticas puede permitir inferencias aunque los eventos no contengan campos clínicos. |
| Cookies → Google Maps: «puede utilizar cookies…» / «inventario efectivo requiere comprobación» | Capturar las cookies reales tras autorizar en el hosting definitivo, con y sin sesión de Google y según navegador. Completar nombres, dominios, finalidades, tipo y duración efectivos; no inventar un listado universal. Validar el consentimiento específico por clic y la información previa del mapa. |
| Ambas políticas → «No enviamos… datos sobre menores ni motivos de consulta» | Corroborar que describe exclusión de datos de formularios/contacto, no anonimato absoluto ni verificación de edad. Validar el encaje de la analítica seudónima en este contexto; no se certifica que un visitante nunca sea menor. |
| Identidad de la responsable y canal de derechos | Corroborar identidad legal completa, NIF, domicilio y procedimiento efectivo para atender derechos. Se conservan los datos existentes sin inventarlos. |

No se ha realizado una auditoría jurídica general del resto del texto (asistencia sanitaria, menores, conservación clínica, Web3Forms, garantías del hosting). Esos contenidos no se dan por certificados por esta revisión de GA4/Maps.

## Comprobaciones reproducibles

```powershell
npx astro check
npm run build
node tests/maps-consent.browser.mjs
node tests/analytics.browser.mjs --approved-build
node tests/analytics.real-tag.mjs --production-build
git diff --check
```

La prueba de Maps sirve los assets de `dist` sin sustituirlos e intercepta la respuesta externa: comprueba cero solicitudes antes del clic, no carga por scroll/consentimiento estadístico, ausencia de referrer, autorización sin activar GA4, retirada local/entre pestañas, recarga, teclado, sin JavaScript y almacenamiento bloqueado. Comprueba siete anchos (375–1440px), marco de 320/400px y ausencia de overflow. No contacta con Maps real ni audita cookies dentro de ese proveedor. La prueba con gtag real ejecuta su lógica pero intercepta los envíos, sin registrar datos de prueba en la propiedad.
