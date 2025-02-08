import React, { useState } from 'react';
import Navbar from '../components/NavBar';
import '../styles/HomePage.css'; // Asegúrate de tener estilos para la página
import logo from '../media/logo.png'; // Importa el logo desde la ruta correcta
import { GiHumanEar } from "react-icons/gi"; // Importa el ícono para Misión
import { BsAirplaneFill } from "react-icons/bs";

const HomePage = () => {
    const links = [
        { path: '/login', label: 'Iniciar Sesión' },
        { path: '/register', label: 'Registrar' },
        { path: '/Administradores', label: 'Administradores' },
    ];

    const [activeQuestion, setActiveQuestion] = useState(null); // Estado para controlar qué pregunta está activa

    const toggleQuestion = (index) => {
        setActiveQuestion(activeQuestion === index ? null : index);
    };

    const faqs = [
        {
            question: "¿Cómo puedo registrar un ticket de soporte técnico?",
            answer: "Puedes registrar un ticket desde nuestra página principal, haciendo clic en el botón 'Registrar'. Solo necesitas completar el formulario con la información solicitada y nuestro equipo comenzará a trabajar en tu solicitud."
        },
        {
            question: "¿Cuál es el tiempo promedio de resolución de un ticket?",
            answer: "El tiempo de resolución depende de la complejidad del problema, pero nuestro equipo se esfuerza en resolver el 90% de los casos en menos de 24 horas."
        },
        {
            question: "¿Cómo puedo hacer seguimiento a mi ticket?",
            answer: "Puedes hacer seguimiento a tu ticket iniciando sesión en nuestra plataforma con las credenciales que creaste al registrar el ticket. Allí verás el estado actualizado de tu solicitud."
        },
        {
            question: "¿Ofrecen soporte para sistemas operativos específicos?",
            answer: "Sí, ofrecemos soporte para una amplia variedad de sistemas operativos, incluidos Windows, macOS, y varias distribuciones de Linux. Asegúrate de especificar tu sistema al crear el ticket."
        },
        {
            question: "¿Puedo solicitar soporte fuera de horario laboral?",
            answer: "Contamos con un equipo de guardia que ofrece soporte 24/7 en casos de emergencia. Si necesitas asistencia fuera del horario regular, marca la opción de 'Soporte de Emergencia' al registrar tu ticket."
        },
    ];

    return (
        <div className="container">
            <Navbar links={links} className="navbar" />
            <div className="floating-container">
                <img src={logo} alt="Logo" className="middle-logo" />
                <div className="about-us">
                    <h2>¿Quiénes somos?</h2>
                    <p>
                        Somos una empresa dedicada a la resolución de tickets de soporte técnico con alta trayectoria,
                        brindando soluciones efectivas y rápidas para mejorar la experiencia del cliente en sus inquietudes y problemas relacionados a su provisión de servicios IT.
                    </p>
                </div>
            </div>

            <div className="vision-mission-container">
                <div className="vision">
                    <h2><BsAirplaneFill />Visión</h2>
                    <p>
                        Ser líderes en el sector de soporte técnico, reconocidos por nuestra capacidad de ofrecer soluciones innovadoras y mejorar continuamente la experiencia del cliente en el ámbito IT.
                    </p>
                </div>
                <div className="mission">
                    <h2><GiHumanEar /> Misión</h2>
                    <p>
                        Nuestra misión es proporcionar soluciones técnicas rápidas y eficientes que permitan a nuestros clientes mantener el más alto nivel de rendimiento en sus operaciones, garantizando soporte continuo y mejoras en su infraestructura IT.
                    </p>
                </div>
            </div>

            {/* Nueva sección de preguntas frecuentes */}
            <div className="faq-container">
                <h2>Preguntas Frecuentes</h2>
                {faqs.map((faq, index) => (
                    <div key={index} className="faq-item">
                        <h3 onClick={() => toggleQuestion(index)} style={{ cursor: 'pointer' }}>
                            {faq.question}
                        </h3>
                        {activeQuestion === index && (
                            <p>{faq.answer}</p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HomePage;