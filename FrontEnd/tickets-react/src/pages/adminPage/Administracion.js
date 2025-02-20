import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import { Modal, Box, TextField, Button, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import '../../styles/AdminTicketList.module.css';
import { MdNavigateBefore } from "react-icons/md";
import { IoIosArrowForward } from "react-icons/io";
import { fetchCategorias } from '../../utils/categoria';

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

const Administracion = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [ticketMessages, setTicketMessages] = useState([]);
  const [selectedMessageIndex, setSelectedMessageIndex] = useState(0);
  const [responseMessage, setResponseMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTechnicianModalOpen, setIsTechnicianModalOpen] = useState(false);
  const [technicians, setTechnicians] = useState([]);
  const [selectedTechnician, setSelectedTechnician] = useState('');
  const [isCategoriaModalOpen, setIsCategoriaModalOpen] = useState(false);
  const [newCategoria, setNewCategoria] = useState('');


  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/tickets/`, { //Probar
          headers: {
            Authorization: `Token ${token}`,
          },
        });

        const categorias = await fetchCategorias();

        const ticketsConCategoria = response.data.map(ticket => {
          const categoria = categorias.find(cat => cat.id === ticket.categoria);
          return {
            ...ticket,
            categoria_nombre: categoria ? categoria.nombre : 'Desconocida',
          };
        });

        setTickets(ticketsConCategoria);
      } catch (error) {
        console.error('Error fetching tickets:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, []);

  const handleAction = async (ticket) => {
    setSelectedTicket(ticket);
    setResponseMessage('');
    setSelectedMessageIndex(0);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/ticket-messages/?ticket=${ticket.id}`,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      const sortedMessages = response.data.sort(
        (a, b) => new Date(a.created_at) - new Date(b.created_at)
      );

      setTicketMessages(sortedMessages);
      setSelectedMessageIndex(sortedMessages.length - 1);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }

    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTicket(null);
    setTicketMessages([]);
    setSelectedMessageIndex(0);
  };

  const handleSubmitResponse = async () => {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        alert('No hay un token de autenticación válido. Por favor, inicie sesión.');
        return;
      }

      let fullResponseMessage = responseMessage;
      if (selectedTechnician) {
        fullResponseMessage += `- Asignado a: ${selectedTechnician.nombre + ', email: ' + selectedTechnician.email + ', telefono: ' + selectedTechnician.numtel}`;
      }



      await axios.post(
        `${process.env.REACT_APP_API_URL}/ticket-messages/${ticketMessages[selectedMessageIndex].id}/responder/`,
        { respuesta: fullResponseMessage },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,
          },
        }
      );
    } catch (error) {
      console.error('Error al mandar respuesta', error);
    }

    console.log(`Responding to ticket ID ${selectedTicket.id}: ${responseMessage}`);
    handleCloseModal();
  };

  const handlePrevMessage = () => {
    setSelectedMessageIndex(prev => Math.max(prev - 1, 0));
  };

  const handleNextMessage = () => {
    setSelectedMessageIndex(prev => Math.min(prev + 1, ticketMessages.length - 1));
  };

  const handleDeleteTicket = async (ticketId) => {
    const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar este ticket?');
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${process.env.REACT_APP_API_URL}/tickets/${ticketId}/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      // Eliminar el ticket del estado local
      setTickets(prevTickets => prevTickets.filter(ticket => ticket.id !== ticketId));
      alert('Ticket eliminado con éxito.');
    } catch (error) {
      console.error('Error al eliminar el ticket:', error);
      alert('Hubo un error al eliminar el ticket.');
    }
  };

const handleTechnician = async () => {
  try {
    const token = localStorage.getItem('token');
    const tecnicos = await axios.get(`${process.env.REACT_APP_URL}/trabajadores/`, {
      headers: {
        Authorization: `Token ${token}`,
      },
    });
    console.log(tecnicos.data); 
    const techniciansArray = Object.values(tecnicos.data);
    setTechnicians(techniciansArray);
  } catch (error) {
    console.error('Error al obtener los tecnicos disponibles:', error);
    alert('Hubo un error al obtener los tecnicos.');
  }
  setIsTechnicianModalOpen(true);
};

