import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TicketList = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const token = localStorage.getItem('token');

                const response = await axios.get('http://localhost:8000/api/tickets/', {
                    headers: {
                        'Authorization': `Token ${token}`, // Incluye el token en el encabezado
                    },
                });
                setTickets(response.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching tickets:', err);
                setError('Error al obtener los tickets');
                setLoading(false);
            }
        };

        fetchTickets();
    }, []);

    if (loading) return <div>Cargando tickets...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <h2>Lista de Tickets</h2>
            <table>
                <thead>
                    <tr>
                        <th>Asunto</th>
                        <th>Mensaje</th>
                        <th>Estado</th>
                        <th>Prioridad</th>
                        <th>Fecha de Creación</th>
                        <th>Fecha de Actualización</th>
                        <th>Usuario</th>
                        <th>Agente</th>
                        <th>Categoría</th>
                    </tr>
                </thead>
                <tbody>
                    {tickets.map(ticket => (
                        <tr key={ticket.id}>
                            <td>{ticket.asunto}</td>
                            <td>{ticket.mensaje}</td>
                            <td>{ticket.estado}</td> 
                            <td>{ticket.prioridad}</td> 
                            <td>{new Date(ticket.fecha_creacion).toLocaleString()}</td>
                            <td>{new Date(ticket.fecha_actualizacion).toLocaleString()}</td>
                            <td>{ticket.usuario}</td>
                            <td>{ticket.agente || 'Sin asignar'}</td>
                            <td>{ticket.categoria}</td> 
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TicketList;
