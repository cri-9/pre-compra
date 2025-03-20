import React, {useState} from 'react';
import Select from 'react-select';

function DatosCliente({onChange}) {
    const [ tipoCliente, setTipoCliente ] = useState('');
    const [ nombre, setNombre ] = useState('');
    const [ email, setEmail ] = useState('');
    const [ telefono, setTelefono ] = useState('');
    const [ rut, setRut ] = useState('');
    const [ direccion, setDireccion ] = useState('');
    const [ region, setRegion ] = useState('');
    const [ comuna, setComuna ] = useState('');
    const [inspeccion, setInspeccion] = useState('');

    const tiposCliente = [
        { value: 'Persona', label: 'Persona' },
        { value: 'Empresa', label: 'Empresa' },
    ];

    const regiones = [
        { value: 'RM', label: 'Región Metropolitana' },
        { value: 'V', label: 'Valparaíso' },
        { value: 'I', label: 'O’Higgins' },
        { value: 'VI', label: 'Maule' },
        { value: 'VII', label: 'Biobío' },
        { value: 'VIII', label: 'Araucanía' },
        { value: 'IX', label: 'Los Ríos' },
        { value: 'X', label: 'Los Lagos' },
        { value: 'XI', label: 'Aysén' },
        { value: 'XII', label: 'Magallanes' },
        { value: 'XIV', label: 'Los Ríos' },
        { value: 'XV', label: 'Arica y Parinacota' },
    ];

    const comunas = {
        VIII: [
          { value: "Temuco", label: "Temuco" },
          { value: "Padre Las Casas", label: "Padre Las Casas" },
          { value: "Pucon", label: "Pucon" },
          { value: "Villarrica", label: "Villarrica" },
          { value: "Galvarino", label: "Galvarino" },
          { value: "Lautaro", label: "Lautaro" },
          { value: "Perquenco", label: "Perquenco" },
          { value: "Cunco", label: "Cunco" },
          { value: "Victoria", label: "Victoria" },
          { value: "Carahue", label: "Carahue" },
          { value: "Freire", label: "Freire" },
          { value: "Nueva Imperial", label: "Nueva Imperial" },
          { value: "Gorbea", label: "Gorbea" },
          { value: "Melipeuco", label: "Melipeuco" },
        ],
        // Agrega las comunas para las otras regiones aquí
      };
    
    const handleTipoClienteChange = (selectedOption) => {
        setTipoCliente(selectedOption.value);
        onChange({ tipoCliente: selectedOption.value, nombre, email, telefono, rut, direccion, region, comuna, inspeccion });
    };

    const handleNombreChange = (e) => {
        setNombre(e.target.value);
        onChange({ tipoCliente, nombre: e.target.value, email, telefono, rut, direccion, region, comuna, inspeccion });
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        onChange({ tipoCliente, nombre, email: e.target.value, telefono, rut, direccion, region, comuna, inspeccion });
    };

    const handleTelefonoChange = (e) => {
        setTelefono(e.target.value);
        onChange({ tipoCliente, nombre, email, telefono: e.target.value, rut, direccion, region, comuna, inspeccion });
    };

    const handleRutChange = (e) => {
        setRut(e.target.value);
        onChange({ tipoCliente, nombre, email, telefono, rut: e.target.value, direccion, region, comuna, inspeccion });
    };

    const handleDireccionChange = (e) => {
        setDireccion(e.target.value);
        onChange({ tipoCliente, nombre, email, telefono, rut, direccion: e.target.value, region, comuna, inspeccion });
    };

    const handleRegionChange = (selectedOption) => {
        setRegion(selectedOption.value);
        onChange({ tipoCliente, nombre, email, telefono, rut, direccion, region: selectedOption.value, comuna, inspeccion });
    };

    const handleComunaChange = (selectedOption) => {
        setComuna(selectedOption.value);
        onChange({ tipoCliente, nombre, email, telefono, rut, direccion, region, comuna: selectedOption.value, inspeccion });
    };

    const handleInspeccionChange = (e) => {
        setInspeccion(e.target.value);
        onChange({ tipoCliente, nombre, email, telefono, rut, direccion, region, comuna, inspeccion: e.target.value });
    };

    return (
        <div>
            <Select 
            options={tiposCliente} 
            onChange={handleTipoClienteChange} 
            placeholder="Tipo de cliente" 
            />
            <input 
            type="text" 
            placeholder="Nombre" 
            onChange={handleNombreChange}
             />
            <input 
            type="email" 
            placeholder="Email" 
            onChange={handleEmailChange} 
            />
            <input 
            type="number" 
            placeholder="Teléfono" 
            onChange={handleTelefonoChange} 
            />
            <input 
            type="text" 
            placeholder="RUT" 
            onChange={handleRutChange} 
            />
            <input 
            type="text" 
            placeholder="Dirección" 
            onChange={handleDireccionChange} 
            />
            <Select 
            options={regiones} 
            onChange={handleRegionChange} 
            placeholder="Región" 
            />
            <Select 
            options={comunas[region] || []} 
            onChange={handleComunaChange} 
            placeholder="Comuna" 
            />
            <input type="text" placeholder="Inspección" onChange={handleInspeccionChange} />
        </div>
    );
    };

    export default DatosCliente;