const handleSelectTechnician = (e) => {
  setSelectedTechnician(e.target.value);
  setIsTechnicianModalOpen(false);
};

  const handleAddCategoria = async () => {
    console.log("sfsdfd")
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${process.env.REACT_APP_API_URL}/categorias/`, 
        { nombre: newCategoria },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,
          },
        }
      );
      setIsCategoriaModalOpen(false);
      alert('Categoría agregada correctamente.');
    } catch (error) {
      console.error('Error al agregar categoría:', error);
      alert('Hubo un error al agregar la categoría.');
    }
  };

const handleSelectTechnician = (e) => {
  setSelectedTechnician(e.target.value);
  setIsTechnicianModalOpen(false);
};

  const handleAddCategoria = async () => {
    console.log("sfsdfd")
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${process.env.REACT_APP_API_URL}/categorias/`, 
        { nombre: newCategoria },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,
          },
        }
      );
      setIsCategoriaModalOpen(false);
      alert('Categoría agregada correctamente.');
    } catch (error) {
      console.error('Error al agregar categoría:', error);
      alert('Hubo un error al agregar la categoría.');
    }
  };
  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'asunto', headerName: 'Asunto', width: 200 },
    { field: 'prioridad_display', headerName: 'Prioridad', width: 130 },
    { field: 'categoria_nombre', headerName: 'Categoría', width: 130 },
    { field: 'estado_display', headerName: 'Estado', width: 130 },
    { field: 'fecha_creacion', headerName: 'Fecha Creación', width: 180 },
    { field: 'fecha_actualizacion', headerName: 'Fecha Actualización', width: 180 },
    {
      field: 'actions',
      headerName: 'Acciones',
      width: 250,
      renderCell: (params) => (
        <>
          <button
            className="btn-respond"
            onClick={() => handleAction(params.row)}
            style={{
              backgroundColor: '#7D3C98',
              color: '#fff',
              border: 'none',
              padding: '5px 10px',
              borderRadius: '5px',
              cursor: 'pointer',
              marginRight: '10px',
            }}
          >
            Responder
          </button>
          <button
            className="btn-delete"
            onClick={() => handleDeleteTicket(params.row.id)}
            style={{
              backgroundColor: '#D32F2F',
              color: '#fff',
              border: 'none',
              padding: '5px 10px',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            Eliminar
          </button>
        </>
      ),
    },
  ];

  return (
    <ThemeProvider theme={theme}>
      <div style={{ height: 600, width: '100%' }}>
        {/* Contenedor para el título y el botón */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <h1 style={{ margin: 0 }}>Administración de Tickets</h1>
          <button
            onClick={() => setIsCategoriaModalOpen(true)}
            style={{
              backgroundColor: '#7D3C98',
              color: '#fff',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            Agregar Categoría
          </button>
        </div>
        <DataGrid
          rows={tickets}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 20]}
          loading={loading}
          getRowId={(row) => row.id}
        />
      </div>

      {/* Modal */}
      <Modal open={isModalOpen} onClose={handleCloseModal}>
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
            width: '500px',
          }}
        >
          <Button onClick={handlePrevMessage} disabled={selectedMessageIndex === 0}>
            <MdNavigateBefore style={{ fontSize: '2rem' }} />
          </Button>
          <Button onClick={handleNextMessage} disabled={selectedMessageIndex === ticketMessages.length - 1}>
            <IoIosArrowForward style={{ fontSize: '2rem' }} />
          </Button>
          <h2>Responder Ticket</h2>
          {selectedTicket && <p><strong>Asunto:</strong> {selectedTicket.asunto}</p>}
          {ticketMessages.length > 0 && (
            <>
              <p><strong>Mensaje anterior:</strong></p>
              <TextField
                value={ticketMessages[selectedMessageIndex]?.mensaje || ''}
                InputProps={{
                  readOnly: true,
                }}
                fullWidth
                variant="outlined"
                sx={{
                  marginBottom: 2,
                  backgroundColor: '#333333',
                  borderRadius: '5px',
                  color: '#ffffff',
                }}
              />
            </>
          )}
          <p><strong>Respuesta:</strong></p>
          <TextField
            multiline
            rows={4}
            variant="outlined"
            fullWidth
            value={ticketMessages[selectedMessageIndex]?.respuesta || responseMessage}
            onChange={(e) => setResponseMessage(e.target.value)}
            sx={{
              marginBottom: 2,
              backgroundColor: '#333333',
              borderRadius: '5px',
              color: '#ffffff',
            }}
          />
          {/* Contenedor de botones alineados */}
          <div style={{ display: 'flex', marginTop: '10px' }}>
            <Button variant="contained" color="primary" onClick={handleSubmitResponse} sx={{ flex: 1, marginRight: 1 }}>
              Enviar
            </Button>
            <Button variant="outlined" onClick={handleCloseModal} color="secondary" sx={{ flex: 1, marginRight: 1 }}>
              Cancelar
            </Button>
            <Button variant="contained" onClick={handleTechnician} sx={{ flex: 2 }}>
              Asignar Técnico
            </Button>
          </div>

        </Box>
      </Modal>


      <Modal open={isTechnicianModalOpen} onClose={() => setIsTechnicianModalOpen(false)}>
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
          <h2>Seleccionar Técnico</h2>
          <FormControl fullWidth>
            <InputLabel id="label-tecnico">Técnico</InputLabel>
            <Select
              labelId="label-tecnico"
              value={selectedTechnician}
              onChange={handleSelectTechnician}
              sx={{
                marginBottom: 2,
                backgroundColor: '#333333',
                borderRadius: '5px',
                color: '#ffffff',
              }}
            >
              {technicians.map((tech) => (
                <MenuItem key={tech.id} value={{ nombre: tech.nombre, numtel: tech.numtel, email: tech.email }}>
                  {tech.nombre} - {tech.profesion}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button variant="contained" color="secondary" onClick={() => setIsTechnicianModalOpen(false)}>
            Cancelar
          </Button>
        </Box>
      </Modal>

      <Modal open={isCategoriaModalOpen} onClose={() => setIsCategoriaModalOpen(false)}>
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
        <h2>Agregar Nueva Categoría</h2>
        <TextField
          label="Nombre de la Categoría"
          variant="outlined"
          fullWidth
          value={newCategoria}
          onChange={(e) => setNewCategoria(e.target.value)}
          sx={{
            marginBottom: 2,
            backgroundColor: '#333333',
            borderRadius: '5px',
            color: '#ffffff',
          }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
          <Button variant="contained" color="primary" onClick={handleAddCategoria} sx={{ marginRight: 2 }}>
            Agregar
          </Button>
          <Button variant="outlined" onClick={() => setIsCategoriaModalOpen(false)} color="secondary">
            Cancelar
          </Button>
        </Box>
      </Box>
    </Modal>


    </ThemeProvider>
  );
};

export default Administracion;
