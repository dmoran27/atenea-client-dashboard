<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Clock, Calendar as CalendarIcon } from '@lucide/vue'
import { Badge } from '@/core/components/ui/badge'
import { useBookingServices } from '../composables/useBookingServices'
import type { Booking, BookingStatus } from '@/modules/bookings/api'
import BookingActionsMenu from './ui/BookingActionsMenu.vue'

const props = defineProps<{
  selectedDay: string
  bookings: Booking[]
}>()

const emit = defineEmits<{
  (e: 'view', booking: Booking): void
  (e: 'reschedule', booking: Booking): void
  (e: 'cancel', booking: Booking): void
}>()

const { t } = useI18n()
const { getServiceTitle } = useBookingServices()

const statusVariant: Record<BookingStatus, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  confirmed: 'default',
  pending: 'secondary',
  cancelled: 'destructive',
  completed: 'outline',
}

const selectedDayLabel = computed(() => {
  if (!props.selectedDay) return ''
  const d = new Date(`${props.selectedDay}T00:00:00`)
  return d.toLocaleDateString(undefined, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
})

function formatBookingTime(booking: Booking): string {
  if (booking.endDate) return t('bookings.calendar.stay')
  if (booking.time && booking.endTime) return `${booking.time} - ${booking.endTime}`
  if (booking.time) return booking.time
  return t('bookings.calendar.fullDay')
}
</script>

<template>
  <div class="flex flex-col rounded-lg border bg-card p-4">
    <!-- Cabecera del Panel -->
    <h3 class="mb-1 text-base font-semibold capitalize">{{ selectedDayLabel }}</h3>
    <p class="mb-4 text-sm text-muted-foreground">
      {{ bookings.length }}
      {{
        bookings.length === 1
          ? t('bookings.calendar.singleBooking')
          : t('bookings.calendar.pluralBookings')
      }}
    </p>

    <!-- Lista de Reservas con scroll interno si hay muchas -->
    <div
      v-if="bookings.length > 0"
      class="max-h-[520px] space-y-2 overflow-y-auto pr-1 text-left scrollbar-thin scrollbar-thumb-muted"
    >
      <div
        v-for="booking in bookings"
        :key="booking.id"
        class="group relative flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors hover:border-primary/40 hover:bg-accent/40"
        @click="emit('view', booking)"
      >
        <div
          class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/20"
        >
          <Clock class="h-4 w-4 text-primary" />
        </div>

        <div class="flex-1 overflow-hidden">
          <div class="flex items-center justify-between gap-1">
            <p class="truncate text-sm font-medium">{{ booking.clientAlias }}</p>
            <BookingActionsMenu
              icon="vertical"
              :booking="booking"
              @view="emit('view', $event)"
              @reschedule="emit('reschedule', $event)"
              @cancel="emit('cancel', $event)"
            />
          </div>

          <p class="truncate text-xs text-muted-foreground">
            {{ getServiceTitle(booking.serviceId) }}
          </p>

          <div class="mt-1 flex items-center justify-between gap-2">
            <span class="text-xs font-medium text-muted-foreground">
              {{ formatBookingTime(booking) }}
            </span>
            <Badge :variant="statusVariant[booking.status]" class="text-[10px]">
              {{ t(`bookings.status.${booking.status}`) }}
            </Badge>
          </div>
        </div>
      </div>
    </div>

    <!-- Estado vacío -->
    <div v-else class="flex flex-col items-center justify-center py-8 text-center">
      <CalendarIcon class="mb-2 h-8 w-8 text-muted-foreground/40" />
      <p class="text-sm text-muted-foreground">{{ t('bookings.calendar.noBookings') }}</p>
    </div>
  </div>
</template>
