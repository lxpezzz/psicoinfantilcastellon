# Imágenes y assets

- Imágenes importadas: src/images/, agrupadas por sección o feature.
- Prioriza astro:assets y <Image /> para contenido cuando corresponda.
- public/ para URL directa: favicon, robots, OG, descargables, fondos CSS y demos estáticas.
- No dupliques assets ni muevas existentes solo para uniformar.
- Usa capturas y assets reales para representar productos, fotografías o interfaces existentes; evita reconstrucciones HTML complejas.
- Si falta un asset necesario, indícalo. No inventes capturas ni funcionalidades para sustituirlo.
- CSS y SVG para decoración sencilla; no conviertas contenido funcional o texto importante en imágenes.
- Alt descriptivo para contenido y vacío para decoración; reserva dimensiones o proporción.
- Carga diferida fuera del contenido inicial cuando corresponda; prioriza la imagen LCP identificada.
