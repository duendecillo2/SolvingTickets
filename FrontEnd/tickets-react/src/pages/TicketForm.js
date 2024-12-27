import React, { useState, useEffect } from 'react';
import { fetchCategorias } from '../utils/categoria'; // Asegúrate de tener este archivo en tu proyecto
import styles from '../styles/CreateTicketForm.module.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateTicketForm = () => {
    const [asunto, setAsunto] = useState('');
    const [mensaje, setMensaje] = useState('');
    const [prioridad, setPrioridad] = useState('M');
    const [categoria, setCategoria] = useState('');
    const [categorias, setCategorias] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            const data = await fetchCategorias();
            setCategorias(data);
        };

        fetchData();
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();

        const ticketData = {
            asunto,
            mensaje,
            prioridad,
            categoria,
        };

        try {
            const token = localStorage.getItem('token'); 

            if (!token) {
                alert('No hay un token de autenticación válido. Por favor, inicie sesión.');
                return;
            }

            await axios.post('http://localhost:8000/api/tickets/', ticketData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`, // Aquí se pasa correctamente el token
                },
            });

            alert('Ticket creado exitosamente');
            navigate('/dashboard');
        } catch (error) {
            console.error('Error al crear el ticket:', error);
            alert('Error al crear el ticket. Verifica los datos ingresados.');
        }
    };

    return (
        <div className={styles.container}>
            <form onSubmit={handleSubmit}>
                <h2 className={styles.h2}>Crear Ticket</h2>
                <div className={styles.inputGroup}>
                    <input
                        type="text"
                        value={asunto}
                        onChange={(e) => setAsunto(e.target.value)}
                        required
                    />
                    <label>Asunto</label>
                </div>
                <div className={styles.inputGroup}>
                    <textarea
                        value={mensaje}
                        onChange={(e) => setMensaje(e.target.value)}
                        required
                    />
                    <label>Mensaje</label>
                </div>
                <div className={styles.inputGroup}>
                    <select
                        value={prioridad}
                        onChange={(e) => setPrioridad(e.target.value)}
                        required
                    >
                        <option value="B">Baja</option>
                        <option value="M">Media</option>
                        <option value="A">Alta</option>
                        <option value="C">Crítica</option>
                    </select>
                    <label>Prioridad</label>
                </div>
                <div className={styles.inputGroup}>
                    <select
                        value={categoria}
                        onChange={(e) => setCategoria(e.target.value)}
                        required
                    >
                        <option value="">Seleccione una categoría</option>
                        {categorias.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                        ))}
                    </select>
                    <label>Categoría</label>
                </div>
                <button type="submit" className={styles.button}>Crear Ticket</button>
            </form>
        </div>
    );
};

export default CreateTicketForm;
