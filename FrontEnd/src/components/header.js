import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Header.css';  // Importamos los estilos

const Header = () => {
    return (
        <header className="header">
            <div className="logo-container">
                <Link to="/">
                    <img 
                        src={require('../media/logoSolvingTickets.png')} 
                        alt="Logo" 
                        className="logo"
                    />
                </Link>
            </div>
        </header>
    );
};

export default Header;
