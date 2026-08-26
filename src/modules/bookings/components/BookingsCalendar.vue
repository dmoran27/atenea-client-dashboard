<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { ChevronLeft, ChevronRight } from '@lucide/vue'
import { Button } from '@/core/components/ui/button'
import BookingCalendarDetail from './BookingCalendarDetail.vue'
import { useCalendar } from '../composables/useCalendar'
import type { Booking, BookingStatus } from '@/core/api/booking'
import { formatLocalDate } from '@/core/lib/utils.ts'

const props = defineProps<{
  bookings: Booking[]
}>()

const emit = defineEmits<{
  (e: 'view', booking: Booking): void
  (e: 'reschedule', booking: Booking): void
  (e: 'cancel', booking: Booking): void
}>()

const { t } = useI18n()
const {
  selectedDay,
  monthLabel,
  weekdayLabels,
  calendarDays,
  selectDay,
  prevMonth,
  nextMonth,
  goToToday,
} = useCalendar()

const statusColors: Record<BookingStatus, string> = {
  confirmed: 'bg-blue-500',
  pending: 'bg-amber-500',
  cancelled: 'bg-rose-500',
  completed: 'bg-emerald-500',
}

const bookingsByDateMap = computed(() => {
  const map = new Map<string, Booking[]>()

  props.bookings.forEach((booking) => {
    const startStr = booking.date
    const endStr = booking.endDate ?? booking.date

    const curr = new Date(`${startStr}T00:00:00`)
    const endDateObj = new Date(`${endStr}T00:00:00`)

    while (curr <= endDateObj) {
      const dateKey = formatLocalDate(curr)
      if (!map.has(dateKey)) {
        map.set(dateKey, [])
      }
      map.get(dateKey)!.push(booking)
      curr.setDate(curr.getDate() + 1)
    }
  })

  return map
})

function getDayBookings(date: string | null): Booking[] {
  if (!date) return []
  return bookingsByDateMap.value.get(date) ?? []
}

// Formateo de etiqueta según si es rango de días o franja horaria
function formatMiniTime(booking: Booking, currentDayStr: string): string {
  if (booking.endDate && booking.date !== booking.endDate) {
    if (booking.date === currentDayStr) return t('bookings.calendar.rangeStart', 'Inicio')
    if (booking.endDate === currentDayStr) return t('bookings.calendar.rangeEnd', 'Fin')
    return t('bookings.calendar.stay', 'Estancia')
  }
  if (booking.time) return booking.time
  return t('bookings.calendar.fullDay', 'Día completo')
}

// Determinar forma visual de la píldora para rangos de días
function getRangeClasses(booking: Booking, currentDayStr: string): string {
  if (!booking.endDate || booking.date === booking.endDate) {
    return 'rounded px-1'
  }
  if (booking.date === currentDayStr) {
    return 'rounded-l px-1 rounded-r-none border-r border-primary/20'
  }
  if (booking.endDate === currentDayStr) {
    return 'rounded-r px-1 rounded-l-none border-l border-primary/20'
  }
  return 'rounded-none px-1'
}

// Clic directo sobre la franja/píldora
function handleBookingMiniClick(dateStr: string, booking: Booking) {
  selectDay(dateStr)
  emit('view', booking)
}

const selectedDayBookings = computed(() => getDayBookings(selectedDay.value))
</script>

<template>
  <div class="grid gap-4 lg:grid-cols-3">
    <!-- Grid Principal del Calendario -->
    <div class="lg:col-span-2">
      <div class="rounded-lg border bg-card p-4">
        <!-- Cabecera -->
        <div class="mb-4 flex items-center justify-between">
          <h3 class="text-base font-semibold capitalize">{{ monthLabel }}</h3>
          <div class="flex items-center gap-1">
            <Button variant="outline" size="sm" class="mr-2" @click="goToToday">
              {{ t('bookings.calendar.today') }}
            </Button>
            <Button variant="ghost" size="icon" class="h-8 w-8" @click="prevMonth">
              <ChevronLeft class="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" class="h-8 w-8" @click="nextMonth">
              <ChevronRight class="h-4 w-4" />
            </Button>
          </div>
        </div>

        <!-- Días de la semana -->
        <div class="mb-2 grid grid-cols-7 gap-1">
          <div
            v-for="(label, i) in weekdayLabels"
            :key="i"
            class="py-1 text-center text-xs font-medium text-muted-foreground"
          >
            {{ label }}
          </div>
        </div>

        <!-- Celdas de Días -->
        <div class="grid grid-cols-7 gap-1">
          <div
            v-for="(day, i) in calendarDays"
            :key="i"
            :class="[
              'relative flex min-h-[80px] flex-col rounded-md border p-1.5 transition-colors',
              day.date === null
                ? 'border-transparent'
                : 'cursor-pointer hover:border-primary/50 hover:bg-accent/50',
              day.date === selectedDay ? 'border-primary bg-primary/5 ring-1 ring-primary' : '',
            ]"
            @click="day.date && selectDay(day.date)"
          >
            <template v-if="day.date">
              <span
                :class="[
                  'mb-1 flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium',
                  day.isToday ? 'bg-primary text-primary-foreground' : 'text-foreground',
                ]"
              >
                {{ day.dayNumber }}
              </span>

              <div class="space-y-0.5 overflow-hidden">
                <div
                  v-for="booking in getDayBookings(day.date).slice(0, 3)"
                  :key="booking.id"
                  class="flex cursor-pointer items-center gap-1 py-0.5 text-[10px] font-medium transition-opacity hover:opacity-80"
                  :class="[
                    statusColors[booking.status] + '/10',
                    getRangeClasses(booking, day.date),
                  ]"
                  @click.stop="handleBookingMiniClick(day.date, booking)"
                >
                  <span
                    class="h-1.5 w-1.5 shrink-0 rounded-full"
                    :class="statusColors[booking.status]"
                  ></span>
                  <span class="truncate text-muted-foreground">
                    {{ formatMiniTime(booking, day.date) }}
                  </span>
                </div>

                <span
                  v-if="getDayBookings(day.date).length > 3"
                  class="px-1 text-[10px] text-muted-foreground"
                >
                  +{{ getDayBookings(day.date).length - 3 }}
                </span>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>

    <!-- Detalle Lateral -->
    <BookingCalendarDetail
      :selected-day="selectedDay"
      :bookings="selectedDayBookings"
      @view="emit('view', $event)"
      @reschedule="emit('reschedule', $event)"
      @cancel="emit('cancel', $event)"
    />
  </div>
</template>
