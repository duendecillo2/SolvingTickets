import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import '../../styles/UserManagement.css'; // Asegúrate de que la ruta sea correcta

Modal.setAppElement('#root'); // Asegúrate de que el elemento raíz sea correcto

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editUser, setEditUser] = useState(null);
  const [newRole, setNewRole] = useState('');
  

  useEffect(() => {
    // Obtener la información del usuario actual del localStorage

    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found');
        }
        const response = await axios.get('http://localhost:8000/api/users/', {
          headers: {
            'Authorization': `Token ${token}`,
          },
        });
        setUsers(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Error fetching users');
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleEdit = (user) => {
    if (!editUser) { // Solo abrir si no hay un modal ya abierto
      setEditUser(user);
      setNewRole(user.profile__role);
    }
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');
      
  
      // Realizar la solicitud PATCH para actualizar el rol del usuario
      await axios.patch(
        `http://localhost:8000/api/users/${editUser.id}/edit/`,
        { role: newRole },
        {
          headers: {
            'Authorization': `Token ${token}`},
        }
      );
      // Actualizar el estado local
      setUsers(
        users.map((u) =>
          u.id === editUser.id ? { ...u, profile__role: newRole } : u
        )
      );
      setEditUser(null);
    } catch (err) {
      console.error('Error saving user:', err.response?.data || err.message);
      alert('Error al guardar. Verifica permisos de administrador.');
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      if (window.confirm('This action is irreversible. Confirm deletion?')) {
        try {
          const token = localStorage.getItem('token');
          if (!token) {
            throw new Error('No token found');
          }
          await axios.delete(
            `http://localhost:8000/api/users/${userId}/delete/`,
            {
              headers: {
                'Authorization': `Token ${token}`,
              },
            }
          );
          setUsers(users.filter((u) => u.id !== userId));
        } catch (err) {
          console.error('Error deleting user:', err);
          if (err.response && err.response.status === 403) {
            alert('You do not have permission to delete this user.');
          } else {
            setError('Error deleting user');
          }
        }
      }
    }
  };

  const handleToggleActive = async (userId, isActive) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }


      const response = await axios.patch(
        `http://localhost:8000/api/users/${userId}/toggle-active/`,
        { is_active: !isActive },
        {
          headers: {
            'Authorization': `Token ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setUsers(
          users.map((u) =>
            u.id === userId ? { ...u, is_active: !isActive } : u
          )
        );
        alert(
          `User has been ${!isActive ? 'unbanned' : 'banned'} successfully.`
        );
      }
    } catch (err) {
      console.error('Error toggling user active status:', err);
      alert('Error: Only agents can perform this action.');
    }
  };

  if (loading) return <div className="loading">Loading users...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="user-management">
      <h2>User Management</h2>
      <table className="user-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className={!user.is_active ? 'banned' : ''}>
              <td>{user.id}</td>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.profile__role}</td>
              <td>{user.is_active ? 'Active' : 'Banned'}</td>
              <td>
                    <button
                      className="btn btn-edit"
                      onClick={() => handleEdit(user)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-delete"
                      onClick={() => handleDelete(user.id)}
                    >
                      Delete
                    </button>
                    <button
                      className={`btn ${
                        user.is_active ? 'btn-danger' : 'btn-success'
                      }`}
                      onClick={() => handleToggleActive(user.id, user.is_active)}
                    >
                      {user.is_active ? 'Ban User' : 'Unban User'}
                    </button>
                
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editUser && (
        <Modal
          isOpen={!!editUser}
          onRequestClose={() => setEditUser(null)}
          contentLabel="Edit User"
          className="edit-user-modal"
          overlayClassName="edit-user-overlay"
          
        >
          <h2>Edit User</h2>
          <label>
            Role:
            <select
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
            >
              <option value="user">User</option>
              <option value="agent">Agent</option>
            </select>
          </label>
          <button onClick={handleSave}>Save</button>
          <button onClick={() => setEditUser(null)}>Cancel</button>
        </Modal>
      )}
    </div>
  );
};

export default UserManagement;