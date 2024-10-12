import { useState } from "react";

return (
    <div className="ticket-inbox">
    <h1>Bandeja de Tickets</h1>
    <table>
        <thead>
        <tr>
            <th>ID</th>
            <th>Título</th>
            <th>Estado</th>
            <th>Prioridad</th>
            <th>Fecha de Creación</th>
            <th>Acciones</th>
        </tr>
        </thead>
        <tbody>
        {tickets.map((ticket) => (
            <tr key={ticket.id}>
            <td>{ticket.id}</td>
            <td>{ticket.title}</td>
            <td>
                <span className={`badge ${getStatusClass(ticket.status)}`}>
                {ticket.status === "open" ? "Abierto" : 
                ticket.status === "in_progress" ? "En Progreso" : "Resuelto"}
                </span>
            </td>
            <td>
                <span className={`badge ${getPriorityClass(ticket.priority)}`}>
                {ticket.priority === "low" ? "Baja" : 
                ticket.priority === "medium" ? "Media" : "Alta"}
                </span>
            </td>
            <td>{ticket.createdAt}</td>
            <td>
                {ticket.status !== "resolved" && (
                <button 
                    onClick={() => handleResolveTicket(ticket.id)}
                    className="resolve-button"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="check-icon">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                    Resolver
                </button>
                )}
            </td>
            </tr>
        ))}
        </tbody>
    </table>
    </div>
)
