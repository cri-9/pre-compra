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
    
    if (dayOfWeek === 6 || selectedBloque === "SABADO") { // Sábado
      return horariosSabado;
    } else if (selectedBloque && selectedBloque !== "SABADO") { // Lunes a Viernes
      return horariosPorBloque[selectedBloque] || [];
    }
    
    return [];
  };

  // Función para verificar si es sábado
  const esSabado = (fecha) => {
    return fecha?.getDay() === 6;
  };

  // Generar días del calendario
  const generateCalendarDays = () => {
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    const today = new Date();

    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      
      const isCurrentMonth = date.getMonth() === currentDate.getMonth();
      const isToday = date.toDateString() === today.toDateString();
      const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
      const isDisabled = date < today && !isToday;
      
      days.push({
        date,
        day: date.getDate(),
        isCurrentMonth,
        isToday,
        isSelected,
        isDisabled
      });
    }

    return days;
  };

  // Función para cargar bloques disponibles
  const fetchBloquesDisponibles = async (fechaISO) => {
    try {
      setCargandoBloques(true);
      setErrorBloques(null);

      const response = await fetch(API_URLS.VERIFICAR_BLOQUE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fecha: fechaISO })
      });

      if (!response.ok) {
        throw new Error('Error en la respuesta del servidor');
      }

      const data = await response.json();

      if (data.success && data.disponibles) {
        setBloquesDisponibles(data.disponibles);
        setShowBloques(true);
      } else {
        setBloquesDisponibles([]);
        setErrorBloques("No hay bloques disponibles para esta fecha");
      }
      
    } catch (error) {
      console.error('Error al cargar bloques:', error);
      setErrorBloques("Error al cargar disponibilidad");
      setBloquesDisponibles([]);
    } finally {
      setCargandoBloques(false);
    }
  };

  // Manejar selección de fecha
  const handleDateSelect = (day) => {
    if (day.isDisabled) return;

    const fechaISO = day.date.toISOString().split("T")[0];
    setSelectedDate(day.date);
    setSelectedBloque("");
    setSelectedHorario("");
    setShowBloques(false);
    setShowHorarios(false);

    // Para sábados, asignar bloque por defecto
    const bloqueDefault = esSabado(day.date) ? "SABADO" : "";

    // Actualizar datos del padre
    onChange({ 
      ...datos, 
      fecha: fechaISO, 
      bloque: bloqueDefault, 
      horario: "",
      hora_inicio: "",
      hora_fin: ""
    });

    // Para sábados, mostrar horarios directamente y actualizar estado
    if (esSabado(day.date)) {
      setSelectedBloque("SABADO");
      setShowHorarios(true);
    } else {
      // Para otros días, cargar bloques disponibles
      fetchBloquesDisponibles(fechaISO);
    }
  };

  // Manejar selección de bloque
  const handleBloqueSelect = (bloque) => {
    setSelectedBloque(bloque);
    setSelectedHorario("");
    setShowHorarios(true);

    // Actualizar datos del padre
    onChange({ 
      ...datos, 
      bloque, 
      horario: "",
      hora_inicio: "",
      hora_fin: ""
    });
  };

  // Manejar selección de horario
  const handleHorarioSelect = (hora) => {
    setSelectedHorario(hora);

    // Calcular hora de fin (1 hora después)
    const horaInicio = new Date(`2000-01-01 ${hora}:00`);
    const horaFin = new Date(horaInicio.getTime() + 60 * 60 * 1000);
    
    const horaInicioStr = horaInicio.toTimeString().substring(0, 5);
    const horaFinStr = horaFin.toTimeString().substring(0, 5);

    // Actualizar datos del padre
    onChange({ 
      ...datos, 
      horario: hora,
      hora_inicio: horaInicioStr,
      hora_fin: horaFinStr
    });
  };

  // Navegar entre meses
  const handlePreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const monthNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  const dayNames = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

  // Continúo con el resto del componente...
  // (Aquí iría el resto del código del componente)

  return (
    <Card sx={{ 
      maxWidth: 900, 
      mx: 'auto', 
      my: 3,
      borderRadius: 3,
      boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
      overflow: 'hidden'
    }}>
      {/* Header del componente */}
      <Box sx={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        p: 3,
        textAlign: 'center'
      }}>
        <CalendarToday sx={{ fontSize: 40, mb: 1 }} />
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Agenda tu cita de inspección
        </Typography>
        <Typography variant="body1" sx={{ opacity: 0.9 }}>
          Selecciona el día y hora que mejor te convenga
        </Typography>
      </Box>

      <CardContent sx={{ p: 3 }}>
        {/* Calendario */}
        <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
          {/* Header del calendario */}
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <IconButton onClick={handlePreviousMonth} color="primary">
              <ChevronLeft />
            </IconButton>
            <Typography variant="h6" fontWeight="bold" color="primary">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </Typography>
            <IconButton onClick={handleNextMonth} color="primary">
              <ChevronRight />
            </IconButton>
          </Box>

          {/* Días de la semana */}
          <Grid container spacing={1} mb={1}>
            {dayNames.map((day) => (
              <Grid item xs={12/7} key={day}>
                <Typography 
                  variant="caption" 
                  fontWeight="bold" 
                  color="text.secondary"
                  sx={{ display: 'block', textAlign: 'center', p: 1 }}
                >
                  {day}
                </Typography>
              </Grid>
            ))}
          </Grid>

          {/* Días del calendario */}
          <Grid container spacing={1}>
            {generateCalendarDays().map((day, index) => (
              <Grid item xs={12/7} key={index}>
                <Button
                  variant={day.isSelected ? "contained" : "text"}
                  color={day.isToday ? "secondary" : "primary"}
                  onClick={() => handleDateSelect(day)}
                  disabled={day.isDisabled}
                  sx={{
                    width: '100%',
                    height: 48,
                    minWidth: 'auto',
                    borderRadius: 2,
                    fontSize: '0.9rem',
                    fontWeight: day.isSelected || day.isToday ? 'bold' : 'normal',
                    opacity: day.isCurrentMonth ? 1 : 0.4,
                    backgroundColor: day.isSelected ? 'primary.main' : 'transparent',
                    '&:hover': {
                      backgroundColor: day.isSelected ? 'primary.dark' : 'primary.light',
                      transform: 'scale(1.05)',
                    },
                    transition: 'all 0.2s ease'
                  }}
                >
                  {day.day}
                </Button>
              </Grid>
            ))}
          </Grid>
        </Paper>

        {/* Selección de bloques (solo para días que no sean sábado) */}
        {selectedDate && !esSabado(selectedDate) && (
          <Fade in={showBloques} timeout={500}>
            <Paper elevation={1} sx={{ p: 3, mb: 3, borderRadius: 2, backgroundColor: '#f8f9ff' }}>
              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <Schedule sx={{ color: '#667eea' }} />
                <Typography variant="h6" fontWeight="bold">
                  Selecciona el bloque horario
                </Typography>
              </Box>

              {cargandoBloques ? (
                <Box display="flex" justifyContent="center" py={2}>
                  <CircularProgress size={30} />
                </Box>
              ) : errorBloques ? (
                <Alert severity="warning" sx={{ mb: 2 }}>
                  {errorBloques}
                </Alert>
              ) : (
                <Grid container spacing={2}>
                  {bloquesDisponibles.map((bloque) => (
                    <Grid item xs={12} sm={6} key={bloque}>
                      <Button
                        variant={selectedBloque === bloque ? "contained" : "outlined"}
                        color="primary"
                        onClick={() => handleBloqueSelect(bloque)}
                        sx={{
                          width: '100%',
                          height: 60,
                          fontSize: '1.1rem',
                          fontWeight: 'bold',
                          borderRadius: 2,
                          '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
                          },
                          transition: 'all 0.3s ease'
                        }}
                      >
                        <Box>
                          <Typography variant="h6">
                            {bloque === 'AM' ? '🌅 Mañana' : '🌆 Tarde'}
                          </Typography>
                          <Typography variant="caption" display="block">
                            {bloque === 'AM' ? '10:00 - 14:00' : '16:30 - 20:30'}
                          </Typography>
                        </Box>
                      </Button>
                    </Grid>
                  ))}
                </Grid>
              )}
            </Paper>
          </Fade>
        )}

        {/* Mensaje especial para sábados */}
        {selectedDate && esSabado(selectedDate) && (
          <Alert severity="info" sx={{ mb: 3, fontWeight: 'bold' }}>
            📅 Horarios especiales disponibles para sábado
          </Alert>
        )}

        {/* Selección de horarios */}
        {showHorarios && (
          <Slide direction="up" in={showHorarios} timeout={500}>
            <Paper elevation={1} sx={{ p: 3, borderRadius: 2, backgroundColor: '#f0f7ff' }}>
              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <AccessTime sx={{ color: '#667eea' }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  {esSabado(selectedDate) 
                    ? 'Horarios disponibles - Sábado' 
                    : `Horarios disponibles - ${selectedBloque === 'AM' ? 'Mañana' : 'Tarde'}`}
                </Typography>
              </Box>

              <Grid container spacing={2}>
                {getHorariosDisponibles().map((horario) => (
                  <Grid item xs={6} sm={4} md={3} key={horario.hora}>
                    <Chip
                      label={horario.label}
                      variant={selectedHorario === horario.hora ? "filled" : "outlined"}
                      color={selectedHorario === horario.hora ? "primary" : "default"}
                      onClick={() => handleHorarioSelect(horario.hora)}
                      sx={{
                        width: '100%',
                        height: 48,
                        fontSize: '1rem',
                        fontWeight: selectedHorario === horario.hora ? 'bold' : 'normal',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          backgroundColor: selectedHorario === horario.hora ? 'primary.dark' : 'primary.light',
                          transform: 'scale(1.05)',
                          boxShadow: '0 4px 12px rgba(102, 126, 234, 0.2)'
                        }
                      }}
                    />
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Slide>
        )}

        {/* Resumen de la selección */}
        {selectedDate && selectedHorario && (
          <Fade in timeout={800}>
            <Paper 
              elevation={3} 
              sx={{ 
                p: 3, 
                mt: 3, 
                borderRadius: 2,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                textAlign: 'center'
              }}
            >
              <CheckCircle sx={{ fontSize: 40, mb: 2 }} />
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                ¡Cita agendada exitosamente!
              </Typography>
              <Typography variant="body1">
                📅 {selectedDate.toLocaleDateString('es-ES', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </Typography>
              <Typography variant="body1">
                🕒 {selectedHorario} - {datos?.hora_fin || 'N/A'}
              </Typography>
              {!esSabado(selectedDate) && (
                <Typography variant="body2" sx={{ opacity: 0.9, mt: 1 }}>
                  Bloque: {selectedBloque === 'AM' ? 'Mañana' : 'Tarde'}
                </Typography>
              )}
            </Paper>
          </Fade>
        )}
      </CardContent>
    </Card>
  );
};

export default FechaAgendamientoModerno;
