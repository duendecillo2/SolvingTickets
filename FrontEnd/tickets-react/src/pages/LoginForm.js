import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import styles from '../styles/LoginRegisterForm.module.css'; 
import BackButton from '../components/BackButton';

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

            const token = response.data.token;
            localStorage.setItem('token', token); 

            const profileResponse = await axios.get('http://localhost:8000/api/profile', {
                headers: {
                    'Authorization': `Token ${token}`,
                },
            });

            const userRole = profileResponse.data[0].role;
            console.log(userRole)
            const userStatus = profileResponse.data[0].status;
            //Redirigir segun el rol
            if (userStatus === 'ban') {
                toast.info("Tu cuenta ha sido baneada. Contacta al administrador.");
                navigate('/login');
                return;
            }
            if (userRole === 'user') {
                navigate('/dashboard');
            } else {
                navigate('/adminPage');
            }

            toast.success('Inicio de sesión exitoso');
            
        } catch (error) {
            console.error('Error en el inicio de sesión:', error);
            toast.error('Error en el inicio de sesión. Verifica tus credenciales.');
        }
    };

    return (
    <div className={styles.container}> 
        <div className={styles.wrapper}>
            <div className={styles.formWrapper}>
                <form onSubmit={handleSubmit}>
                    <h2 className={styles.h2}>Login</h2>
                    <BackButton text="Volver" goHome={true} />
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