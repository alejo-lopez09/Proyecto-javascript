// ============================================
// RESERVAS.JS - Página de Reservas
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  // Establecer fecha mínima como hoy
  const today = new Date().toISOString().split('T')[0];
  const checkInInput = document.getElementById('checkIn');
  const checkOutInput = document.getElementById('checkOut');
  if (checkInInput) checkInInput.min = today;
  if (checkOutInput) checkOutInput.min = today;

  if (checkInInput) {
    checkInInput.addEventListener('change', () => {
      if (checkOutInput) checkOutInput.min = checkInInput.value;
    });
  }

  const searchForm = document.getElementById('searchForm');
  if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const checkIn = document.getElementById('checkIn').value;
      const checkOut = document.getElementById('checkOut').value;
      const people = parseInt(document.getElementById('people').value);

      if (new Date(checkIn) >= new Date(checkOut)) {
        Utils.showNotification('La fecha de salida debe ser posterior a la de entrada', 'error');
        return;
      }

      const availableRoomsDiv = document.getElementById('availableRooms');
      const rooms = Storage.getRooms();
      const available = rooms.filter(room =>
        Reservations.checkAvailability(room.id, checkIn, checkOut) && room.capacity >= people
      );

      if (available.length === 0) {
        availableRoomsDiv.innerHTML = '<p style="text-align:center;color:#E8B34B;padding:2rem;">No hay habitaciones disponibles para esas fechas y cantidad de personas.</p>';
        return;
      }

      availableRoomsDiv.innerHTML = available.map(room => {
        const days = Utils.daysBetween(checkIn, checkOut);
        const total = room.price * days;
        const imagenSrc = room.imagen || `img/habitaciones/room${room.id}.jpg`;
        return `
          <div class="room-card">
            <img src="${imagenSrc}" alt="${room.name}"
                 onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22300%22%3E%3Crect fill=%221C2541%22 width=%22400%22 height=%22300%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22%23E8B34B%22 font-family=%22Arial%22%3E${room.name}%3C/text%3E%3C/svg%3E'">
            <div class="room-card-content">
              <h3>${room.name}</h3>
              <p>${room.description}</p>
              <p><strong>Capacidad:</strong> ${room.capacity} personas | <strong>Camas:</strong> ${room.beds}</p>
              <p><strong>Servicios:</strong> ${room.services.join(', ')}</p>
              <p><strong>Precio:</strong> $${room.price.toLocaleString('es-CO')}/noche × ${days} noches = <span style="color:#E8B34B;font-weight:700;">$${total.toLocaleString('es-CO')}</span></p>
              <div class="room-bottom">
                <button class="btn-primary" onclick="confirmReservation(${room.id}, '${checkIn}', '${checkOut}', ${people})">Reservar Ahora</button>
              </div>
            </div>
          </div>
        `;
      }).join('');
    });
  }

  renderMyReservations();
});

function renderMyReservations() {
  const myReservationsDiv = document.getElementById('myReservations');
  if (!myReservationsDiv) return;

  if (!Auth.isLoggedIn()) {
    myReservationsDiv.innerHTML = '<p style="text-align:center;color:#B8C1CC;">Inicia sesión para ver tus reservas.</p>';
    return;
  }

  const userReservations = Storage.getReservationsByUser(Auth.currentUser.email);
  if (userReservations.length === 0) {
    myReservationsDiv.innerHTML = '<p style="text-align:center;color:#B8C1CC;">No tienes reservas activas.</p>';
    return;
  }

  myReservationsDiv.innerHTML = userReservations.map(res => `
    <div class="reservation-card">
      <div class="reservation-header">
        <h4>${res.roomName}</h4>
        <span class="status status-${res.status}">${res.status === 'confirmed' ? 'Confirmada' : 'Cancelada'}</span>
      </div>
      <div class="reservation-info">
        <p><strong>Entrada:</strong> ${Utils.formatDate(res.checkIn)}</p>
        <p><strong>Salida:</strong> ${Utils.formatDate(res.checkOut)}</p>
        <p><strong>Personas:</strong> ${res.people}</p>
        <p><strong>Total:</strong> $${res.total.toLocaleString('es-CO')}</p>
      </div>
      <button class="btn-danger" onclick="cancelReservation(${res.id})">Cancelar Reserva</button>
    </div>
  `).join('');
}

function confirmReservation(roomId, checkIn, checkOut, people) {
  if (!Auth.isLoggedIn()) {
    Utils.showNotification('Debes iniciar sesión para reservar', 'error');
    Utils.redirect('login.html');
    return;
  }
  const reservation = Reservations.createReservation(roomId, checkIn, checkOut, people);
  if (reservation) {
    Utils.showNotification('¡Reserva confirmada! Revisa tus reservas abajo.', 'success');
    document.getElementById('searchForm').reset();
    document.getElementById('availableRooms').innerHTML = '';
    renderMyReservations();
  }
}

function cancelReservation(reservationId) {
  if (confirm('¿Estás seguro de que deseas cancelar esta reserva?')) {
    Reservations.cancelReservation(reservationId);
    renderMyReservations();
  }
}
