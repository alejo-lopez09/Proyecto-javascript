/* Aquí centralizas localStorage.

Ejemplo:

function guardarDatos(clave, datos) {
    localStorage.setItem(clave, JSON.stringify(datos));
}

function obtenerDatos(clave) {
    return JSON.parse(localStorage.getItem(clave)) || [];
} */