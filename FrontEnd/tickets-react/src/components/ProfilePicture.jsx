import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/ProfilePicture.css'; // Archivo de estilos

const ProfilePicture = () => {
    const [image, setImage] = useState(null);

    const fetchProfilePicture = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:8000/api/profile/', {
                headers: {
                    'Authorization': `Token ${token}`,
                },
            });
            console.log('Respuesta de la API:', response.data);
            setImage(response.data[0].profile_image); // Actualiza el estado con la URL de la imagen
        } catch (error) {
            console.error('Error al obtener la imagen de perfil:', error);
        }
    };

    // Llamar a la función para cargar la imagen cuando el componente se monta
    useEffect(() => {
        fetchProfilePicture();
    }, []);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(URL.createObjectURL(file)); // Genera una URL temporal para la imagen seleccionada
            handleImageUpload(file); // Llamamos a la función de carga de la imagen
        }
    };

    const handleImageUpload = async (file) => {
        const formData = new FormData();
        formData.append('profile_image', file);

        try {
            const token = localStorage.getItem('token');
            const response = await axios.patch('http://localhost:8000/api/profile/upload-profile-image/', formData, {
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'multipart/form-data', // Esto es necesario para enviar archivos
                },
            });

            // Actualiza el estado de la imagen con la nueva URL
            setImage(response.data.imageUrl);
            console.log('Imagen actualizada:', response.data);
        } catch (error) {
            console.error('Error al actualizar la imagen de perfil:', error);
        }
    };

    return (
        <div className="profile-container">
            <div className="profile-picture">
                {image ? (
                    <img src={image} alt="Foto de perfil" className="profile-img" />
                ) : (
                    <span className="placeholder">Foto</span>
                )}
            </div>
            <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
            />
        </div>
    );
};

export default ProfilePicture;
