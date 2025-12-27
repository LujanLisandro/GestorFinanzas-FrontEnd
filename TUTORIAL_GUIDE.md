# Sistema de Tutorial Interactivo - Guía de Implementación

## 📋 Descripción General

El sistema de tutorial interactivo guía a los usuarios en su primera sesión, mostrándoles cómo usar las diferentes funcionalidades de la aplicación financiera mediante elementos destacados y tarjetas informativas posicionadas dinámicamente.

## ✨ Características Implementadas

### 1. **Elementos Destacados con CSS Selectors**
El tutorial puede señalar elementos específicos de la UI usando selectores CSS:
- `.balance-card-total` - Tarjeta de balance total
- `button[title="Abrir navegación lateral"]` - Botón del menú de navegación
- `.add-button-menu` - Menú de botón flotante para agregar movimientos
- `.financial-charts` - Gráficos financieros

### 2. **Posicionamiento Dinámico**
Las tarjetas del tutorial se posicionan automáticamente relativas al elemento objetivo:
- `top-left` / `top-right`
- `bottom-left` / `bottom-right`
- `left-center` / `right-center`
- `center` (para pasos sin elemento objetivo)

### 3. **Flechas Direccionales Animadas**
Cada paso puede mostrar una flecha animada que apunta al elemento:
- ⬆️ `up` - Flecha hacia arriba
- ⬇️ `down` - Flecha hacia abajo
- ⬅️ `left` - Flecha hacia la izquierda
- ➡️ `right` - Flecha hacia la derecha

### 4. **Destacado Visual con Animación**
Los elementos objetivo reciben:
- Clase CSS `.tutorial-highlight` con animación de pulso azul
- z-index elevado (65) para aparecer sobre otros elementos
- Box-shadow brillante con efecto de respiración

## 🎯 Pasos del Tutorial

### Paso 1: Bienvenida
- **Posición:** Centro de la pantalla
- **Objetivo:** Introducción general

### Paso 2: Balance Total
- **Elemento:** `.balance-card-total`
- **Posición:** `bottom-left` (debajo a la izquierda del balance)
- **Flecha:** `up` (apunta hacia arriba al balance)
- **Descripción:** Muestra dónde ver el balance total

### Paso 3: Menú de Navegación
- **Elemento:** `button[title="Abrir navegación lateral"]`
- **Posición:** `bottom-right` (debajo del botón)
- **Flecha:** `left` (apunta hacia el botón)
- **Descripción:** Explica el menú lateral de secciones

### Paso 4: Importancia de Categorías
- **Elemento:** `button[title="Abrir navegación lateral"]` (mismo botón)
- **Posición:** `bottom-right`
- **Flecha:** `left`
- **Descripción:** Enfatiza la necesidad de crear categorías primero

### Paso 5: Agregar Movimientos
- **Elemento:** `.add-button-menu`
- **Posición:** `left-center` (a la izquierda del botón)
- **Flecha:** `right` (apunta al botón flotante)
- **Descripción:** Muestra cómo agregar ingresos/gastos

### Paso 6: Gráficos Financieros
- **Elemento:** `.financial-charts`
- **Posición:** `top-right` (arriba de los gráficos)
- **Flecha:** `down` (apunta hacia los gráficos)
- **Descripción:** Explica la visualización de gastos por categoría

### Paso 7: Acciones Rápidas
- **Elemento:** `.add-button-menu` (mismo botón flotante)
- **Posición:** `left-center`
- **Flecha:** `right`
- **Descripción:** Recuerda las acciones disponibles

### Paso 8: Finalización
- **Posición:** Centro de la pantalla
- **Descripción:** Mensaje de despedida y referencia al botón de ayuda

## 🔧 Implementación Técnica

### Componentes Modificados

#### 1. **Tutorial.tsx** (Nuevo)
```tsx
interface TutorialStep {
    id: number;
    title: string;
    description: string;
    targetSelector?: string; // Selector CSS
    position: 'center' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'left-center' | 'right-center';
    arrowDirection?: 'up' | 'down' | 'left' | 'right';
    highlightColor: string;
    offset?: { x: number; y: number };
}
```

**Características:**
- `useEffect` para encontrar elementos con `document.querySelector()`
- `calculateTooltipPosition()` usa `getBoundingClientRect()` para posicionamiento
- Aplica clase `.tutorial-highlight` y z-index a elementos objetivo
- Animación de entrada/salida con `showOverlay` state

#### 2. **BalanceCard.tsx**
```tsx
className={`... ${type === 'total' ? 'balance-card-total' : ''}`}
```
Añade la clase `balance-card-total` solo a la tarjeta de balance total.

