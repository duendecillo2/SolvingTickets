import React, { useEffect, useState } from 'react';
import { FaLinkedin } from 'react-icons/fa';
import Modal from 'react-modal';
import '../styles/Administradores.css';

const Administradores = () => {
    const [admins, setAdmins] = useState([]);
    const [selectedAdmin, setSelectedAdmin] = useState(null);
    const [modalIsOpen, setModalIsOpen] = useState(false);

    useEffect(() => {
        fetch("http://127.0.0.1:8000/api/administradores/")
            .then(response => response.json())
            .then(data => setAdmins(data))
            .catch(error => console.error("Error al obtener administradores:", error));
    }, []);
    console.log(admins)
    const openModal = (admin) => {
        setSelectedAdmin(admin);
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
        setSelectedAdmin(null);
    };

    return (
        <div className="admin-container">
            <h2>Administradores</h2>
            <div className="admin-grid">
                {admins.length > 0 ? (
                    admins.map(admin => (
                        <div key={admin.id} className="admin-card">
                            <div className="card-content">
                                <div className="image">
                                    <img
                                        src={admin.profile_image ? `http://localhost:8000${admin.profile_image}` : "/default-profile.png"}
                                        alt={admin.username}
                                    />
                                </div>
                                <div className="social-media">
                                    <FaLinkedin />
                                </div>
                                <div className="name-profession">
                                    <span className="name">{admin.username}</span>
                                </div>
                                <div className="button">
                                    <button className="view-profile" onClick={() => openModal(admin)}>Ver Perfil</button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No hay administradores registrados.</p>
                )}
            </div>

            {selectedAdmin && (
                <Modal
                    isOpen={modalIsOpen}
                    onRequestClose={closeModal}
                    contentLabel="Perfil del Administrador"
                    className="admin-modal"
                    overlayClassName="admin-modal-overlay"
                    shouldCloseOnOverlayClick={true}
                >
                    <div className="modal-content">
                        <div className="modal-image">
                            <img
                                src={selectedAdmin.profile_image ? `http://localhost:8000${selectedAdmin.profile_image}` : "/default-profile.png"}
                                alt={selectedAdmin.username}
                            />
                        </div>
                        <h2 className="modal-name">{selectedAdmin.username}</h2>
                        <p className="modal-bio">Biografia: {selectedAdmin.bio}</p>

                        <div class="modal-reviews">
                                <p>⭐ Opinión 1: Muy buen administrador...</p>
                                <p>⭐ Opinión 2: Responde rápido...</p>
                                <p>⭐ Opinión 3: Excelente atención...</p>
                                <p>⭐ Opinión 1: Muy buen administrador...</p>
                                <p>⭐ Opinión 2: Responde rápido...</p>
                                <p>⭐ Opinión 3: Excelente atención...</p>
                                <p>⭐ Opinión 1: Muy buen administrador...</p>
                                <p>⭐ Opinión 2: Responde rápido...</p>
                                <p>⭐ Opinión 3: Excelente atención...</p>
                                <p>⭐ Opinión 1: Muy buen administrador...</p>
                                <p>⭐ Opinión 2: Responde rápido...</p>
                                <p>⭐ Opinión 3: Excelente atención...</p>
                                -- Más opiniones aquí --
                        </div>
                        
                        
                    </div>
                </Modal>
            )}

        </div>
    );
};

export default Administradores;