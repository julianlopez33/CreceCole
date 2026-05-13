// ==========================================================================
// LÓGICA DE ONBOARDING Y TUTORIAL
// ==========================================================================

window.App = window.App || {};

/**
 * Gestor del tutorial para nuevos usuarios.
 */
App.Tutorial = {
    /**
     * Verifica si el usuario actual debe ver el tutorial.
     */
    checkOnboarding: function() {
        if (App.currentUser && App.currentUser.isNewUser) {
            this.showInvitation();
        }
    },

    /**
     * Muestra un modal de invitación al tutorial.
     */
    showInvitation: function() {
        // Evita mostrarlo si ya existe un modal de este tipo
        if (document.getElementById('tutorial-invitation')) return;

        const modalHtml = `
            <div id="tutorial-invitation" class="tutorial-modal-overlay">
                <div class="tutorial-modal-content animate-pop">
                    <div class="tutorial-icon">
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                            <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
                            <path d="M12 16v-4"/>
                            <path d="M12 8h.01"/>
                        </svg>
                    </div>
                    <h2>¡Bienvenido a Crece Cole!</h2>
                    <p>Parece que eres nuevo por aquí. ¿Te gustaría ver un breve recorrido sobre cómo funciona la plataforma?</p>
                    <div class="tutorial-modal-actions">
                        <button id="skip-tutorial" class="btn btn-outline">Omitir por ahora</button>
                        <button id="start-tutorial" class="btn btn-primary">¡Ver cómo funciona!</button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHtml);

        // Estilos rápidos para el modal (si no se cargan desde CSS)
        this.injectInvitationStyles();

        // Eventos
        document.getElementById('skip-tutorial').onclick = () => this.dismiss(false);
        document.getElementById('start-tutorial').onclick = () => this.goToTutorial();
    },

    /**
     * Redirige a la página de tutorial.
     */
    goToTutorial: function() {
        // Marcamos como visto antes de ir para que no vuelva a aparecer
        this.dismiss(true);
        window.location.href = 'tutorial.html';
    },

    /**
     * Cierra el modal y marca al usuario como "no nuevo".
     */
    dismiss: function(accepted) {
        const modal = document.getElementById('tutorial-invitation');
        if (modal) modal.remove();

        // Actualizar estado del usuario
        if (App.currentUser) {
            App.currentUser.isNewUser = false;
            
            // Guardar en la sesión actual
            App.save('session', App.currentUser);

            // Actualizar en la "base de datos" de usuarios
            const users = App.load('users') || [];
            const userIndex = users.findIndex(u => u.email === App.currentUser.email);
            if (userIndex !== -1) {
                users[userIndex].isNewUser = false;
                App.save('users', users);
            }
        }
    },

    /**
     * Inyecta estilos base para el modal de invitación.
     */
    injectInvitationStyles: function() {
        if (document.getElementById('tutorial-invitation-styles')) return;

        const style = document.createElement('style');
        style.id = 'tutorial-invitation-styles';
        style.innerHTML = `
            .tutorial-modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.6);
                backdrop-filter: blur(8px);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 9999;
                padding: 20px;
            }
            .tutorial-modal-content {
                background: white;
                padding: 40px;
                border-radius: 24px;
                max-width: 500px;
                width: 100%;
                text-align: center;
                box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
            }
            .tutorial-icon {
                margin-bottom: 24px;
                color: var(--primary, #4f46e5);
                display: flex;
                justify-content: center;
            }
            .tutorial-modal-content h2 {
                margin-bottom: 16px;
                font-size: 1.8rem;
                color: var(--text-primary, #111827);
            }
            .tutorial-modal-content p {
                margin-bottom: 32px;
                color: var(--text-secondary, #4b5563);
                line-height: 1.6;
            }
            .tutorial-modal-actions {
                display: flex;
                gap: 16px;
                justify-content: center;
            }
            @media (max-width: 480px) {
                .tutorial-modal-actions {
                    flex-direction: column;
                }
                .tutorial-modal-actions button {
                    width: 100%;
                }
            }
            .animate-pop {
                animation: pop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            }
            @keyframes pop {
                from { transform: scale(0.8); opacity: 0; }
                to { transform: scale(1); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }
};
