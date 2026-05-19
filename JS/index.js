// ============================================
// INDEX.JS - Página Principal
// ============================================

function renderRooms() {
  const roomsContainer = document.getElementById('roomsContainer');
  if (roomsContainer) {
    const rooms = Storage.getRooms().slice(0, 3);
    roomsContainer.innerHTML = rooms.map(room => createRoomCard(room)).join('');
  }
}

// Esperar a que las habitaciones se carguen desde el JSON
window.addEventListener('habitacionesLoaded', () => {
  renderRooms();
});

// Si ya están en localStorage, renderizar inmediatamente
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    const rooms = Storage.getRooms();
    if (rooms.length > 0) {
      renderRooms();
    }
  }, 500);
});

function reserveRoom(roomId) {
  if (!Auth.isLoggedIn()) {
    Utils.redirect('login.html');
    return;
  }
  Utils.redirect(`reservas.html?roomId=${roomId}`);
}
