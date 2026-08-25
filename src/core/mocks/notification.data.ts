import type { AppNotification } from '../api/notification'

export const mockNotifications: AppNotification[] = [
  {
    id: '1',
    title: 'Nueva Reserva',
    description: 'Juan Pérez agendó una cita para mañana a las 10:00 AM.',
    read: false,
    createdAt: new Date(),
    type: 'info',
  },
  {
    id: '2',
    title: 'Pago Confirmado',
    description: 'Se ha registrado el pago de la reserva #1024.',
    read: false,
    createdAt: new Date(Date.now() - 3600000),
    type: 'success',
  },
  {
    id: '3',
    title: 'Stock Bajo',
    description: 'El inventario de productos seleccionados está por agotarse.',
    read: true,
    createdAt: new Date(Date.now() - 86400000),
    type: 'warning',
  },
]
