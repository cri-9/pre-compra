# Mejores Prácticas - Manejo de Props Error en Material-UI

## 🐛 Problema Resuelto
**Error**: `Invalid prop error of type string supplied to ForwardRef(FormControl2), expected boolean`

## ✅ Solución
Los props `error` en componentes de Material-UI (TextField, FormControl, etc.) deben ser **boolean**, no string.

### ❌ Incorrecto:
```jsx
// Cuando rutError es string, esto puede devolver string
error={touched.rut && (!rut || rutError)}
```

### ✅ Correcto:
```jsx
// Usar !! para convertir a boolean
error={touched.rut && (!rut || !!rutError)}
```

## 📋 Patrones Correctos

### Para validaciones simples:
```jsx
error={touched.campo && !campo}  // boolean
error={touched.email && !email} // boolean
```

### Para validaciones con mensajes de error:
```jsx
error={!!errorMessage}           // string -> boolean
error={touched.campo && !!errorString} // string -> boolean
```

### Para validaciones complejas:
```jsx
error={touched.email && (!email || !/regex/.test(email))} // boolean
```

## 🔧 Componentes Corregidos
- ✅ `DatosCliente.jsx` - Línea 275: `error={touched.rut && (!rut || !!rutError)}`
- ✅ `Pago.jsx` - Ya usa `error={!!errorNombre}`
- ✅ `Cotizacion.jsx` - Ya usa `error={!!errores.campo}`
- ✅ `DatosVehiculo.jsx` - Ya usa `error={!!patenteError}`

## 🚨 Verificar Siempre
Cuando uses props `error` en Material-UI:
1. Asegúrate de que sea boolean
2. Usa `!!` para convertir strings a boolean
3. Prueba en desarrollo para detectar warnings temprano

## 🧪 Herramientas de Debugging
- Console del navegador muestra estos warnings
- ESLint puede configurarse para detectar estos problemas
- TypeScript ayuda a prevenir estos errores de tipo
