import React, { useEffect, useState } from 'react';
import { FaLinkedin } from 'react-icons/fa';
import Modal from 'react-modal';
import '../styles/Administradores.css';
import BackButton from '../components/BackButton';

const Administradores = () => {
    const [admins, setAdmins] = useState([]);
    const [calificaciones, setCalificaciones] = useState({});
    const [selectedAdmin, setSelectedAdmin] = useState(null);
    const [modalIsOpen, setModalIsOpen] = useState(false);

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/administradores/`)
            .then(response => response.json())
            .then(data => setAdmins(data))
            .catch(error => console.error("Error al obtener administradores:", error));
    }, []);

    useEffect(() => {
        fetch(`${process.env.REACT_APP_URL}/calificaciones/`)
            .then(response => response.json())
            .then(data => {
                console.log("Datos de calificaciones recibidos:", data);
                setCalificaciones(data);
            })
            .catch(error => console.error("Error al obtener calificaciones:", error));
    }, []);

    const openModal = (admin) => {
        if (!modalIsOpen) {  // Solo abre si el modal no está abierto
            setSelectedAdmin(admin);
            setModalIsOpen(true);
        }
    };

    const closeModal = () => {
        setModalIsOpen(false);
        setSelectedAdmin(null);
    };

    return (
        <div className="admin-container">
            <h2>Administradores</h2>
            <BackButton/>
            <div className="admin-grid">
                {admins.length > 0 ? (
                    admins.map(admin => (
                        <div key={admin.id} className="admin-card">
                            <div className="card-content">
                                <div className="image">
                                    <img
                                        src={admin.profile_image ? `${process.env.REACT_APP_URL}${admin.profile_image}` : "/default-profile.png"} 
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
                                src={selectedAdmin.profile_image ? `${process.env.REACT_APP_URL}${selectedAdmin.profile_image}` : "/default-profile.png"}
                                alt={selectedAdmin.username}
                            />
                        </div>
                        <h2 className="modal-name">{selectedAdmin.username}</h2>
                        <p className="modal-bio">Biografía: {selectedAdmin.bio}</p>

                        <div className="modal-reviews">
                            <h3>Opiniones</h3>
                            {calificaciones[selectedAdmin.id] ? (
                                calificaciones[selectedAdmin.id].map((opinion, index) => (
                                    <p key={index}>⭐ {opinion.calificacion} - {opinion.comentario}</p>
                                ))
                            ) : (
                                <p>No hay opiniones disponibles.</p>
                            )}
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default Administradores;