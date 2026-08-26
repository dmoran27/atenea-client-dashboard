<script setup lang="ts">
import { ref, computed, watch, type Component } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/core/components/ui/dialog'
import { Button } from '@/core/components/ui/button'
import type { Booking, BookingServiceConfig } from '@/core/api/booking'
import { useBookingServices } from '../composables/useBookingServices'
import { useBookingValidation } from '../composables/useBookingValidation'
import { formatLocalDate } from '@/core/lib/utils'
import {
  generateTimeSlots,
  isBookingPast,
  isDateDisabled as isDateDisabledUtil,
  isSlotDisabled as isSlotDisabledUtil,
} from '../utils/booking.utils'

import BookingSingleDaySelector from './modes/BookingSingleDaySelector.vue'
import BookingDaysRangeSelector from './modes/BookingDaysRangeSelector.vue'
import BookingSlotsSelector from './modes/BookingSlotsSelector.vue'
import BookingCustomRangeSelector from './modes/BookingCustomRangeSelector.vue'
import { Calendar, Clock } from '@lucide/vue'

const props = withDefaults(
  defineProps<{
    open: boolean
    booking: Booking | null
    existingBookings?: Booking[]
  }>(),
  { existingBookings: () => [] },
)

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
  (e: 'confirm', payload: { date: string; time: string; endDate?: string; endTime?: string }): void
}>()

const { t } = useI18n()
const { services, isDayAvailable, getDaySchedule, getFixedSlotsForDay } = useBookingServices()

// Estados reactivos locales para el formulario
const date = ref('')
const endDate = ref('')
const time = ref('')
const endTime = ref('')

const todayStr = computed(() => formatLocalDate(new Date()))

const serviceId = computed(() => props.booking?.serviceId || '')

const currentConfig = computed<BookingServiceConfig | undefined>(() => {
  if (!serviceId.value) return undefined
  return services.value.find((s) => s.id === serviceId.value)
})

const minAdvanceHours = computed(() => currentConfig.value?.minAdvanceHours ?? 0)

const selectedDayOfWeek = computed(() =>
  date.value ? new Date(`${date.value}T00:00:00`).getDay() : -1,
)

const currentDaySchedule = computed(() =>
  serviceId.value && selectedDayOfWeek.value !== -1
    ? getDaySchedule(serviceId.value, selectedDayOfWeek.value)
    : undefined,
)

const generatedSlots = computed(() => {
  if (!currentConfig.value) return []
  if (currentConfig.value.mode === 'fixed_classes') {
    return getFixedSlotsForDay(serviceId.value, selectedDayOfWeek.value)
  }
  return generateTimeSlots(currentConfig.value, currentDaySchedule.value?.operationalHours)
})

// Ocupación ignorando la reserva actual que se está editando
const bookedCountsForDate = computed(() => {
  if (!date.value) return new Map<string, number>()
  const counts = new Map<string, number>()
  props.existingBookings
    .filter(
      (b) =>
        b.date === date.value &&
        b.status !== 'cancelled' &&
        b.serviceId === serviceId.value &&
        b.id !== props.booking?.id, // Excluimos la reserva actual
    )
    .forEach((b) => {
      if (b.time) counts.set(b.time, (counts.get(b.time) || 0) + 1)
    })
  return counts
})

function isDateDisabled(dateStr: string): boolean {
  return isDateDisabledUtil(
    dateStr,
    currentConfig.value,
    serviceId.value,
    minAdvanceHours.value,
    todayStr.value,
    isDayAvailable,
  )
}

function isSlotDisabled(slot: string): boolean {
  return isSlotDisabledUtil(
    slot,
    date.value,
    currentConfig.value,
    bookedCountsForDate.value,
    minAdvanceHours.value,
    todayStr.value,
  )
}

function getSlotCapacityText(slot: string): string {
  if (
    !currentConfig.value ||
    currentConfig.value.capacityType !== 'group' ||
    !currentConfig.value.maxCapacity
  ) {
    return ''
  }
  return `${bookedCountsForDate.value.get(slot) || 0}/${currentConfig.value.maxCapacity}`
}

const { singleDayError, daysRangeError, timeSlotsError, customRangeError, dateTimeValid } =
  useBookingValidation({
    date,
    endDate,
    time,
    endTime,
    currentConfig,
    minAdvanceHours,
    todayStr,
    currentDaySchedule,
    isDateDisabled,
    isSlotDisabled,
  })

