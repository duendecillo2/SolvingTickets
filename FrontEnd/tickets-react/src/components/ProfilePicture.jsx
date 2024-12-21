import React, { useState } from 'react';
import '../styles/ProfilePicture.css'; // Archivo de estilos

const ProfilePicture = () => {
    const [image, setImage] = useState(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(URL.createObjectURL(file)); // Genera una URL temporal para la imagen seleccionada
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
            <input type="file" accept="image/*" onChange={handleImageChange} />
        </div>
    );
};

export default ProfilePicture;
