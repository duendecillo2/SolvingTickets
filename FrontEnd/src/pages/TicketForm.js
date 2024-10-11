import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TicketForm = () => {
    const [asunto, setAsunto] = useState('');
    const [mensaje, setMensaje] = useState('');
    const [prioridad, setPrioridad] = useState('M');
    const [categoria, setCategoria] = useState('');
    const [categorias, setCategorias] = useState([]);

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
            categoria, // Aquí se debe enviar el ID de la categoría
        };

        try {
            const response = await axios.post('http://localhost:8000/api/tickets/', ticketData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            console.log('Ticket creado:', response.data);
            alert('Ticket creado exitosamente');

            // Restablece los campos del formulario después de enviar
            setAsunto('');
            setMensaje('');
            setPrioridad('M');
            setCategoria('');
        } catch (error) {
            console.error('Error creando el ticket:', error);
            console.log(error.response.data); // Muestra detalles del error
            alert('Hubo un error al crear el ticket. Inténtalo de nuevo.');
        }
    };

    return (
        <div>
            <h2>Crear Ticket</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="asunto">Asunto:</label>
                    <input
                        type="text"
                        id="asunto"
                        value={asunto}
                        onChange={(e) => setAsunto(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="mensaje">Mensaje:</label>
                    <textarea
                        id="mensaje"
                        value={mensaje}
                        onChange={(e) => setMensaje(e.target.value)}
                        required
                    ></textarea>
                </div>
                <div>
                    <label htmlFor="prioridad">Prioridad:</label>
                    <select
                        id="prioridad"
                        value={prioridad}
                        onChange={(e) => setPrioridad(e.target.value)}
                    >
                        <option value="B">Baja</option>
                        <option value="M">Media</option>
                        <option value="A">Alta</option>
                        <option value="C">Crítica</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="categoria">Categoría:</label>
                    <select
                        id="categoria"
                        value={categoria}
                        onChange={(e) => setCategoria(e.target.value)}
                        required
                    >
                        <option value="">Selecciona una categoría</option>
                        {categorias.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.nombre}
                            </option>
                        ))}
                    </select>
                </div>
                <button type="submit">Enviar Ticket</button>
            </form>
        </div>
    );
};

export default TicketForm;