#### 3. **FinancialCharts.tsx**
```tsx
<div className="space-y-6 financial-charts">
```
Añade la clase `financial-charts` al contenedor principal.

#### 4. **AddButtonMenu.tsx**
```tsx
<div className={`fixed bottom-6 right-6 z-50 add-button-menu ${className}`}>
```
Añade la clase `add-button-menu` al contenedor del botón flotante.

#### 5. **Header.tsx**
```tsx
<button
    onClick={onTutorialOpen}
    title="Ver tutorial"
>
    <HelpCircle />
    Tutorial
</button>
```
Botón de ayuda para reabrir el tutorial manualmente.

#### 6. **Dashboard.tsx**
```tsx
const [isTutorialOpen, setIsTutorialOpen] = useState(false);

<Tutorial
    isOpen={isTutorialOpen}
    onClose={() => setIsTutorialOpen(false)}
    onOpenNavMenu={() => setIsNavigationOpen(true)}
/>
```
Estado y renderizado del componente Tutorial.

#### 7. **index.css**
```css
.tutorial-highlight {
    position: relative;
    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.5), 0 0 20px 8px rgba(59, 130, 246, 0.3) !important;
    border-radius: 0.75rem !important;
    animation: tutorial-pulse 2s ease-in-out infinite;
}

@keyframes tutorial-pulse {
    0%, 100% {
        box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.5), 0 0 20px 8px rgba(59, 130, 246, 0.3);
    }
    50% {
        box-shadow: 0 0 0 6px rgba(59, 130, 246, 0.7), 0 0 30px 12px rgba(59, 130, 246, 0.5);
    }
}
```
Estilos para el efecto de destacado con animación de pulso.

## 🎨 Personalización

### Añadir Nuevos Pasos

```tsx
{
    id: 9,
    title: 'Nuevo Paso',
    description: 'Descripción del nuevo paso',
    targetSelector: '.mi-elemento', // Clase CSS del elemento
    position: 'bottom-left',
    arrowDirection: 'up',
    highlightColor: 'from-blue-600 to-purple-600',
    offset: { x: 0, y: 10 } // Offset personalizado (opcional)
}
```

### Modificar Colores de Fondo
Los colores de gradiente se controlan con `highlightColor`:
- `'from-blue-600 to-purple-600'`
- `'from-green-500 to-emerald-600'`
- `'from-orange-500 to-amber-600'`
- etc.

### Ajustar Posicionamiento
En `calculateTooltipPosition()`:
- Modificar valores de offset (actualmente +20 / -20 píxeles)
- Cambiar el ancho del tooltip (400px por defecto)
- Ajustar la altura del cálculo vertical (150px por defecto)

## 🚀 Próximos Pasos

### Detección de Primera Sesión (Pendiente)
```tsx
useEffect(() => {
    // Cuando esté disponible el endpoint
    const checkFirstLogin = async () => {
        const response = await userService.checkFirstLogin();
        if (response.isFirstLogin) {
            setIsTutorialOpen(true);
        }
    };
    checkFirstLogin();
}, []);
```

### Guardado de Progreso (Opcional)
```tsx
// Guardar el paso actual en localStorage
localStorage.setItem('tutorialStep', currentStep.toString());

// Recuperar al reabrir
const savedStep = localStorage.getItem('tutorialStep');
setCurrentStep(savedStep ? parseInt(savedStep) : 0);
```

## 📝 Notas Importantes

1. **z-index Management**: El tutorial usa z-index 60-70 para aparecer sobre todo
2. **Elemento no encontrado**: Si el selector CSS no encuentra el elemento, la tarjeta se posiciona en modo fijo
3. **Responsive**: Las posiciones se calculan dinámicamente, funcionando en diferentes tamaños de pantalla
4. **Cleanup**: El `useEffect` limpia las clases y estilos al cambiar de paso

## 🐛 Troubleshooting

**Problema:** El elemento no se destaca
- Verificar que la clase CSS existe en el componente
- Comprobar que el selector en `targetSelector` es correcto
- Revisar la consola del navegador para errores

**Problema:** La tarjeta aparece en posición incorrecta
- Ajustar valores de offset en el paso específico
- Modificar `calculateTooltipPosition()` para ese caso de uso
- Verificar que el elemento objetivo tiene dimensiones calculables

**Problema:** La flecha no apunta correctamente
- Cambiar `arrowDirection` al valor correcto ('up', 'down', 'left', 'right')
- Ajustar `getArrowPosition()` para posiciones personalizadas
