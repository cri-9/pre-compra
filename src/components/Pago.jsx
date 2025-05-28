import React, { useState } from "react";
import axios from "axios";
import { Card,
  CardContent,
  Typography,
  Box,
  TextField,
  Button,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Divider,
  CircularProgress,
  Alert,
  Snackbar } from "@mui/material";
  import CheckIcon from '@mui/icons-material/Check';
  import PaymentIcon from '@mui/icons-material/Payment';
  import LocalAtmIcon from '@mui/icons-material/LocalAtm';
  import AccountBalanceIcon from '@mui/icons-material/AccountBalance';

  

const Pago = ({ datos, onChange, iniciarWebPay, loading, nombreServicio, datosCliente = {}, onGoToAgendamiento }) => {
    // --- Recargo por comuna en Región IX ---
    const comunasConRecargo = [
      "Pucon", "Villarrica", "Galvarino", "Victoria", "Nueva Imperial", "Gorbea"
    ];
    // Se usa la región y comuna del vendedor (donde está el auto)
    // Determina la comuna y región del vendedor (donde está el auto)
    const regionVendedor = datos.vendedor?.region || datos.datosVendedor?.region;
    const comunaVendedor = datos.vendedor?.comuna || datos.datosVendedor?.comuna;
    const aplicarRecargo = regionVendedor === "IX" && comunasConRecargo.includes(comunaVendedor);

    console.log('Pago datosCliente prop:', datosCliente);
    const [codigoDescuento, setCodigoDescuento] = useState('');
    const [descuentoAplicado, setDescuentoAplicado] = useState(false);
    // Calcular monto base (con descuento si aplica)
    const montoBase = datos.montoConDescuento != null ? datos.montoConDescuento : datos.monto || 0;
    // Sumar recargo si corresponde
    const montoFinal = montoBase + (aplicarRecargo ? 15000 : 0);
    const [errorDescuento, setErrorDescuento] = useState('');
    const [procesando, setProcesando] = useState(false);
    const [errorNombre, setErrorNombre] = useState('');
    const [errorTelefono, setErrorTelefono] = useState('');
    const [autoDateMsg, setAutoDateMsg] = useState('');
  
    // Manejar cambio en el método de pago
    const handleMetodoPagoChange = (event) => {
      onChange({ ...datos, metodo: event.target.value });
    };

    // Manejar cambio en el nombre
    const handleNombreChange = (event) => {
      const nombre = event.target.value;
      try {
        if (nombre) {
          validarNombre(nombre);
          setErrorNombre('');
        } else {
          setErrorNombre('');
        }
        onChange({ ...datos, nombre });
      } catch (error) {
        setErrorNombre(error.message);
      }
    };
  
    // Aplicar código de descuento
    const aplicarDescuento = () => {
      if (codigoDescuento === 'DESC10') {
        const nuevoMonto = Math.round(datos.monto * 0.9); // 10% de descuento
        setDescuentoAplicado(true);
        setErrorDescuento('');
        // El recargo se suma automáticamente en el render
        onChange({ ...datos, codigoDescuento, montoConDescuento: nuevoMonto });
      } else {
        setErrorDescuento('Código de descuento inválido');
        setDescuentoAplicado(false);
        onChange({ ...datos, codigoDescuento: '', montoConDescuento: null });
      }
    };

  
    // Formatear precio como CLP
    const formatearPrecio = (precio) => {
      return new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP',
        maximumFractionDigits: 0,
      }).format(precio);
    };
  
    // Validar nombre
    const validarNombre = (nombre) => {
      if (!nombre || nombre.trim().length < 3) {
        throw new Error("El nombre debe tener al menos 3 caracteres");
      }
      if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(nombre)) {
        throw new Error("El nombre solo puede contener letras y espacios");
      }
      return true;
    };

    // Validar teléfono chileno (9 dígitos, comienza con 9)
    const validarTelefonoChileno = (telefono) => {
      if (!telefono) return false;
      // Elimina todo lo que no sea número
      const soloNumeros = telefono.replace(/\D/g, '');
      // Quita el prefijo de país si está presente
      const sinPrefijo = soloNumeros.startsWith('56') ? soloNumeros.slice(2) : soloNumeros;
      // Valida que sean 9 dígitos y que comiencen con 9
      return /^9\d{8}$/.test(sinPrefijo);
    };

    // Formatear teléfono para almacenamiento (solo los 9 dígitos)
    const formatearTelefono = (telefono) => {
      if (!telefono) return '';
      // Elimina todo lo que no sea número
      const soloNumeros = telefono.replace(/\D/g, '');
      // Toma siempre los últimos 9 dígitos
      return soloNumeros.slice(-9);
    };

    // Manejar pago con transferencia
    const handleTransferencia = async () => {
      try {
        setProcesando(true);

        console.log('Validating datosCliente in handleTransferencia:', datosCliente);

        if (!datosCliente || Object.keys(datosCliente).length === 0) {
          throw new Error("Los datos del cliente no están completos. Por favor complete la información del cliente.");
        }
        
        // Validar campos requeridos
        const camposFaltantes = [];
        if (!datos.email) camposFaltantes.push("Email");
        if (!datos.nombre) camposFaltantes.push("Nombre completo");
        if (!datos.telefono) camposFaltantes.push("Teléfono móvil");
        if (!datos.metodo) camposFaltantes.push("Método de pago");

        // Validar campos de dirección en datosCliente
        if (!datosCliente.direccion) camposFaltantes.push("Dirección");
        if (!datosCliente.region) camposFaltantes.push("Región");
        if (!datosCliente.comuna) camposFaltantes.push("Comuna");
        
        if (camposFaltantes.length > 0) {
          throw new Error(`Por favor complete los siguientes campos: ${camposFaltantes.join(", ")}`);
        }

        // Validar formato de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(datos.email)) {
          throw new Error("Por favor ingrese un email válido");
        }

        // Validar el nombre antes de enviar
        try {
          validarNombre(datos.nombre);
        } catch (error) {
          throw new Error(`Error en el nombre: ${error.message}`);
        }
        
        // Validar teléfono chileno
        if (!validarTelefonoChileno(datos.telefono)) {
          throw new Error("Por favor ingrese un número de teléfono móvil chileno válido (9 dígitos comenzando con 9)");
        }
        
        // Formatear el teléfono para asegurar formato correcto
        const telefonoFormateado = formatearTelefono(datos.telefono);
    
        // Validar que el monto corresponda al servicio seleccionado
        const precios_servicios = {
          'Servicio Básico': 30000,
          'Servicio Semi Full': 45000,
          'Servicio Full': 65000
        };

        const servicioSeleccionado = datos.nombreServicio || nombreServicio;
        const montoBaseServicio = precios_servicios[servicioSeleccionado];

        if (!montoBaseServicio) {
          throw new Error(`Servicio no válido: ${servicioSeleccionado}`);
        }

        const valorRecargo = aplicarRecargo ? 15000 : 0;
        const montoBaseEnvio = datos.montoConDescuento != null ? datos.montoConDescuento : montoBaseServicio;
        const valorDescuento = (datos.codigoDescuento === 'DESC10') ? Math.round(montoBaseServicio * 0.1) : 0;
        const montoBase = montoBaseServicio;
        const total = montoBase + valorRecargo - valorDescuento;

        const datosTransferencia = {
          email: datos.email,
          nombre: datos.nombre,
          telefono: telefonoFormateado,
          direccion: datosCliente?.direccion || '',
          region: datosCliente?.region || '',
          comuna: datosCliente?.comuna || '',
          metodoPago: 'Transferencia',
          servicio: servicioSeleccionado,
          monto: montoBase, // solo el monto base del servicio
          montoBase: montoBase, // <-- Agregado para el backend
          recargo: valorRecargo,
          descuento: valorDescuento,
          total: total,
          codigoDescuento: datos.codigoDescuento || ''
        };

        console.log('Datos de dirección:', {
          direccion: datosCliente?.direccion,
          region: datosCliente?.region,
          comuna: datosCliente?.comuna
        });
    
        console.log('Enviando datos al servidor:', datosTransferencia);
        
        try {
          const response = await axios.post(
            "http://localhost/pre-compra/Backend/notificarTransferencia.php",
            datosTransferencia,
            {
              headers: {
                'Content-Type': 'application/json',
              },
              timeout: 10000 // 10 segundos de timeout
            }
          );

          console.log('Respuesta del servidor:', response.data);

          // Si la transferencia fue exitosa, redirigir a la landing page principal
          if (response.data.success) {
            window.location.href = '/gracias.html';
            return;
          }

          // Si hay un error general del backend
          if (response.data.error) {
            throw new Error(response.data.error);
          }

          // Si llegamos aquí, algo inesperado ocurrió
          throw new Error("Error inesperado al procesar la solicitud");

        } catch (axiosError) {
          // Manejo de errores de red y otros
          console.error("Error en la petición axios:", axiosError);
          if (axiosError.code === 'ECONNABORTED') {
            alert("La conexión con el servidor ha tardado demasiado. Por favor intente nuevamente.");
            return;
          }
          if (!axiosError.response) {
            alert(`No se pudo conectar con el servidor. Detalle: ${axiosError.message}`);
            return;
          }
          // Mostrar mensaje de error del backend si existe
          alert(`Error del servidor: ${axiosError.response?.data?.error || axiosError.message}`);
        } finally {
          setProcesando(false);
        }
      } catch (error) {
        // Mostrar detalles del error en consola para debug
        console.error("Error completo:", error);
        console.error("Mensaje de error:", error.message);
        if (error.response) {
          console.error("Datos de la respuesta de error:", error.response.data);
        }
        alert(error.message);
      } finally {
        setProcesando(false);
      }
    };

    // Manejar pago con WebPay usando fetch/axios
    const handleWebPay = async () => {
      setProcesando(true);
      try {
        // Inicializar variables por si no existen
        const datosAgendamiento = {
          ...datos.datosAgendamiento,
          bloque: datos.bloque || (datos.datosAgendamiento && datos.datosAgendamiento.bloque),
          fecha: datos.fecha || (datos.datosAgendamiento && datos.datosAgendamiento.fecha) || ''
        };
        const datosVehiculo = datos.datosVehiculo || {};
        const datosVendedor = {
          tipo: "",
          nombre: "",
          telefono: "",
          direccion: "",
          region: "",
          comuna: "",
          ...datos.datosVendedor
        };
        // Debug: mostrar datos del vendedor antes de validar
        console.log('Datos del vendedor para validación:', datosVendedor);
        // Si todos los campos están vacíos, advertir y salir
        if (
          !datos.datosVendedor ||
          Object.values(datosVendedor).every(v => !v || !String(v).trim())
        ) {
          alert('Error: No se están recibiendo los datos del vendedor. Verifica que el componente padre esté enviando correctamente los datos.');
          setProcesando(false);
          return;
        }
        // Validar datos requeridos antes de enviar
        const camposFaltantes = [];
        if (!datos.email) camposFaltantes.push("Email");
        if (!datos.nombre) camposFaltantes.push("Nombre completo");
        if (!datos.telefono) camposFaltantes.push("Teléfono móvil");
        if (!datos.metodo) camposFaltantes.push("Método de pago");
        // Validar datos del vendedor (deben ser string no vacíos)
        if (!datosVendedor.tipo || typeof datosVendedor.tipo !== "string" || !datosVendedor.tipo.trim()) camposFaltantes.push("Tipo de vendedor");
        if (!datosVendedor.nombre || typeof datosVendedor.nombre !== "string" || !datosVendedor.nombre.trim()) camposFaltantes.push("Nombre del vendedor");
        if (!datosVendedor.telefono || typeof datosVendedor.telefono !== "string" || !datosVendedor.telefono.trim()) camposFaltantes.push("Teléfono del vendedor");
        if (!datosVendedor.direccion || typeof datosVendedor.direccion !== "string" || !datosVendedor.direccion.trim()) camposFaltantes.push("Dirección del vendedor");
        if (!datosVendedor.region || typeof datosVendedor.region !== "string" || !datosVendedor.region.trim()) camposFaltantes.push("Región del vendedor");
        if (!datosVendedor.comuna || typeof datosVendedor.comuna !== "string" || !datosVendedor.comuna.trim()) camposFaltantes.push("Comuna del vendedor");
        if (camposFaltantes.length > 0) {
          alert('Por favor completa los siguientes campos obligatorios antes de pagar:\n' + camposFaltantes.join(', '));
          setProcesando(false);
          return;
        }
        // Validar formato de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(datos.email)) {
          throw new Error("Por favor ingrese un email válido");
        }

        // Validar el nombre antes de enviar
        try {
          validarNombre(datos.nombre);
        } catch (error) {
          throw new Error(`Error en el nombre: ${error.message}`);
        }
        
        // Validar teléfono chileno
        if (!validarTelefonoChileno(datos.telefono)) {
          throw new Error("Por favor ingrese un número de teléfono móvil chileno válido (9 dígitos comenzando con 9)");
        }
        
        // Formatear el teléfono para asegurar formato correcto
        const telefonoFormateado = formatearTelefono(datos.telefono);
    
        // Validar que el monto corresponda al servicio seleccionado
        const precios_servicios = {
          'Servicio Básico': 30000,
          'Servicio Semi Full': 45000,
          'Servicio Full': 65000
        };

        const servicioSeleccionado = datos.nombreServicio || nombreServicio;
        const montoServicio = precios_servicios[servicioSeleccionado];

        if (!montoServicio) {
          throw new Error(`Servicio no válido: ${servicioSeleccionado}`);
        }
        
        // Aplicar descuento si corresponde
        const valorRecargo = aplicarRecargo ? 15000 : 0;
        const montoBaseEnvio = datos.montoConDescuento != null ? datos.montoConDescuento : montoServicio;
        

        const datosParaWebpay = {
          cliente: {
            ...datosCliente,
            nombre: datos.nombre,
            email: datos.email,
            telefono: datos.telefono,
            direccion: datosCliente.direccion,
            region: datosCliente.region,
            comuna: datosCliente.comuna,
          },
          agendamiento: {
            ...datosAgendamiento,
            bloque: datos.bloque || datosAgendamiento.bloque, // <-- Asegura que bloque esté presente
            fecha: datosAgendamiento.fecha || '', // <-- Agrega la fecha explícitamente
            horario: datos.horario || datosAgendamiento.horario || '', // <-- Asegura que horario esté presente
            hora_inicio: datosAgendamiento.hora_inicio || '',
            hora_fin: datosAgendamiento.hora_fin || ''
          },
          vehiculo: datosVehiculo,
          vendedor: datosVendedor,
          pago: {
            metodo: datos.metodo,
            monto: montoFinal,
            montoBase: montoBaseEnvio,
            recargo: valorRecargo,
            nombreServicio: datos.nombreServicio,
            codigoDescuento: datos.codigoDescuento || ''
          }
        };

        // Corregir/agregar fecha si está vacía
        if (
          !datosParaWebpay.agendamiento.fecha ||
          datosParaWebpay.agendamiento.fecha.trim() === ''
        ) {
          datosParaWebpay.agendamiento.fecha = new Date().toISOString().split("T")[0];
          console.warn('La fecha del agendamiento estaba vacía, se corrigió automáticamente a:', datosParaWebpay.agendamiento.fecha);
          setAutoDateMsg(`La fecha estaba vacía y fue corregida automáticamente a ${new Date().toLocaleDateString()} antes de continuar con el pago.`);
        }

        // Verificar que el bloque esté presente
        if (!datosParaWebpay.agendamiento.bloque || datosParaWebpay.agendamiento.bloque.trim() === '') {
          throw new Error("El bloque horario es obligatorio para continuar con el pago");
        }

        // Log para depuración: revisa en consola la estructura final
        console.log("Datos enviados a webpay.php:", datosParaWebpay);
        
        
        // Enviar datos a webpay.php para crear la transacción
        const response = await fetch('http://localhost/pre-compra/Backend/webpay.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(datosParaWebpay),
        });

        if (!response.ok) {
          const errorData = await response.json();
          
          // Manejo del error 422 (validación de fecha y bloque)
          if (response.status === 422) {
            alert(errorData.message || 'Faltan campos requeridos (fecha o bloque)');
          } else {
            // Otros errores
            alert(errorData.error || errorData.message || 'Error al procesar el pago.');
          }
          return; // Detener el flujo en caso de error
        }

        const data = await response.json();
        if (data.success && data.url && data.token) {
          // Redirigir a la URL de Webpay con el token
          window.location.href = `${data.url}?token_ws=${data.token}`;
        } else {
          alert(data.error || data.message || 'No se pudo iniciar el pago con WebPay.');
        }
      } catch (error) {
        // Mostrar mensaje de error real si existe
        if (error && error.message) {
          alert(`Error al procesar el pago online: ${error.message}`);
        } else {
          alert('Error al procesar el pago online.');
        }
      } finally {
        setProcesando(false);
      }
    };

    return (
      <>
        <Snackbar
  open={!!autoDateMsg}
  autoHideDuration={5000}
  onClose={() => setAutoDateMsg('')}
  anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
>
  <Alert onClose={() => setAutoDateMsg('')} severity="info" sx={{ width: '100%' }}>
    {autoDateMsg}
  </Alert>
</Snackbar>
        
        <Card
          elevation={3}
          sx={{
            borderRadius: 3,
            p: 2,
            mt: 2,
            backgroundColor: '#f7f7f7',
          }}
        >
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
            Detalles de Pago
          </Typography>
  
          {/* Resumen del Servicio Seleccionado */}
          <Box sx={{ mb: 4, p: 2, backgroundColor: '#e8f4fc', borderRadius: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 3 }}>
              Servicio seleccionado: {nombreServicio}
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              Valor del servicio: {formatearPrecio(datos.monto)}
            </Typography>
            {descuentoAplicado && (
              <Typography variant="body1" sx={{ mb: 1, color: '#388e3c', fontWeight: 'bold' }}>
                Descuento aplicado: -{formatearPrecio(datos.monto - montoFinal + (aplicarRecargo ? 15000 : 0))}
              </Typography>
            )}
            {aplicarRecargo && (
              <Typography variant="body1" sx={{ mb: 1, color: '#D35400', fontWeight: 'bold' }}>
                Recargo por comuna: +{formatearPrecio(15000)}
              </Typography>
            )}
            <Divider sx={{ my: 1 }} />
            <Typography variant="h6" sx={{ mt: 2 }}>
              Total a pagar: {formatearPrecio(montoFinal)}
            </Typography>
          </Box>
  
          {/* Código de Descuento */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle1" gutterBottom>
              ¿Tienes un código de descuento?
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                placeholder="Ingresa tu código"
                value={codigoDescuento}
                onChange={(e) => setCodigoDescuento(e.target.value)}
                disabled={descuentoAplicado}
              />
              <Button
                variant="contained"
                color="secondary"
                onClick={aplicarDescuento}
                disabled={descuentoAplicado}
              >
                Aplicar
              </Button>
            </Box>
            {errorDescuento && (
              <Alert severity="error" sx={{ mt: 1 }}>
                {errorDescuento}
              </Alert>
            )}
            {descuentoAplicado && (
              <Alert severity="success" sx={{ mt: 1 }}>
                ¡Descuento aplicado correctamente!
              </Alert>
            )}
          </Box> 
          
          {/* Alerta de recargo */}
          {aplicarRecargo && (
            <Alert severity="info" sx={{ my: 2 }}>
              Se aplicará un recargo de $15.000 por la comuna seleccionada.
            </Alert>
          )}         
          
          <Divider sx={{ my: 3 }} />

          {/* Campo de Nombre */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Nombre completo:
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              value={datos.nombre || ''}
              onChange={handleNombreChange}
              error={!!errorNombre}
              helperText={errorNombre}
              placeholder="Ingresa tu nombre completo"
            />
          </Box>

          {/* Campo de Teléfono */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Teléfono móvil:
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              value={datos.telefono || ''}
              onChange={(e) => {
                const telefono = e.target.value;
                onChange({ ...datos, telefono });
                
                // Validación en tiempo real
                if (telefono) {
                  if (!validarTelefonoChileno(telefono)) {
                    setErrorTelefono("Ingrese un número móvil chileno válido (9 dígitos comenzando con 9)");
                  } else {
                    setErrorTelefono("");
                  }
                } else {
                  setErrorTelefono("");
                }
              }}
              error={!!errorTelefono}
              helperText={errorTelefono || "Formatos aceptados: 912345678, +56912345678 o 56912345678"}
              placeholder="Ej: 912345678"
              inputProps={{
                maxLength: 15,
              }}
            />
          </Box>
  
          {/* Método de Pago */}
          <FormControl component="fieldset" sx={{ mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Selecciona un método de pago:
            </Typography>
            <RadioGroup
              name="metodo-pago"
              value={datos.metodo || ''}
              onChange={handleMetodoPagoChange}
            >
              {/* Metodo de WebPay */}
              <FormControlLabel
                value="webpay"
                control={<Radio />}
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PaymentIcon sx={{ fontSize: 22, color: '#7B1FA2' }} /> 
                <Typography sx={{ fontWeight: 500 }}>
                  WebPay (pago online)
                  </Typography>
                  </Box>
                }
              />
             
              <FormControlLabel
                value="transferencia"
                control={<Radio />}
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AccountBalanceIcon /> Pagar con transferencia electrónica
                  </Box>
                }
              />
            </RadioGroup>
          </FormControl>
  
          {/* Botón de pago */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
              width: '100%'
            }}
          >
            {datos.metodo === 'webpay' && (
              <Box sx={{ width: '100%', mb: 2 }}>
                {(!datos.fecha || !datos.bloque) && (
                  <Alert severity="warning" sx={{
                    mb: 2,
                    fontWeight: 'bold',
                    fontSize: 16,
                    letterSpacing: '0.3px',
                    background: '#fffdeb',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2
                  }}>
                    <span style={{ color: "#d89211", fontWeight: 700 }}>
                      ⚠️ Selecciona la <b>fecha</b> y el <b>bloque horario</b> para continuar con el pago.
                    </span>
                    {typeof onGoToAgendamiento === "function" &&
                      <Button
                        color="warning"
                        variant="outlined"
                        size="small"
                        sx={{ ml: 2, fontWeight: 700 }}
                        onClick={onGoToAgendamiento}
                      >
                        Ir a selección
                      </Button>
                    }
                  </Alert>
                )}
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={handleWebPay}
                  disabled={loading || procesando || !datos.fecha || !datos.bloque}
                  sx={{ minWidth: 200, fontSize: 18, fontWeight: 600, boxShadow: 3 }}
                >
                  {loading || procesando ? <CircularProgress size={24} color="inherit" /> : 'Pagar con WebPay'}
                </Button>
              </Box>
            )}          
  
            {datos.metodo === 'transferencia' && (
              <Box sx={{ width: '100%', mb: 2 }}>
                {(!datos.fecha || !datos.bloque) && (
                  <Alert severity="warning" sx={{
                    mb: 2,
                    fontWeight: 'bold',
                    fontSize: 16,
                    letterSpacing: '0.3px',
                    background: '#fffdeb',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2
                  }}>
                    <span style={{ color: "#d89211", fontWeight: 700 }}>
                      ⚠️ Debes seleccionar una <b>fecha</b> y un <b>bloque horario</b> antes de finalizar.
                    </span>
                    {typeof onGoToAgendamiento === "function" &&
                      <Button
                        color="warning"
                        variant="outlined"
                        size="small"
                        sx={{ ml: 2, fontWeight: 700 }}
                        onClick={onGoToAgendamiento}
                      >
                        Ir a selección
                      </Button>
                    }
                  </Alert>
                )}
                <Alert severity="info" sx={{ mt: 2, width: '100%' }}>
                  Un ejecutivo se pondrá en contacto con usted para los datos de esta y así finalizar el
                  agendamiento.
                </Alert>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleTransferencia}
                  disabled={procesando || !datos.fecha || !datos.bloque}
                  sx={{ minWidth: 200, mt: 2, fontSize: 18, fontWeight: 600, boxShadow: 3 }}
                >
                  {procesando ? <CircularProgress size={24} color="inherit" /> : 'Finalizar'}
                </Button>
              </Box>
            )}
          </Box>
        </CardContent>
      </Card>
      </>
    );
  };
  
  export default Pago;


