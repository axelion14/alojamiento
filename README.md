# ViviendaMorelia 🏠 — Plataforma Antifraude de Vivienda Estudiantil

Plataforma de búsqueda y validación de vivienda estudiantil en Morelia, Michoacán. Este MVP está diseñado específicamente para resolver de forma real y eficiente los problemas críticos de fraudes inmobiliarios y falsas expectativas en la renta de alojamientos para estudiantes de nuevo ingreso.

---

## 🚀 Requisitos Clave del MVP (Presentación al Comité)

Esta versión incluye las **4 funcionalidades críticas** requeridas para la demostración de negocio:

### 1. Filtros Críticos en Tiempo Real 💰
*   **Presupuesto:** Barra deslizante interactiva que restringe resultados en tiempo real (Rango: `$1,000` - `$12,000` MXN).
*   **Género:** Opciones de filtro adaptadas a la demanda real estudiantil (`Hombre`, `Mujer`, `Mixto`).
*   **Servicios:** Filtrado cruzado (lógica tipo `AND`) para múltiples servicios (Wifi, Agua, Luz, Gas, Estacionamiento, Seguridad, etc.).

### 2. Validación Geográfica (Mapa de Morelia) 📍
*   **Mapa Interactivo:** Desarrollado con Leaflet.js, centrado en Morelia y optimizado con pines de precios flotantes (estilo Airbnb).
*   **Coordenadas Universitarias Reales:** Ubicación de las principales escuelas y facultades de la ciudad:
    *   *Ciudad Universitaria (UMSNH)* 🎓
    *   *Facultad de Medicina y Odontología (UMSNH)* (Av. Ventura Puente) 🏥
    *   *Campus UNAM Morelia* 🏫
    *   *Instituto Tecnológico de Morelia (ITM)* 🔬
    *   *Universidad Vasco de Quiroga (UVAQ)* ⛪
    *   *Tec de Monterrey (ITESM)* 💻
    *   *Facultad de Derecho (UMSNH)* ⚖️
*   **Simulación de Proximidad:** Al elegir una universidad, se dibuja un **círculo de radio de 1 km** (cercanía a pie) en el mapa. Cada propiedad calcula su distancia por la fórmula de Haversine y dibuja una **línea discontinua de ruta** al ser seleccionada. El modal de detalles del inmueble lista las 3 escuelas más cercanas con estimación de minutos de caminata.

### 3. Seguridad Integrada (Sello Antifraude) 🛡️
*   **Registro de Usuarios:** Sistema de roles persistente (`Estudiante` o `Arrendador`).
*   **Publicación Certificada:** Para que un propietario publique un anuncio, debe realizar el flujo de validación:
    1.  Cargar su *Identificación Oficial (INE/Pasaporte)*.
    2.  Cargar un *Comprobante de Domicilio (CFE/Agua)* cuya dirección física coincida con el alojamiento.
*   **Sello Verde:** Al completarse la validación, la propiedad se geolocaliza automáticamente en el mapa y recibe el sello de **"🛡️ Arrendador Verificado"**, reduciendo fraudes por depósitos falsos.

### 4. Algoritmo Preventivo de Disponibilidad 🔒
*   El grid oculta de forma automática cualquier alojamiento cuyo estado sea `'apartado'` para evitar que el estudiante genere falsas expectativas de conversión.
*   Una barra de estado notifica cuántas propiedades han sido apartadas y protegidas de la visualización en la sesión activa.

---

## 🧪 Guía para la Demostración en Vivo (Panel de Control)

En la esquina inferior izquierda verás el widget flotante **`Panel de Simulación (Demostración)`** diseñado para que demuestres el comportamiento lógico ante el jurado:

1.  **Login Rápido:** Haz clic en **"🔑 Ser Arrendador"** (Don Carlos) para publicar y verificar un inmueble al instante, o en **"🎓 Ser Estudiante"** (Mateo) para buscar y calcular distancias.
2.  **Toggle de Apartadas:** Marca la casilla *"Ver propiedades apartadas (Demo)"* para desactivar temporalmente el filtro preventivo. Las propiedades apartadas aparecerán difuminadas con el sello de **🔒 Reservado**.
3.  **Simular Reservas:** Cambia el estado de una propiedad libre a "Apartada" con un solo clic y observa cómo desaparece de la pantalla y el mapa de inmediato.
4.  **Persistencia:** Todos los datos se guardan en el `localStorage` del navegador, por lo que puedes refrescar la página en cualquier momento de la presentación sin perder tus registros de prueba.

---

## 🛠️ Stack Tecnológico

- **React 19** + **Vite 8** — Frontend SPA
- **Leaflet 1.9.4** — Mapa interactivo (sin peer dependencies conflictivas)
- **Tailwind CSS 3** — Estilos y diseño responsivo premium
- **Google Fonts (Outfit)** — Tipografía de alta calidad

---

## 💻 Instalación y Uso Local

```bash
# Clonar el repositorio
git clone https://github.com/axelion14/alojamiento.git
cd alojamiento

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo en puerto alternativo (ej: 8080)
npm run dev -- --port 8080
```

Abrir [http://localhost:8080](http://localhost:8080) en el navegador.

---

## 📂 Estructura del Proyecto

```text
src/
├── App.jsx                     # Componente principal (Registro, Vistas, Filtros y Modales)
├── index.css                   # Tailwind imports + Tipografía Outfit
├── main.jsx                    # Punto de entrada de React
├── components/
│   └── MapaMorelia.jsx         # Mapa Leaflet, coordenadas universitarias y Haversine
└── data/
    └── propiedades.json        # Datos locales con lat, lng, isVerified y status
```
