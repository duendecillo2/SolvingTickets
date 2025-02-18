// src/pages/Dashboard.js
import React from 'react';
import Navbar from '../components/NavBar';
import Card from '../components/Card'
import { FaPlusCircle } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import '../styles/Dashboard.css'
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {

    const navigate = useNavigate();

    const links = [
        { path: '/profile', label: 'Perfil' },
        { path: '/administradores', label: 'Administradores' },
        { path: '/logout', label: 'Cerrar Sesión' },
    ];

    const handleCreateTicket = () => {
        navigate('/crear-ticket'); // Cambia '/create-ticket' a la ruta deseada
    };

    const handleViewTickets = () => {
        navigate('/ver-tickets'); // Cambia '/view-tickets' a la ruta deseada
    };


    return (
        <div>
            <Navbar links={links} />
            <div className='dashboard-content'>
            <h1 className='ddd'>Bienvenido al Dashboard</h1>
            <p>Aquí puedes ver tu información y configuraciones.</p>
            <div className='card-container'>
            <Card title="Crear Tickets" description="Genera un nuevo ticket para gestionar tus solicitudes de forma sencilla y eficiente. Crea tickets personalizados para cada necesidad y mantén un seguimiento claro de tus tareas." buttonText="Crear" icon={FaPlusCircle} onClick={handleCreateTicket}/>
            <Card title="Ver mis tickets" description="Consulta y gestiona todos tus tickets en un solo lugar. Revisa el estado de cada solicitud y mantente al tanto de su progreso." buttonText="Ver" icon={FaEye} onClick={handleViewTickets} />
            </div>
            </div>
        </div>
    );
};

export default Dashboard;
