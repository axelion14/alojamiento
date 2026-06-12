# ViviendaMorelia

Plataforma de búsqueda y validación de alojamiento estudiantil en Morelia, Michoacán. Este proyecto es un MVP diseñado para mitigar fraudes de arrendamiento y facilitar la verificación geográfica de propiedades cercanas a las principales instituciones educativas.

## Funcionalidades Principales

*   **Filtros en Tiempo Real:** Filtros de presupuesto máximo, género (Hombre, Mujer, Mixto) y servicios incluidos con actualización inmediata de la interfaz.
*   **Geolocalización y Proximidad:** Mapa interactivo centrado en Morelia con la ubicación de las principales facultades (UMSNH, UNAM, ITM, UVAQ, Tec de Monterrey). Calcula de forma dinámica la distancia (fórmula de Haversine) y traza rutas de cercanía para el usuario.
*   **Publicación y Verificación:** Registro simulado de estudiantes y arrendadores. Para publicar un anuncio con la insignia de "Arrendador Verificado", el propietario debe subir una identificación oficial y un comprobante de domicilio coincidente con la dirección registrada.
*   **Gestión de Disponibilidad:** Exclusión automática de propiedades con estado "apartado" para evitar falsas expectativas y optimizar la conversión de búsqueda.
*   **Panel de Demostración:** Módulo flotante para pruebas en vivo que permite cambiar el rol de usuario, alternar la visibilidad de propiedades reservadas y simular apartados en tiempo real.

## Stack Tecnológico

*   React 19 (Frontend SPA)
*   Vite 8 (Herramienta de construcción)
*   Leaflet 1.9.4 (Renderizado de mapa y coordenadas)
*   Tailwind CSS 3 (Estilos responsivos)
*   Google Fonts - Outfit (Tipografía del sistema)

## Instalación y Uso Local

Siga estos pasos para clonar e iniciar el entorno de desarrollo local:

```bash
# Clonar el proyecto
git clone https://github.com/axelion14/alojamiento.git
cd alojamiento

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo en puerto alternativo
npm run dev -- --port 8080
```

El servidor estará disponible en [http://localhost:8080](http://localhost:8080).

## Estructura de Directorios

```text
src/
├── App.jsx                     # Vistas, modales y lógica de filtros
├── index.css                   # Importaciones de Tailwind y fuentes
├── main.jsx                    # Entrada de la aplicación React
├── components/
│   └── MapaMorelia.jsx         # Componente de mapa y lógica de distancias
└── data/
    └── propiedades.json        # Datos locales enriquecidos
```

