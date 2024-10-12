import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/NavBar.css';

const Navbar = ({ links }) => {
    return (
        <nav className="navbar">
            <div className="navbar-container">
                <h1 className="navbar-logo">SolvingTickets</h1>
                <ul className="navbar-menu">
                    {links.map((link, index) => (
                        <li key={index}>
                            <Link to={link.path} className="navbar-link">{link.label}</Link>
                        </li>
                    ))}
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
