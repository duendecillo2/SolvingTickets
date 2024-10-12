import React from 'react';
import '../styles/Button.css';

const Button = ({ label, onClick, styleType }) => {
    return (
        <button className={`button ${styleType}`} onClick={onClick}>
            {label}
        </button>
    );
};

export default Button;