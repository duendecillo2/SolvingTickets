import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../styles/adminStyles/TicketList.css'; 

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
                        'Authorization': `Token ${token}`,
                    },
                });
                console.log(response.data);
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

    if (loading) return <div className="loading">Cargando tickets...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="ticket-list">
            <h2>Lista de Tickets</h2>
            <table className="ticket-table">
                <thead>
                    <tr>
                        <th>Asunto</th>
                        <th>Prioridad</th>
                        <th>Categoría</th>
                        <th>Fecha Creación</th>
                        <th>Fecha Actualización</th>
                        <th>Estado</th>
                        <th>Agente</th>
                    </tr>
                </thead>
                <tbody>
                    {tickets.map(ticket => (
                        <tr key={ticket.id} className="ticket-row">
                            <td>{ticket.asunto}</td>
                            <td><span className={`badge badge-${ticket.prioridad_display}`}>{ticket.prioridad_display}</span></td>
                            <td>{ticket.categoria}</td>
                            <td>{new Date(ticket.fecha_creacion).toLocaleDateString()}</td>
                            <td>{new Date(ticket.fecha_actualizacion).toLocaleDateString()}</td>
                            <td><span className={`badge badge-${ticket.estado_display}`}>{ticket.estado_display}</span></td>
                            <td>{ticket.agente || 'Sin asignar'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TicketList;
