import React, { useState, useEffect } from "react";
import { API_URLS } from '../config/api';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import Fade from '@mui/material/Fade';
import Slide from '@mui/material/Slide';
import Tooltip from '@mui/material/Tooltip';
import {
  ChevronLeft,
  ChevronRight,
  Schedule,
  CalendarToday,
  CheckCircle,
  AccessTime,
  EventAvailable,
  WatchLater,
} from "@mui/icons-material";
import '../Csspersonalizado/FechaAgendamientoModerno.css';

const FechaAgendamientoModerno = ({ datos, onChange }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(datos?.fecha ? new Date(datos.fecha) : null);
  const [bloquesDisponibles, setBloquesDisponibles] = useState([]);
  const [selectedBloque, setSelectedBloque] = useState(datos?.bloque || "");
  const [selectedHorario, setSelectedHorario] = useState(datos?.horario || "");
  const [cargandoBloques, setCargandoBloques] = useState(false);
  const [errorBloques, setErrorBloques] = useState(null);
  const [showBloques, setShowBloques] = useState(false);
  const [showHorarios, setShowHorarios] = useState(false);

  // Horarios normales (lunes a viernes)
  const horariosPorBloque = {
    AM: [
      { hora: "10:00", label: "10:00 AM" },
      { hora: "11:00", label: "11:00 AM" },
      { hora: "14:00", label: "2:00 PM" },
    ],
    PM: [
      { hora: "16:30", label: "4:30 PM" },
      { hora: "18:00", label: "6:00 PM" },
      { hora: "19:30", label: "7:30 PM" },
      { hora: "20:30", label: "8:30 PM" },
    ]
  };

  // Horarios especiales para sábado
  const horariosSabado = [
    { hora: "09:00", label: "9:00 AM" },
    { hora: "10:30", label: "10:30 AM" },
    { hora: "12:00", label: "12:00 PM" },
    { hora: "13:30", label: "1:30 PM" },
    { hora: "15:00", label: "3:00 PM" }
  ];

  // Función para obtener horarios según el día seleccionado
  const getHorariosDisponibles = () => {
    if (!selectedDate) return [];
    
    const dayOfWeek = selectedDate.getDay(); // 0 = Domingo, 6 = Sábado
    
    if (dayOfWeek === 6) { // Sábado
      return horariosSabado;
    } else if (selectedBloque) { // Lunes a Viernes
      return horariosPorBloque[selectedBloque] || [];
    }
    
    return [];
  };

  // Función para verificar si es sábado
  const esSabado = (fecha) => {
    return fecha?.getDay() === 6;
  };

  // Continúo con el resto del componente...
  // (Aquí iría el resto del código del componente)

  return (
    <Card sx={{ maxWidth: 800, mx: 'auto', my: 2 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Selecciona fecha y hora para tu cita
        </Typography>
        {/* Aquí iría el resto del JSX */}
        <Box sx={{ p: 2 }}>
          <Typography>Componente en construcción...</Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default FechaAgendamientoModerno;
