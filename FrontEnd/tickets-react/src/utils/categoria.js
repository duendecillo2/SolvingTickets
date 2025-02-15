// utils/api.js
import axios from 'axios';

export const fetchCategorias = async () => {
    try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/categorias/`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener las categorías:', error);
        return [];
    }
};

