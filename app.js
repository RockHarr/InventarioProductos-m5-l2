/**
 * =========================================================
 * InventarioProductos — POO ES6+ (Vanilla)
 * Requisitos del enunciado:
 * - Clase Producto (constructor, métodos, getter, static)
 * - Instancias y pruebas (console.log)
 * - Arrow functions con filter/map para bajo stock
 *
 * Extra portafolio:
 * - UI accesible (validaciones + mensajes)
 * - Botón Reiniciar
 * - Modo Node: si no hay DOM, corre la demo en consola
 *
 * Créditos: Rockwell Harrison Hernández
 * =========================================================
 */

/* ---------------------------------------------------------
   1) CLASE Producto (tal como pide el enunciado)
---------------------------------------------------------- */

class Producto {
    /**
     * Constructor: define propiedades del producto.
     * @param {string} nombre
     * @param {number} precio
     * @param {number} stock
     */
    constructor(nombre, precio, stock) {
        this.nombre = nombre;
        this.precio = precio;
        this.stock = stock;
    }

    /**
     * vender(): reduce stock si hay suficiente.
     * @param {number} cantidad
     * @returns {string} mensaje de resultado
     */
    vender(cantidad) {
        if (cantidad <= this.stock) {
            this.stock -= cantidad;
            return `Venta realizada: ${cantidad} unidad(es) de ${this.nombre}. Stock restante: ${this.stock}`;
        } else {
            return `No hay suficiente stock de ${this.nombre} para realizar la venta.`;
        }
    }

    /**
     * reponer(): aumenta el stock.
     * @param {number} cantidad
     * @returns {string} mensaje de resultado
     */
    reponer(cantidad) {
        this.stock += cantidad;
        return `Stock de ${this.nombre} aumentado a ${this.stock}.`;
    }

    /**
     * Getter: devuelve información formateada del producto.
     * Se accede como: prod.informacion (sin paréntesis).
     */
    get informacion() {
        return `Producto: ${this.nombre} | Precio: $${this.precio} | Stock: ${this.stock}`;
    }

    /**
     * Método estático: compara precios de dos productos.
     * Se usa así: Producto.compararPrecio(prodA, prodB)
     */
    static compararPrecio(prodA, prodB) {
        return prodA.precio > prodB.precio ? prodA.nombre : prodB.nombre;
    }
}

/* ---------------------------------------------------------
   2) DEMO del enunciado (console.log)
   - Esto es lo que se pide ver al ejecutar con Node.
---------------------------------------------------------- */

function runEnunciadoDemo() {
    // Instancias base
    const prod1 = new Producto("Teclado", 25000, 10);
    const prod2 = new Producto("Mouse", 12000, 5);

    console.log(prod1.informacion);     // Información inicial
    console.log(prod1.vender(3));       // Simula venta
    console.log(prod1.reponer(5));      // Repone stock
    console.log(prod1.informacion);     // Nuevo stock
    console.log(`El producto más caro es: ${Producto.compararPrecio(prod1, prod2)}`);

    // Arrow functions + filter + map
    const listaProductos = [prod1, prod2, new Producto("Monitor", 55000, 2)];
    const productosBajoStock = listaProductos.filter(prod => prod.stock < 5);

    console.log(productosBajoStock.map(prod => prod.informacion));
}

/* ---------------------------------------------------------
   3) MODO Node (sin DOM)
   - Si no existe "document", estamos en Node.
   - Ejecutamos la demo directamente.
---------------------------------------------------------- */

const IS_BROWSER = typeof document !== "undefined";

if (!IS_BROWSER) {
    runEnunciadoDemo();
}

/* ---------------------------------------------------------
   4) UI Portafolio (solo si estamos en navegador)
---------------------------------------------------------- */

