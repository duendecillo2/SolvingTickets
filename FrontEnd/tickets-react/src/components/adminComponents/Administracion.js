import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import styles from '../../styles/adminStyles/AdminTicketList.module.css';

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

export default Administracion;