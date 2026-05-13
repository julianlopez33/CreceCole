// ==========================================================================
// LÓGICA DE USUARIOS Y SESIONES (SIMULACIÓN LOCAL)
// ==========================================================================

// Asegura la existencia del objeto App para el manejo de sesiones
window.App = window.App || {};

/**
 * Registra un nuevo usuario en la base de datos local (localStorage).
 * @param {Object} userData - Objeto con nombre, email y contraseña.
 */
App.register = function(userData) {
    // Carga la lista actual de usuarios o inicializa una vacía
    const users = App.load('users') || [];
    // Agrega el nuevo usuario al array con la bandera de "nuevo usuario"
    const newUser = { ...userData, isNewUser: true };
    users.push(newUser);
    // Persiste la lista actualizada en el almacenamiento local
    App.save('users', users);
    // Notifica al usuario sobre el éxito de la operación
    alert('¡Registro exitoso! Ya puedes iniciar sesión.');
};

/**
 * Intenta iniciar sesión comparando credenciales con los usuarios guardados.
 * @param {string} email - Correo del usuario.
 * @param {string} password - Contraseña ingresada.
 * @returns {boolean} - Indica si el login fue exitoso.
 */
App.login = function(email, password) {
    // Carga todos los usuarios registrados
    const users = App.load('users') || [];
    // Busca un usuario que coincida exactamente con el email y la contraseña
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        // Establece el usuario actual en memoria para la sesión activa
        App.currentUser = user;
        // Guarda los datos del usuario en la clave 'session' para persistencia entre páginas
        App.save('session', user);
        
        // Recupera el historial de donaciones específico para este usuario
        const contributions = App.load(`contributions_${user.email}`) || [];
        App.userContributions = contributions;
        
        // Notifica a la interfaz que debe actualizar los elementos (botones, perfil, etc.)
        App.updateUI();
        return true; // Login exitoso
    }
    return false; // Login fallido
};

/**
 * Limpia los datos de la sesión actual y redirige a la página principal.
 */
App.logout = function() {
    // Elimina el usuario de la memoria del script
    App.currentUser = null;
    // Borra la sesión persistente del navegador
    localStorage.removeItem('crececole_session');
    // Redirige al usuario al inicio para limpiar el estado de la aplicación
    window.location.href = 'index.html';
};

