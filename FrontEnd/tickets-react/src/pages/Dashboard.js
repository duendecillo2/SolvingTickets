// src/pages/Dashboard.js
import React from 'react';
import Navbar from '../components/NavBar';

const Dashboard = () => {
    const links = [
        { path: '/profile', label: 'Perfil' },
        { path: '/settings', label: 'Configuración' },
        { path: '/logout', label: 'Cerrar Sesión' },
    ];

    return (
        <div>
            <Navbar links={links} />
            <h1>Bienvenido al Dashboard</h1>
            <p>Aquí puedes ver tu información y configuraciones.</p>
        </div>
    );
};

export default Dashboard;
