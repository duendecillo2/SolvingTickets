import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/NavBar.css';

const Navbar = ({ links }) => {
    return (
        <nav className="navbar">
            <h1 className="logo">SolvingTickets</h1>
            <nav>
                {links.map((link, index) => (
                    <Link key={index} to={link.path} className="navbar-link">{link.label}</Link>
                ))}
            </nav>
        </nav>
    );
};

export default Navbar;
