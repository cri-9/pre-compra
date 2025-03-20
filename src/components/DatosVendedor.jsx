import React, { useState} from "react";
import Select from "react-select";

function DatosVendedor ({ onChange}) {
    const [tipoVendedor, setTipoVendedor] = useState('');
    const [nombreVendedor, setNombreVendedor] = useState('');
    const [telefonoVendedor, setTelefonoVendedor] = useState('');
    const [direccionVendedor, setDireccionVendedor] = useState('');
    const [regionVendedor, setRegionVendedor] = useState('');
    const [comunaVendedor, setComunaVendedor] = useState('');

    const tiposVendedor = [
        { value: 'Particular', label: 'Particular' },
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

    const handleTipoVendedorChange = (selectedOption) => {
        setTipoVendedor(selectedOption.value);
        onChange({ tipoVendedor: selectedOption.value, nombreVendedor, telefonoVendedor, direccionVendedor, regionVendedor, comunaVendedor });
    };
// Compare this snippet from src/DatosVendedor.js:
//     const handleNombreChange = (e) => {
//         setNombre(e.target.value); 
//     };

    const handleNombreVendedorChange = (e) => {
        setNombreVendedor(e.target.value);
        onChange({ tipoVendedor, nombreVendedor: e.target.value, telefonoVendedor, direccionVendedor, regionVendedor, comunaVendedor });
    };
// Compare this snippet from src/DatosVendedor.js:
//     const handleTelefonoChange = (e) => {
//         setTelefono(e.target.value);
//     };
const handleTelefonoVendedorChange = (e) => {
    setTelefonoVendedor(e.target.value);
    onChange({ tipoVendedor, nombreVendedor, telefonoVendedor: e.target.value, direccionVendedor, regionVendedor, comunaVendedor });
}
// Compare this snippet from src/DatosVendedor.js:
//     const handleDireccionChange = (e) => {

    const handleDireccionVendedorChange = (e) => {
        setDireccionVendedor(e.target.value);
        onChange({ tipoVendedor, nombreVendedor, telefonoVendedor, direccionVendedor: e.target.value, regionVendedor, comunaVendedor });
    };
// Compare this snippet from src/DatosVendedor.js:
//     const handleRegionChange = (selectedOption) => {
//         setRegion(selectedOption.value);
//     };
const handleRegionVendedorChange = (selectedOption) => {
    setRegionVendedor(selectedOption.value);
    onChange({ tipoVendedor, nombreVendedor, telefonoVendedor, direccionVendedor, regionVendedor: selectedOption.value, comunaVendedor });
}
// Compare this snippet from src/DatosVendedor.js:
//     const handleComunaChange = (selectedOption) => {
    //         setComuna(selectedOption.value);
    //     };
    const handleComunaVendedorChange = (selectedOption) => {
        setComunaVendedor(selectedOption.value);
        onChange({ tipoVendedor, nombreVendedor, telefonoVendedor, direccionVendedor, regionVendedor, comunaVendedor: selectedOption.value });
    };
    // Compare this snippet from src/DatosVendedor.js:
    //     return (
    //         <div>
    //             <Select options={tipos} onChange={handleTipoChange} placeholder="Tipo de cliente" />
    //             <input type="text" value={nombre} onChange={handleNombreChange} placeholder
    //                 ="Nombre del cliente"/>
    //             <input type="text" value={telefono} onChange={handleTelefonoChange} placeholder
    //                 ="Teléfono del cliente"/>
    //             <input type="text" value={direccion} onChange={handleDireccionChange} placeholder
    //                 ="Dirección del cliente"/>
    //             <Select options={regiones} onChange={handleRegionChange} placeholder="Región" />
    //             <Select options={comunas} onChange={handleComunaChange} placeholder="Com
    //             una" />
    //         </div>
    //     );
    return (
        <div>
          <Select
            options={tiposVendedor}
            onChange={handleTipoVendedorChange}
            placeholder="Tipo de vendedor"
          />
          <input
            type="text"
            placeholder="Nombre del vendedor"
            onChange={handleNombreVendedorChange}
          />
          <input
            type="text"
            placeholder="Teléfono del vendedor"
            onChange={handleTelefonoVendedorChange}
          />
          <input
            type="text"
            placeholder="Dirección del vendedor"
            onChange={handleDireccionVendedorChange}
          />
          <Select
            options={regiones}
            onChange={handleRegionVendedorChange}
            placeholder="Región"
          />
          <Select
            options={comunas[regionVendedor] || []}
            onChange={handleComunaVendedorChange}
            placeholder="Comuna"
          />
        </div>
      );
    }
    
    export default DatosVendedor;
// Compa r e this snippet from src/DatosVendedor.js:    
//     import React, { useState } from 'react';
//     import Select from 'react-select';
