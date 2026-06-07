# ViviendaMorelia 🏠

Plataforma de búsqueda de vivienda estudiantil en Morelia, Michoacán. MVP para medir si una plataforma especializada reduce el tiempo de búsqueda frente a los grupos de Facebook.

## Stack

- **React 19** + **Vite 8** — Frontend SPA
- **Tailwind CSS 3** — Estilos utilitarios
- **Despliegue**: Estático (Vercel / cualquier CDN)

## Requisitos

- **Node.js** >= 20.19 o >= 22.12
- **npm** >= 10

## Instalación

```bash
# Clonar el repositorio
git clone https://github.com/axelion14/alojamiento.git
cd alojamiento

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

Abrir [http://localhost:5173](http://localhost:5173) en el navegador.

## Comandos útiles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo con HMR |
| `npm run build` | Build de producción en `dist/` |
| `npm run preview` | Vista previa del build de producción |
| `npm run lint` | Revisión de código con ESLint |

## Estructura del proyecto

```
src/
├── App.jsx                  # Componente principal con toda la UI
├── index.css                # Directivas de Tailwind
├── main.jsx                 # Punto de entrada de React
└── data/
    └── propiedades.json     # 32 propiedades de Morelia
```

## Funcionalidades

- **Búsqueda por texto** en título y descripción
- **Filtros**: precio, género, zona, tipo, servicios (AND)
- **Modal de detalle** con amenidades, reglas y contacto WhatsApp
- **Sidebar colapsable** en móviles
- **Diseño responsivo** (mobile-first con Tailwind)

## Despliegue en Vercel

Conectar el repositorio desde [vercel.com/import](https://vercel.com/import) — el archivo `vercel.json` ya maneja las rutas SPA.

O desde la CLI:

```bash
npx vercel --prod
```
