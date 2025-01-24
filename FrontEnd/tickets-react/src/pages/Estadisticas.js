import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar, Doughnut } from 'react-chartjs-2';
import '../styles/AdminStats.css';
import {Chart as ChartJS, ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const AdminStats = () => {
    const [ticketStats, setTicketStats] = useState({
        totalTickets: 0,
        ticketsByState: {},
        ticketsByPriority: {},
        ticketsByCategory: {},
        closedPercentage: 0,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchTicketData = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:8000/api/tickets/stats', {
                    headers: {
                        'Authorization': `Token ${token}`,
                    },
                });

                console.log(response);    
                const { total, by_state, by_priority, by_category, closed_percentage } = response.data;

                setTicketStats({
                    totalTickets: total,
                    ticketsByState: by_state,
                    ticketsByPriority: by_priority,
                    ticketsByCategory: by_category,
                    closedPercentage: closed_percentage,
                });
                setLoading(false);
            } catch (err) {
                console.error('Error fetching stats:', err);
                setError('Error al obtener las estadísticas');
                setLoading(false);
            }
        };

        fetchTicketData();
    }, []);

    if (loading) return <div>Cargando estadísticas...</div>;
    if (error) return <div>{error}</div>;

    const { totalTickets, ticketsByState, ticketsByPriority, ticketsByCategory, closedPercentage } = ticketStats;

    return (
        <div className="admin-stats">
            <h2>Estadísticas de Tickets</h2>
            <p>Total de Tickets Asignados: {totalTickets}</p>

            <div className="charts">
                <div>
                    <h3>Tickets por Estado</h3>
                    <Doughnut
                        data={{
                            labels: Object.keys(ticketsByState),
                            datasets: [{
                                data: Object.values(ticketsByState),
                                backgroundColor: ['#f1c40f', '#007bff', '#2ecc71'],
                            }]
                        }}
                    />
                </div>

                <div>
                    <h3>Tickets por Prioridad</h3>
                    <Bar
                        data={{
                            labels: Object.keys(ticketsByPriority),
                            datasets: [{
                                label: 'Tickets por Prioridad',
                                data: Object.values(ticketsByPriority),
                                backgroundColor: ['#ff6b6b', '#ffa500', '#7bed9f', '#fa0202'],
                            }]
                        }}
                    />
                </div>

                <div>
                    <h3>Categorías de Tickets</h3>
                    <Bar
                        data={{
                            labels: Object.keys(ticketsByCategory),
                            datasets: [{
                                label: 'Categorías',
                                data: Object.values(ticketsByCategory),
                                backgroundColor: ['#9b59b6', '#3498db', '#e74c3c', '#f1c40f'],
                            }]
                        }}
                    />
                </div>

                <div>
                    <h3>Porcentaje de Tickets Resueltos</h3>
                    <p>{closedPercentage}% de tickets están resueltos</p>
                </div>
            </div>
        </div>
    );
};

export default AdminStats;
