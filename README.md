#  FinanPro - Gestor de Finanzas Personales

<div align="center">

![React](https://img.shields.io/badge/React-19.1.1-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7.1.7-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.4.14-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

**Una aplicación web moderna para gestionar tus finanzas personales de manera simple y efectiva.**

[Demo](#)  [Documentación](#características)  [Instalación](#instalación)  [API](#api-backend)

</div>

---

##  Tabla de Contenidos

- [Características](#-características)
- [Tecnologías](#-tecnologías)
- [Arquitectura](#-arquitectura)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Funcionalidades](#-funcionalidades-detalladas)
- [API Backend](#-api-backend)
- [Servicios](#-servicios)
- [Componentes](#-componentes)
- [Contribución](#-contribución)

---

##  Características

###  Principales
- ** Dashboard Interactivo** - Vista general de tu situación financiera con gráficos y estadísticas
- ** Multi-Moneda** - Soporte para ARS (Pesos Argentinos) y USD (Dólares)
- ** Cotización del Dólar en Tiempo Real** - Integración con API de cotizaciones (Oficial, Blue, MEP, etc.)
- ** Diseño Responsivo** - Funciona perfectamente en desktop, tablet y móvil
- ** Autenticación Segura** - Sistema de login con JWT tokens
- ** Tutorial Interactivo** - Guía paso a paso para nuevos usuarios

###  Gestión Financiera
- ** Registro de Movimientos** - Ingresos y egresos con categorías personalizadas
- ** Categorías Personalizables** - Crea y edita categorías con emojis
- ** Calendario Financiero** - Visualiza tus movimientos por fecha
- ** Filtros Avanzados** - Filtra por fecha, categoría y tipo de movimiento
- ** Exportación a PDF** - Genera reportes de tus transacciones

###  Análisis y Reportes
- ** Gráfico de Torta** - Distribución de gastos por categoría
- ** Balance en Tiempo Real** - Total, ingresos y egresos actualizados
- ** Conversión Automática** - Visualiza tu balance en ARS o USD

---

##  Tecnologías

### Frontend
| Tecnología | Versión | Descripción |
|------------|---------|-------------|
| React | 19.1.1 | Biblioteca para interfaces de usuario |
| TypeScript | 5.9.3 | Superset tipado de JavaScript |
| Vite | 7.1.7 | Build tool y dev server ultrarrápido |
| Tailwind CSS | 3.4.14 | Framework CSS utility-first |
| React Router | 7.9.4 | Enrutamiento para React |
| Chart.js | 4.5.1 | Gráficos interactivos |
| Lucide React | 0.545.0 | Iconos modernos |
| jsPDF | 3.0.4 | Generación de PDFs |

### Backend (Requerido)
- **Spring Boot** - API REST
- **JWT** - Autenticación stateless
- **PostgreSQL/MySQL** - Base de datos

---

##  Arquitectura

```

                        FRONTEND                              
        
     React +       Tailwind         Chart.js +         
    TypeScript       CSS           React-Chartjs-2     
        
                                                              
    
                      Services Layer                         
    authService  movementService  categoryService  etc    
    

                             HTTP/REST + JWT

                     BACKEND (Spring Boot)                    
        
      Auth         Movement          Category          
    Controller     Controller        Controller        
        

```

---

##  Instalación

### Prerrequisitos
- Node.js >= 18.x
- npm >= 9.x o yarn >= 1.22
- Backend API corriendo (Spring Boot)

### Pasos

1. **Clonar el repositorio**
```bash
git clone https://github.com/Lichu0800/GestorFinanzas-FrontEnd.git
cd GestorFinanzas-FrontEnd
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env.local
```

4. **Iniciar en desarrollo**
```bash
npm run dev
```

5. **Build para producción**
```bash
npm run build
npm run preview
```

---

##  Configuración

### Variables de Entorno

Crear archivo `.env.local` o `.env.production`:

```env
# URL del Backend API
VITE_API_URL=http://localhost:8080/api/v1

# API de cotizaciones del dólar (opcional)
VITE_DOLAR_API_URL=https://dolarapi.com/v1

# Nombre de la aplicación
VITE_APP_NAME=FinanPro

# Versión
VITE_APP_VERSION=1.0.0

# Modo debug (true/false)
VITE_DEBUG_MODE=false
```

### Configuración de Producción

Para Railway u otros servicios:
```env
VITE_API_URL=https://tu-backend.railway.app/api/v1
```

---

##  Estructura del Proyecto

```
src/
 assets/              # Recursos estáticos (imágenes, fuentes)
 components/          # Componentes React reutilizables
    sections/        # Secciones del dashboard
       AnalyticsSection.tsx
       CalendarSection.tsx
       CategoriesSection.tsx
       TransactionsSection.tsx
    AddButtonMenu.tsx      # Menú flotante para agregar movimientos
    BackendUnavailable.tsx # Pantalla de error de conexión
    BalanceCard.tsx        # Tarjeta de balance total
    CategoryModal.tsx      # Modal para crear/editar categorías
    CurrencyBalanceCard.tsx # Tarjeta de balance por moneda
    DolarConfigModal.tsx   # Configuración de cotización
    FinancialCharts.tsx    # Gráficos financieros
    Header.tsx             # Barra de navegación superior
    Login.tsx              # Página de inicio de sesión
    NavigationMenu.tsx     # Menú de navegación lateral
    ProtectedRoute.tsx     # HOC para rutas protegidas
    Register.tsx           # Página de registro
    Tutorial.tsx           # Tutorial interactivo
 config/              # Configuraciones
    api.ts           # Endpoints de la API
    environment.ts   # Variables de entorno
 contexts/            # React Context
    AuthContext.tsx  # Estado de autenticación
    FinancialContext.tsx # Estado financiero
 hooks/               # Custom hooks
    useLogout.ts     # Hook para cerrar sesión
 pages/               # Páginas principales
    Dashboard.tsx    # Dashboard principal
 services/            # Servicios de API
    authService.ts       # Autenticación
    balanceService.ts    # Balance del usuario
    categoryService.ts   # CRUD de categorías
    dolarService.ts      # Cotizaciones del dólar
    financeService.ts    # Operaciones financieras
    httpService.ts       # Cliente HTTP base
    movementService.ts   # CRUD de movimientos
    pdfExportService.ts  # Exportación a PDF
    tutorialService.ts   # Estado del tutorial
 types/               # Tipos TypeScript
    index.ts         # Definiciones de tipos
 utils/               # Utilidades
    apiTest.ts       # Testing de API
 App.tsx              # Componente raíz
 index.css            # Estilos globales
 main.tsx             # Entry point
```

---

##  Funcionalidades Detalladas

###  Autenticación

#### Login
- Autenticación con username y password
- Token JWT almacenado en localStorage
- Sesión persistente entre recargas
- Manejo automático de tokens expirados

#### Registro
- Creación de nuevas cuentas
- Validación de campos
- Asignación automática de roles

###  Gestión de Movimientos

#### Crear Movimiento
```typescript
interface CreateMovementData {
    description: string;      // Descripción del movimiento
    amount: number;           // Monto
    movementType: 'INGRESO' | 'EGRESO';
    currency: 'ARS' | 'USD';  // Moneda
    categoryID: number;       // ID de categoría
    date: string;            // Fecha ISO-8601
    reference?: string;       // Referencia opcional
}
```

#### Filtros Disponibles
- **Rango de fechas** - Desde/Hasta
- **Categoría** - Filtrar por categoría específica
- **Tipo** - Solo ingresos o solo egresos
- **Paginación** - Resultados paginados

###  Categorías

- Crear categorías personalizadas
- Asignar emojis para identificación visual
- Editar y eliminar categorías existentes
- Descripción opcional

###  Calendario Financiero

- Vista mensual de movimientos
- Totales de ingresos/egresos por día
- Navegación entre meses
- Detalle de transacciones al seleccionar un día

###  Gráficos y Análisis

- **Gráfico de Torta** - Distribución de gastos por categoría
- **Filtro por rango de fechas** - Personaliza el período de análisis
- **Porcentajes** - Visualiza el peso de cada categoría
- **Tooltips interactivos** - Información detallada al hover

###  Cotización del Dólar

#### Tipos de Cotización Soportados
- Oficial
- Blue
- Bolsa (MEP)
- Contado con Liquidación (CCL)
- Mayorista
- Cripto
- Tarjeta

#### Configuración
- Seleccionar tipo de dólar preferido
- Elegir entre precio de compra o venta
- Configuración guardada en localStorage

###  Exportación PDF

Genera reportes PDF con:
- Listado de transacciones
- Resumen financiero (ingresos, egresos, balance)
- Fecha de generación
- Formato profesional con tablas

###  Tutorial Interactivo

Tutorial de 9 pasos para nuevos usuarios:

1. **Bienvenida** - Introducción a FinanPro
2. **Balance Total** - Explicación del balance
3. **Menú de Navegación** - Cómo acceder a secciones
4. **Categorías** - Crear categorías (paso importante)
5. **Agregar Movimientos** - Registrar ingresos/egresos
6. **Transacciones** - Ver historial
7. **Calendario** - Vista por fechas
8. **Configuración** - Ajustes de la app
9. **Finalización** - Completar tutorial

Características:
- **Efecto Spotlight** - Resalta el elemento actual
- **Progresión** - Se completa solo una vez
- **Sincronización** - Estado guardado en backend

---

##  API Backend

### Endpoints Principales

#### Autenticación
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/auth/login` | Iniciar sesión |
| POST | `/auth/logout` | Cerrar sesión |
| POST | `/api/users` | Registrar usuario |

#### Movimientos
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/movement` | Listar movimientos (paginado) |
| POST | `/api/movement` | Crear movimiento |
| PUT | `/api/movement/{id}` | Actualizar movimiento |
| DELETE | `/api/movement/{id}` | Eliminar movimiento |

#### Categorías
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/category` | Listar categorías del usuario |
| POST | `/api/category` | Crear categoría |
| PUT | `/api/category/{id}` | Actualizar categoría |
| DELETE | `/api/category/{id}` | Eliminar categoría |

#### Balance
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/balance/me` | Obtener balance del usuario |

#### Tutorial
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/users/tutorial` | Estado del tutorial |
| PUT | `/api/users/tutorial/complete` | Marcar como completado |

#### Cotizaciones
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/dolar` | Obtener cotizaciones |

### Autenticación de Requests

Todos los endpoints (excepto login/register) requieren header:
```
Authorization: Bearer {jwt_token}
```

---

##  Servicios

### AuthService
```typescript
// Login
authService.login({ username, password }): Promise<LoginResponse>

// Logout
authService.logout(): Promise<LogoutResponse>

// Obtener datos del usuario
authService.getUserData(): User | null

// Verificar si está autenticado
authService.isAuthenticated(): boolean
```

### MovementService
```typescript
// Obtener movimientos
movementService.getMovements(filters?: MovementFilters): Promise<Movement[]>

// Crear movimiento
movementService.createMovement(data: CreateMovementData): Promise<Movement>

// Actualizar movimiento
movementService.updateMovement(id: number, data: UpdateMovementData): Promise<Movement>

// Eliminar movimiento
movementService.deleteMovement(id: number): Promise<void>

// Convertir a formato Transaction
movementService.convertToTransactions(movements: Movement[]): Transaction[]
```

### CategoryService
```typescript
// Obtener categorías
categoryService.getCategories(): Promise<CategoryResponse>

// Crear categoría
categoryService.createCategory(category: Omit<Category, 'id'>): Promise<SingleCategoryResponse>

// Actualizar categoría
categoryService.updateCategory(id: number, category: Partial<Category>): Promise<SingleCategoryResponse>

// Eliminar categoría
categoryService.deleteCategory(id: number): Promise<{ success: boolean }>
```

### DolarService
```typescript
// Obtener cotizaciones
dolarService.getDolarQuotes(): Promise<DolarQuote[]>

// Obtener tasa de cambio configurada
dolarService.getExchangeRate(): Promise<number>

// Guardar configuración
dolarService.saveConfig(dolarType: DolarType, priceType: PriceType): void

// Convertir USD a ARS
dolarService.convertUSDToARS(usdAmount: number, exchangeRate: number): number
```

---

##  Componentes

### Componentes Principales

| Componente | Descripción |
|------------|-------------|
| `Dashboard` | Página principal con toda la funcionalidad |
| `Header` | Navbar con logo, usuario y acciones |
| `NavigationMenu` | Menú lateral de navegación |
| `BalanceCard` | Tarjeta de balance total |
| `CurrencyBalanceCard` | Tarjeta de balance por moneda |
| `FinancialCharts` | Gráficos de análisis |
| `AddButtonMenu` | Botón flotante para agregar |
| `Tutorial` | Sistema de tutorial interactivo |

### Secciones

| Sección | Descripción |
|---------|-------------|
| `TransactionsSection` | Listado y gestión de transacciones |
| `CategoriesSection` | CRUD de categorías |
| `CalendarSection` | Vista calendario de movimientos |
| `AnalyticsSection` | Análisis y estadísticas |

### Modales

| Modal | Descripción |
|-------|-------------|
| `CategoryModal` | Crear/editar categorías |
| `DolarConfigModal` | Configurar cotización del dólar |

---

##  Responsive Design

La aplicación está optimizada para:

- **Desktop** (1024px+) - Layout completo con sidebar
- **Tablet** (768px - 1023px) - Sidebar colapsable
- **Mobile** (< 768px) - Navegación adaptada, menú hamburguesa

---

##  Temas y Estilos

### Paleta de Colores

```css
/* Primary - Azul */
primary-50: #eff6ff
primary-600: #2563eb
primary-700: #1d4ed8

/* Accent - Cyan */
accent-50: #ecfeff
accent-500: #06b6d4
accent-700: #0e7490

/* Secondary - Purple */
secondary-50: #fdf4ff
secondary-500: #a855f7

/* Estados */
success: #10b981 (Emerald)
danger: #ef4444 (Red)
warning: #f59e0b (Amber)
```

### Efectos Especiales

- **Glassmorphism** - Fondos con blur y transparencia
- **Gradientes** - Transiciones suaves de colores
- **Animaciones** - Transiciones smooth en interacciones
- **Spotlight** - Efecto de resaltado en tutorial

---

##  Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Inicia servidor de desarrollo

# Producción
npm run build        # Build para producción
npm run preview      # Preview del build

# Calidad de código
npm run lint         # Ejecuta ESLint
```

---

##  Contribución

1. Fork el proyecto
2. Crea tu rama (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add: AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

##  Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más información.

---

##  Autor

**Lisandro** - [@Lichu0800](https://github.com/Lichu0800)

---

<div align="center">

** Si te gustó el proyecto, dale una estrella en GitHub! **

Made with  and React

</div>