const modeComponents: Record<string, Component> = {
  single_day: BookingSingleDaySelector,
  days_range: BookingDaysRangeSelector,
  time_slots: BookingSlotsSelector,
  fixed_classes: BookingSlotsSelector,
  custom_time_range: BookingCustomRangeSelector,
}

const currentModeComponent = computed(() =>
  currentConfig.value ? modeComponents[currentConfig.value.mode] : null,
)

const currentModeError = computed(() => {
  const mode = currentConfig.value?.mode
  if (mode === 'single_day') return singleDayError.value
  if (mode === 'days_range') return daysRangeError.value
  if (mode === 'time_slots' || mode === 'fixed_classes') return timeSlotsError.value
  if (mode === 'custom_time_range') return customRangeError.value
  return ''
})

// Sincronizar datos al abrir el modal
watch(
  () => props.open,
  (isOpen) => {
    if (isOpen && props.booking) {
      const isPastDate = isBookingPast(props.booking)

      // Si la fecha ya pasó, iniciamos con campos limpios para forzar una selección nueva válida
      date.value = isPastDate ? '' : props.booking.date
      endDate.value = isPastDate ? '' : props.booking.endDate || ''
      time.value = isPastDate ? '' : props.booking.time || ''
      endTime.value = isPastDate ? '' : props.booking.endTime || ''
    }
  },
)

// Resetear horas al cambiar de fecha
watch(date, (newDate, oldDate) => {
  if (oldDate && newDate !== oldDate) {
    time.value = ''
    endTime.value = ''
  }
})

function handleSubmit() {
  if (!dateTimeValid.value) return
  emit('confirm', {
    date: date.value,
    time: time.value,
    endDate: endDate.value || undefined,
    endTime: endTime.value || undefined,
  })
  emit('update:open', false)
}
</script>

<template>
  <Dialog :open="props.open" @update:open="(v: boolean) => emit('update:open', v)">
    <DialogContent class="max-h-[90vh] max-w-md overflow-y-auto">
      <DialogHeader>
        <DialogTitle>{{ t('bookings.rescheduleModal.title', 'Reagendar Reserva') }}</DialogTitle>
        <DialogDescription>
          {{
            t(
              'bookings.rescheduleModal.description',
              'Selecciona la nueva fecha u horario para la reserva.',
            )
          }}
        </DialogDescription>
      </DialogHeader>

      <div v-if="booking" class="space-y-4 pb-1">
        <!-- Tarjeta Informativa del Horario Actual -->
        <div class="rounded-lg border bg-muted/40 p-3 text-sm">
          <p class="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
            {{ t('bookings.originalSchedule', 'Horario actual') }}
          </p>
          <div class="flex flex-wrap items-center gap-3 font-medium text-foreground">
            <!-- Fecha(s) -->
            <div v-if="booking.date" class="flex items-center gap-1.5">
              <Calendar class="h-4 w-4 text-primary shrink-0" />
              <span>
                {{ formatLocalDate(booking.date) }}
                <template v-if="booking.endDate">
                  — {{ formatLocalDate(booking.endDate) }}</template
                >
              </span>
            </div>

            <!-- Hora(s) -->
            <div v-if="booking.time" class="flex items-center gap-1.5">
              <Clock class="h-4 w-4 text-primary shrink-0" />
              <span>
                {{ booking.time }}
                <template v-if="booking.endTime"> - {{ booking.endTime }}</template>
              </span>
            </div>
          </div>
        </div>

        <!-- Selector Dinámico según el Modo de Reserva -->
        <component
          :is="currentModeComponent"
          v-if="currentModeComponent"
          v-model:date="date"
          v-model:endDate="endDate"
          v-model:time="time"
          v-model:endTime="endTime"
          :error="currentModeError"
          :today-str="todayStr"
          :context="{
            currentConfig,
            currentDaySchedule,
            generatedSlots,
            isDateDisabled,
            isSlotDisabled,
            getSlotCapacityText,
          }"
        />
      </div>

      <DialogFooter class="gap-2">
        <DialogClose as-child>
          <Button variant="outline">{{ t('bookingModal.cancel') }}</Button>
        </DialogClose>
        <Button :disabled="!dateTimeValid" @click="handleSubmit">
          {{ t('bookings.actions.save', 'Guardar Cambios') }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
