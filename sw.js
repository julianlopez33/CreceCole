// SERVICE WORKER - CRECE COLE PWA
const CACHE_NAME = 'crececole-cache-v1';
const ASSETS_TO_CACHE = [
    'index.html',
    'acceso.html',
    'proyectos.html',
    'perfil.html',
    'nosotros.html',
    'impacto.html',
    'css/main.css',
    'css/index.css',
    'css/acceso.css',
    'css/proyectos.css',
    'css/perfil.css',
    'css/nosotros.css',
    'css/impacto.css',
    'js/constantes.js',
    'js/almacenamiento.js',
    'js/autenticacion.js',
    'js/proyectos.js',
    'js/donaciones.js',
    'js/gestor-interfaz.js',
    'js/seguridad.js',
    'js/principal.js',
    'manifest.json'
];

// Instalación: Cachear archivos estáticos
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('Cache abierto, guardando recursos estáticos...');
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
});

// Activación: Limpiar caches antiguos
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        console.log('Borrando cache antiguo:', cache);
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});

// Fetch: Estrategia Stale-While-Revalidate (servir de cache y actualizar en segundo plano)
self.addEventListener('fetch', (event) => {
    // Solo cachear peticiones GET
    if (event.request.method !== 'GET') return;

    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            const fetchedResponse = fetch(event.request).then((networkResponse) => {
                // No cachear llamadas a la API PHP (datos dinámicos)
                if (event.request.url.includes('api/')) {
                    return networkResponse;
                }

                // Actualizar el cache con la nueva versión
                return caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, networkResponse.clone());
                    return networkResponse;
                });
            }).catch(() => {
                // Manejo de errores si falla la red y no hay cache
                return cachedResponse;
            });

            return cachedResponse || fetchedResponse;
        })
    );
});
