import React, { useState } from 'react';
import  UserManagement from '../pages/adminPage/UserManagement.js';
import Administracion from '../pages/adminPage/Administracion';
import AdminStats from '../pages/adminPage/Estadisticas';
import '../styles/AdminPage.css';



const AdminPage = () => {
  const [activeSection, setActiveSection] = useState('users'); // Estado para gestionar qué módulo está activo

  const renderSection = () => {
    switch (activeSection) {
      case 'users':
        return <UserManagement />;
      case 'tickets':
        return <Administracion />;
      case 'stats':
        return <AdminStats/>;
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
      </nav>
      <div className="admin-content">
        {renderSection()}
      </div>
    </div>
  );
};

export default AdminPage;