if (IS_BROWSER) {
    /* ---------------------------
       Utilidades DOM
    ---------------------------- */
    const $ = (sel, root = document) => root.querySelector(sel);

    function setStatus(text) {
        $("#statusPill").textContent = text;
    }

    function showMessage(text, variant = "") {
        const msg = $("#msg");
        msg.textContent = text;
        msg.classList.remove("msg--ok", "msg--bad");
        if (variant === "ok") msg.classList.add("msg--ok");
        if (variant === "bad") msg.classList.add("msg--bad");
        msg.style.display = "block";
    }

    function hideMessage() {
        const msg = $("#msg");
        msg.textContent = "";
        msg.classList.remove("msg--ok", "msg--bad");
        msg.style.display = "none";
    }

    function setFieldError(inputEl, errorEl, message) {
        inputEl.setAttribute("aria-invalid", "true");
        errorEl.textContent = message;
    }

    function clearFieldError(inputEl, errorEl) {
        inputEl.setAttribute("aria-invalid", "false");
        errorEl.textContent = "";
    }

    function appendLog(line) {
        const output = $("#output");
        const p = document.createElement("p");
        p.textContent = line;
        p.style.margin = "0 0 6px";
        output.appendChild(p);
    }

    function clearLog() {
        $("#output").innerHTML = `<p class="result__placeholder">Aquí aparecerán los mensajes…</p>`;
    }

    /* ---------------------------
       Estado del inventario UI
    ---------------------------- */
    const state = {
        productos: [], // array de Producto
    };

    /* ---------------------------
       Render de select
    ---------------------------- */
    function renderSelect() {
        const select = $("#selectProd");
        select.innerHTML = "";

        if (state.productos.length === 0) {
            const opt = document.createElement("option");
            opt.value = "";
            opt.textContent = "— Sin productos —";
            select.appendChild(opt);
            return;
        }

        state.productos.forEach((prod, idx) => {
            const opt = document.createElement("option");
            opt.value = String(idx);
            opt.textContent = prod.informacion;
            select.appendChild(opt);
        });
    }

    /* ---------------------------
       Validación: Crear producto
    ---------------------------- */
    function validateAddForm() {
        const nombreEl = $("#nombre");
        const precioEl = $("#precio");
        const stockEl = $("#stock");

        const errNombre = $("#errNombre");
        const errPrecio = $("#errPrecio");
        const errStock = $("#errStock");

        // Limpia errores previos
        clearFieldError(nombreEl, errNombre);
        clearFieldError(precioEl, errPrecio);
        clearFieldError(stockEl, errStock);

        const nombre = nombreEl.value.trim();
        const precio = Number(precioEl.value);
        const stock = Number(stockEl.value);

        let ok = true;

        if (!nombre) {
            ok = false;
            setFieldError(nombreEl, errNombre, "Ingresa un nombre (texto).");
        }

        if (!Number.isFinite(precio) || precio < 0) {
            ok = false;
            setFieldError(precioEl, errPrecio, "Ingresa un precio válido (≥ 0).");
        }

        if (!Number.isFinite(stock) || stock < 0) {
            ok = false;
            setFieldError(stockEl, errStock, "Ingresa un stock válido (≥ 0).");
        }

        return { ok, nombre, precio, stock };
    }

    /* ---------------------------
       Validación: Cantidad acción
    ---------------------------- */
    function validateCantidad() {
        const cantidadEl = $("#cantidad");
        const errCantidad = $("#errCantidad");
        clearFieldError(cantidadEl, errCantidad);

        const cantidad = Number(cantidadEl.value);

        if (!Number.isFinite(cantidad) || cantidad <= 0 || !Number.isInteger(cantidad)) {
            setFieldError(cantidadEl, errCantidad, "Ingresa una cantidad entera mayor a 0.");
            return { ok: false, cantidad: 0 };
        }

        return { ok: true, cantidad };
    }

    /* ---------------------------
       Acciones UI
    ---------------------------- */

    function addProducto(nombre, precio, stock) {
        // Creamos instancia usando la clase del enunciado
        const prod = new Producto(nombre, precio, stock);
        state.productos.push(prod);
        renderSelect();
    }

    function getSelectedProducto() {
        const select = $("#selectProd");
        const idx = Number(select.value);

        if (!Number.isInteger(idx) || idx < 0 || idx >= state.productos.length) {
            return null;
        }
        return state.productos[idx];
    }

    function handleAddSubmit(e) {
        e.preventDefault();
        hideMessage();

        const { ok, nombre, precio, stock } = validateAddForm();
        if (!ok) {
            setStatus("Revisa campos");
            showMessage("Corrige los campos marcados para continuar.", "bad");
            return;
        }

        addProducto(nombre, precio, stock);
        setStatus("Producto agregado");
        showMessage("Producto agregado al inventario.", "ok");
        appendLog(`✅ Agregado: ${nombre} ($${precio}) stock=${stock}`);

        // UX: resetea solo inputs (no todo el inventario)
        $("#formAdd").reset();
    }

    function handleVender() {
        const prod = getSelectedProducto();
        if (!prod) {
            setStatus("Sin producto");
            showMessage("Primero agrega o selecciona un producto.", "bad");
            return;
        }

        const { ok, cantidad } = validateCantidad();
        if (!ok) {
            setStatus("Cantidad inválida");
            showMessage("Revisa la cantidad ingresada.", "bad");
            return;
        }

        // Método del enunciado
        const msg = prod.vender(cantidad);
        renderSelect();
        setStatus("Venta");
        showMessage("Acción ejecutada (ver salida).", "ok");
        appendLog(msg);
    }

    function handleReponer() {
        const prod = getSelectedProducto();
        if (!prod) {
            setStatus("Sin producto");
            showMessage("Primero agrega o selecciona un producto.", "bad");
            return;
        }

        const { ok, cantidad } = validateCantidad();
        if (!ok) {
            setStatus("Cantidad inválida");
            showMessage("Revisa la cantidad ingresada.", "bad");
            return;
        }

        // Método del enunciado
        const msg = prod.reponer(cantidad);
        renderSelect();
        setStatus("Reposición");
        showMessage("Acción ejecutada (ver salida).", "ok");
        appendLog(msg);
    }

    function handleBajoStock() {
        if (state.productos.length === 0) {
            setStatus("Sin productos");
            showMessage("Agrega productos para filtrar.", "bad");
            return;
        }

        // Arrow function + filter (enunciado)
        const bajo = state.productos.filter(prod => prod.stock < 5);

        // Arrow function + map (enunciado)
        const info = bajo.map(prod => prod.informacion);

        appendLog("📦 Productos con stock < 5:");
        if (info.length === 0) {
            appendLog("— Ninguno —");
        } else {
            info.forEach(line => appendLog(line));
        }

        setStatus("Filtro aplicado");
    }

    function handleMasCaro() {
        if (state.productos.length < 2) {
            setStatus("Faltan datos");
            showMessage("Necesitas al menos 2 productos para comparar.", "bad");
            return;
        }

        // Método estático del enunciado
        const a = state.productos[0];
        const b = state.productos[1];
        const nombreMasCaro = Producto.compararPrecio(a, b);

        appendLog(`💰 Comparación (1° vs 2°): El más caro es: ${nombreMasCaro}`);
        setStatus("Comparación");
    }

    function loadDemo() {
        // Limpia inventario y carga tal cual el ejemplo del enunciado
        state.productos = [];
        addProducto("Teclado", 25000, 10);
        addProducto("Mouse", 12000, 5);
        addProducto("Monitor", 55000, 2);
        clearLog();
        setStatus("Demo cargada");
        showMessage("Demo cargada: Teclado, Mouse, Monitor.", "ok");
    }

    function resetAll() {
        // Reinicio completo (como pide tu estándar)
        state.productos = [];
        $("#formAdd").reset();
        $("#cantidad").value = "";
        clearFieldError($("#nombre"), $("#errNombre"));
        clearFieldError($("#precio"), $("#errPrecio"));
        clearFieldError($("#stock"), $("#errStock"));
        clearFieldError($("#cantidad"), $("#errCantidad"));
        hideMessage();
        clearLog();
        renderSelect();
        setStatus("Listo");
    }

    /* ---------------------------
       Eventos
    ---------------------------- */
    function bindEvents() {
        $("#formAdd").addEventListener("submit", handleAddSubmit);
        $("#btnVender").addEventListener("click", handleVender);
        $("#btnReponer").addEventListener("click", handleReponer);
        $("#btnBajoStock").addEventListener("click", handleBajoStock);
        $("#btnMasCaro").addEventListener("click", handleMasCaro);
        $("#btnClearLog").addEventListener("click", clearLog);
        $("#btnDemo").addEventListener("click", loadDemo);
        $("#btnReset").addEventListener("click", resetAll);

        // Ejecuta la demo del enunciado y además lo imprime en UI
        $("#btnRunConsole").addEventListener("click", () => {
            appendLog("▶ Ejecutando pruebas del enunciado (ver también consola)...");
            runEnunciadoDemo();
            appendLog("✅ Listo. (Abrir DevTools Console para ver los console.log)");
            setStatus("Pruebas OK");
        });

        // Limpieza de error en vivo
        $("#nombre").addEventListener("input", () => clearFieldError($("#nombre"), $("#errNombre")));
        $("#precio").addEventListener("input", () => clearFieldError($("#precio"), $("#errPrecio")));
        $("#stock").addEventListener("input", () => clearFieldError($("#stock"), $("#errStock")));
        $("#cantidad").addEventListener("input", () => clearFieldError($("#cantidad"), $("#errCantidad")));
    }

    /* ---------------------------
       Init
    ---------------------------- */
    (function init() {
        bindEvents();
        resetAll();
    })();
}
