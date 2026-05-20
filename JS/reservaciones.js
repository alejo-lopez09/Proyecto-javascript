// ============================================
// RESERVATIONS.JS - Lógica de Reservas
// ============================================

const Reservations = {
  checkAvailability(roomId, checkIn, checkOut) {
    const reservations = Storage.getReservations();
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    return !reservations.some(res => {
      if (res.roomId !== roomId || res.status !== 'confirmed') return false;
      const resCheckIn = new Date(res.checkIn);
      const resCheckOut = new Date(res.checkOut);
      return !(checkOutDate <= resCheckIn || checkInDate >= resCheckOut);
    });
  },

  createReservation(roomId, checkIn, checkOut, people) {
    if (!Auth.isLoggedIn()) {
      Utils.showNotification('Debes iniciar sesión para reservar', 'error');
      Utils.redirect('login.html');
      return null;
    }

    const room = Storage.getRoomById(roomId);
    if (!room) {
      Utils.showNotification('Habitación no encontrada', 'error');
      return null;
    }

    if (people > room.capacity) {
      Utils.showNotification(`La habitación solo puede alojar ${room.capacity} personas`, 'error');
      return null;
    }

    // Verificar disponibilidad justo antes de confirmar (evita solapamiento)
    if (!this.checkAvailability(roomId, checkIn, checkOut)) {
      Utils.showNotification('La habitación ya no está disponible en esas fechas', 'error');
      return null;
    }

    const days = Utils.daysBetween(checkIn, checkOut);
    const total = room.price * days;

    const reservation = {
      roomId,
      roomName: room.name,
      checkIn,
      checkOut,
      people,
      total,
      days,
      userEmail: Auth.currentUser.email,
      userName: Auth.currentUser.name
    };

    return Storage.addReservation(reservation);
  },

  cancelReservation(reservationId) {
    Storage.cancelReservation(reservationId);
    Utils.showNotification('Reserva cancelada correctamente', 'success');
  }
};
