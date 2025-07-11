import { Box, Typography, Accordion, AccordionSummary, AccordionDetails, Container } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { motion } from "framer-motion";

const preguntas = [
  {
    pregunta: "¿Qué incluye el servicio de precompra automotriz?",
    respuesta: "Incluye inspección visual, revisión con escáner, análisis documental, prueba de ruta y evaluación general del vehículo."
  },
  {
    pregunta: "¿Cuánto tiempo tarda la inspección?",
    respuesta: "En promedio entre 1 y 2 horas, dependiendo del tipo de revisión y el estado del vehículo."
  },
  {
    pregunta: "¿Puedo agendar una inspección a domicilio?",
    respuesta: "Sí, contamos con servicio a domicilio. Puedes agendar directamente desde nuestra web."
  },
  {
    pregunta: "¿El informe es válido legalmente?",
    respuesta: "El informe es técnico e informativo. Aunque no es legalmente vinculante, sirve como respaldo en tu decisión de compra."
  },
  {
    pregunta: "¿Puedo cancelar o reprogramar mi cita?",
    respuesta: "Sí, puedes hacerlo con al menos 24 horas de anticipación desde tu correo de confirmación o contactándonos directamente."
  },
  {
    pregunta: "¿El servicio aplica para autos nuevos?",
    respuesta: "Nuestro enfoque es para autos usados, pero también podemos realizar revisión en vehículos nuevos si el cliente lo desea."
  },
  {
  pregunta: "¿Qué formas de pago aceptan?",
  respuesta: [
    "Aceptamos tarjetas de crédito/débito WebPay.",
    "Si eliges transferencia, te llegará un correo para continuar con la reserva."
  ]
},
  {
    pregunta: "¿Revisan vehículos en regiones?",
    respuesta: "No, solo estamos presentes en la Novena Región, principalmente en Temuco y alrededores."
  },
  {
    pregunta: "¿Puedo solicitar más de una inspección el mismo día?",
    respuesta: "Sí, pero recomendamos agendar con anticipación para asegurar disponibilidad."
  },
  {
    pregunta: "¿Qué pasa si el vehículo no aprueba la inspección?",
    respuesta: "Nuestro deber es informarte objetivamente. Tú decides si continúas con la compra o buscas otra alternativa."
  }
];

const PreguntasFrecuentes = () => {
  return (
    <Container id="preguntas-frecuentes" sx={{ my: 8 }}>
      <Typography variant="h4" fontWeight="bold" textAlign="center" mb={4}>
        Preguntas Frecuentes
      </Typography>

      {preguntas.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
          viewport={{ once: true }}
        >
          <Accordion sx={{ mb: 1, boxShadow: 1 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ bgcolor: "#f5f5f5" }}>
              <Typography fontWeight="bold">{item.pregunta}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>{item.respuesta}</Typography>
            </AccordionDetails>
          </Accordion>
        </motion.div>
      ))}
    </Container>
  );
};

export default PreguntasFrecuentes;
