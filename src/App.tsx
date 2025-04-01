import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import FormularioContacto from './components/FormularioContacto';
import ServiceCards from "./components/ServiceCards";



function App() {
  return (
    <div>
      <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/service-cards" element={<ServiceCards />} /> 
        <Route path="/agendar" element={<FormularioContacto />} />        
      </Routes>
    </Router>
    
    </div>

  );
}


export default App;
