import React, { useState } from "react";
import { TextField, Button, Box, Typography, Card, CardContent, Divider } from "@mui/material";
import FormItem from "./FormItem";

function Pago({ datos, iniciarWebPay, loading }) { // Recibe la función iniciarWebPay y el estado loading desde FormularioContacto
  const [codigoDescuento, setCodigoDescuento] = useState("");
  const [total, setTotal] = useState(35000);
  const [error, setError] = useState(null);

  const handleCodigoDescuentoChange = (e) => {
    setCodigoDescuento(e.target.value);
  };

  const aplicarCodigo = () => {
    // Este ejemplo es local. Idealmente se haría un POST a un endpoint para validar el código.
    if (codigoDescuento === "DESCUENTO10") {
      setTotal(31500); // 10% de descuento
      setError(null);
    } else {
      setError("Código de descuento no válido");
    }
  };

  return (
    <Card elevation={3} sx={{ borderRadius: 3, p: 3, mt: 2, backgroundColor: "#f7f7f7" }}>
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

        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
          <Button variant="outlined" color="primary" onClick={aplicarCodigo}>
            Aplicar Código
          </Button>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" sx={{ mb: 2, textAlign: "center" }}>
          Total a pagar: ${total}
        </Typography>

        {/* Botón de pago */}
        <Button
          variant="contained"
          color="success"
          fullWidth
          onClick={iniciarWebPay} // Aquí llamamos la función pasada por props
          disabled={loading}
        >
          {loading ? "Redirigiendo a WebPay..." : "Pagar y Agendar"}
        </Button>
      </CardContent>
    </Card>
  );
}

export default Pago;

