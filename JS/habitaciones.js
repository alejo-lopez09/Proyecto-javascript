// =============================================
// habitaciones.js
// CRUD completo de habitaciones — admin panel
// Conectado a: ./data/habitaciones.json
// =============================================

const STORAGE_HABITACIONES = "habitaciones";

// ── Lectura / escritura ──────────────────────

function obtenerHabitaciones() {
    return JSON.parse(localStorage.getItem(STORAGE_HABITACIONES)) || [];
}

function guardarHabitaciones(data) {
    localStorage.setItem(STORAGE_HABITACIONES, JSON.stringify(data));
}

// Carga el JSON solo si el storage está vacío
async function inicializarHabitaciones() {
    if (localStorage.getItem(STORAGE_HABITACIONES)) return;
    try {
        const res = await fetch("./data/habitaciones.json");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        localStorage.setItem(STORAGE_HABITACIONES, JSON.stringify(data));
        console.info(`[habitaciones] ${data.length} registros cargados desde JSON.`);
    } catch (err) {
        console.error("[habitaciones] Error cargando JSON:", err);
        localStorage.setItem(STORAGE_HABITACIONES, JSON.stringify([]));
    }
}

// ── Alerta ───────────────────────────────────

function mostrarAlerta(mensaje, tipo = "success") {
    const el = document.getElementById("adminAlerta");
    if (!el) { alert(mensaje); return; }
    el.textContent   = mensaje;
    el.className     = `admin-alerta admin-alerta--${tipo}`;
    el.style.display = "block";
    clearTimeout(el._t);
    el._t = setTimeout(() => { el.style.display = "none"; }, 4000);
}

// ── Estadísticas ─────────────────────────────
// Solo actualiza los contadores de habitaciones
// (reservas y usuarios se leen del storage si existen)

function actualizarEstadisticas() {
    const habitaciones = obtenerHabitaciones();
    const reservas     = JSON.parse(localStorage.getItem("reservas"))  || [];
    const usuarios     = JSON.parse(localStorage.getItem("usuarios"))  || [];
    const ahora        = Date.now();

    const activas = reservas.filter(r => {
        if (r.estado !== "Activa") return false;
        const salida = r.fechaSalida ? r.fechaSalida.replace(" ", "T") : null;
        return salida && new Date(salida).getTime() > ahora;
    });

    const ocupadasIds = new Set(activas.map(r => String(r.idHabitacion)));
    const disponibles = habitaciones.filter(h => !ocupadasIds.has(String(h.id))).length;

    const set = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.textContent = val;
    };

    set("totalHabitaciones",       habitaciones.length);
    set("reservasActivas",         activas.length);
    set("habitacionesDisponibles", disponibles);
    set("totalUsuarios",           usuarios.length);
}

// ── Render tabla ─────────────────────────────

function renderizarHabitaciones() {
    const tbody        = document.getElementById("tablaHabitaciones");
    const habitaciones = obtenerHabitaciones();

    if (!tbody) return;
    tbody.innerHTML = "";

    if (habitaciones.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align:center;">
                    No hay habitaciones registradas.
                </td>
            </tr>`;
        actualizarEstadisticas();
        return;
    }

    habitaciones.forEach(h => {
        const servicios = Array.isArray(h.servicios)
            ? h.servicios.join(", ")
            : (h.servicios || "—");

        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${h.nombre}</td>
            <td>${h.personas}</td>
            <td>${h.camas}</td>
            <td>$${Number(h.precio).toLocaleString("es-CO")}</td>
            <td>${servicios}</td>
            <td><span class="badge badge--disponible">Disponible</span></td>
            <td>
                <div class="table-actions">
                    <button class="btn btn-secondary editar-hab-btn"
                            data-id="${h.id}">Editar</button>
                    <button class="btn btn-danger eliminar-hab-btn"
                            data-id="${h.id}">Eliminar</button>
                </div>
            </td>`;
        tbody.appendChild(tr);
    });

    activarEventosHabitaciones();
    actualizarEstadisticas();
}

// ── Formulario crear / editar ────────────────

let modoEdicionHabitacion = null; // null = crear | number = id editar

const habitacionForm     = document.getElementById("habitacionForm");
const habitacionTitulo   = document.getElementById("habitacionFormTitulo");
const seccionForm        = document.getElementById("seccionFormHabitacion");
const btnCancelarEdicion = document.getElementById("btnCancelarEdicion");
const btnNuevaHabitacion = document.getElementById("btnNuevaHabitacion");

// Botón "+ Nueva habitación" → limpia form y hace scroll
if (btnNuevaHabitacion) {
    btnNuevaHabitacion.addEventListener("click", () => abrirFormHabitacion());
}

