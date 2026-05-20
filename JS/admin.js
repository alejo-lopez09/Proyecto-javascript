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
  updateRoom(room) {
    Storage.updateRoom(room);
  },
  getRooms() {
    return Storage.getRooms();
  },
  getReservations() {
    return Storage.getReservations();
  },
  cancelReservation(reservationId) {
    Storage.cancelReservation(reservationId);
  }
};
