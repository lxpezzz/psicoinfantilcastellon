REGLA DATA / SINGLE SOURCE OF TRUTH

No hardcodees repetidamente información de 7DStudio dentro de componentes.

Datos reutilizables como:
- nombre de marca;
- email;
- teléfono;
- WhatsApp;
- redes sociales;
- CTAs;
- URLs;
- productos;
- servicios;
- datos legales;

deben vivir en /src/data cuando tenga sentido.

El componente debe encargarse de presentación.
Los datos deben encargarse de contenido.

No lleves esta regla al extremo:
textos únicos que solo aparecen una vez pueden permanecer en el componente.

---

# REGLAS CRÍTICAS

## CRITICAL DATA INTEGRITY
Never invent, infer or modify prices, quantities, guarantees, discounts, statistics, performance claims, product materials or service inclusions. If a value is not explicitly present in the project, omit it instead of inventing it.