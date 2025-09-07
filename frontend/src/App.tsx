import { FC } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
// IMPORTAR PÁGINA DE MANTENIMIENTO
//import MantenimientoPage from './components/MantenimientoPage';
// LandingPage comentado mientras está en mantenimiento
// Blog import removido temporalmente para producción
import FormularioContacto from './components/FormularioContacto';
import Gracias from './components/Gracias';
import LandingPage from './components/LandingPage';
import ServiceCards from "./components/ServiceCards";
import ResultadoPago from './components/resultado-pago';



const App: FC = () => {
  return (
    <div>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          {/* PÁGINA DE MANTENIMIENTO - Comentar/descomentar según necesites */}
          {/*<Route path="/" element={<MantenimientoPage />} />*/}
          
          {/* PÁGINA NORMAL - Descomenta esta línea cuando termines el mantenimiento */}
           <Route path="/" element={<LandingPage />} /> 
          
          <Route path="/service-cards" element={<ServiceCards />} /> 
          <Route path="/agendar" element={<FormularioContacto />} />
          <Route path="/agenda" element={<FormularioContacto />} />
          {/*<Route path="/blog" element={<Blog />} />*/}
          <Route path="/resultado-pago" element={<ResultadoPago />} />
          <Route path="/gracias" element={<Gracias />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;