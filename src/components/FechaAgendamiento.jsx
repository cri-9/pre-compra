import React, { useState} from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function FechaAgendamiento({onChange}) {
    const [fecha, setFecha] = useState(new Date());
    const [bloque, setBloque] = useState('');

    const bloques = [
        { value: ' AM ', label: '8:00 - 14:00 AM' },
        { value: 'PM', label: '14:00 - 20:00 PM' },
    ]; 

    const handleFechaChange = (date) => {
        setFecha(date);
        onChange({ fecha: date, bloque });
    };

    const handleBloqueChange = (selectedOption) => {
        setBloque(selectedOption.value);
        onChange({ fecha, bloque: selectedOption.value });
    };

    return (
        <div>
            <DatePicker selected={fecha} onChange={handleFechaChange} />
            <Select options={bloques} onChange={handleBloqueChange} placeholder="Bloque" />
        </div>
    );
}
export default FechaAgendamiento;
