import React, { useState } from "react";
import { TextField, Button } from '@mui/material';
import axios from "axios";

function Pago({ datos, onAnterior }) {
    const [codigoDescuento, setCodigoDescuento] = useState("");
    const [total, setTotal] = useState(45000);

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
          <TextField label="Código de descuento" value={codigoDescuento} onChange={handleCodigoDescuentoChange} fullWidth style={{ marginBottom: '20px' }} /> {/* Espacio inferior */}
          <div style={{ marginTop: '20px' }}> {/* Espacio superior para los botones */}
              <Button variant="contained" onClick={onAnterior}>
                  Anterior
              </Button>
              <Button variant="contained" onClick={handleIrPago}>
                  Ir al pago
              </Button>
          </div>
          <p>Total: ${total}</p>
      </div>
  );
}

export default Pago;
