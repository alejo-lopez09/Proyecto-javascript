// =============================================
// STORAGE KEYS
// =============================================

const STORAGE_HABITACIONES = "habitaciones";
const STORAGE_RESERVAS      = "reservas";
const STORAGE_USUARIOS      = "usuarios";

// =============================================
// HELPERS — LECTURA / ESCRITURA localStorage
// =============================================

function obtenerHabitaciones() {
    return JSON.parse(localStorage.getItem(STORAGE_HABITACIONES)) || [];
}

function obtenerReservas() {
    return JSON.parse(localStorage.getItem(STORAGE_RESERVAS)) || [];
}

function obtenerUsuarios() {
    return JSON.parse(localStorage.getItem(STORAGE_USUARIOS)) || [];
}

function guardarHabitaciones(habitaciones) {
    localStorage.setItem(STORAGE_HABITACIONES, JSON.stringify(habitaciones));
}

function guardarReservas(reservas) {
    localStorage.setItem(STORAGE_RESERVAS, JSON.stringify(reservas));
}

// =============================================
// INICIALIZAR STORAGE desde JSON
// =============================================

async function inicializarStorage(storageKey, jsonPath) {
    if (localStorage.getItem(storageKey)) return;

    try {
        const response = await fetch(jsonPath);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        localStorage.setItem(storageKey, JSON.stringify(data));
        console.info(`[Storage] "${storageKey}" cargado desde ${jsonPath} — ${data.length} registros.`);
    } catch (error) {
        console.error(`[Storage] Error cargando "${storageKey}" desde ${jsonPath}:`, error);
        localStorage.setItem(storageKey, JSON.stringify([]));
    }
}

// =============================================
// ANTI-SOLAPAMIENTO DE RESERVAS
// =============================================

/**
 * Convierte una fecha+hora "YYYY-MM-DD HH:MM" a timestamp numérico.
 */
function toTimestamp(fechaHora) {
    // Soporta "YYYY-MM-DD" y "YYYY-MM-DD HH:MM"
    return new Date(fechaHora.replace(" ", "T")).getTime();
}

/**
 * Verifica si dos rangos de fecha/hora se solapan.
 * Un rango [A, B] se solapa con [C, D] si A < D && C < B
 */
function seSuperponen(inicioA, finA, inicioB, finB) {
    return toTimestamp(inicioA) < toTimestamp(finB) &&
           toTimestamp(inicioB) < toTimestamp(finA);
}

/**
 * Devuelve true si la habitación YA tiene una reserva activa
 * que se solape con el rango solicitado.
 * Ignora la reserva con idExcluir (útil para edición).
 */
function existeSolapamiento(idHabitacion, fechaEntrada, fechaSalida, idExcluir = null) {
    const reservas = obtenerReservas();

    return reservas.some((reserva) => {
        if (reserva.idHabitacion !== idHabitacion) return false;
        if (reserva.estado === "Cancelada")          return false;
        if (idExcluir && reserva.idReserva === idExcluir) return false;

        return seSuperponen(
            fechaEntrada, fechaSalida,
            reserva.fechaEntrada, reserva.fechaSalida
        );
    });
}

// =============================================
// ESTADÍSTICAS
// =============================================

function renderizarEstadisticas() {
    const habitaciones = obtenerHabitaciones();
    const reservas     = obtenerReservas();
    const usuarios     = obtenerUsuarios();

    const ahora = Date.now();

    // Reservas que están activas Y cuya fecha de salida aún no pasó
    const reservasActivas = reservas.filter(
        (r) => r.estado === "Activa" && toTimestamp(r.fechaSalida) > ahora
    );

    // IDs de habitaciones actualmente ocupadas
    const ocupadasIds = new Set(reservasActivas.map((r) => r.idHabitacion));
    const disponibles = habitaciones.filter((h) => !ocupadasIds.has(h.id)).length;

    document.getElementById("totalHabitaciones").textContent    = habitaciones.length;
    document.getElementById("reservasActivas").textContent      = reservasActivas.length;
    document.getElementById("habitacionesDisponibles").textContent = disponibles;
    document.getElementById("totalUsuarios").textContent        = usuarios.length;
}

// =============================================
// RENDER HABITACIONES
// =============================================

