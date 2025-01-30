import './App.css';
import React from 'react';
import { BrowserRouter , Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard'; 
import TicketForm from './pages/TicketForm'
import TicketList from './pages/TicketList'
import RegisterForm from './pages/RegisterForm'
import HomePage from './pages/HomePage';
import LoginForm from './pages/LoginForm'
import Profile from './pages/Profile';
import Administracion from './pages/Administracion'
import Administrador from './pages/Administrador'
import RespuestaForm from './pages/RespuestaForm';

import AdminStats from './pages/Estadisticas'



function App() {
  return (
    <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePage/>}/>
                <Route path="/Dashboard" element={<Dashboard/>} />
                <Route path="/register" element={<RegisterForm/>} />
                <Route path="/crear-ticket" element={<TicketForm/>} />
                <Route path="/ver-tickets" element={<TicketList/>} />
                <Route path="/login" element={<LoginForm />} />
                <Route path="/profile" element={<Profile />} />

                <Route path="/administration" element={<Administrador/>} />
                <Route path="/answer-ticket" element={<RespuestaForm/>} />

                <Route path="/Administracion" element={<Administracion/>} />
                <Route path="/Estadisticas" element={<AdminStats/>} />

            </Routes>
    </BrowserRouter>
  );
}

export default App;
