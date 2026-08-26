<script setup lang="ts">
import { computed, watch, type Component } from 'vue'
import { useI18n } from 'vue-i18n'
import { Info, ClockAlert, User, Calendar } from '@lucide/vue'

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
import { Label } from '@/core/components/ui/label'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/core/components/ui/select'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/core/components/ui/tabs'

import { useBookingServices } from '../composables/useBookingServices'
import { useBookingValidation } from '../composables/useBookingValidation'
import { useBookingFormState } from '../composables/useBookingFormState'
import { useAuthStore } from '@/core/stores/useAuthStore'
import type { Booking, BookingStatus, BookingServiceConfig } from '@/core/api/booking'
import { formatLocalDate } from '@/core/lib/utils'

// Importamos usando alias para evitar colisión de nombres con las funciones locales
import {
  generateTimeSlots,
  isDateDisabled as isDateDisabledUtil,
  isSlotDisabled as isSlotDisabledUtil,
} from '../utils/booking.utils'

import BookingSingleDaySelector from './modes/BookingSingleDaySelector.vue'
import BookingDaysRangeSelector from './modes/BookingDaysRangeSelector.vue'
import BookingSlotsSelector from './modes/BookingSlotsSelector.vue'
import BookingCustomRangeSelector from './modes/BookingCustomRangeSelector.vue'
import BookingClientForm from './BookingClientForm.vue'

const props = withDefaults(
  defineProps<{
    open: boolean
    existingBookings?: Booking[]
  }>(),
  { existingBookings: () => [] },
)

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
  (e: 'confirm', booking: Omit<Booking, 'id'>): void
}>()

const { t } = useI18n()
const authStore = useAuthStore()
const { services, getServiceTitle, isDayAvailable, getDaySchedule, getFixedSlotsForDay } =
  useBookingServices()

const {
  activeTab,
  clientAlias,
  clientEmail,
  clientPhone,
  serviceId,
  date,
  endDate,
  time,
  endTime,
  notes,
  resetForm,
  resetDateTime,
} = useBookingFormState()

const todayStr = computed(() => formatLocalDate(new Date()))

const currentConfig = computed<BookingServiceConfig | undefined>(() =>
  serviceId.value ? services.value.find((s) => s.id === serviceId.value) : undefined,
)

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

const bookedCountsForDate = computed(() => {
  if (!date.value) return new Map<string, number>()
  const counts = new Map<string, number>()
  props.existingBookings
    .filter(
      (b) => b.date === date.value && b.status !== 'cancelled' && b.serviceId === serviceId.value,
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

// Validaciones
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

const contactValid = computed(
  () =>
    Boolean(clientAlias.value.trim()) &&
    Boolean(clientEmail.value.trim()) &&
    Boolean(clientPhone.value.trim()),
)

const canConfirm = computed(
  () => contactValid.value && dateTimeValid.value && Boolean(serviceId.value),
)

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      resetForm()
      if (services.value.length === 1 && services.value[0]?.id) {
        serviceId.value = services.value[0].id
      }
    }
  },
)

watch(serviceId, () => {
  resetDateTime()
})

function handleSubmit() {
  if (!canConfirm.value) return

  const defaultStartTime = currentDaySchedule.value?.operationalHours?.start || '09:00'

  const newBooking = {
    clientId: authStore.user?.id || '',
    clientAlias: clientAlias.value,
    clientEmail: clientEmail.value,
    clientPhone: clientPhone.value,
    serviceId: serviceId.value,
    date: date.value,
    time: time.value || defaultStartTime,
    endDate: endDate.value || undefined,
    endTime: endTime.value || undefined,
    status: (currentConfig.value?.requiresApproval ? 'pending' : 'confirmed') as BookingStatus,
    notes: notes.value || undefined,
  } as Omit<Booking, 'id'>

  emit('confirm', newBooking)
  resetForm()
  emit('update:open', false)
}
</script>

<template>
  <Dialog :open="props.open" @update:open="(v: boolean) => emit('update:open', v)">
    <DialogContent class="max-h-[90vh] max-w-lg flex flex-col p-0 gap-0 overflow-hidden">
      <!-- Encabezado fijo -->
      <DialogHeader class="p-6 pb-2">
        <DialogTitle>{{ t('bookingModal.title') }}</DialogTitle>
        <DialogDescription>{{ t('bookingModal.description') }}</DialogDescription>
      </DialogHeader>

      <!-- Cuerpo con Scroll independiente -->
      <div class="flex-1 overflow-y-auto px-6 py-2">
        <Tabs v-model="activeTab" class="w-full">
          <TabsList class="grid w-full grid-cols-2">
            <TabsTrigger value="service" class="gap-2">
              <Calendar class="h-4 w-4" />
              <span>{{ t('bookingModal.tabs.service') }}</span>
            </TabsTrigger>
            <TabsTrigger value="client" class="gap-2">
              <User class="h-4 w-4" />
              <span>{{ t('bookingModal.tabs.client') }}</span>
            </TabsTrigger>
          </TabsList>

          <!-- Tab 1: Reserva y Fechas -->
          <TabsContent value="service" class="space-y-4 pt-4">
            <div class="space-y-2">
              <Label>
                {{ t('bookingModal.service') }} <span class="text-destructive">*</span>
              </Label>
              <Select v-model="serviceId">
                <SelectTrigger class="w-full">
                  <SelectValue :placeholder="t('bookingModal.selectService')" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem v-for="svc in services" :key="svc.id" :value="svc.id">
                    {{ getServiceTitle(svc.id) }}
                  </SelectItem>
                </SelectContent>
              </Select>

              <div
                v-if="currentConfig?.description"
                class="mt-2 flex items-start gap-2 rounded-md border bg-muted/30 p-3 text-xs leading-relaxed text-muted-foreground"
              >
                <Info class="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <div>
                  <span v-if="currentConfig?.mode">
                    {{ t(`bookingModal.modes.${currentConfig.mode}`) }}
                  </span>
                  <br />
                  <span>{{ currentConfig.description }}</span>
                </div>
              </div>

              <div
                v-if="minAdvanceHours > 0"
                class="mt-2 flex items-center gap-2 rounded-md border border-amber-500/30 bg-amber-500/10 p-2.5 text-xs text-amber-700 dark:text-amber-400"
              >
                <ClockAlert class="h-4 w-4 shrink-0" />
                <span>{{
                  t('bookingModal.minAdvanceNoticeHint', { hours: minAdvanceHours })
                }}</span>
              </div>
            </div>

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
          </TabsContent>

          <!-- Tab 2: Datos del Cliente -->
          <TabsContent value="client" class="pt-4">
            <BookingClientForm
              v-model:alias="clientAlias"
              v-model:email="clientEmail"
              v-model:phone="clientPhone"
              v-model:notes="notes"
            />
          </TabsContent>
        </Tabs>
      </div>

      <!-- Pie del Modal Fijo -->
      <DialogFooter class="p-6 pt-4 border-t gap-2 sm:gap-0">
        <DialogClose as-child>
          <Button variant="outline" @click="resetForm">{{ t('bookingModal.cancel') }}</Button>
        </DialogClose>
        <Button :disabled="!canConfirm" @click="handleSubmit">
          {{ t('bookingModal.confirm') }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
