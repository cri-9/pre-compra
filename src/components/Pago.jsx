import React, { useState } from "react";
import { TextField, Button, Box, Typography, Card, CardContent, Divider } from '@mui/material';
import axios from "axios";
import FormItem from './FormItem';

function Pago({ datos, onAnterior }) {
  const [codigoDescuento, setCodigoDescuento] = useState("");
  const [total, setTotal] = useState(35000);
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
      .catch(() => {
        setError("Error al aplicar el código de descuento");
      });
  };

  // Simula redirección a WebPay
  const redirigirAWepPay = () => {
    window.location.href = "https://webpay3g.transbank.cl/webpay-server/initTransaction"; // Cambiar por URL real desde backend
  };

  return (
    <Card elevation={3} sx={{ borderRadius: 3, p: 3, mt: 2, backgroundColor: '#f7f7f7' }}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Pago del Servicio
        </Typography>

        <FormItem>
          <TextField
            label="Código de descuento"
            value={codigoDescuento}
            onChange={handleCodigoDescuentoChange}
            fullWidth
            variant="outlined"
            size="small"
          />
        </FormItem>

        {error && (
          <Typography variant="body2" color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button variant="outlined" color="primary" onClick={handleIrPago}>
            Aplicar Código
          </Button>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" sx={{ mb: 2, textAlign: 'center' }}>
          Total a pagar: ${total}
        </Typography>

        <Button
          variant="contained"
          color="success"
          fullWidth
          onClick={redirigirAWepPay}
        >
          Pagar con WebPay
        </Button>
      </CardContent>
    </Card>
  );
}

export default Pago;

