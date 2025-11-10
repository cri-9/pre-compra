# 📊 Diagrama Visual de la Solución del Menú de Servicios

## ANTES vs DESPUÉS

### ❌ ANTES (Problema)
```
┌─────────────────────────────────────────┐
│           APP BAR (z-index: ~1130)      │
│  Logo     Inicio  Quiénes  Servicios[]  │
│                                         │
│  [MENÚ DENTRO DEL APPBAR - CORTADO]    │  ← Overflow: hidden lo corta
│   Service TPMS (no se ve bien)         │
│   Regeneración DPF (no se ve bien)     │
└─────────────────────────────────────────┘
    ↓ (Aquí debería estar el menú flotante)
┌─────────────────────────────────────────┐
│     HERO/IMAGEN PRINCIPAL                │
│                                         │
│  [MENÚ PODRÍA ESTAR DETRÁS]            │  ← Z-index insuficiente
└─────────────────────────────────────────┘
```

### ✅ DESPUÉS (Solución)
```
┌──────────────────────────────────────────────┐
│              APP BAR (z-index: 1100)         │
│  Logo    Inicio  Quiénes  Servicios[]        │
└──────────────────────────────────────────────┘
         ▼ (menú flotante en document.body)
    ┌─────────────────────┐
    │    MENÚ FLOTANTE    │  ← Renderizado en body
    │  (z-index: 10000)   │  ← Por encima de todo
    │                     │
    │ 🔧 Servicio TPMS    │
    │ 💨 Regeneración DPF │
    │                     │
    └─────────────────────┘
         ▼
┌──────────────────────────────────────────────┐
│         HERO/IMAGEN PRINCIPAL                │
│                                              │
│    (Contenido detrás del menú flotante)     │
└──────────────────────────────────────────────┘
```

## 🏗️ Arquitectura de Z-Index

### Jerarquía de Capas (de abajo a arriba)

```
Z-INDEX ACTUAL DESPUÉS DE SOLUCIÓN:

10000  ┌─────────────────────────────┐
       │     MENÚ DE SERVICIOS       │  ← Siempre visible, por encima de todo
       │   (Popper + Paper + Items)  │
───────├─────────────────────────────┤
 9999  │     BACKDROP (si existe)    │
───────├─────────────────────────────┤
 1130  │         APP BAR             │  ← Sticky header
       │  (z-index.appBar + 50)      │
───────├─────────────────────────────┤
  100  │   Servicios Container Box   │  ← Contenedor local
───────├─────────────────────────────┤
    1  │    CONTENIDO PRINCIPAL      │  ← Hero, imágenes, secciones
       │  (LandingPage, TPMS, DPF)   │
───────┴─────────────────────────────┘
```

## 🎯 Flujo de Renderización

### ANTES (Problema: DOM anidado)
```
<body>
  ├── #root
      ├── <Router>
          ├── <LandingPage/>
              ├── <Navbar/>
                  ├── <AppBar>
                      ├── <Toolbar>
                          ├── <Box> (servicios-container)
                              ├── <Button>Servicios</Button>
                              └── <Menu>  ← AQUÍ DENTRO DEL APPBAR
                                  ├── <MenuItem>TPMS</MenuItem>
                                  └── <MenuItem>DPF</MenuItem>  ✗ Cortado por overflow
                      └── ... otros elementos
                  └── ...
              ├── <HeroSection>
              ├── <Box>Contenido</Box>
              └── ...
```

### DESPUÉS (Solución: DOM flotante)
```
<body>
  ├── #root
      ├── <Router>
          ├── <LandingPage/>
              ├── <Navbar/>
                  ├── <AppBar>
                      ├── <Toolbar>
                          ├── <Box class="servicios-container">
                              ├── <Button id="servicios-button">Servicios</Button>
                              └── (Menu renderizado en otro lugar)
                      └── ... otros elementos
                  └── ...
              ├── <HeroSection>
              ├── <Box>Contenido</Box>
              └── ...
  ├── <Popper id="servicios-menu" container={document.body}>  ← AQUÍ EN BODY
      ├── <Paper (elevation 3)>
          ├── <MenuItem>
          │   ├── <img> (TPMS icon)
          │   └── Servicio TPMS
          ├── <MenuItem>
          │   ├── <img> (DPF icon)
          │   └── Regeneración DPF
          └── ...
      └── </Paper>
  └── ...
```

## 🔌 Puntos Clave de Implementación

### 1️⃣ Container Inicialización (useEffect)
```jsx
const [menuContainer, setMenuContainer] = useState(undefined);

useEffect(() => {
  if (typeof document !== 'undefined') {
    setMenuContainer(document.body);  ← Disponible después del montaje
  }
}, []);
```
**Por qué**: En SSR/desarrollo, `document` podría no estar disponible en primer render.

