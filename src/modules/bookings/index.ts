import { widgetRegistry } from '@/core/registry/widgetRegistry'
import NextBookingWidget from './components/widgets/NextBookingWidget.vue'
import BookingKpisWidget from './components/widgets/BookingKpisWidget.vue'

export function init() {
  widgetRegistry.register({
    id: 'next-booking-widget',
    component: NextBookingWidget,
    order: 5,
    colSpan: { sm: 12, lg: 'full' }, // Pantalla completa
  })

  widgetRegistry.register({
    id: 'booking-kpis-widget',
    component: BookingKpisWidget,
    order: 10,
    colSpan: { sm: 12, lg: 12 }, // Ocupa la fila completa distribuyendo sus 4 cards internamente
  })
}
