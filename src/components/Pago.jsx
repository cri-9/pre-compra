import React, { useState } from "react";
import { TextField, Button, Box, Typography } from '@mui/material';
import axios from "axios";
import FormItem from './FormItem';

function Pago({ datos, onAnterior }) {
    const [codigoDescuento, setCodigoDescuento] = useState("");
    const [total, setTotal] = useState(45000);
    const [error, setError] = useState(null);

    const handleCodigoDescuentoChange = (e) => {
        setCodigoDescuento(e.target.value);
    };

    const handleIrPago = () => {
        axios.post("http://localhost:3001/pago", { datos, codigoDescuento })
            .then((response) => {
                setTotal(response.data.total);
                setError(null);
            })
            .catch((error) => {
                setError("Error al aplicar el código de descuento");
            });
    };

    return (
        <Box sx={{ width: '100%' }}>
            <FormItem>
                <TextField
                    label="Código de descuento"
                    value={codigoDescuento}
                    onChange={handleCodigoDescuentoChange}
                    fullWidth
                />
            </FormItem>
            {error && (
                <Typography variant="body2" color="error" sx={{ mb: 2 }}>
                    {error}
                </Typography>
            )}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                <Button variant="contained" color="primary" onClick={handleIrPago}>
                    Aplicar Código
                </Button>
            </Box>
            <Typography variant="h6" sx={{ mt: 2 }}>
                Total: ${total}
            </Typography>
        </Box>
    );
}

export default Pago;