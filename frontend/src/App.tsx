import { FC } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import FormularioContacto from './components/FormularioContacto';
import ServiceCards from "./components/ServiceCards";
import ResultadoPago from './components/resultado-pago';
import Gracias from './components/Gracias';


const App: FC = () => {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/service-cards" element={<ServiceCards />} /> 
          <Route path="/agendar" element={<FormularioContacto />} />
          <Route path="/agenda" element={<FormularioContacto />} />
          <Route path="/resultado-pago" element={<ResultadoPago />} />
          <Route path="/gracias" element={<Gracias />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
