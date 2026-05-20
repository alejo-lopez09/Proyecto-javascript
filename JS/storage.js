// ============================================
// STORAGE.JS - Gestión de localStorage
// ============================================

const Storage = {
  init() {
    if (!localStorage.getItem('users')) {
      const defaultUsers = [
        {
          id: 'admin@hotelcarmen.com',
          email: 'admin@hotelcarmen.com',
          password: 'admin123',
          name: 'Administrador',
          idNumber: '123456',
          nationality: 'Colombiana',
          phone: '321226838',
          role: 'admin'
        }
      ];
      localStorage.setItem('users', JSON.stringify(defaultUsers));
    }
    if (!localStorage.getItem('reservations')) {
      localStorage.setItem('reservations', JSON.stringify([]));
    }
    if (!localStorage.getItem('messages')) {
      localStorage.setItem('messages', JSON.stringify([]));
    }
  },

  // Usuarios
  getUsers() {
    return JSON.parse(localStorage.getItem('users')) || [];
  },
  addUser(user) {
    const users = this.getUsers();
    users.push(user);
    localStorage.setItem('users', JSON.stringify(users));
  },
  getUserByEmail(email) {
    return this.getUsers().find(u => u.email === email);
  },

  // Habitaciones
  getRooms() {
    return JSON.parse(localStorage.getItem('rooms')) || [];
  },
  addRoom(room) {
    const rooms = this.getRooms();
    // IDs > 1000 para habitaciones creadas por el admin (distintas a las del JSON)
    const adminRooms = rooms.filter(r => r.id > 1000);
    room.id = adminRooms.length === 0 ? 1001 : Math.max(...adminRooms.map(r => r.id)) + 1;
    rooms.push(room);
    localStorage.setItem('rooms', JSON.stringify(rooms));
    return room;
  },
  updateRoom(updatedRoom) {
    const rooms = this.getRooms().map(r => r.id === updatedRoom.id ? updatedRoom : r);
    localStorage.setItem('rooms', JSON.stringify(rooms));
  },
  deleteRoom(id) {
    const rooms = this.getRooms().filter(r => r.id !== id);
    localStorage.setItem('rooms', JSON.stringify(rooms));
  },
  getRoomById(id) {
    return this.getRooms().find(r => r.id === id);
  },

  // Reservas
  getReservations() {
    return JSON.parse(localStorage.getItem('reservations')) || [];
  },
  addReservation(reservation) {
    const reservations = this.getReservations();
    reservation.id = reservations.length === 0 ? 1 : Math.max(...reservations.map(r => r.id || 0)) + 1;
    reservation.status = 'confirmed';
    reservation.createdAt = new Date().toISOString();
    reservations.push(reservation);
    localStorage.setItem('reservations', JSON.stringify(reservations));
    return reservation;
  },
  updateReservation(updatedRes) {
    const reservations = this.getReservations().map(r => r.id === updatedRes.id ? updatedRes : r);
    localStorage.setItem('reservations', JSON.stringify(reservations));
  },
  cancelReservation(id) {
    const reservations = this.getReservations().map(r => {
      if (r.id === id) return { ...r, status: 'cancelled' };
      return r;
    });
    localStorage.setItem('reservations', JSON.stringify(reservations));
  },
  deleteReservation(id) {
    const reservations = this.getReservations().filter(r => r.id !== id);
    localStorage.setItem('reservations', JSON.stringify(reservations));
  },
  getReservationsByUser(email) {
    return this.getReservations().filter(r => r.userEmail === email && r.status !== 'cancelled');
  },

  // Mensajes
  getMessages() {
    return JSON.parse(localStorage.getItem('messages')) || [];
  },
  addMessage(message) {
    const messages = this.getMessages();
    message.id = messages.length === 0 ? 1 : Math.max(...messages.map(m => m.id || 0)) + 1;
    message.createdAt = new Date().toISOString();
    messages.push(message);
    localStorage.setItem('messages', JSON.stringify(messages));
    return message;
  }
};

Storage.init();
