import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/NavBar.css';

const Navbar = ({ links }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Elimina el token del localStorage
        localStorage.removeItem('token');
        // Redirige al usuario a la página de inicio de sesión
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <h1 className="logo">SolvingTickets</h1>
            <nav>
                {links.map((link, index) => (
                    link.label === 'Cerrar Sesión' ? (
                        <span key={index} onClick={handleLogout} className="navbar-link">
                            {link.label}
                        </span>
                    ) : (
                        <Link key={index} to={link.path} className="navbar-link">{link.label}</Link>
                    )
                ))}
            </nav>
        </nav>
    );
};

export default Navbar;
