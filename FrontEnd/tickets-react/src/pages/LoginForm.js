import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/LoginForm.css'; 

const LoginForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.post('http://localhost:8000/api/login/', {
                username,
                password,
            });

            localStorage.setItem('token', response.data.access);
            alert('Inicio de sesión exitoso');
            navigate('/dashboard');
        } catch (error) {
            console.error('Error en el inicio de sesión:', error);
            alert('Error en el inicio de sesión. Verifica tus credenciales.');
        }
    };

    return (
        <div className="wrapper">
            <div className="form-wrapper sign-in">
                <form onSubmit={handleSubmit}>
                    <h2>Login</h2>
                    <div className="input-group">
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                        <label>Username</label>
                    </div>
                    <div className="input-group">
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <label>Password</label>
                    </div>
                    <div className="remember">
                        <label>
                            <input type="checkbox" /> Remember me
                        </label>
                    </div>
                    <button type="submit">Login</button>
                    <div className="signUp-link">
                        <p>
                            Don't have an account? <a href="/register" className="signUpBtn-link">Sign Up</a>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginForm;
