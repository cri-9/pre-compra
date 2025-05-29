# Aplicación de Pre-Compra

## Instrucciones de Configuración

### Configuración del Frontend
1. Copiar `.env.example` a `.env`:
```bash
cp .env.example .env
```

2. Instalar dependencias:
```bash
npm install
```

3. Iniciar el servidor de desarrollo:
```bash
npm run dev
```

### Configuración del Backend
1. Copiar `Backend/.env.example` a `Backend/.env`:
```bash
cp Backend/.env.example Backend/.env
```

2. Configurar los ajustes de la base de datos en `Backend/.env`

3. Configurar las credenciales de WebPay en `Backend/.env`

4. Asegurarse de que XAMPP esté ejecutándose (Apache y MySQL)

## Mejoras Recientes

### Frontend
- Configuración de entorno añadida para las URL de la API
- Gestión de errores mejorada para las solicitudes de red
- Estados de carga y validación de entrada añadidos
- Mejora de la respuesta del usuario con las notificaciones de Snackbar
- Redirección automática añadida tras el envío correcto del formulario
- Corrección de llamadas duplicadas al estado de carga
- Gestión adecuada de los códigos de estado HTTP

### Backend
- Compatibilidad con variables de entorno añadida
- Gestión y registro de errores mejorados
- Saneamiento de entrada añadido
- Compatibilidad con transacciones de base de datos añadida
- Eliminación de la salida de depuración de la gestión de conexiones
- Códigos de estado HTTP adecuados añadidos
- Encabezados de seguridad añadidos
- Validación para formatos de correo electrónico y teléfono añadidos

### Integración con WebPay
- Credenciales movidas a variables de entorno
- Gestión de errores adecuada añadida
- Validación del token de sesión añadida
- Saneamiento de los datos de pago añadidos

## Estructura del proyecto


```
pre-compra/
├── src/
│   ├── components/      # React components
│   ├── assets/         # Static assets
│   ├── types/          # TypeScript type definitions
│   └── config/         # Environment configuration
├── Backend/
│   ├── conexionBD.php  # Database connection
│   ├── webpay.php      # WebPay integration
│   └── agendarTransferencia.php  # Booking endpoint
└── public/             # Public assets
```

## Variables de entorno

### Frontend (.env)
- `VITE_API_URL`: URL de la API del backend
- `VITE_WEBPAY_ENABLED`: Habilitar/deshabilitar la integración con WebPay
- `VITE_ENV`: Entorno (desarrollo/producción)

### Backend (.env)
- `DB_HOST`: Host de la base de datos
- `DB_NAME`: Nombre de la base de datos
- `DB_USER`: Usuario de la base de datos
- `DB_PASS`: Contraseña de la base de datos
- `WEBPAY_COMMERCE_CODE`: Código de comercio de WebPay
- `WEBPAY_API_KEY`: Clave de la API de WebPay
- `WEBPAY_ENVIRONMENT`: Entorno de WebPay (integración/producción)
- `APP_ENV`: Entorno de la aplicación
- `APP_URL`: URL de la aplicación

## Mejoras de seguridad
- Se ha añadido la limpieza de entradas para todas las entradas de usuario
- Se han trasladado las credenciales confidenciales al entorno Variables
- Se agregó un manejo adecuado de errores para evitar la fuga de información
- Se agregó validación para formatos de correo electrónico y teléfono
- Se agregó compatibilidad con transacciones de base de datos para la integridad de los datos
- Se agregó validación de token de sesión para transacciones de WebPay

## Manejo de errores
- Se agregaron códigos de estado HTTP correctos
- Mensajes de error mejorados para una mejor respuesta del usuario
- Se agregó registro para errores de backend
- Se agregó validación para campos obligatorios
- Se agregó manejo de errores de red

## Mejoras futuras
1. Agregar límite de velocidad para endpoints de API
2. Implementar almacenamiento en caché de solicitudes
3. Agregar pruebas automatizadas
4. Agregar pipeline de CI/CD
5. Implementar un sistema de monitoreo y registro
6. Agregar un sistema de respaldo de datos
7. Implementar autenticación de usuarios
8. Agregar panel de administración
