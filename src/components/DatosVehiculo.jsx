import React, { useState } from 'react';
import Select from 'react-select';

function DatosVehiculo({ onChange }) {
  const [marca, setMarca] = useState('');
  const [modelo, setModelo] = useState('');
  const [año, setAño] = useState('');
  const [patente, setPatente] = useState('');

  const marcas = [
    { value: 'Toyota', label: 'Toyota' },
    { value: 'Honda', label: 'Honda' },
    // ... más marcas
  ];

  const modelos = {
    Toyota: [{ value: 'Corolla', label: 'Corolla' }],
    Honda: [{ value: 'Civic', label: 'Civic' }],
    // ... modelos por marca
  };

  const handleMarcaChange = (selectedOption) => {
    setMarca(selectedOption.value);
    onChange({ marca: selectedOption.value, modelo, año, patente });
  };

  const handleModeloChange = (selectedOption) => {
    setModelo(selectedOption.value);
    onChange({ marca, modelo: selectedOption.value, año, patente });
  };

  const handleAñoChange = (e) => {
    setAño(e.target.value);
    onChange({ marca, modelo, año: e.target.value, patente });
  };

  const handlePatenteChange = (e) => {
    setPatente(e.target.value);
    onChange({ marca, modelo, año, patente: e.target.value });
  };

  return (
    <div>
      <Select options={marcas} onChange={handleMarcaChange} placeholder="Marca" />
      <Select options={modelos[marca] || []} onChange={handleModeloChange} placeholder="Modelo" />
      <input type="number" placeholder="Año" onChange={handleAñoChange} />
      <input type="text" placeholder="Patente" onChange={handlePatenteChange} />
    </div>
  );
}

export default DatosVehiculo;
