import './App.css';
import React from 'react';
import { BrowserRouter , Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard'; 
import TicketForm from './pages/TicketForm'
import TicketList from './components/adminComponents/TicketList'
import RegisterForm from './pages/RegisterForm'
import HomePage from './pages/HomePage';
import LoginForm from './pages/LoginForm'
import Profile from './pages/Profile';
import Administracion from './components/adminComponents/Administracion.js'
import AdminStats from './components/adminComponents/Statistics'
import AdminPage from './pages/AdminPage'
import UserManagement from './components/adminComponents/UserManagement.js';

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
                <Route path="/Administracion" element={<Administracion/>} />
                <Route path="/Estadisticas" element={<AdminStats/>} />
                <Route path="/admin" element={<AdminPage />} />
            </Routes>
    </BrowserRouter>
  );
}

export default App;
