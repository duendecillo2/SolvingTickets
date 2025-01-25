import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/TicketList.css'; // Asegúrate de crear este archivo CSS
import { Modal, Box, Button } from '@mui/material';

const TicketList = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedTicket, setSelectedTicket] = useState(null); // Estado para el ticket seleccionado
    const [isModalOpen, setIsModalOpen] = useState(false); // Estado para controlar el modal

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

    const handleViewTicket = (ticket) => {
        console.log("Ticket seleccionado:", ticket);
        console.log("Modal abierto:", isModalOpen);
        setSelectedTicket(ticket); // Guarda el ticket seleccionado
        setIsModalOpen(true); // Abre el modal
        
    };

    const closeModal = () => {
        setSelectedTicket(null); // Limpia el ticket seleccionado
        setIsModalOpen(false); // Cierra el modal
    };

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
                        <th>Acciones</th>
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
                            <td>
                                <button
                                    className="view-ticket-button"
                                    onClick={() => handleViewTicket(ticket)}
                                >
                                    Ver Ticket
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Modal para detalles del ticket */}
      {isModalOpen && selectedTicket && (
        <Modal open={isModalOpen} onClose={closeModal}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              bgcolor: '#1c1c1c',
              color: '#ffffff',
              borderRadius: '10px',
              boxShadow: 24,
              p: 4,
              width: '400px',
            }}
          >
            <h3>Detalles del Ticket</h3>
            <p><strong>Asunto:</strong> {selectedTicket.asunto}</p>
            <p><strong>Mensaje:</strong> {selectedTicket.mensaje}</p>
            <p><strong>Respuesta:</strong> {selectedTicket.respuesta || 'Sin respuesta aún'}</p>
            <Button
              onClick={closeModal}
              variant="contained"
              color="primary"
              sx={{ marginTop: 2 }}
            >
              Cerrar
            </Button>
          </Box>
        </Modal>
            )}
        </div>
    );
};

export default TicketList;
