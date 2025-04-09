import React, { useState } from "react";
import { TextField, Button, Box, Typography, Card, CardContent, Divider } from "@mui/material";
import axios from "axios";
import FormItem from "./FormItem";

function Pago({ datos, onAnterior }) {
  const [codigoDescuento, setCodigoDescuento] = useState("");
  const [total, setTotal] = useState(35000);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

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

  const handlePagarYAgendar = async () => {
    setLoading(true);
    try {
      const response = await axios.post("http://localhost/webpay.php", {
        datos,
        codigoDescuento,
      });

      if (response.data.success) {
        const { url, token } = response.data;
        // Redirige a WebPay
        const form = document.createElement("form");
        form.method = "POST";
        form.action = url;

        const input = document.createElement("input");
        input.type = "hidden";
        input.name = "token_ws";
        input.value = token;
        form.appendChild(input);

        document.body.appendChild(form);
        form.submit();
      } else {
        setError("No se pudo iniciar la transacción.");
      }
    } catch (err) {
      setError("Error al conectar con el servidor de pagos.");
      console.error(err);
    } finally {
      setLoading(false);
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

        <Button
          variant="contained"
          color="success"
          fullWidth
          onClick={handlePagarYAgendar}
          disabled={loading}
        >
          {loading ? "Redirigiendo a WebPay..." : "Pagar y Agendar"}
        </Button>
      </CardContent>
    </Card>
  );
}

export default Pago;

