# InventarioProductos — POO ES6+ (JavaScript)

Ejercicio de clase para practicar **Pensamiento Orientado a Objetos** en JavaScript usando sintaxis **ES6+**:

- Clase `Producto` (constructor + propiedades)
- Métodos: `vender()` y `reponer()`
- Getter: `informacion`
- Static: `Producto.compararPrecio()`
- Arrow functions con `filter()` + `map()` para “bajo stock”

Incluye una UI dark y accesible (portafolio), **sin dependencias externas**.

## Cómo ejecutar

### Opción A (Portafolio / Navegador)
1. Abre `index.html` en el navegador.
2. Usa **Cargar demo** o agrega productos manualmente.
3. Prueba **Vender**, **Reponer**, **Bajo stock**, **Comparar precio**.
4. **Reiniciar** vuelve todo al estado inicial.

### Opción B (Profe / Node)
El enunciado pide `node inventario.js`. En esta entrega el archivo se llama `app.js`.

- Puedes ejecutar:
   - `node app.js`
- O si se exige el nombre:
   - renombrar `app.js` a `inventario.js` y ejecutar:
   - `node inventario.js`

> En Node, el script detecta que no hay DOM y corre automáticamente la demo por consola.

---

## Flujo (Mermaid)

```mermaid
flowchart TD
  A[Inicio] --> B{Entorno}
  B -- Navegador --> C[UI: agregar/seleccionar producto]
  C --> D{Acción}
  D -->|Vender| E[Producto.vender(cantidad)]
  D -->|Reponer| F[Producto.reponer(cantidad)]
  D -->|Bajo stock| G[filter + map (arrow functions)]
  D -->|Comparar| H[Producto.compararPrecio(a,b)]
  E --> I[Actualizar inventario + mostrar salida]
  F --> I
  G --> I
  H --> I
  B -- Node --> J[Demo en consola: console.log]
  J --> K[Fin]


---

## Estructura del proyecto

InventarioProductos/
├─ index.html
├─ styles.css
├─ app.js
└─ README.md

