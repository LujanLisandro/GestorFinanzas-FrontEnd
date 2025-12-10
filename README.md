# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

# Gestor de Finanzas Personales - Frontend

Dashboard financiero moderno para gestión de finanzas personales desarrollado con React + TypeScript.

## 🚀 Características

- **Autenticación**: Login simple (sin registro)
- **Dashboard**: Vista completa del balance financiero
- **Gráficos Interactivos**: Visualización de ingresos, gastos y tendencias
- **Responsive Design**: Diseño adaptativo para todos los dispositivos
- **TypeScript**: Desarrollo con tipado estático para mayor seguridad

## 🛠️ Tecnologías

- **React 18** - Biblioteca de UI
- **TypeScript** - Lenguaje tipado
- **Vite** - Herramienta de construcción rápida
- **Tailwind CSS** - Framework de estilos utility-first
- **Chart.js** - Biblioteca de gráficos
- **React Router** - Enrutamiento
- **Lucide React** - Iconos modernos

## 📦 Instalación

1. Clona el repositorio:
   ```bash
   git clone <repository-url>
   cd GestorFinanzas-FrontEnd
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

4. Abre tu navegador en `http://localhost:5173`

## 🔐 Credenciales de Prueba

- **Usuario**: `admin`
- **Contraseña**: `password`

## 📊 Backend API

El frontend está preparado para conectarse con un backend de Spring Boot. La configuración de la API se encuentra en:
- Archivo: `src/config/api.ts`
- URL de producción: `https://gestorfinanzas-api-production.up.railway.app/api/v1`
- URL de desarrollo: `http://localhost:8080/api/v1`

### Endpoints esperados (Spring Boot):

```
GET    /api/balance          - Obtener balance y transacciones
POST   /api/transactions     - Crear nueva transacción
DELETE /api/transactions/:id - Eliminar transacción
POST   /api/auth/login       - Autenticación de usuario
```

## 🏗️ Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── Header.tsx
│   ├── Login.tsx
│   ├── BalanceCard.tsx
│   ├── FinancialCharts.tsx
│   └── ProtectedRoute.tsx
├── contexts/            # Contextos de React
│   ├── AuthContext.tsx
│   └── FinancialContext.tsx
├── pages/              # Páginas principales
│   └── Dashboard.tsx
├── types/              # Definiciones de tipos
│   └── index.ts
└── App.tsx             # Componente principal
```

## 🎨 Características del UI

- **Diseño Moderno**: Interfaz limpia con Tailwind CSS
- **Gráficos Interactivos**: Charts.js para visualización de datos
- **Responsive**: Adaptable a móviles, tablets y desktop
- **Iconos**: Lucide React para iconografía consistente
- **Tema**: Paleta de colores profesional en tonos azul/indigo

## 🚧 Características Futuras

- [ ] Conectar con API de Spring Boot
- [ ] Agregar/editar transacciones
- [ ] Filtros por fecha y categoría
- [ ] Exportar reportes
- [ ] Configuración de categorías personalizadas
- [ ] Notificaciones push
- [ ] Modo oscuro

## 📝 Scripts Disponibles

- `npm run dev` - Servidor de desarrollo
- `npm run build` - Construir para producción
- `npm run preview` - Vista previa de la build
- `npm run lint` - Linter de código

## 🔧 Configuración

### Variables de Entorno

El proyecto usa diferentes archivos de entorno según el contexto:

- **`.env.development`** - Para desarrollo local (ya configurado)
- **`.env.production`** - Para producción (Railway)
- **`.env.local`** - Para sobrescribir configuraciones personales

```bash
# Desarrollo (ya configurado)
npm run dev  # Usa .env.development

# Producción
npm run build  # Usa .env.production
```

📖 **[Ver guía completa de entornos](ENVIRONMENT.md)** para más detalles sobre gestión de configuraciones

---

Desarrollado con ❤️ para gestión financiera personal