function renderizarHabitaciones() {
    const habitaciones    = obtenerHabitaciones();
    const tablaHabitaciones = document.getElementById("tablaHabitaciones");

    tablaHabitaciones.innerHTML = "";

    if (habitaciones.length === 0) {
        tablaHabitaciones.innerHTML = `
            <tr>
                <td colspan="7" style="text-align:center;">No hay habitaciones registradas.</td>
            </tr>`;
        return;
    }

    habitaciones.forEach((habitacion) => {
        const servicios = Array.isArray(habitacion.servicios)
            ? habitacion.servicios.join(", ")
            : habitacion.servicios || "—";

        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${habitacion.nombre}</td>
            <td>${habitacion.personas}</td>
            <td>${habitacion.camas}</td>
            <td>$${Number(habitacion.precio).toLocaleString("es-CO")}</td>
            <td>${servicios}</td>
            <td><span class="badge badge--disponible">Disponible</span></td>
            <td>
                <div class="table-actions">
                    <button class="btn btn-secondary editar-hab-btn" data-id="${habitacion.id}">
                        Editar
                    </button>
                    <button class="btn btn-danger eliminar-hab-btn" data-id="${habitacion.id}">
                        Eliminar
                    </button>
                </div>
            </td>`;

        tablaHabitaciones.appendChild(tr);
    });

    activarEventosHabitaciones();
}

// =============================================
// RENDER RESERVAS
// =============================================

function renderizarReservas() {
    const reservas      = obtenerReservas();
    const habitaciones  = obtenerHabitaciones();
    const usuarios      = obtenerUsuarios();
    const tablaReservas = document.getElementById("tablaReservas");

    tablaReservas.innerHTML = "";

    if (reservas.length === 0) {
        tablaReservas.innerHTML = `
            <tr>
                <td colspan="8" style="text-align:center;">No existen reservas registradas.</td>
            </tr>`;
        return;
    }

    // Mostrar más recientes primero
    const ordenadas = [...reservas].sort(
        (a, b) => toTimestamp(b.fechaEntrada) - toTimestamp(a.fechaEntrada)
    );

    ordenadas.forEach((reserva) => {
        const habitacion = habitaciones.find((h) => h.id === reserva.idHabitacion);
        const usuario    = usuarios.find((u) => u.id === reserva.idUsuario);

        const badgeClass = reserva.estado === "Activa"
            ? "badge--activa"
            : "badge--cancelada";

        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${usuario?.nombre || "—"}</td>
            <td>${habitacion?.nombre || "—"}</td>
            <td>${reserva.fechaEntrada}</td>
            <td>${reserva.fechaSalida}</td>
            <td>${reserva.personas ?? "—"}</td>
            <td>$${Number(reserva.total ?? 0).toLocaleString("es-CO")}</td>
            <td><span class="badge ${badgeClass}">${reserva.estado}</span></td>
            <td>
                <div class="table-actions">
                    ${reserva.estado === "Activa" ? `
                        <button class="btn btn-secondary editar-res-btn"
                                data-id="${reserva.idReserva}">Editar</button>
                        <button class="btn btn-danger cancelar-res-btn"
                                data-id="${reserva.idReserva}">Cancelar</button>
                    ` : `<span style="color:var(--color-muted,#999)">—</span>`}
                </div>
            </td>`;

        tablaReservas.appendChild(tr);
    });

    activarEventosReservas();
}

// =============================================
// AGREGAR / EDITAR HABITACIÓN
// =============================================

let modoEdicionHabitacion = null; // null = crear | id = editar

const habitacionForm     = document.getElementById("habitacionForm");
const habitacionTitulo   = document.getElementById("habitacionFormTitulo");
const seccionForm        = document.getElementById("seccionFormHabitacion");
const btnCancelarEdicion = document.getElementById("btnCancelarEdicion");

// Botón "+ Nueva habitación" en la tabla → scroll al form vacío
const btnNuevaHabitacion = document.getElementById("btnNuevaHabitacion");
if (btnNuevaHabitacion) {
    btnNuevaHabitacion.addEventListener("click", () => abrirFormHabitacion());
}

// Botón "Cancelar edición" dentro del form → resetea modo
if (btnCancelarEdicion) {
    btnCancelarEdicion.addEventListener("click", () => abrirFormHabitacion());
}

