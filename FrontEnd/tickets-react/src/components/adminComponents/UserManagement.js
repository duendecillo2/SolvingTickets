import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../styles/adminStyles/UserManagement.css'; // Asegúrate de que la ruta sea correcta

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        console.log('Token:', token); // Debugging: verificar el valor del token
        if (!token) {
          throw new Error('No token found');
        }
        const response = await axios.get('http://localhost:8000/api/users/', {
          headers: {
            'Authorization': `Token ${token}`,
          },
        });
        console.log('Fetched users:', response.data); // Debugging line
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

  const handleEdit = async (userId, updatedData) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }
      const response = await axios.put(`http://localhost:8000/api/users/${userId}/`, updatedData, {
        headers: {
          'Authorization': `Token ${token}`,
        },
      });
      setUsers(users.map(user => user.id === userId ? response.data : user));
    } catch (err) {
      console.error('Error editing user:', err);
    }
  };

  const handleDelete = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      if (window.confirm('This action is irreversible. Confirm deletion?')) {
        deleteUser(userId);
      }
    }
  };

  const deleteUser = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }
      await axios.delete(`http://localhost:8000/api/users/${userId}/`, {
        headers: {
          'Authorization': `Token ${token}`,
        },
      });
      setUsers(users.filter(user => user.id !== userId));
    } catch (err) {
      console.error('Error deleting user:', err);
    }
  };

  const handleToggleActive = async (userId, isActive) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }
      const response = await axios.patch(`http://localhost:8000/api/users/${userId}/`, {
        is_active: !isActive,
      }, {
        headers: {
          'Authorization': `Token ${token}`,
        },
      });
      setUsers(users.map(user => user.id === userId ? { ...user, is_active: response.data.is_active } : user));
    } catch (err) {
      console.error('Error toggling user active status:', err);
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
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.username}</td> {/* Using 'username' property */}
              <td>{user.email}</td>
              <td>{user.profile__role}</td> {/* Using 'profile__role' property */}
              <td>{user.is_active ? 'Active' : 'Inactive'}</td>
              <td>
                <button className="btn btn-edit" onClick={() => handleEdit(user.id, { username: 'newUsername' })}>Edit</button>
                <button className="btn btn-delete" onClick={() => handleDelete(user.id)}>Delete</button>
                <button className="btn btn-toggle" onClick={() => handleToggleActive(user.id, user.is_active)}>
                  {user.is_active ? 'Deactivate' : 'Activate'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement;
