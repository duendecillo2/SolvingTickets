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
import Administracion from './pages/adminPage/Administracion'
import AdminStats from './pages/adminPage/Estadisticas'
import AdminPage from './pages/AdminPage'
import Administradores from './pages/Administradores';
<<<<<<< HEAD
=======

>>>>>>> origin/production---checa
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
<<<<<<< HEAD
                <Route path="/adminPage" element={<AdminPage/>}/>
                <Route path="/Administradores" element={<Administradores/>}/>
=======
                <Route path="/adminPage" element={<AdminPage/>} /> 
                <Route path="/administradores" element={<Administradores/>} />
>>>>>>> origin/production---checa
            </Routes>
    </BrowserRouter>
  );
}

export default App;
