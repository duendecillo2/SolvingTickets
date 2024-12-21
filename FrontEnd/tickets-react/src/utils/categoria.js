// utils/api.js
import axios from 'axios';

export const fetchCategorias = async () => {
    try {
        const response = await axios.get('http://localhost:8000/api/categorias/');
        return response.data;
    } catch (error) {
        console.error('Error al obtener las categorías:', error);
        return [];
    }
};
