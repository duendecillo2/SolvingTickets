import './App.css';
import React from 'react';
import { BrowserRouter , Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Dashboard from './pages/Dashboard'; 
import TicketForm from './pages/TicketForm'
import TicketList from './pages/TicketList'
import RegisterForm from './pages/RegisterForm'
import HomePage from './pages/HomePage';
import LoginForm from './pages/LoginForm'
import Profile from './pages/Profile';
import Administracion from './pages/adminPage/Administracion'
import AdminStats from './pages/adminPage/Estadisticas'
import AdminPage from './pages/AdminPage'
import Administradores from './pages/Administradores';

function App() {
  return (
    <BrowserRouter>
    <Toaster />
            <Routes>
                <Route path="/" element={<HomePage/>}/>
                <Route path="/Dashboard" element={<Dashboard/>} />
                <Route path="/register" element={<RegisterForm/>} />
                <Route path="/crear-ticket" element={<TicketForm/>} />
                <Route path="/ver-tickets" element={<TicketList/>} />
                <Route path="/login" element={<LoginForm />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/Administracion" element={<Administracion/>} />
                <Route path="/Estadisticas" element={<AdminStats/>} />
                <Route path="/adminPage" element={<AdminPage/>} /> 
                <Route path="/administradores" element={<Administradores/>} />
            </Routes>
    </BrowserRouter>
  );
}

export default App;
