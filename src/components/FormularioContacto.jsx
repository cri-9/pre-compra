import React, { useState } from 'react';
import DatosVehiculo from './DatosVehiculo';
import DatosCliente from './DatosCliente';
import DatosVendedor from './DatosVendedor';
import FechaAgendamiento from './FechaAgendamiento';
import Pago from './Pago';

function FormularioContacto() {
  const [datos, setDatos] = useState({
    vehiculo: {},
    cliente: {},
    vendedor: {},
    agendamiento: {},
    pago: {},
  });
  const [pasoActual, setPasoActual] = useState(1);

  const handleDatosChange = (seccion, nuevosDatos) => {
    setDatos({ ...datos, [seccion]: nuevosDatos });
  };

  const handleSiguientePaso = () => {
    setPasoActual(pasoActual + 1);
  };

  return (
    <div>
      {pasoActual === 1 && (
        <DatosVehiculo
          onChange={(nuevosDatos) => handleDatosChange('vehiculo', nuevosDatos)}
          onSiguiente={handleSiguientePaso}
        />
      )}
      {pasoActual === 2 && (
        <DatosCliente
          onChange={(nuevosDatos) => handleDatosChange('cliente', nuevosDatos)}
          onSiguiente={handleSiguientePaso}
        />
      )}
      {pasoActual === 3 && (
        <DatosVendedor
          onChange={(nuevosDatos) => handleDatosChange('vendedor', nuevosDatos)}
          onSiguiente={handleSiguientePaso}
        />
      )}
      {pasoActual === 4 && (
        <FechaAgendamiento
          onChange={(nuevosDatos) => handleDatosChange('agendamiento', nuevosDatos)}
          onSiguiente={handleSiguientePaso}
        />
      )}
      {pasoActual === 5 && <Pago datos={datos} />}
    </div>
  );
}

export default FormularioContacto;
