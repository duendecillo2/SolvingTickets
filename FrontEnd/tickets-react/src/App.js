import './App.css';
import React from 'react';
import { BrowserRouter , Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard'; 
import TicketForm from './pages/TicketForm'
import TicketList from './pages/TicketList'
import RegisterForm from './pages/RegisterForm'
import HomePage from './pages/HomePage';
import LoginForm from './pages/LoginForm'


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
            </Routes>
    </BrowserRouter>
  );
}

export default App;