// Botón "Cancelar edición" → vuelve a modo crear
if (btnCancelarEdicion) {
    btnCancelarEdicion.addEventListener("click", () => abrirFormHabitacion());
}

function abrirFormHabitacion(habitacion = null) {
    if (!habitacionForm) return;

    habitacionForm.reset();
    modoEdicionHabitacion = null;

    // Título dinámico
    if (habitacionTitulo) {
        habitacionTitulo.textContent = habitacion
            ? "Editar habitación"
            : "Gestión de habitaciones";
    }

    // Mostrar / ocultar botón cancelar
    if (btnCancelarEdicion) {
        btnCancelarEdicion.style.display = habitacion ? "inline-flex" : "none";
    }

    // Si viene con datos, rellenar el formulario
    if (habitacion) {
        modoEdicionHabitacion = habitacion.id;
        document.getElementById("nombreHabitacion").value    = habitacion.nombre;
        document.getElementById("precioHabitacion").value    = habitacion.precio;
        document.getElementById("personasHabitacion").value  = habitacion.personas;
        document.getElementById("camasHabitacion").value     = habitacion.camas;
        document.getElementById("serviciosHabitacion").value = Array.isArray(habitacion.servicios)
            ? habitacion.servicios.join(", ")
            : (habitacion.servicios || "");
        const imgInput = document.getElementById("imagenHabitacion");
        if (imgInput) imgInput.value = habitacion.imagen || "";
    }

    // Scroll suave al formulario siempre
    if (seccionForm) {
        seccionForm.scrollIntoView({ behavior: "smooth", block: "start" });
    }
}

// Submit — crear o editar
if (habitacionForm) {
    habitacionForm.addEventListener("submit", e => {
        e.preventDefault();

        const nombre    = document.getElementById("nombreHabitacion").value.trim();
        const precio    = Number(document.getElementById("precioHabitacion").value);
        const personas  = Number(document.getElementById("personasHabitacion").value);
        const camas     = Number(document.getElementById("camasHabitacion").value);
        const servicios = document.getElementById("serviciosHabitacion").value
            .split(",").map(s => s.trim()).filter(Boolean);
        const imagen    = document.getElementById("imagenHabitacion")?.value.trim() || "";

        // Validación básica
        if (!nombre || isNaN(precio) || precio <= 0 || isNaN(personas) || personas < 1 || isNaN(camas) || camas < 1) {
            mostrarAlerta("Completa todos los campos correctamente.", "error");
            return;
        }

        let habitaciones = obtenerHabitaciones();

        if (modoEdicionHabitacion) {
            // EDITAR
            habitaciones = habitaciones.map(h =>
                h.id === modoEdicionHabitacion
                    ? { ...h, nombre, precio, personas, camas, servicios, imagen }
                    : h
            );
            mostrarAlerta("✓ Habitación actualizada correctamente.", "success");
        } else {
            // CREAR — id único con Date.now()
            habitaciones.push({
                id: Date.now(),
                nombre,
                precio,
                personas,
                camas,
                servicios,
                imagen
            });
            mostrarAlerta("✓ Habitación agregada correctamente.", "success");
        }

        guardarHabitaciones(habitaciones);
        abrirFormHabitacion();       // limpia y resetea al modo crear
        renderizarHabitaciones();
    });
}

// ── Botones editar / eliminar en la tabla ────

function activarEventosHabitaciones() {
    // EDITAR
    document.querySelectorAll(".editar-hab-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const id  = Number(btn.dataset.id);
            const hab = obtenerHabitaciones().find(h => h.id === id);
            if (hab) abrirFormHabitacion(hab);
        });
    });

    // ELIMINAR
    document.querySelectorAll(".eliminar-hab-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const id       = Number(btn.dataset.id);
            const reservas = JSON.parse(localStorage.getItem("reservas")) || [];

            // Bloquear si tiene reservas activas
            const tieneActivas = reservas.some(
                r => String(r.idHabitacion) === String(id) && r.estado === "Activa"
            );
            if (tieneActivas) {
                mostrarAlerta("No se puede eliminar: tiene reservas activas.", "error");
                return;
            }

            if (!confirm("¿Eliminar esta habitación? Esta acción no se puede deshacer.")) return;

            guardarHabitaciones(obtenerHabitaciones().filter(h => h.id !== id));
            mostrarAlerta("✓ Habitación eliminada.", "success");
            renderizarHabitaciones();
        });
    });
}

// ── Init ─────────────────────────────────────

(async () => {
    await inicializarHabitaciones();
    renderizarHabitaciones();
})();