import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import '../styles/TicketList.css'; // Asegúrate de crear este archivo CSS
import { Modal, Box, Button, TextField } from '@mui/material';
import { FaCheck } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import { MdNavigateBefore } from "react-icons/md";
import { IoIosArrowForward } from "react-icons/io";
import { fetchCategorias }from '../utils/categoria'
import BackButton from '../components/BackButton';

const TicketList = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedTicket, setSelectedTicket] = useState(null); // Estado para el ticket seleccionado
    const [isModalOpen, setIsModalOpen] = useState(false); // Estado para controlar el modal
    const [isMessageModalOpen, setIsMessageModalOpen] = useState(false); // Estado para el modal de nuevo mensaje
    const [newMessageText, setNewMessageText] = useState(''); // Estado para el nuevo mensaje
    const [selectedMessageIndex, setSelectedMessageIndex] = useState(0);
    const [ticketMessages, setTicketMessages] = useState([]);
    const [categorias, setCategorias] = useState([]);
    

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
                
                const data = await fetchCategorias();
                setCategorias(data);

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
        setSelectedTicket(ticket); // Guarda el ticket seleccionado

        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(
                `http://localhost:8000/api/ticket-messages/?ticket=${ticket.id}`,
            {
                headers: {
                    Authorization: `Token ${token}`,
                },
            }
        );
            console.log(response)
            // Ordenar los mensajes por fecha, en caso de que la API no los devuelva ordenados
            const sortedMessages = response.data.sort(
                (a, b) => new Date(a.created_at) - new Date(b.created_at)
        );
        
        setTicketMessages(sortedMessages);
        setSelectedMessageIndex(sortedMessages.length - 1);
            
        } catch (error) {
            console.error('Error fetching messages:', error);
        }

        setIsModalOpen(true); // Abre el modal
        
    };

    const closeModal = () => {
        setSelectedTicket(null); // Limpia el ticket seleccionado
        setIsModalOpen(false); // Cierra el modal
    };

    const ticketFinalized = async () => {
        if (!selectedTicket) return; // Asegúrate de que haya un ticket seleccionado
    
        try {
            const token = localStorage.getItem('token');
            const response = await axios.patch(
                `http://localhost:8000/api/tickets/${selectedTicket.id}/actualizar-estado/`,
                { estado: 'C' }, // Cambia 'estado' al campo que usas en tu modelo
                {
                    headers: {
                        'Authorization': `Token ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
    
            // Actualizar el estado local de los tickets
            setTickets(prevTickets =>
                prevTickets.map(ticket =>
                    ticket.id === selectedTicket.id
                        ? { ...ticket, estado: 'cerrado' } // Actualiza el estado en el frontend
                        : ticket
                )
            );
    
            console.log('Ticket actualizado:', response.data);
            closeModal(); // Cierra el modal después de la acción
        } catch (err) {
            console.error('Error al finalizar el ticket:', err);
            toast.error('No se pudo finalizar el ticket. Inténtalo de nuevo.');
        }
    };
    
    const openMessageModal = () => {
        setIsMessageModalOpen(true); // Abre el modal para enviar mensaje
    };

    const closeMessageModal = () => {
        setIsMessageModalOpen(false); // Cierra el modal de mensaje
        setNewMessageText(''); // Limpia el texto del mensaje
    };

    const sendMessage = async () => {
        if (!selectedTicket || !newMessageText) return; // Asegúrate de que haya un ticket seleccionado y un mensaje
        
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                `http://localhost:8000/api/ticket-messages/`, // Asegúrate de que esta URL sea correcta
                { 
                    ticket: selectedTicket.id,
                    mensaje: newMessageText 
                },
                {
                    headers: {
                        'Authorization': `Token ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
    
            console.log('Mensaje enviado:', response.data);
            closeMessageModal(); // Cierra el modal después de enviar el mensaje
            setNewMessageText(''); // Limpia el texto del mensaje
        } catch (err) {
            console.error('Error al enviar mensaje:', err);
            toast.error('No se pudo enviar el mensaje. Inténtalo de nuevo.');
        }
    };

    const handlePrevMessage = () => {
        setSelectedMessageIndex(prev => Math.max(prev - 1, 0)); // Navega al mensaje anterior
    };

    const handleNextMessage = () => {
        setSelectedMessageIndex(prev => Math.min(prev + 1, ticketMessages.length - 1)); // Navega al siguiente mensaje
    };  

    if (loading) return <div className="loading">Cargando tickets...</div>;
    if (error) return <div className="error">{error}</div>;

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
                <button
                    className="view-ticket-button"
                    onClick={() => handleViewTicket(ticket)}
                >
                    Ver Ticket
                </button>
                </td>
            </tr>
            );
        })}
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
                        <Button onClick={handlePrevMessage} disabled={selectedMessageIndex === 0}>
                                    <MdNavigateBefore style={{ fontSize: '2rem' }} />
                        </Button>
                        <Button onClick={handleNextMessage} disabled={selectedMessageIndex === ticketMessages.length - 1}>
                                    <IoIosArrowForward style={{ fontSize: '2rem' }} />
                        </Button>
                        <h3>Detalles del Ticket</h3>
                        <p><strong>Asunto:</strong> {selectedTicket.asunto}</p>
                        <p><strong>Mensaje:</strong> {ticketMessages[selectedMessageIndex]?.mensaje}</p>
                        <p><strong>Respuesta:</strong> {ticketMessages[selectedMessageIndex]?.respuesta || 'Sin respuesta aún'}</p>
                        
                        {/* Botones */}
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Button onClick={closeModal} variant="contained" color="primary">
                                Cerrar
                            </Button>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <Button onClick={ticketFinalized} variant="contained" color="success">
                                    <FaCheck />
                                </Button>
                                <Button onClick={openMessageModal} variant="contained" color="error">
                                    <ImCross />
                                </Button>
                            </div>
                        </div>
                    </Box>
                </Modal>
            )}

            {/* Modal para enviar un nuevo mensaje */}
            {isMessageModalOpen && (
                <Modal open={isMessageModalOpen} onClose={closeMessageModal}>
                    <Box
                        sx={{
                            margin : '30px' ,
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            bgcolor: '#1c1c1c',
                            color: '#7D3C98',
                            borderRadius: '20px',
                            boxShadow: 24,
                            p: 4,
                            width: '400px',
                        }}
                    >
                        <h3>Ticket #{selectedTicket.id}</h3>
                        <p>Nuevo mensaje:</p>
                        <TextField
                            multiline
                            rows={4}
                            fullWidth
                            value={newMessageText}
                            onChange={(e) => setNewMessageText(e.target.value)}
                            variant="outlined"
                            color="primary"
                            InputProps={{
                                style: {
                                  color: 'white', // Cambia el color del texto a blanco
                                },
                            }}
                        />
                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
                            <Button
                                onClick={sendMessage}
                                variant="contained"
                                color="primary"
                            >
                                Enviar
                            </Button>
                        </div>
                    </Box>
                </Modal>
            )}
        </div>
    );
};

export default TicketList;
