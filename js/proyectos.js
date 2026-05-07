// ==========================================================================
// GESTIÓN DE PROYECTOS (INTERACCIÓN CON API PHP)
// ==========================================================================

// Asegura que el objeto global App esté disponible para la gestión de campañas
window.App = window.App || {};

/**
 * Envía una petición al servidor para crear un nuevo proyecto.
 * @param {Object} projectData - Datos del proyecto (título, categoría, meta, imagen, descripción).
 */
App.createProject = async function(projectData) {
    // Valida que haya un usuario identificado
    if (!App.currentUser) {
        alert('Debes iniciar sesión para crear un proyecto');
        return;
    }

    try {
        // Realiza una petición POST al endpoint de proyectos
        const response = await fetch('api/proyectos.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ...projectData,
                autor_email: App.currentUser.email // Adjunta el email del autor desde la sesión
            })
        });

        // Espera y parsea la respuesta JSON
        const result = await response.json();
        if (result.success) {
            alert('¡Proyecto creado con éxito!');
            App.renderProjects(); // Actualiza la vista de proyectos para mostrar el nuevo
        } else {
            alert('Error: ' + result.message);
        }
    } catch (error) {
        // Manejo de errores de red o del servidor
        console.error('Error al crear proyecto:', error);
        alert('Error de conexión con el servidor');
    }
};

/**
 * Obtiene la lista de proyectos desde la base de datos y los dibuja en el HTML.
 * @param {string} filter - Categoría por la cual filtrar los proyectos (por defecto 'all').
 */
App.renderProjects = async function(filter = 'all') {
    // Busca el contenedor donde se mostrarán las tarjetas
    const grid = document.getElementById('projects-grid');
    if (!grid) return; // Si no estamos en la página de proyectos, sale de la función

    try {
        // Obtiene todos los proyectos mediante una petición GET
        const response = await fetch('api/proyectos.php');
        let projects = await response.json();

        // Si se especificó una categoría, filtra la lista recibida
        if (filter !== 'all') {
            projects = projects.filter(p => p.categoria === filter);
        }

        // Si no hay proyectos que mostrar, informa al usuario
        if (projects.length === 0) {
            grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--text-secondary);">No se encontraron proyectos en esta categoría.</p>';
            return;
        }

        // Genera el HTML para cada tarjeta de proyecto dinámicamente
        grid.innerHTML = projects.map(p => {
            // Calcula el porcentaje de recaudación (máximo 100%)
            const percent = Math.min(Math.round((p.recaudado / p.meta) * 100), 100);
            return `
                <div class="card animate-fade">
                    <div class="card-img-container">
                        <img src="${p.imagen || 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800'}" class="card-img" alt="${p.titulo}">
                        <span class="category-badge">${p.categoria}</span>
                    </div>
                    <h3 style="margin-bottom: 0.75rem; color: var(--text-primary); font-size: 1.25rem; line-height: 1.4;">${p.titulo}</h3>
                    <p style="color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 1.5rem; flex-grow: 1;">${p.descripcion}</p>
                    
                    <div class="progress-container">
                        <div class="progress-bar" style="width: ${percent}%"></div>
                    </div>
                    
                    <div class="project-stats">
                        <div class="stat-group">
                            <span class="stat-label">recaudado</span>
                            <span class="stat-value">$${Number(p.recaudado).toLocaleString()}</span>
                        </div>
                        <div class="stat-group" style="text-align: right;">
                            <span class="stat-label">meta</span>
                            <span class="stat-value">$${Number(p.meta).toLocaleString()}</span>
                        </div>
                        <span class="stat-percent">${percent}%</span>
                    </div>

                    <button onclick="App.openDonationModal(${p.id})" class="btn btn-primary" style="width: 100%; padding: 1rem; font-weight: 700; border-radius: 14px;">
                        apoyar proyecto
                    </button>
                </div>
            `;
        }).join('');
    } catch (error) {
        // En caso de fallo en la carga, muestra un mensaje de error visual
        console.error('Error al cargar proyectos:', error);
        grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: red;">Error al conectar con la base de datos.</p>';
    }
};

