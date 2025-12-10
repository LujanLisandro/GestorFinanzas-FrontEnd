# 🌍 Gestión de Entornos (Desarrollo y Producción)

Este proyecto usa **múltiples archivos de entorno** para gestionar diferentes configuraciones según el contexto de ejecución.

## 📁 Archivos de Entorno

### Prioridad de Carga (de mayor a menor)

1. **`.env.local`** - Configuración local personal (NO se sube a Git)
2. **`.env.[mode]`** - Configuración específica del modo (development/production)
3. **`.env`** - Configuración base (NO se sube a Git)

### Archivos Disponibles

| Archivo | Propósito | Se sube a Git? | Cuándo se usa |
|---------|-----------|----------------|---------------|
| `.env.development` | Desarrollo local | ✅ Sí | `npm run dev` |
| `.env.production` | Producción (Railway) | ✅ Sí | `npm run build` |
| `.env.local` | Configuración personal | ❌ No | Siempre (sobrescribe todo) |
| `.env` | Archivo base local | ❌ No | Fallback |
| `.env.example` | Plantilla de ejemplo | ✅ Sí | Documentación |

## 🚀 Uso Básico

### Para Desarrollo Local

```bash
# El proyecto ya está configurado con .env.development
npm run dev

# Se usará automáticamente:
# VITE_API_URL=http://localhost:8080/api/v1
```

### Para Producción (Build)

```bash
# Construir para producción
npm run build

# Se usará automáticamente .env.production:
# VITE_API_URL=https://gestorfinanzas-api-production.up.railway.app/api/v1
```

### Para Sobrescribir Localmente

Si necesitas una configuración personalizada que no quieres compartir:

```bash
# Crea un archivo .env.local (será ignorado por Git)
cp .env.example .env.local

# Edita .env.local con tus valores personales
# Este archivo tiene la mayor prioridad
```

## 🔧 Configuración de Variables

### Variables Disponibles

```bash
# URL de la API Backend
VITE_API_URL=http://localhost:8080/api/v1

# Nombre de la aplicación
VITE_APP_NAME="Gestor de Finanzas"

# Versión
VITE_APP_VERSION="1.0.0"

# API del Dólar
VITE_DOLAR_API_URL=https://dolarapi.com/v1

# Timeout de sesión (minutos)
VITE_SESSION_TIMEOUT=30

# Modo debug (true/false)
VITE_DEBUG_MODE=false
```

### Acceso en el Código

```typescript
// En cualquier archivo TypeScript/JavaScript:
const apiUrl = import.meta.env.VITE_API_URL;
const appName = import.meta.env.VITE_APP_NAME;
const debugMode = import.meta.env.VITE_DEBUG_MODE === 'true';
```

## 📝 Escenarios Comunes

### Escenario 1: Desarrollo contra backend local

```bash
# Ya configurado en .env.development
npm run dev
```

### Escenario 2: Desarrollo contra backend de producción

```bash
# Crea .env.local
echo "VITE_API_URL=https://gestorfinanzas-api-production.up.railway.app/api/v1" > .env.local

# Ejecuta
npm run dev
```

### Escenario 3: Testing contra otro servidor

```bash
# Crea .env.local con la URL de testing
echo "VITE_API_URL=https://gestorfinanzas-api-testing.up.railway.app/api/v1" > .env.local

npm run dev
```

### Escenario 4: Build para producción

```bash
# Usa automáticamente .env.production
npm run build

# El build usará la URL de Railway
```

## ⚠️ Mejores Prácticas

### ✅ Hacer

- ✅ Usar `.env.development` para configuración de desarrollo compartida
- ✅ Usar `.env.production` para configuración de producción
- ✅ Crear `.env.local` para sobrescribir configuraciones personalmente
- ✅ Subir `.env.example` como plantilla
- ✅ Documentar todas las variables nuevas

### ❌ No Hacer

- ❌ Subir archivos `.env` o `.env.local` a Git (contienen secretos)
- ❌ Hardcodear URLs en el código
- ❌ Compartir valores sensibles (tokens, passwords) en archivos versionados
- ❌ Usar variables sin el prefijo `VITE_` (no estarán disponibles)

## 🔒 Seguridad

### Variables Públicas vs Privadas

⚠️ **IMPORTANTE**: Todas las variables `VITE_*` son **públicas** y se incluyen en el bundle del frontend.

```bash
# ✅ OK para frontend (públicas)
VITE_API_URL=https://api.example.com
VITE_APP_NAME="Mi App"

# ❌ NO HACER - Nunca pongas secretos en variables VITE_
# Estos valores serán visibles en el código del navegador
VITE_SECRET_KEY=abc123  # ❌ INCORRECTO
VITE_API_SECRET=xyz789  # ❌ INCORRECTO
```

### Claves y Secretos

Los secretos deben manejarse en el **backend**, no en el frontend:
- Tokens de autenticación → Backend (cookies HTTP-only)
- API Keys → Backend
- Credenciales → Backend

## 📚 Recursos

- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [Vite Modes and Environment Variables](https://vitejs.dev/guide/env-and-mode.html#modes)

## 🆘 Troubleshooting

### Problema: Variables no se actualizan

**Solución**: Reinicia el servidor de desarrollo
```bash
# Ctrl+C para detener
npm run dev
```

### Problema: No sé qué archivo se está usando

**Solución**: Agrega un log temporal en tu código
```typescript
console.log('API URL:', import.meta.env.VITE_API_URL);
console.log('Modo:', import.meta.env.MODE);
```

### Problema: Necesito diferentes configuraciones en el mismo entorno

**Solución**: Usa `.env.local` para sobrescribir sin afectar a otros
```bash
cp .env.example .env.local
# Edita .env.local con tus valores
```
