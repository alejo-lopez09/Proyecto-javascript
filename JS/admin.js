// ============================================
// ADMIN.JS - Lógica de Administración
// ============================================

const Admin = {
  addRoom(roomData) {
    return Storage.addRoom(roomData);
  },

  deleteRoom(roomId) {
    Storage.deleteRoom(roomId);
  },

  getRooms() {
    return Storage.getRooms();
  },

  getReservations() {
    return Storage.getReservations();
  },

  cancelReservation(reservationId) {
    Storage.deleteReservation(reservationId);
  }
};
