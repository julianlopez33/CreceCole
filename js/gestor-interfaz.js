// ==========================================================================
// GESTOR DE LA INTERFAZ DE USUARIO (UI)
// ==========================================================================

// Asegura que el objeto global App esté disponible para manipular la UI
window.App = window.App || {};

/**
 * Actualiza los elementos visibles de la interfaz según si hay un usuario logueado o no.
 * Maneja el cambio entre el botón de "Iniciar Sesión" y el enlace al "Perfil".
 */
App.updateUI = function() {
    // Obtiene las referencias a los elementos del DOM necesarios
    const loginBtn = document.getElementById('login-link');
    const userBtn = document.getElementById('user-profile-link');
    
    // Si existe una sesión activa (App.currentUser no es nulo)
    if (App.currentUser) {
        // Oculta el botón de acceso
        if (loginBtn) loginBtn.style.display = 'none';
        // Muestra el enlace al perfil y actualiza el texto con el nombre del usuario
        if (userBtn) {
            userBtn.style.display = 'block';
            userBtn.textContent = App.currentUser.name;
        }
    } else {
        // Si no hay sesión, muestra el botón de acceso y oculta el perfil
        if (loginBtn) loginBtn.style.display = 'block';
        if (userBtn) userBtn.style.display = 'none';
    }
};

/**
 * Configura la funcionalidad del menú móvil (hamburguesa) al cargar el documento.
 */
document.addEventListener('DOMContentLoaded', () => {
    // Busca el botón de menú y el contenedor de enlaces
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    // Si ambos elementos existen en la página actual
    if (menuToggle && navLinks) {
        // Al hacer clic, añade o quita la clase 'active' para mostrar/ocultar el menú en móvil
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }
});

