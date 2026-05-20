// ============================================
// DATA.JS - Carga de datos desde JSON
// ============================================

let habitacionesData = [];

async function loadHabitaciones() {
  try {
    const response = await fetch('./data/habitaciones.json');
    if (!response.ok) {
      throw new Error('Error al cargar habitaciones.json: ' + response.status);
    }
    const data = await response.json();

    const fromJson = data.map(room => ({
      id: room.id,
      name: room.nombre,
      price: room.precio,
      capacity: room.personas,
      beds: room.camas,
      description: room.descripcion || room.nombre,
      services: room.servicios,
      imagen: room.imagen
    }));

    // Mezclar: partir de las del JSON y agregar las que el admin haya creado (id > 1000)
    const existing = Storage.getRooms();
    const adminRooms = existing.filter(r => r.id > 1000);
    const merged = [...fromJson, ...adminRooms];

    localStorage.setItem('rooms', JSON.stringify(merged));
    habitacionesData = merged;

    window.dispatchEvent(new Event('habitacionesLoaded'));
  } catch (error) {
    console.error('Error cargando habitaciones.json:', error);
    window.dispatchEvent(new Event('habitacionesLoaded'));
  }
}

loadHabitaciones();
