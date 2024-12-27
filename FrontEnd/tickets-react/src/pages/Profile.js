// ProfilePage.js
import React, { useState, useEffect } from 'react';
import ProfilePicture from '../components/ProfilePicture';
import '../styles/ProfilePage.css';
import axios from 'axios';

const ProfilePage = () => {
    const [userData, setUserData] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState(''); // Estado para el apellido
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    const response = await axios.get('http://localhost:8000/api/usuarios/', {
                        headers: {
                            'Authorization': `Token ${token}`,
                        },
                    });
                    setUserId(response.data[0].id); // Inicializa correctamente el userId
                    setUserData(response.data); // Actualiza el estado con los datos del usuario
                    setFirstName(response.data[0].first_name || ''); // Inicializa firstName
                    setLastName(response.data[0].last_name || ''); // Inicializa lastName
                } else {
                    console.warn('No hay un token de autenticación disponible');
                }
            } catch (error) {
                console.error('Error al obtener datos del usuario', error);
            }
        };
        fetchUserData();
    }, []); // Ejecuta la función una vez al montar el componente

    const handleEditClick = () => {
        setIsEditing(!isEditing);
    };

    const handleSave = async () => {
        try {
            if (!firstName.trim() && !lastName.trim()) {
                console.error('El nombre o apellido deben ser llenados');
                return;
            }

            if (!userId) {
                console.error('El ID del usuario no está disponible');
                return;
            }

            const updatedData = {};
            if (firstName.trim()) updatedData.first_name = firstName;
            if (lastName.trim()) updatedData.last_name = lastName;

            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:8000/api/usuarios/${userId}/`, updatedData, {
                headers: {
                    'Authorization': `Token ${token}`,
                },
            });

            setUserData((prev) => ({
                ...prev,
                ...updatedData,
            }));

            setIsEditing(false);
        } catch (error) {
            console.error('Error al guardar datos del usuario', error.response?.data || error.message);
        }
    };

    const formatDate = (date) => {
        if (!date) return '';
        const parsedDate = new Date(date);
        if (isNaN(parsedDate)) return '';
        return parsedDate.toISOString().split('T')[0];
    };

    if (!userData || !userData[0]) {
        return <div>Loading...</div>;
    }

    return (
        <div className="profile-page-container">
            <h2 className="profile-title">Mi Perfil</h2>
            <div className="profile-section">
                <ProfilePicture />
                <h3 className="profile-subtitle">Foto de Perfil</h3>
            </div>

            <div className="profile-details">
                <h3 className="profile-subtitle">Información Personal</h3>
                <div className="profile-field">
                    <label>Usuario:</label>
                    <span>{userData[0].username}</span>
                </div>
                <div className="profile-field">
                    <label>Nombre:</label>
                    {isEditing ? (
                        <input
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                        />
                    ) : (
                        <span>{userData[0].first_name}</span>
                    )}
                </div>
                <div className="profile-field">
                    <label>Apellido:</label>
                    {isEditing ? (
                        <input
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                        />
                    ) : (
                        <span>{userData[0].last_name}</span>
                    )}
                </div>
                <div className="profile-field">
                    <label>Email:</label>
                    <span>{userData[0].email}</span>
                </div>
                <div className="profile-field">
                    <label>Fecha de Registro:</label>
                    <span>{formatDate(userData[0].date_joined)}</span>
                </div>
            </div>
            <button onClick={handleEditClick}>
                {isEditing ? 'Cancelar' : 'Editar'}
            </button>
            {isEditing && <button onClick={handleSave}>Actualizar</button>}
        </div>
    );
};

export default ProfilePage;
