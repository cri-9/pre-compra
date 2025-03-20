import React, { useState } from 'react';
import DatosVehiculo from './DatosVehiculo';
import DatosCliente from './DatosCliente';
import DatosVendedor from './DatosVendedor';
import FechaAgendamiento from './FechaAgendamiento';
import Pago from './Pago';
import { Typography  } from '@mui/material';  // Importamos el componente Typography de Material-UI

function FormularioContacto() {
  const [pasoActual, setPasoActual] = useState(1);
  const [datos, setDatos] = useState({
    vehiculo: {},
    cliente: {},
    vendedor: {},
    agendamiento: {},
    pago: {},
  });

  const pasos = [
    { id: 1, nombre: "Datos del Vehículo" },
    { id: 2, nombre: "Datos del Cliente" },
    { id: 3, nombre: "Datos del Vendedor" },
    { id: 4, nombre: "Fecha de Agendamiento" },
    { id: 5, nombre: "Pago" },
  ]
  const handleSiguientePaso = () => {
    setPasoActual(pasoActual + 1);
};

const handlePasoAnterior = () => {
    setPasoActual(pasoActual - 1);
};

const handleDatosChange = (seccion, nuevosDatos) => {
    setDatos({ ...datos, [seccion]: nuevosDatos });
};

const getPasoStyle = (pasoId, pasoActual) => {
  const isActive = pasoId === pasoActual;
  return {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      margin: '0 10px',
      color: isActive ? '#000' : '#888',
  };
};

const getCirculoStyle = (pasoId, pasoActual) => {
  const isActive = pasoId === pasoActual;
  return {
      width: '30px',
      height: '30px',
      borderRadius: '50%',
      backgroundColor: isActive ? '#007bff' : '#ddd',
      color: isActive ? '#fff' : '#888',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: '5px',
  };
};

return (
  <div style={{ width: '600px', margin: '20px auto' }}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '30px' }}>
          {pasos.map((paso) => (
              <div key={paso.id} style={getPasoStyle(paso.id, pasoActual)}>
                  <div style={getCirculoStyle(paso.id, pasoActual)}>{paso.id}</div>
                  <div>{paso.nombre}</div>
              </div>
          ))}
      </div>

        {pasoActual === 1 && (
            <DatosVehiculo
                datos={datos.vehiculo}
                onChange={(nuevosDatos) => handleDatosChange('vehiculo', nuevosDatos)}
                onSiguiente={handleSiguientePaso}
            />
        )}
        {pasoActual === 2 && (
            <DatosCliente
                datos={datos.cliente}
                onChange={(nuevosDatos) => handleDatosChange('cliente', nuevosDatos)}
                onSiguiente={handleSiguientePaso}
                onAnterior={handlePasoAnterior}
            />
        )}
        {pasoActual === 3 && (
            <DatosVendedor
                datos={datos.vendedor}
                onChange={(nuevosDatos) => handleDatosChange('vendedor', nuevosDatos)}
                onSiguiente={handleSiguientePaso}
                onAnterior={handlePasoAnterior}
            />
        )}
        {pasoActual === 4 && (
            <FechaAgendamiento
                datos={datos.agendamiento}
                onChange={(nuevosDatos) => handleDatosChange('agendamiento', nuevosDatos)}
                onSiguiente={handleSiguientePaso}
                onAnterior={handlePasoAnterior}
            />
        )}
        {pasoActual === 5 && (
            <Pago
                datos={datos.pago}
                onAnterior={handlePasoAnterior}
            />
        )}
    </div>
);
}

export default FormularioContacto;