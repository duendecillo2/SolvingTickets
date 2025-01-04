import React, { useState } from 'react';
import '../styles/RespuestaForm.css';
import axios from 'axios';

const RespuestaForm = () => {
    const [respuesta, setRespuesta] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.post('http://localhost:8000/api/tickets/respuesta/', {
                respuesta: respuesta,
            });
            console.log('Respuesta guardada:', response.data);
            // Limpiar el campo de texto después de enviar la respuesta
            setRespuesta('');
        } catch (error) {
            console.error('Error al guardar la respuesta:', error);
        }
    };

    return (
        <div className="card">
            <h2>Formulario de Respuesta</h2>
            <form onSubmit={handleSubmit}>
                <textarea
                    placeholder="Escribe tu respuesta aquí..."
                    value={respuesta}
                    onChange={(e) => setRespuesta(e.target.value)}
                    required
                ></textarea>
                <button type="submit">Enviar</button>
            </form>
        </div>
    );
};

export default RespuestaForm;