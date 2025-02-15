import React, { useState, useEffect } from 'react';
import ProfilePicture from '../components/ProfilePicture';
import '../styles/ProfilePage.css';
import axios from 'axios';
import BackButton from '../components/BackButton';

const ProfilePage = () => {
    const [userData, setUserData] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    const response = await axios.get(`${process.env.REACT_APP_API_URL}/usuarios/`, {
                        headers: {
                            'Authorization': `Token ${token}`,
                        },
                    });

                    if (response.data.length > 0) {
                        const user = response.data[0]; // Obtiene el primer usuario
                        setUserId(user.id);
                        setUserData(user);
                        setFirstName(user.first_name || '');
                        setLastName(user.last_name || '');
                    }
                } else {
                    console.warn('No hay un token de autenticación disponible');
                }
            } catch (error) {
                console.error('Error al obtener datos del usuario', error);
            }
        };
        fetchUserData();
    }, []);

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

            const updatedData = {
                first_name: firstName.trim(),
                last_name: lastName.trim(),
            };

            const token = localStorage.getItem('token');
            await axios.put(`${process.env.REACT_APP_API_URL}/usuarios/${userId}/`, updatedData, {
                headers: {
                    'Authorization': `Token ${token}`,
                },
            });

            setUserData((prev) => ({
                ...prev,
                first_name: firstName,
                last_name: lastName,
            }));

            setIsEditing(false);
        } catch (error) {
            console.error('Error al guardar datos del usuario', error.response?.data || error.message);
        }
    };

    const formatDate = (date) => {
        if (!date) return '';
        const parsedDate = new Date(date);
        return isNaN(parsedDate) ? '' : parsedDate.toISOString().split('T')[0];
    };

    if (!userData || Object.keys(userData).length === 0) {
        return <div>Loading...</div>;
    }

    return (
        <div className="profile-page-container">
            <h2 className="profile-title">Mi Perfil</h2>
            <BackButton text="Volver" />
            <div className="profile-section">
                <ProfilePicture />
                <h3 className="profile-subtitle">Foto de Perfil</h3>
            </div>
            <div className="profile-details">
                <h3 className="profile-subtitle">Información Personal</h3>
                <div className="profile-field">
                    <label>Usuario:</label>
                    <span>{userData.username}</span>
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
                        <span>{userData.first_name}</span>
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
                        <span>{userData.last_name}</span>
                    )}
                </div>
                <div className="profile-field">
                    <label>Email:</label>
                    <span>{userData.email}</span>
                </div>
                <div className="profile-field">
                    <label>Fecha de Registro:</label>
                    <span>{formatDate(userData.date_joined)}</span>
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
