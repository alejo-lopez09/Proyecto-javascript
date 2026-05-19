// ============================================
// CARD-HABITACION.JS - Componente Tarjeta
// ============================================

function createRoomCard(room, showReserveBtn = true) {
  // Usar la imagen del JSON si existe, sino usar la ruta por defecto
  const imagenSrc = room.imagen || `img/hotel/room${room.id}.jpg`;
  
  return `
    <div class="room-card">
      <img src="${imagenSrc}" alt="${room.name}" 
           onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22300%22%3E%3Crect fill=%231C2541%22 width=%22400%22 height=%22300%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22%23E8B34B%22 font-family=%22Arial%22%3E${room.name}%3C/text%3E%3C/svg%3E'">
      <div class="room-card-content">
        <h3>${room.name}</h3>
        <p>${room.description}</p>
        <p><strong>Capacidad:</strong> ${room.capacity} personas | <strong>Camas:</strong> ${room.beds}</p>
        <p><strong>Servicios:</strong> ${room.services.join(', ')}</p>
        <div class="room-bottom">
          <span style="font-size: 1.5rem; color: #E8B34B;"><strong>$${room.price}/noche</strong></span>
          ${showReserveBtn ? `<button class="btn-primary" onclick="reserveRoom(${room.id})">Reservar</button>` : ''}
        </div>
      </div>
    </div>
  `;
}
