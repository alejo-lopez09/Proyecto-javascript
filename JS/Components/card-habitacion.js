/* card-habitacion.js

Tarjeta para mostrar habitaciones. */


// CONTENLO


const roomsContainer =
    document.getElementById(
        "roomsContainer"
    );


// OBTENER HABITACIONES


async function obtenerHabitaciones() {

    try {

        const response =
            await fetch(
                "./data/habitaciones.json"
            );

        const habitaciones =
            await response.json();

        return habitaciones;

    } catch (error) {

        console.error(
            "Error cargando habitaciones:",
            error
        );

        return [];

    }

}


// CREAR CARD


function crearCardHabitacion(
    habitacion
) {

    return `

        <article class="room-card fade-up">

            <!-- IMAGEN -->

            <img
                src="${habitacion.imagen}"
                alt="${habitacion.nombre}"
                class="room-image"
            >

            <!-- CONTENIDO -->

            <div class="room-content">

                <!-- HEADER -->

                <div class="room-header">

                    <h3>
                        ${habitacion.nombre}
                    </h3>

                    <span class="badge">
                        Disponible
                    </span>

                </div>

                <!-- DESCRIPCIÓN -->

                <p class="room-description">

                    ${habitacion.personas}
                    personas ·
                    ${habitacion.camas}
                    camas

                </p>

                <!-- SERVICIOS -->

                <div class="room-services">

                    ${habitacion.servicios
                        .map(
                            servicio => `

                                <span>
                                    ${servicio}
                                </span>

                            `
                        )
                        .join("")}

                </div>

                <!-- FOOTER -->

                <div class="room-footer">

                    <div class="room-price">

                        <small>
                            Desde
                        </small>

                        <h4>
                            $${Number(habitacion.precio)
                                .toLocaleString("es-CO")}
                        </h4>

                        <span>
                            por noche
                        </span>

                    </div>

                    <button
                        class="btn btn-primary reservar-btn"
                        data-id="${habitacion.id}"
                    >
                        Reservar
                    </button>

                </div>

            </div>

        </article>

    `;

}


// RENDERIZAR HABITACIONES


async function renderizarHabitaciones() {

    const habitaciones =
        await obtenerHabitaciones();

    roomsContainer.innerHTML = "";

    if (
        habitaciones.length === 0
    ) {

        roomsContainer.innerHTML = `

            <p class="no-rooms">
                No hay habitaciones disponibles.
            </p>

        `;

        return;

    }

    habitaciones.forEach(
        (habitacion) => {

            roomsContainer.innerHTML +=
                crearCardHabitacion(
                    habitacion
                );

        }
    );

    activarBotonesReserva();

}


// BOTONES RESERVA


function activarBotonesReserva() {

    const botones =
        document.querySelectorAll(
            ".reservar-btn"
        );

    botones.forEach(
        (boton) => {

            boton.addEventListener(
                "click",
                () => {

                    const id =
                        Number(
                            boton.dataset.id
                        );

                    localStorage.setItem(
                        "habitacionSeleccionada",
                        id
                    );

                    window.location.href =
                        "./reservas.html";

                }
            );

        }
    );

}



renderizarHabitaciones();