function abrirFormHabitacion(habitacion = null) {
    habitacionForm.reset();
    modoEdicionHabitacion = null;

    if (habitacionTitulo) {
        habitacionTitulo.textContent = habitacion
            ? "Editar habitación"
            : "Gestión de habitaciones";
    }

    // Mostrar u ocultar botón cancelar edición
    if (btnCancelarEdicion) {
        btnCancelarEdicion.style.display = habitacion ? "inline-flex" : "none";
    }

    if (habitacion) {
        modoEdicionHabitacion = habitacion.id;
        document.getElementById("nombreHabitacion").value    = habitacion.nombre;
        document.getElementById("precioHabitacion").value    = habitacion.precio;
        document.getElementById("personasHabitacion").value  = habitacion.personas;
        document.getElementById("camasHabitacion").value     = habitacion.camas;
        document.getElementById("serviciosHabitacion").value = Array.isArray(habitacion.servicios)
            ? habitacion.servicios.join(", ")
            : habitacion.servicios || "";
        const imgInput = document.getElementById("imagenHabitacion");
        if (imgInput) imgInput.value = habitacion.imagen || "";
    }

    // Scroll suave al panel del formulario (tanto para nueva como para editar)
    if (seccionForm) {
        seccionForm.scrollIntoView({ behavior: "smooth", block: "start" });
    }
}

habitacionForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const nombre   = document.getElementById("nombreHabitacion").value.trim();
    const precio   = Number(document.getElementById("precioHabitacion").value);
    const personas = Number(document.getElementById("personasHabitacion").value);
    const camas    = Number(document.getElementById("camasHabitacion").value);
    const servicios = document.getElementById("serviciosHabitacion").value
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    const imagen   = document.getElementById("imagenHabitacion")?.value.trim() || "";

    if (!nombre || isNaN(precio) || precio <= 0 || isNaN(personas) || isNaN(camas)) {
        mostrarAlerta("Por favor completa todos los campos correctamente.", "error");
        return;
    }

    let habitaciones = obtenerHabitaciones();

    if (modoEdicionHabitacion) {
        // EDITAR
        habitaciones = habitaciones.map((h) => {
            if (h.id !== modoEdicionHabitacion) return h;
            return { ...h, nombre, precio, personas, camas, servicios, imagen };
        });
        mostrarAlerta("Habitación actualizada correctamente.", "success");
    } else {
        // CREAR
        const nueva = {
            id: Date.now(),
            nombre,
            precio,
            personas,
            camas,
            servicios,
            imagen
        };
        habitaciones.push(nueva);
        mostrarAlerta("Habitación agregada correctamente.", "success");
    }

    guardarHabitaciones(habitaciones);

    // Volver al modo "nueva habitación" (limpia form y título)
    abrirFormHabitacion();

    renderizarHabitaciones();
    renderizarEstadisticas();
});

// =============================================
// EDITAR / ELIMINAR HABITACIÓN — EVENTOS
// =============================================

function activarEventosHabitaciones() {
    // EDITAR
    document.querySelectorAll(".editar-hab-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
            const id = Number(btn.dataset.id);
            const habitacion = obtenerHabitaciones().find((h) => h.id === id);
            if (habitacion) abrirFormHabitacion(habitacion);
        });
    });

    // ELIMINAR
    document.querySelectorAll(".eliminar-hab-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
            const id = Number(btn.dataset.id);

            // Verificar si tiene reservas activas
            const tieneReservasActivas = obtenerReservas().some(
                (r) => r.idHabitacion === id && r.estado === "Activa"
            );

            if (tieneReservasActivas) {
                mostrarAlerta(
                    "No se puede eliminar: la habitación tiene reservas activas.",
                    "error"
                );
                return;
            }

            if (!confirm("¿Estás seguro de que deseas eliminar esta habitación?")) return;

            let habitaciones = obtenerHabitaciones().filter((h) => h.id !== id);
            guardarHabitaciones(habitaciones);
            renderizarHabitaciones();
            renderizarEstadisticas();
            mostrarAlerta("Habitación eliminada.", "success");
        });
    });
}

// =============================================
// EDITAR RESERVA — MODAL / FORMULARIO
// =============================================

const reservaModal      = document.getElementById("reservaModal");      // modal de edición
const reservaEditForm   = document.getElementById("reservaEditForm");    // form dentro del modal
const reservaEditId     = document.getElementById("reservaEditId");      // input hidden con idReserva

