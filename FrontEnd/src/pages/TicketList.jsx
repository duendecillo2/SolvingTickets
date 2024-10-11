import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const tickets = [
    { nro: 1, asunto: 'Issue 1', categoria: 'Bug', estado: 'Open', fechaCreacion: '2023-10-01', fechaSolucion: '2023-10-05' },
    { nro: 2, asunto: 'Issue 2', categoria: 'Feature', estado: 'Closed', fechaCreacion: '2023-10-02', fechaSolucion: '2023-10-06' },
    // Add more tickets as needed
];

const TicketList = () => {
    return (
        <div className="container mt-5">
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Nro</th>
                        <th>Asunto</th>
                        <th>Categoria</th>
                        <th>Estado</th>
                        <th>Fecha Creacion</th>
                        <th>Fecha de Solucion</th>
                    </tr>
                </thead>
                <tbody>
                    {tickets.map(ticket => (
                        <tr key={ticket.nro}>
                            <td>{ticket.nro}</td>
                            <td>{ticket.asunto}</td>
                            <td>{ticket.categoria}</td>
                            <td>{ticket.estado}</td>
                            <td>{ticket.fechaCreacion}</td>
                            <td>{ticket.fechaSolucion}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TicketList;