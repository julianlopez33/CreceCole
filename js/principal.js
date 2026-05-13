// ==========================================================================
// PUNTO DE ENTRADA PRINCIPAL DE LA APLICACIÓN
// ==========================================================================

// Asegura que el objeto global App esté disponible para coordinar toda la app
window.App = window.App || {};

/**
 * Inicialización global que se ejecuta al cargar cualquier página del sitio.
 * Configura el estado inicial, la UI y los eventos básicos.
 */
document.addEventListener('DOMContentLoaded', () => {
    // 1. Intenta recuperar la sesión del usuario desde el almacenamiento local
    App.currentUser = App.load('session');
    
    // 2. Verifica si el usuario tiene permiso para estar en la página actual (seguridad)
    App.checkAuth();

    // 2.5 Verifica si el usuario es nuevo para mostrar el tutorial
    if (App.Tutorial) {
        App.Tutorial.checkOnboarding();
    }
    
    // 3. Actualiza los botones de la barra de navegación (Login vs Perfil)
    App.updateUI();
    
    // 4. Si la página tiene el contenedor de proyectos, los carga automáticamente
    if (document.getElementById('projects-grid')) {
        App.renderProjects();
    }
    
    // 5. Configura los botones de filtro por categoría (Tecnología, Arte, etc.)
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Cambia el estilo visual de los botones para indicar cuál está activo
            filterBtns.forEach(b => {
                b.classList.remove('btn-primary');
                b.classList.add('btn-outline');
            });
            btn.classList.remove('btn-outline');
            btn.classList.add('btn-primary');
            
            // Ejecuta el renderizado de proyectos aplicando el filtro de la categoría seleccionada
            App.renderProjects(btn.dataset.category);
        });
    });

    // 6. Configura la lógica de apertura, cierre y envío de formularios en modales
    setupModals();
});

/**
 * Función encargada de inicializar todos los comportamientos de las ventanas modales.
 */
function setupModals() {
    const donationModal = document.getElementById('donation-modal');
    const createModal = document.getElementById('create-project-modal');
    
    // Lógica para cerrar el modal de donación mediante la 'X' o botón de cancelar
    const closeDonation = document.getElementById('close-modal');
    if (closeDonation) {
        closeDonation.onclick = () => donationModal.style.display = 'none';
    }

    // Lógica para cerrar el modal de creación de proyectos
    const closeCreate = document.getElementById('close-create-modal');
    if (closeCreate) {
        closeCreate.onclick = () => createModal.style.display = 'none';
    }

    // Lógica para abrir el modal de creación (valida si el usuario está logueado)
    const openCreateBtn = document.getElementById('open-create-modal');
    if (openCreateBtn) {
        openCreateBtn.onclick = () => {
            if (!App.currentUser) {
                alert('Inicia sesión para crear proyectos');
                window.location.href = 'acceso.html';
                return;
            }
            createModal.style.display = 'flex';
        };
    }

    // Captura el envío del formulario para crear una nueva campaña
    const createForm = document.getElementById('create-project-form');
    if (createForm) {
        createForm.onsubmit = (e) => {
            e.preventDefault(); // Evita que la página se recargue
            
            // Recolecta los datos ingresados por el usuario
            const projectData = {
                title: document.getElementById('project-title').value,
                category: document.getElementById('project-category').value,
                goal: Number(document.getElementById('project-goal').value),
                image: document.getElementById('project-image').value,
                description: document.getElementById('project-desc').value
            };
            
            // Llama a la función de lógica de negocio para guardar el proyecto
            App.createProject(projectData);
            createModal.style.display = 'none'; // Cierra el modal
            createForm.reset(); // Limpia los campos del formulario
        };
    }

    // Maneja el clic en el botón de confirmación de donación dentro del modal
    const confirmDonation = document.getElementById('confirm-donation');
    if (confirmDonation) {
        confirmDonation.onclick = () => {
            const amount = document.getElementById('donation-amount').value;
            // Valida que el monto sea un número positivo
            if (amount > 0) {
                // Ejecuta la donación asociada al proyecto actualmente seleccionado
                App.donate(App.currentProjectId, amount);
                donationModal.style.display = 'none'; // Cierra el modal tras donar
            }
        };
    }
}

/**
 * Abre la ventana modal de donación para un proyecto específico.
 * Se llama desde el atributo 'onclick' de los botones en las tarjetas de proyectos.
 * @param {number} projectId - ID del proyecto al que se desea apoyar.
 */
App.openDonationModal = function(projectId) {
    // Seguridad: impide donar si no hay una sesión iniciada
    if (!App.currentUser) {
        alert('Inicia sesión para donar');
        window.location.href = 'acceso.html';
        return;
    }
    
    // Guarda el ID del proyecto actual para usarlo al confirmar la donación
    App.currentProjectId = projectId;
    
    // Busca el nombre del proyecto para mostrarlo en el título del modal
    // Nota: Aquí se intenta cargar de localStorage o usa las constantes por defecto
    const projects = App.load('projects') || App.INITIAL_PROJECTS;
    const project = projects.find(p => p.id === projectId);
    
    // Actualiza el texto del modal y lo hace visible
    document.getElementById('modal-project-title').textContent = `donar a: ${project.title}`;
    document.getElementById('donation-modal').style.display = 'flex';
};

/**
 * REGISTRO DEL SERVICE WORKER (PWA)
 * Permite que la aplicación funcione offline y sea instalable.
 */
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .then(registration => {
                console.log('Service Worker registrado con éxito:', registration.scope);
            })
            .catch(error => {
                console.log('Fallo al registrar el Service Worker:', error);
            });
    });
}


