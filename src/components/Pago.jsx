import React, { useState } from "react";
import axios from "axios";

function Pago({ datos }) {
    const [codigoDescuento, setCodigoDescuento] = useState("");
    const [total, setTotal] = useState(629912);

    const handleCodigoDescuentoChange = (e) => {
        setCodigoDescuento(e.target.value);
    };

    const handleIrPago = () => {
        axios.post("http://localhost:3001/pago", { datos, codigoDescuento })
            .then((response) => {
                setTotal(response.data.total);
            });
    }
    return (
        <div>
            <input type="text" value={codigoDescuento} onChange={handleCodigoDescuentoChange} placeholder="Código de descuento" />
            <button onClick={handleIrPago}>Ir a pago</button>
            <p>Total: {total}</p>
        </div>
    ); 
}
export default Pago;
