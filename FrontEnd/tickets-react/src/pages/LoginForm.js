import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import styles from '../styles/LoginRegisterForm.module.css'; 

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

            localStorage.setItem('token', response.data.token); 
            alert('Inicio de sesión exitoso');
            navigate('/dashboard');
        } catch (error) {
            console.error('Error en el inicio de sesión:', error);
            alert('Error en el inicio de sesión. Verifica tus credenciales.');
        }
    };

    return (
    <div className={styles.container}> 
        <div className={styles.wrapper}>
            <div className={styles.formWrapper}>
                <form onSubmit={handleSubmit}>
                    <h2 className={styles.h2}>Login</h2>
                    <div className={styles.inputGroup}>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                        <label>Username</label>
                    </div>
                    <div className={styles.inputGroup}>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <label>Password</label>
                    </div>
                    <div className={styles.remember}>
                        <label>
                            <input type="checkbox" /> Remember me
                        </label>
                    </div>
                    <button type="submit" className={styles.button}>Login</button>
                    <div className={styles.signUpLink}>
                        <p>
                            Don't have an account? <Link to="/register" className={styles.signUpBtnLink}>Sign Up</Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
      </div>  
    );
};

export default LoginForm;
