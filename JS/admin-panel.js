// ============================================
// ADMIN-PANEL.JS - Panel de Administración
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  if (!Auth.checkAdminAccess()) return;

  // Tabs
  const tabs = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById(tab.getAttribute('data-tab')).classList.add('active');
    });
  });

  // Agregar habitación
  const addRoomForm = document.getElementById('addRoomForm');
  if (addRoomForm) {
    addRoomForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const room = {
        name: document.getElementById('roomName').value.trim(),
        price: parseFloat(document.getElementById('roomPrice').value),
        capacity: parseInt(document.getElementById('roomCapacity').value),
        beds: parseInt(document.getElementById('roomBeds').value),
        description: document.getElementById('roomDescription').value.trim(),
        services: document.getElementById('roomServices').value.split(',').map(s => s.trim()).filter(Boolean)
      };
      Admin.addRoom(room);
      Utils.showNotification('Habitación agregada correctamente', 'success');
      addRoomForm.reset();
      renderRoomsList();
    });
  }

  renderRoomsList();
  renderReservationsList();
});

function renderRoomsList() {
  const roomsList = document.getElementById('roomsList');
  if (!roomsList) return;
  const rooms = Admin.getRooms();
  if (rooms.length === 0) {
    roomsList.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:1rem;color:#B8C1CC;">No hay habitaciones registradas</td></tr>';
    return;
  }
  roomsList.innerHTML = rooms.map(room => `
    <tr>
      <td>${room.name}</td>
      <td>$${room.price.toLocaleString('es-CO')}</td>
      <td>${room.capacity}</td>
      <td>${room.beds}</td>
      <td>${room.description}</td>
      <td><button class="btn-danger" onclick="deleteRoom(${room.id})">Eliminar</button></td>
    </tr>
  `).join('');
}

function renderReservationsList() {
  const reservationsList = document.getElementById('reservationsList');
  if (!reservationsList) return;
  const reservations = Admin.getReservations();
  if (reservations.length === 0) {
    reservationsList.innerHTML = '<tr><td colspan="9" style="text-align:center;padding:1rem;color:#B8C1CC;">No hay reservas registradas</td></tr>';
    return;
  }
  reservationsList.innerHTML = reservations.map(res => `
    <tr>
      <td>${res.userName}</td>
      <td>${res.roomName}</td>
      <td>${Utils.formatDate(res.checkIn)}</td>
      <td>${Utils.formatDate(res.checkOut)}</td>
      <td>${res.people}</td>
      <td>$${res.total.toLocaleString('es-CO')}</td>
      <td><span class="status status-${res.status}">${res.status === 'confirmed' ? 'Confirmada' : 'Cancelada'}</span></td>
      <td>
        ${res.status === 'confirmed' ? `
          <button class="btn-outline" onclick="editReservation(${res.id})" style="margin-bottom:4px;">Modificar</button>
          <button class="btn-danger" onclick="cancelRes(${res.id})">Cancelar</button>
        ` : '<span style="color:#B8C1CC;font-size:0.85rem;">—</span>'}
      </td>
    </tr>
  `).join('');
}

window.deleteRoom = function(roomId) {
  if (confirm('¿Estás seguro de que deseas eliminar esta habitación?')) {
    Admin.deleteRoom(roomId);
    Utils.showNotification('Habitación eliminada', 'success');
    renderRoomsList();
  }
};

window.cancelRes = function(reservationId) {
  if (confirm('¿Cancelar esta reserva?')) {
    Admin.cancelReservation(reservationId);
    Utils.showNotification('Reserva cancelada', 'success');
    renderReservationsList();
  }
};

window.editReservation = function(reservationId) {
  const reservations = Admin.getReservations();
  const res = reservations.find(r => r.id === reservationId);
  if (!res) return;

  const newCheckIn = prompt('Nueva fecha de entrada (YYYY-MM-DD):', res.checkIn);
  if (!newCheckIn) return;
  const newCheckOut = prompt('Nueva fecha de salida (YYYY-MM-DD):', res.checkOut);
  if (!newCheckOut) return;

  if (new Date(newCheckIn) >= new Date(newCheckOut)) {
    Utils.showNotification('La fecha de salida debe ser posterior a la de entrada', 'error');
    return;
  }

  // Verificar que no haya solapamiento con otras reservas (excluyendo la actual)
  const otherReservations = reservations.filter(r => r.id !== reservationId && r.roomId === res.roomId && r.status === 'confirmed');
  const checkInDate = new Date(newCheckIn);
  const checkOutDate = new Date(newCheckOut);
  const overlap = otherReservations.some(r => {
    const rIn = new Date(r.checkIn);
    const rOut = new Date(r.checkOut);
    return !(checkOutDate <= rIn || checkInDate >= rOut);
  });

  if (overlap) {
    Utils.showNotification('Las nuevas fechas se solapan con otra reserva existente', 'error');
    return;
  }

  const room = Storage.getRoomById(res.roomId);
  const days = Utils.daysBetween(newCheckIn, newCheckOut);
  const newTotal = room ? room.price * days : res.total;

  Storage.updateReservation({ ...res, checkIn: newCheckIn, checkOut: newCheckOut, total: newTotal, days });
  Utils.showNotification('Reserva modificada correctamente', 'success');
  renderReservationsList();
};
