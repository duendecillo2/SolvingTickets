import React from 'react';
import '../styles/Card.css';

const Card = ({ title, description, icon: Icon, buttonText, onClick }) => {
    return (
        <div className="card">
            <h2 className="card-title">{title}</h2>
            {Icon && <Icon className="card-icon" />}
            <p className="card-description">{description}</p>
            <button className="card-button" onClick={onClick}>{buttonText}</button>
        </div>
    );
};

export default Card;
