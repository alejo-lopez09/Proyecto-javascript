Hotel El Rincón del Carmen

Sistema web de gestión hotelera desarrollado como proyecto académico, enfocado en la administración de habitaciones, reservas y usuarios mediante una interfaz moderna, responsive y fácil de usar.

El proyecto fue construido utilizando únicamente tecnologías frontend, manejando persistencia de datos con LocalStorage y archivos JSON simulando una base de datos inicial.

Descripción del proyecto

El sistema permite:

Visualizar habitaciones disponibles.
Consultar disponibilidad según fechas.
Realizar reservas.
Gestionar habitaciones desde un panel administrativo.
Administrar reservas activas.
Simular persistencia de datos sin necesidad de backend.

Todo el proyecto fue diseñado bajo una estética elegante inspirada en hoteles premium, utilizando una paleta basada en tonos azul medianoche y dorado.

Porque claramente los humanos decidieron que un hotel necesita verse “lujoso” aunque el backend esté sostenido con cinta pegante y fe. Igual quedó bacano.

Tecnologías utilizadas
Frontend
HTML5
CSS3
JavaScript Vanilla
Persistencia de datos
LocalStorage
Archivos JSON
Herramientas
Visual Studio Code
Live Server
Estructura del proyecto
PROYECTO_JAVASCRIPT/
│
├── CSS/
│   ├── admin.css
│   ├── estilacos.css
│   ├── reservas.css
│   └── responsive.css
│
├── JS/
│   ├── auth.js
│   ├── habitaciones.js
│   ├── reservas.js
│   ├── storage.js
│   └── ui.js
│
├── data/
│   ├── habitaciones.json
│   ├── reservas.json
│   └── usuarios.json
│
├── img/
│   ├── habitaciones/
│   ├── hotel/
│   └── logo/
│
├── admin.html
├── contacto.html
├── index.html
├── login.html
├── registro.html
└── reservas.html
Funcionamiento general
Inicialización de datos

La primera vez que se ejecuta el proyecto, los archivos JSON son cargados automáticamente al LocalStorage.

A partir de ese momento:

LocalStorage actúa como la base de datos principal.

Los JSON funcionan únicamente como datos iniciales.

Sistema de habitaciones

Las habitaciones son almacenadas con:

ID
Nombre
Precio
Capacidad
Número de camas
Servicios
Imagen

Ejemplo:

{
  "id": 1,
  "nombre": "Habitación Deluxe",
  "precio": 320000,
  "personas": 2,
  "camas": 1
}
Sistema de reservas

Cada reserva contiene:

ID de reserva
Usuario asociado
Habitación reservada
Fecha de entrada
Fecha de salida
Número de personas
Estado

El sistema valida disponibilidad evitando cruces de fechas entre reservas.

Panel administrativo

El administrador puede:

Crear habitaciones
Editar habitaciones
Eliminar habitaciones
Visualizar estadísticas
Gestionar reservas

Todo desde una interfaz centralizada.

Porque abrir veinte páginas distintas para administrar un hotel es una idea brillante inventada por gente que claramente odia la felicidad.

Diseño visual

La interfaz fue desarrollada siguiendo principios de diseño modernos:

Glassmorphism
Diseño responsive
Animaciones suaves
Tipografía elegante
Tarjetas dinámicas
Navbar fijo
Hero sections con imágenes
Responsividad

El proyecto se adapta a:

Computadores
Tablets
Dispositivos móviles

Utilizando:

Flexbox
CSS Grid
Media Queries
Cómo ejecutar el proyecto
1. Clonar el repositorio
git clone URL_DEL_REPOSITORIO
2. Abrir el proyecto en Visual Studio Code
3. Ejecutar con Live Server

Se recomienda usar la extensión:

Live Server

Debido a que el proyecto utiliza fetch() para cargar archivos JSON.

Abrir los archivos HTML directamente con:

file:///

puede generar errores de CORS.

Gracias navegadores modernos. Siempre encontrando nuevas formas de complicar una página que literalmente solo quiere leer un JSON.

Características principales
Sistema dinámico de habitaciones
Reservas con validación
Persistencia en LocalStorage
Panel administrativo
Interfaz moderna
Diseño responsive
Arquitectura modular en JavaScript
Mejoras futuras
Integración con backend real
Base de datos SQL
Sistema de autenticación seguro
Roles de usuario
Pasarela de pagos
Dashboard avanzado
Reportes estadísticos
Autores
Alejandro López

Desarrollo frontend, estructura visual y lógica principal.

Jhonatan Rueda

Apoyo en desarrollo, estructura y pruebas del sistema.

Estado del proyecto

Proyecto académico funcional en desarrollo.

Actualmente cuenta con la estructura principal operativa y una arquitectura preparada para futuras mejoras.

Licencia

Proyecto desarrollado con fines educativos.