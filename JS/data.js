// ============================================
// DATA.JS - Carga de datos desde JSON
// ============================================

// Limpiar localStorage para forzar recarga desde JSON
localStorage.removeItem('rooms');

let habitacionesData = [];

// Cargar habitaciones desde JSON
async function loadHabitaciones() {
  try {
    const response = await fetch('./data/habitaciones.json');
    if (!response.ok) {
      throw new Error('Error al cargar habitaciones.json: ' + response.status);
    }
    const data = await response.json();
    
    habitacionesData = data.map(room => ({
      id: room.id,
      name: room.nombre,
      price: room.precio,
      capacity: room.personas,
      beds: room.camas,
      description: room.nombre,
      services: room.servicios,
      imagen: room.imagen
    }));
    
    // Guardar en localStorage
    localStorage.setItem('rooms', JSON.stringify(habitacionesData));
    console.log('✅ Habitaciones cargadas desde JSON:', habitacionesData);
    
    // Disparar evento personalizado cuando los datos estén listos
    window.dispatchEvent(new Event('habitacionesLoaded'));
  } catch (error) {
    console.error('❌ Error cargando habitaciones.json:', error);
  }
}

// Ejecutar al cargar el script
loadHabitaciones();
