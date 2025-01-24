import React, { useEffect, useState } from 'react'; // Importa React y los hooks useEffect y useState desde la biblioteca de React.
import axios from 'axios'; // Importa axios para hacer solicitudes HTTP.
import '../styles/Administrador.css'; // Importa el archivo CSS para los estilos de esta vista.

const Administracion = () => { // Define un componente funcional llamado TicketList.
    const [tickets, setTickets] = useState([]); // Declara un estado llamado tickets y una función setTickets para actualizarlo. Inicialmente es un array vacío.
    const [loading, setLoading] = useState(true); // Declara un estado llamado loading y una función setLoading para actualizarlo. Inicialmente es true.
    const [error, setError] = useState(''); // Declara un estado llamado error y una función setError para actualizarlo. Inicialmente es una cadena vacía.

    useEffect(() => { // useEffect se usa para realizar efectos secundarios en componentes funcionales.
        const fetchTickets = async () => { // Define una función asíncrona para obtener los tickets.
            try {
                const token = localStorage.getItem('token'); // Obtiene el token de autenticación del almacenamiento local.
                console.log(token); // Imprime el token en la consola.  
                const response = await axios.get('http://localhost:8000/api/tickets/', { // Hace una solicitud GET a la API para obtener los tickets.
                    headers: {
                        'Authorization': `Token ${token}`, // Incluye el token en los encabezados de la solicitud.
                    },
                });
                console.log(response.data); // Imprime los datos de la respuesta en la consola.
                setTickets(response.data); // Actualiza el estado tickets con los datos obtenidos.
                setLoading(false); // Cambia el estado loading a false.
            } catch (err) {
                console.error('Error fetching tickets:', err); // Imprime el error en la consola si ocurre uno.
                setError('Error al obtener los tickets'); // Actualiza el estado error con un mensaje de error.
                setLoading(false); // Cambia el estado loading a false.
            }
        };

        fetchTickets(); // Llama a la función fetchTickets para obtener los tickets.
    }, []); // El array vacio como segundo argumento asegura que este efecto solo se ejecute una vez después de la renderización inicial.

    if (loading) return <div className="loading">Cargando tickets...</div>; // Si loading es true, muestra un mensaje de carga.
    if (error) return <div className="error">{error}</div>; // Si hay un error, muestra el mensaje de error.

    return ( // Renderiza la lista de tickets.
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
                        <th>Respuesta</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {tickets.map(ticket => ( // Mapea cada ticket a una fila de la tabla.
                        <tr key={ticket.id} className="ticket-row">
                            <td>{ticket.asunto}</td>
                            <td><span className={`badge badge-${ticket.prioridad_display}`}>{ticket.prioridad_display}</span></td>
                            <td>{ticket.categoria}</td>
                            <td>{new Date(ticket.fecha_creacion).toLocaleDateString()}</td>
                            <td>{new Date(ticket.fecha_actualizacion).toLocaleDateString()}</td>
                            <td><span className={`badge badge-${ticket.estado_display}`}>{ticket.estado_display}</span></td>
                            <td>{ticket.agente || 'Sin asignar'}</td>
                            <td>{ticket.respuesta}</td>
                            <td>
                                <button className="btn btn-success">
                                    <i className="fas fa-check"></i>
                                </button>
                                <button className="btn btn-danger">
                                    <i className="fas fa-times"></i>
                                </button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

}

export default Administracion; // Exporta el componente Administracion para que pueda ser usado en otras partes de la aplicación.