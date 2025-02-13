import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Button.css';

const BackButton = ({ text = 'Volver', goHome = false }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (goHome) {
      navigate('/'); // Redirige al home
    } else {
      navigate(-1); // Vuelve a la página anterior en el historial
    }
  };

  return (
    <button type="button" className="styleType" onClick={handleBack}>
      ⬅ {text}
    </button>
  );
};

export default BackButton;