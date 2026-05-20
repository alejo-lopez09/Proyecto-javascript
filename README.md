# Hotel Rincón del Carmen

Proyecto web para la gestión y visualización de un hotel, desarrollado con HTML, CSS y JavaScript. La aplicación permite visualizar habitaciones, registrarse, iniciar sesión y realizar reservas desde una interfaz moderna y responsive.

---

## Descripción del proyecto

**Hotel Rincón del Carmen** es una aplicación web enfocada en la experiencia de reservas de un hotel. El proyecto cuenta con diferentes vistas para usuarios y administradores, además de almacenamiento local mediante archivos JSON y LocalStorage.

El objetivo principal es ofrecer una plataforma sencilla donde los usuarios puedan:

- Visualizar habitaciones disponibles.
- Registrarse e iniciar sesión.
- Realizar reservas.
- Navegar por diferentes secciones del hotel.
- Gestionar información desde un panel administrativo.

---

## Tecnologías utilizadas

- **HTML5**
- **CSS3**
- **JavaScript (Vanilla JS)**
- **LocalStorage**
- **JSON** para almacenamiento de datos
- **Google Fonts**

---

## Estructura del proyecto

```bash
Hotel_Rincon_DelCarmen/
│
├── index.html
├── login.html
├── reservas.html
├── admin.html
├── contacto.html
│
├── CSS/
│   ├── responsive.css
│   ├── reservas.css
│   ├── admin.css
│   └── estilacos.css
│
├── JS/
│   ├── index.js
│   ├── login.js
│   ├── reservas.js
│   ├── registro.js
│   ├── utils.js
│   └── Components/
│       └── card-habitacion.js
│
├── data/
│   ├── habitaciones.json
│   ├── reservas.json
│   └── usuarios.json
│
└── img/
    ├── habitaciones/
    ├── comidas/
    ├── spa/
    └── hotel/
```

---

## Funcionalidades principales

### Usuarios

- Registro de usuarios.
- Inicio de sesión.
- Visualización de habitaciones.
- Reservas de habitaciones.
- Navegación responsive.
- Interfaz moderna y dinámica.

### Administración

- Panel administrativo.
- Gestión de reservas.
- Gestión de usuarios.
- Visualización de información almacenada.

---

## Cómo ejecutar el proyecto

### Opción 1: Abrir directamente

1. Descargar o clonar el repositorio.
2. Abrir la carpeta del proyecto.
3. Ejecutar el archivo `index.html` en el navegador.

### Opción 2: Usar Live Server (recomendado)

1. Abrir el proyecto en Visual Studio Code.
2. Instalar la extensión **Live Server**.
3. Hacer clic derecho en `index.html`.
4. Seleccionar **Open with Live Server**.

---

## Manejo de datos

El proyecto utiliza:

- **Archivos JSON** para simular una base de datos.
- **LocalStorage** para mantener sesiones e información temporal del usuario.

Archivos principales de datos:

- `habitaciones.json`
- `usuarios.json`
- `reservas.json`

---

## Diseño responsive

La aplicación cuenta con estilos adaptables para diferentes tamaños de pantalla mediante:

- Media queries.
- Diseño flexible.
- Navegación responsive.

Archivo principal:

```bash
CSS/responsive.css
```

---

## Posibles mejoras futuras

- Integración con backend y base de datos real.
- Sistema de pagos.
- Confirmación de reservas por correo.
- Panel administrativo más avanzado.
- Sistema de disponibilidad en tiempo real.
- Autenticación segura con JWT.

---

## Autor

Proyecto desarrollado como práctica académica y de desarrollo web.

---

## Licencia

Este proyecto es de uso educativo y académico.