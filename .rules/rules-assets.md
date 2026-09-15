REGLA DE ASSETS

Usa src/assets para:
- fotografías;
- capturas de demos;
- imágenes de producto;
- imágenes utilizadas directamente por componentes Astro.

Prioriza astro:assets y <Image />.

Usa public únicamente cuando el recurso necesite una URL pública directa, por ejemplo:
- favicon;
- robots.txt;
- archivos descargables;
- recursos externos estáticos;
- demos estáticas completas.

No dupliques el mismo asset entre src/assets y public.

No construyas imágenes o mockups complejos mediante CSS si existe o existirá un asset real.