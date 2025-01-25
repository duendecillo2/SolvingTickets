import React, { useState } from 'react';
import UserManagement from '../components/adminComponents/UserManagement.js'; // Para gestionar usuarios
import TicketManagement from '../components/adminComponents/TicketList'; // Para gestionar tickets
import Statistics from '../components/adminComponents/Statistics'; // Para mostrar estadísticas
import Settings from '../components/adminComponents/Settings.js'; // Para configurar ajustes
import UserList from '../components/adminComponents/UserList.js';
import '../styles/adminStyles/AdminPage.css';
const AdminPage = () => {
  const [activeSection, setActiveSection] = useState('users'); // Estado para gestionar qué módulo está activo

  const renderSection = () => {
    switch (activeSection) {
      case 'users':
        return <UserManagement />;
      case 'tickets':
        return <TicketManagement />;
      case 'stats':
        return <Statistics />;
      case 'settings':
        return <Settings />;
      default:
        return <UserManagement />;
    }
  };

  return (
    <div className="admin-page">
      <nav className="admin-nav">
        <button onClick={() => setActiveSection('users')}>Usuarios</button>
        <button onClick={() => setActiveSection('tickets')}>Tickets</button>
        <button onClick={() => setActiveSection('stats')}>Estadísticas</button>
        <button onClick={() => setActiveSection('settings')}>Configuraciones</button>
      </nav>
      <div className="admin-content">
        {renderSection()}
      </div>
    </div>
  );
};

export default AdminPage;
