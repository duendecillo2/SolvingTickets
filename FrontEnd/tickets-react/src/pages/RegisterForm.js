import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate, Link } from 'react-router-dom';
import styles from '../styles/LoginRegisterForm.module.css'; // Importa el mismo archivo de estilos
import BackButton from '../components/BackButton';

const RegisterForm = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
    
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            toast.error('Por favor, ingresa un correo electrónico válido (debe contener un "@" y un ".").');
            return;
        }
    
        try {
            await axios.post('http://localhost:8000/api/usuarios/', {
                username,
                email,
                password,
            });
            toast.success('Registro exitoso. Ahora puedes iniciar sesión.');
            navigate('/login');
        } catch (error) {
            console.error('Error en el registro:', error);
            toast.error('Error en el registro. Por favor, verifica los datos.');
        }
    };

    return (
    <div className={styles.container}> 
        <div className={styles.wrapper}>
            <div className={styles.formWrapper}>
                <form onSubmit={handleSubmit}>
                    <h2 className={styles.h2}>Register</h2>
                    <BackButton text="Volver" />
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
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <label>Email</label>
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
                    <button type="submit" className={styles.button}>Register</button>
                    <div className={styles.signUpLink}>
                        <p>
                            Already have an account? <Link to="/login" className={styles.signUpBtnLink}>Sign In</Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    </div>  
    );
};

export default RegisterForm;
