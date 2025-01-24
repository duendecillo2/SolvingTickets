import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import '../styles/AdminTicketList.module.css';

const theme = createTheme({
    palette: {
      primary: {
        main: '#7D3C98', // Color morado
      },
      text: {
        primary: '#ffffff', // Letras blancas para encabezados
      },
      background: {
        default: '#000000', // Fondo negro
        paper: '#1c1c1c', // Fondo oscuro para tabla
      },
    },
    components: {
      MuiDataGrid: {
        styleOverrides: {
          root: {
            color: '#ffffff', // Texto blanco para todas las celdas
            backgroundColor: '#1c1c1c', // Fondo de la tabla
          },
          columnHeaders: {
            backgroundColor: '#333333', // Fondo oscuro para encabezados
            color: '#ffffff', // Texto blanco para encabezados
            fontWeight: 'bold',
          },
        },
      },
    },
  });
  

const columns = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'asunto', headerName: 'Asunto', width: 200 },
  { field: 'prioridad_display', headerName: 'Prioridad', width: 130 },
  { field: 'categoria', headerName: 'Categoría', width: 130 },
  { field: 'estado_display', headerName: 'Estado', width: 130 },
  { field: 'fecha_creacion', headerName: 'Fecha Creación', width: 180 },
  { field: 'fecha_actualizacion', headerName: 'Fecha Actualización', width: 180 },
  {
    field: 'actions',
    headerName: 'Acciones',
    width: 150,
    renderCell: (params) => (
      <div>
        <button className="btn-respond" onClick={() => handleAction(params.row)}>Responder</button>
      </div>
    ),
  },
];

const handleAction = (row) => {
  alert(`Acción en ticket: ${row.asunto}`);
};

const Administracion = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8000/api/tickets/', {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        setTickets(response.data);
      } catch (error) {
        console.error('Error fetching tickets:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <div style={{ height: 600, width: '100%' }}>
        <h1>Administración de Tickets</h1>
        <DataGrid
          rows={tickets}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 20]}
          loading={loading}
          getRowId={(row) => row.id}
        />
      </div>
    </ThemeProvider>
  );
};
import React, { useEffect, useState } from 'react'; // Importa React y los hooks useEffect y useState desde la biblioteca de React.
import axios from 'axios'; // Importa axios para hacer solicitudes HTTP.
import '../styles/Administracion.css'; // Importa el archivo CSS para los estilos de esta vista.

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
