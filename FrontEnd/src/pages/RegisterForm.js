import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../components/header.js';  // Ruta correcta hacia el Header
import '../styles/RegisterForm.css';  // Mantén los estilos del formulario

const RegisterForm = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await axios.post('http://localhost:8000/api/register/', {
                username,
                email,
                password,
            }); 
            alert('Registro exitoso. Ahora puedes iniciar sesión.');
            navigate('/login');
        } catch (error) {
            console.error('Error en el registro:', error);
            alert('Error en el registro. Por favor, verifica los datos.');
        }
    };

    return (
        <>
            <Header /> {}
            <form onSubmit={handleSubmit}>
                <h2>Registro</h2>
                <div>
                    <label>Username:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Register</button>
            </form>
        </>
    );
};

export default RegisterForm;
