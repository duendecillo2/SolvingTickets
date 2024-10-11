import React from 'react';
import Navbar from '../components/NavBar';

const HomePage = () => {
    const links = [
        { path: '/register', label: 'Registrar' },
        { path: '/login', label: 'Iniciar Sesión' },
    ];

    return (
        <div>
            <Navbar links={links} />
            <h1>Bienvenido a la Página Principal</h1>
            <p>Aquí puedes registrarte o iniciar sesión.</p>
        </div>
    );
};

export default HomePage;