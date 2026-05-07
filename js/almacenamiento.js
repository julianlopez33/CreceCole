// ==========================================================================
// GESTIÓN DE PERSISTENCIA (LOCALSTORAGE)
// ==========================================================================

// Asegura que el objeto global App esté disponible en este script
window.App = window.App || {};

/**
 * Guarda cualquier tipo de dato en el localStorage del navegador.
 * @param {string} key - La clave bajo la cual se guardará el dato.
 * @param {any} data - La información a guardar (se convertirá a JSON).
 */
App.save = function(key, data) {
    // Convierte el objeto o array a una cadena de texto JSON y lo guarda con un prefijo único
    localStorage.setItem(`crececole_${key}`, JSON.stringify(data));
};

/**
 * Recupera datos guardados previamente en el localStorage.
 * @param {string} key - La clave del dato que se desea obtener.
 * @returns {any|null} - Los datos parseados o null si no existe la clave.
 */
App.load = function(key) {
    // Obtiene la cadena de texto desde el almacenamiento
    const data = localStorage.getItem(`crececole_${key}`);
    // Si existen datos, los convierte de JSON a un objeto de JS; si no, devuelve null
    return data ? JSON.parse(data) : null;
};

