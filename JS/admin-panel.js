document.addEventListener('DOMContentLoaded', () => {
  if (!Auth.checkAdminAccess()) return;

  const tabs = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));
      tab.classList.add('active');
      const tabId = tab.getAttribute('data-tab');
      document.getElementById(tabId).classList.add('active');
    });
  });

  // Gestionar Habitaciones
  const addRoomForm = document.getElementById('addRoomForm');
  if (addRoomForm) {
    addRoomForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const room = {
        name: document.getElementById('roomName').value,
        price: parseFloat(document.getElementById('roomPrice').value),
        capacity: parseInt(document.getElementById('roomCapacity').value),
        beds: parseInt(document.getElementById('roomBeds').value),
        description: document.getElementById('roomDescription').value,
        services: document.getElementById('roomServices').value.split(',').map(s => s.trim())
      };
      Admin.addRoom(room);
      Utils.showNotification('Habitación agregada correctamente', 'success');
      addRoomForm.reset();
      renderRoomsList();
    });
  }

  function renderRoomsList() {
    const roomsList = document.getElementById('roomsList');
    const rooms = Admin.getRooms();
    roomsList.innerHTML = rooms.map(room => `
      <tr>
        <td>${room.name}</td>
        <td>$${room.price}</td>
        <td>${room.capacity}</td>
        <td>${room.beds}</td>
        <td>${room.description}</td>
        <td><button class="btn-danger" onclick="deleteRoom(${room.id})">Eliminar</button></td>
      </tr>
    `).join('');
  }

  function renderReservationsList() {
    const reservationsList = document.getElementById('reservationsList');
    const reservations = Admin.getReservations();
    reservationsList.innerHTML = reservations.map(res => `
      <tr>
        <td>${res.userName}</td>
        <td>${res.roomName}</td>
        <td>${Utils.formatDate(res.checkIn)}</td>
        <td>${Utils.formatDate(res.checkOut)}</td>
        <td>${res.people}</td>
        <td>$${res.total}</td>
        <td><span class="status status-${res.status}">${res.status}</span></td>
        <td><button class="btn-danger" onclick="cancelRes(${res.id})">Cancelar</button></td>
      </tr>
    `).join('');
  }

  renderRoomsList();
  renderReservationsList();

  window.deleteRoom = function(roomId) {
    if (confirm('¿Estás seguro de que deseas eliminar esta habitación?')) {
      Admin.deleteRoom(roomId);
      Utils.showNotification('Habitación eliminada', 'success');
      renderRoomsList();
    }
  };

  window.cancelRes = function(reservationId) {
    if (confirm('¿Estás seguro de que deseas cancelar esta reserva?')) {
      Admin.cancelReservation(reservationId);
      Utils.showNotification('Reserva cancelada', 'success');
      renderReservationsList();
    }
  };
});
