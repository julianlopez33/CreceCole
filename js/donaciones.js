// ==========================================================================
// LÓGICA DE DONACIONES (INTERACCIÓN CON API PHP)
// ==========================================================================

// Asegura que el objeto global App esté disponible para procesar donaciones
window.App = window.App || {};

/**
 * Registra una donación en el servidor y actualiza la interfaz.
 * @param {number} projectId - ID del proyecto al que se dona.
 * @param {number} amount - Cantidad de dinero donada.
 */
App.donate = async function(projectId, amount) {
    // Verifica que el usuario haya iniciado sesión antes de permitir la donación
    if (!App.currentUser) {
        alert('Por favor inicia sesión para donar');
        return;
    }

    try {
        // Envía una petición POST con los datos de la donación al servidor PHP
        const response = await fetch('api/donaciones.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                proyecto_id: projectId, // ID del proyecto destino
                usuario_email: App.currentUser.email, // Email del donante
                monto: amount // Monto de la donación
            })
        });

        // Procesa la respuesta JSON del servidor
        const result = await response.json();
        if (result.success) {
            // Informa al usuario sobre el éxito de su contribución
            alert(`¡Gracias por tu donación de $${amount}!`);
            
            // Refresca la lista de proyectos para mostrar el nuevo total recaudado
            App.renderProjects(); 
            
            // Si el usuario se encuentra en su página de perfil, actualiza su historial de donaciones
            if (window.location.pathname.includes('perfil.html')) {
                App.renderContributions();
            }
        } else {
            // Muestra el error devuelto por el servidor (ej: fondos insuficientes simulados)
            alert('Error al procesar donación: ' + result.message);
        }
    } catch (error) {
        // Captura errores de red o excepciones en el código
        console.error('Error en donación:', error);
        alert('Error de conexión con el servidor');
    }
};