if (reservaEditForm) {
    reservaEditForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const idReserva    = Number(reservaEditId.value);
        const fechaEntrada = document.getElementById("editFechaEntrada").value;
        const fechaSalida  = document.getElementById("editFechaSalida").value;
        const personas     = Number(document.getElementById("editPersonas").value);

        if (!fechaEntrada || !fechaSalida || isNaN(personas) || personas < 1) {
            mostrarAlerta("Completa todos los campos correctamente.", "error");
            return;
        }

        if (toTimestamp(fechaEntrada) >= toTimestamp(fechaSalida)) {
            mostrarAlerta("La fecha de entrada debe ser anterior a la fecha de salida.", "error");
            return;
        }

        let reservas = obtenerReservas();
        const reserva = reservas.find((r) => r.idReserva === idReserva);

        if (!reserva) {
            mostrarAlerta("Reserva no encontrada.", "error");
            return;
        }

        // Anti-solapamiento (excluyendo la reserva que estamos editando)
        if (existeSolapamiento(reserva.idHabitacion, fechaEntrada, fechaSalida, idReserva)) {
            mostrarAlerta(
                "Conflicto de fechas: ya existe una reserva activa en ese rango para esta habitación.",
                "error"
            );
            return;
        }

        // Calcular nuevo total
        const habitacion  = obtenerHabitaciones().find((h) => h.id === reserva.idHabitacion);
        const noches      = calcularNoches(fechaEntrada, fechaSalida);
        const total       = habitacion ? habitacion.precio * noches : 0;

        reservas = reservas.map((r) => {
            if (r.idReserva !== idReserva) return r;
            return { ...r, fechaEntrada, fechaSalida, personas, total };
        });

        guardarReservas(reservas);
        renderizarReservas();
        renderizarEstadisticas();

        if (reservaModal) reservaModal.classList.remove("modal--visible");
        mostrarAlerta("Reserva actualizada correctamente.", "success");
    });
}

// =============================================
// CANCELAR RESERVA — EVENTOS
// =============================================

function activarEventosReservas() {
    // EDITAR RESERVA
    document.querySelectorAll(".editar-res-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
            const id = Number(btn.dataset.id);
            const reserva = obtenerReservas().find((r) => r.idReserva === id);
            if (!reserva || !reservaModal) return;

            reservaEditId.value = reserva.idReserva;
            document.getElementById("editFechaEntrada").value = reserva.fechaEntrada;
            document.getElementById("editFechaSalida").value  = reserva.fechaSalida;
            document.getElementById("editPersonas").value     = reserva.personas ?? 1;

            reservaModal.classList.add("modal--visible");
        });
    });

    // CANCELAR RESERVA
    document.querySelectorAll(".cancelar-res-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
            const id = Number(btn.dataset.id);

            if (!confirm("¿Confirmas la cancelación de esta reserva?")) return;

            let reservas = obtenerReservas().map((r) => {
                if (r.idReserva !== id) return r;
                return { ...r, estado: "Cancelada" };
            });

            guardarReservas(reservas);
            renderizarReservas();
            renderizarEstadisticas();
            mostrarAlerta("Reserva cancelada. La habitación queda disponible.", "success");
        });
    });
}

// =============================================
// CERRAR MODALES
// =============================================

document.querySelectorAll(".modal__close, .modal__overlay").forEach((el) => {
    el.addEventListener("click", () => {
        document.querySelectorAll(".modal--visible").forEach((m) =>
            m.classList.remove("modal--visible")
        );
    });
});

// =============================================
// UTILIDADES
// =============================================

/**
 * Calcula el número de noches entre dos fechas/horas.
 * Redondea hacia arriba si hay fracción de día.
 */
function calcularNoches(fechaEntrada, fechaSalida) {
    const ms      = toTimestamp(fechaSalida) - toTimestamp(fechaEntrada);
    const noches  = ms / (1000 * 60 * 60 * 24);
    return Math.max(1, Math.ceil(noches));
}

/**
 * Muestra un mensaje de alerta en el panel.
 * Busca #adminAlerta; si no existe, usa alert().
 */
function mostrarAlerta(mensaje, tipo = "info") {
    const contenedor = document.getElementById("adminAlerta");

    if (!contenedor) {
        alert(mensaje);
        return;
    }

    contenedor.textContent  = mensaje;
    contenedor.className    = `admin-alerta admin-alerta--${tipo}`;
    contenedor.style.display = "block";

    setTimeout(() => {
        contenedor.style.display = "none";
    }, 4000);
}

// =============================================
// INIT
// =============================================

async function iniciarApp() {
    await inicializarStorage(STORAGE_HABITACIONES, "./data/habitaciones.json");
    await inicializarStorage(STORAGE_RESERVAS,     "./data/reservas.json");
    await inicializarStorage(STORAGE_USUARIOS,     "./data/usuarios.json");

    renderizarHabitaciones();
    renderizarReservas();
    renderizarEstadisticas();
}

iniciarApp();