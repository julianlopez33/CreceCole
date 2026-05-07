// ==========================================================================
// PROTECCIÓN DE RUTAS Y SEGURIDAD
// ==========================================================================

// Asegura que el objeto global App esté disponible para validaciones de seguridad
window.App = window.App || {};

/**
 * Verifica si el usuario tiene una sesión activa antes de permitirle ver páginas privadas.
 * @returns {Object|null} - Devuelve los datos de la sesión o redirige si no hay acceso.
 */
App.checkAuth = function() {
    // Intenta cargar la sesión desde el almacenamiento persistente
    const session = App.load('session');
    
    // Si no hay sesión y el usuario intenta entrar a 'perfil.html'
    if (!session && window.location.pathname.includes('perfil.html')) {
        // Redirige automáticamente a la página de acceso/login
        window.location.href = 'acceso.html';
    }
    
    // Devuelve los datos de la sesión para ser usados en otros scripts
    return session;
};

