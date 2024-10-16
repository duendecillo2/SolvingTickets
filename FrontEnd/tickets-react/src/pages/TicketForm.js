import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/TicketForm.module.css'; // Asegúrate de que la ruta sea correcta

const TicketForm = () => {
    const [asunto, setAsunto] = useState('');
    const [mensaje, setMensaje] = useState('');
    const [prioridad, setPrioridad] = useState('M');
    const [categoria, setCategoria] = useState('');
    const [categorias, setCategorias] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCategorias = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/categorias/');
                setCategorias(response.data);
            } catch (error) {
                console.error('Error fetching categorias:', error);
            }
        };

        fetchCategorias();
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

            await axios.post('http://localhost:8000/api/tickets/', ticketData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`,
                },
            });
            alert('Ticket creado exitosamente');

            // Redirigir a la lista de tickets o a otra página
            navigate('/tickets'); // Cambia la ruta según tu aplicación

            // Restablecer campos
            setAsunto('');
            setMensaje('');
            setPrioridad('M');
            setCategoria('');
        } catch (error) {
            console.error('Error creando el ticket:', error);
            alert('Hubo un error al crear el ticket. Inténtalo de nuevo.');
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.wrapper}>
                <div className={styles.formWrapper}>
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
                                rows="4"
                            />
                            <label>Mensaje</label>
                        </div>
                        <div className={styles.inputGroup}>
                            <select
                                value={prioridad}
                                onChange={(e) => setPrioridad(e.target.value)}
                                required
                            >
                                <option value="" disabled hidden></option> {/* Opción oculta como placeholder */}
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
                                <option value="" disabled hidden></option> {/* Opción oculta como placeholder */}
                                {categorias.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.nombre}
                                    </option>
                                ))}
                            </select>
                            <label>Categoría</label>
                        </div>
                        <button type="submit" className={styles.button}>Enviar Ticket</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default TicketForm;
