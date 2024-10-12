import { useState } from "react";
import '../styles/TicketInbox.css';

//Tickets de ejemplo para mostrar
const initialTickets = [
    { id: "T-001", title: "Error en la página de inicio", status: "open", priority: "high", createdAt: "2023-05-15" },
    { id: "T-002", title: "Actualización de perfil no funciona", status: "in_progress", priority: "medium", createdAt: "2023-05-14" },
    { id: "T-003", title: "Problema con el carrito de compras", status: "open", priority: "high", createdAt: "2023-05-13" },
    { id: "T-004", title: "Solicitud de nueva característica", status: "open", priority: "low", createdAt: "2023-05-12" },
    { id: "T-005", title: "Optimización de rendimiento", status: "in_progress", priority: "medium", createdAt: "2023-05-11" },
]

export default function TicketInbox() {
    const [tickets, setTickets] = useState(initialTickets)
    const handleResolveTicket = (id) => {
    setTickets(tickets.map(ticket => 
        ticket.id === id ? { ...ticket, status: "resolved" } : ticket
    ))
    }

    const getPriorityClass = (priority) => {
    switch (priority) {
        case "low": return "priority-low"
        case "medium": return "priority-medium"
        case "high": return "priority-high"
        case "critic": return "priority-critic"
        default: return ""
    }
    }

    const getStatusClass = (status) => {
    switch (status) {
        case "open": return "status-open"
        case "in_progress": return "status-in-progress"
        case "resolved": return "status-resolved"
        case "closed": return "status-closed" //quizas no haga falta, ya con el resuelto basta
        default: return ""
    }
    }

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
                ticket.priority === "medium" ? "Media" : 
                ticket.priority === "high" ? "Alta" : "Critica"} 
                //si nofunciona dejarlo asi en la linea de arriba ticket.priority === "medium" ? "Media" : "Alta"
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
}