### 2️⃣ Anchor & Transform Origin
```jsx
anchorOrigin={{
  vertical: 'bottom',      ← Punto de anclaje debajo del botón
  horizontal: 'center',
}}
transformOrigin={{
  vertical: 'top',        ← Punto de transformación desde la parte superior
  horizontal: 'center',
}}
```
**Resultado**: El menú se abre desde arriba hacia abajo, centrado.

### 3️⃣ Z-Index Escalado
```jsx
sx={{
  zIndex: 10000,  ← Suficientemente alto para estar por encima de
  '& .MuiPopover-paper': {
    zIndex: 10000,  ← Se asegura que incluso el paper está alto
  }
}}
```
**Por qué**: `theme.zIndex.modal` (~1300) no es suficiente. 10000 garantiza precedencia.

### 4️⃣ Propiedades de Focus
```jsx
disableScrollLock         ← No bloquea el scroll de la página
disableEnforceFocus       ← Permite interacción fuera del menú
disableAutoFocus          ← No enfoca automáticamente al abrir
disableRestoreFocus       ← No restaura el focus anterior al cerrar
```
**UX Mejorada**: Mejor experiencia de usuario, menú más intuitivo.

### 5️⃣ Mouse Behavior
```jsx
MenuListProps={{ 
  'aria-labelledby': 'servicios-button',
  onMouseLeave: handleServiciosClose  ← Cierra al salir del menú
}}
```
**UX Mejorada**: Cierre automático sin necesidad de click, muy natural.

## 📐 Espaciado y Dimensiones

```
┌─────────────────────────────────┐
│  NAVBAR (64px de altura)        │
│  Botón "Servicios"              │
└─────────────────────────────────┘
    ↓ mt: 1.5 (=12px)
  ┌────────────────────────┐
  │ MENÚ DESPLEGABLE       │  ← minWidth: 220px
  │                        │  ← py: 1 (=8px arriba/abajo)
  │  🔧 Servicio TPMS      │  ← py: 2, px: 3 (item)
  │                        │  ← gap: 1 (8px entre icon y texto)
  │  💨 Regeneración DPF   │
  │                        │
  └────────────────────────┘
    ↓ (contenido detrás a z-index: 1)
  ┌────────────────────────┐
  │ HERO / IMAGEN          │
  │                        │
  │ (TPMS o DPF Page)      │
  └────────────────────────┘
```

## 🎨 Colores y Estilos

```
Menú Paper:
  backgroundColor: #f9f6fc (muy claro, casi blanco con tono púrpura)
  border: 1px solid rgba(123, 31, 162, 0.12) (sutil)
  boxShadow: 0 12px 30px rgba(0, 0, 0, 0.18) (sombra suave)
  borderRadius: 12px

MenuItem Estados:
  Normal: transparent background
  Hover: #EDE7F6 (fondo púrpura muy claro)
  
Texto:
  color: #7B1FA2 (púrpura principal)
  fontWeight: 500 (semi-bold)
  fontSize: 0.9rem
```

## ✅ Checklist de Validación

```
DESKTOP:
✅ Hacer click en "Servicios" → menú abre
✅ Menú aparece centrado bajo el botón
✅ Hay separación visual (no pegado)
✅ Iconos se muestran correctamente
✅ Textos legibles ("Servicio TPMS", "Regeneración DPF")
✅ Hover cambia color a púrpura claro
✅ Click navega a /tpms o /dpf
✅ Pasar mouse fuera del menú lo cierra
✅ El menú está por encima del contenido hero
✅ No hay scroll horizontal adicional

TABLET (768px - 1024px):
✅ Mismo comportamiento que desktop
✅ Responsive width
✅ Touch friendly

MOBILE (< 768px):
✅ En mobile usa Collapse, no Menu
✅ No afecta el comportamiento móvil existente

NAVEGACIÓN:
✅ En landing: Servicios → Menu
✅ En TPMS: Servicios → Menu (mismo menú)
✅ En DPF: Servicios → Menu (mismo menú)
✅ Links funcionan correctamente
```

## 📌 Comparativa de Cambios

| Propiedad | Antes | Después | Impacto |
|-----------|-------|---------|---------|
| `container` | No especificado | `document.body` | Renderización flotante |
| `mt` en paper | `0.5` | `1.5` | Mejor separación |
| `zIndex` | `theme.zIndex.modal + 100` (~1400) | `10000` | Siempre visible |
| `anchorOrigin` | Existía | Mejorado | Posición exacta |
| `transformOrigin` | Existía | Mejorado | Alineación perfecta |
| `disableEnforceFocus` | N/A | `true` | Mejor UX |
| `onMouseLeave` | N/A | Agregado | UX más natural |
| CSS override | Global | Específico en Navbar.css | Precedencia garantizada |
| Archivo CSS | N/A | Navbar.css (nuevo) | Mantenibilidad |

---

**Conclusión**: La solución cambia la renderización del menú del flujo normal del DOM a una renderización flotante en `document.body` con z-index suficiente, permitiendo que aparezca correctamente bajo el botón sin ser cortado o ocultado.
