import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/NavBarHomePage.css';
import logo from '../media/logo.png';

const NavBar = ({ links }) => {
    return (
        <nav className="navbar">
            <div className="logo-container">
                <img 
                    src={logo} 
                    alt="Logo" 
                    className="navbar-logo" 
                    onClick={() => window.location.reload()} 
                />
                <span className="navbar-title">Solving Tickets</span>
            </div>
            <ul>
                {links.map((link) => (
                    <li key={link.path}>
                        <Link to={link.path}>{link.label}</Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default NavBar;
