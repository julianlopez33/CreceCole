// ==========================================================================
// CONFIGURACIÓN Y DATOS INICIALES
// ==========================================================================

// Inicializa el objeto global App si no existe para evitar errores de referencia
window.App = window.App || {};

// Lista de proyectos iniciales para la plataforma (datos de respaldo o demostración)
App.INITIAL_PROJECTS = [
    { 
        id: 1, // Identificador único del proyecto
        title: "Renovación del Laboratorio de Computación", // Título de la campaña
        category: "Tecnología", // Categoría para filtrado
        goal: 5000, // Meta financiera en dólares/pesos
        raised: 3200, // Cantidad recaudada actualmente
        image: "https://images.unsplash.com/photo-1547082299-de196ea013d6?w=800&q=80", // URL de la imagen de portada
        description: "Actualización de equipos y software para el aprendizaje digital de los alumnos." // Descripción detallada
    },
    { 
        id: 2, // Identificador único
        title: "Construcción de Techumbre en Cancha Multiusos", 
        category: "Infraestructura", 
        goal: 12000, 
        raised: 8500, 
        image: "https://images.unsplash.com/photo-1519315901367-f34ff9154487?w=800&q=80", 
        description: "Instalación de techado para proteger a los estudiantes del sol durante actividades físicas." 
    },
    { 
        id: 4, // Identificador único
        title: "Expansión del Taller de Artes Plásticas", 
        category: "Artes", 
        goal: 1500, 
        raised: 1200, 
        image: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&q=80", 
        description: "Adquisición de materiales artísticos y mobiliario para fomentar la creatividad estudiantil." 
    }
];

