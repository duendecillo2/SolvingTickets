import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import '../styles/TicketList.css';
import { Modal, Box, Button, Typography } from '@mui/material';
import { FaCheck } from "react-icons/fa";
import BackButton from '../components/BackButton';
import { fetchCategorias } from '../utils/categoria';

const TicketList = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isOpinionModalOpen, setIsOpinionModalOpen] = useState(false);
    const [ticketMessages, setTicketMessages] = useState([]);
    const [selectedMessageIndex, setSelectedMessageIndex] = useState(0);
    const [categorias, setCategorias] = useState([]);

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/tickets/`, {
                    headers: { 'Authorization': `Token ${token}` },
                });

                setTickets(response.data);
                setCategorias(await fetchCategorias());
                setLoading(false);
            } catch (err) {
                console.error('Error fetching tickets:', err);
                setError('Error al obtener los tickets');
                setLoading(false);
            }
        };

        fetchTickets();
    }, []);

    const handleViewTicket = async (ticket) => {
        setSelectedTicket(ticket);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(
                `${process.env.REACT_APP_API_URL}/ticket-messages/?ticket=${ticket.id}`,
                { headers: { Authorization: `Token ${token}` } }
            );
            const sortedMessages = response.data.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
            setTicketMessages(sortedMessages);
            setSelectedMessageIndex(sortedMessages.length - 1);
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        // No restablecemos selectedTicket aquí para que se conserve en el modal de opinión
    };

    const closeOpinionModal = () => {
        setIsOpinionModalOpen(false);
        setSelectedTicket(null); // Ahora sí podemos resetearlo después del flujo de opinión
    };

    const ticketFinalized = async () => {
        if (!selectedTicket) return;
        try {
            const token = localStorage.getItem('token');
            await axios.patch(
                `${process.env.REACT_APP_API_URL}/tickets/${selectedTicket.id}/actualizar-estado/`,
                { estado: 'C' },
                { headers: { 'Authorization': `Token ${token}`, 'Content-Type': 'application/json' } }
            );

            setTickets(prevTickets =>
                prevTickets.map(ticket =>
                    ticket.id === selectedTicket.id ? { ...ticket, estado: 'cerrado' } : ticket
                )
            );

            closeModal();
            setIsOpinionModalOpen(true); // Abre el modal de opinión
        } catch (err) {
            console.error('Error al finalizar el ticket:', err);
            toast.error('No se pudo finalizar el ticket. Inténtalo de nuevo.');
        }
    };

    return (
        <div className="ticket-list">
            <h2>Lista de Tickets</h2>
            <BackButton text="Volver" />
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
                    {tickets.map(ticket => {
                        const categoria = categorias.find(cat => cat.id === ticket.categoria);
                        return (
                            <tr key={ticket.id} className="ticket-row">
                                <td>{ticket.asunto}</td>
                                <td>
                                    <span className={`badge badge-${ticket.prioridad_display}`}>
                                        {ticket.prioridad_display}
                                    </span>
                                </td>
                                <td>{categoria ? categoria.nombre : "Sin Categoría"}</td>
                                <td>{new Date(ticket.fecha_creacion).toLocaleDateString()}</td>
                                <td>{new Date(ticket.fecha_actualizacion).toLocaleDateString()}</td>
                                <td>
                                    <span className={`badge badge-${ticket.estado_display}`}>
                                        {ticket.estado_display}
                                    </span>
                                </td>
                                <td>{ticket.agente || 'Sin asignar'}</td>
                                <td>
                                    <button className="view-ticket-button" onClick={() => handleViewTicket(ticket)}>
                                        Ver Ticket
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            {/* Modal para detalles del ticket */}
            <Modal open={isModalOpen} onClose={closeModal}>
                <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: '#1c1c1c', color: '#ffffff', borderRadius: '10px', boxShadow: 24, p: 4, width: '400px' }}>
                    <h3>Detalles del Ticket</h3>
                    <p><strong>Asunto:</strong> {selectedTicket?.asunto}</p>
                    <p><strong>Mensaje:</strong> {ticketMessages[selectedMessageIndex]?.mensaje}</p>
                    <p><strong>Respuesta:</strong> {ticketMessages[selectedMessageIndex]?.respuesta || 'Sin respuesta aún'}</p>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Button onClick={closeModal} variant="contained" color="primary">
                            Cerrar
                        </Button>
                        <Button onClick={ticketFinalized} variant="contained" color="success">
                            <FaCheck />
                        </Button>
                    </div>
                </Box>
            </Modal>

            {/* Modal de opinión */}
            <Modal open={isOpinionModalOpen} onClose={closeOpinionModal}>
                <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: '#1c1c1c', color: '#ffffff', borderRadius: '10px', boxShadow: 24, p: 4, width: '400px', textAlign: 'center' }}>
                    <Typography variant="h6" gutterBottom>
                        Nos ayudaría que opines sobre nuestro administrador: {selectedTicket?.agente || 'Sin asignar'}
                    </Typography>
                    <Button variant="contained" color="success" onClick={closeOpinionModal}>
                        Opinar
                    </Button>
                </Box>
            </Modal>
        </div>
    );
};

export default TicketList;