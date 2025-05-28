import { ReactNode } from 'react';
import { SxProps, Theme } from '@mui/material/styles';

// Vehicle data interfaces
export interface VehiculoData {
  marca: string;
  modelo: string;
  año: string;
  patente: string;
}

export interface DatosVehiculoProps {
  datos: VehiculoData;
  onChange: (data: VehiculoData) => void;
  onSiguiente?: () => void;
}

// Client data interfaces
export interface ClienteData {
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  rut: string;
  direccion: string;
  region: string;
  comuna: string;
}

export interface DatosClienteProps {
  datos: ClienteData;
  onChange: (data: ClienteData) => void;
}

// Vendor data interfaces
export interface VendedorData {
  tipovendedor: string;
  nombre: string;
  telefono: string;
  direccion: string;
  region: string;
  comuna: string;
}

export interface DatosVendedorProps {
  datos: VendedorData;
  onChange: (data: VendedorData) => void;
}

// Schedule data interfaces
export interface AgendamientoData {
  fecha: string;
  bloque: string;
}

export interface FechaAgendamientoProps {
  datos: AgendamientoData;
  onChange: (data: AgendamientoData) => void;
}

// Service data interfaces
export interface ServicioData {
  servicio: string | null;
  nombreServicio: string;
  monto: number;
}

export interface SeleccionServicioProps {
  datos: ServicioData;
  onChange: (data: ServicioData) => void;
}

// Payment data interfaces
export interface PagoData {
  codigoDescuento: string;
  metodo: string;
  nombreServicio?: string;
  monto?: number;
}

export interface PagoProps {
  datos: PagoData;
  onChange: (data: PagoData) => void;
  iniciarWebPay: () => Promise<void>;
  loading: boolean;
  nombreServicio: string;
}

// Form data interface
export interface FormData {
  vehiculo: VehiculoData;
  cliente: ClienteData;
  vendedor: VendedorData;
  agendamiento: AgendamientoData;
  servicio: ServicioData;
  pago: PagoData;
}

// API Response interfaces
export interface WebPayResponse {
  success: boolean;
  url?: string;
  token?: string;
  error?: string;
}

export interface AgendarResponse {
  success: boolean;
  error?: string;
}

// Component Props interfaces
export interface SnackbarProps {
  open: boolean;
  message: string;
  severity: 'success' | 'error' | 'info' | 'warning';
  onClose: () => void;
}

export interface FormItemProps {
  children: ReactNode;
}

// Styles interface
export interface Styles {
  [key: string]: SxProps<Theme>;
}

// Form step interface
export interface FormStep {
  label: string;
  fields: string[];
}

// Form validation interface
export interface ValidationResult {
  isValid: boolean;
  missingFields: string[];
}

// API request interfaces
export interface AgendarRequest {
  nombre: string;
  telefono: string;
  correo: string;
  direccion: string;
  region: string;
  comuna: string;
  fechaAgendada: string;
  metodo: string;
  servicio: string;
  monto: number;
}
