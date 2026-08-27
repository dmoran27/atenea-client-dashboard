<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { CalendarCheck, Eye } from '@lucide/vue'
import { Card, CardContent } from '@/core/components/ui/card'
import { Badge } from '@/core/components/ui/badge'
import Button from '@/core/components/ui/button/Button.vue'

import { useBookings } from '../../composables/useBooking'
import { useBookingServices } from '../../composables/useBookingServices'
import type { Booking } from '../../api'
import ViewBookingDialog from '../ViewBookingDialog.vue'
const { t } = useI18n()
const { bookings } = useBookings()
const { getServiceTitle } = useBookingServices()

// Asegurar el tipo string explícito para evitar 'todayStr is possibly undefined'
const todayStr: string = new Date().toISOString().split('T')[0] ?? ''

const nextBooking = computed(() => {
  if (!todayStr) return null

  return [...bookings.value]
    .filter((b) => b.status === 'confirmed' && Boolean(b.date) && b.date >= todayStr)
    .sort((a, b) => `${a.date}${a.time ?? ''}`.localeCompare(`${b.date}${b.time ?? ''}`))[0]
})

// --- Estado local de la vista ---
const viewBookingOpen = ref(false)
const selectedBooking = ref<Booking | null>(null)

const handleViewBooking = (booking: Booking) => {
  selectedBooking.value = booking
  viewBookingOpen.value = true
}

function nextBookingLabel(booking: Booking): string {
  if (!booking.date) return ''

  // Desestructuración segura asignando valores por defecto
  const parts = booking.date.split('-').map(Number)
  const year = parts[0] ?? 0
  const month = parts[1] ?? 1
  const day = parts[2] ?? 1

  const targetDate = new Date(year, month - 1, day)

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const diffTime = targetDate.getTime() - today.getTime()
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24))

  const timeText = booking.time ? ` a las ${booking.time}` : ''

  if (diffDays <= 0) return `Hoy${timeText}`
  if (diffDays === 1) return `Mañana${timeText}`
  return `En ${diffDays} días`
}
</script>

<template>
  <Card
    v-if="nextBooking"
    class="overflow-hidden border-primary/20 bg-gradient-to-r from-primary/10 via-card to-card"
  >
    <CardContent class="flex flex-col gap-5 p-5 lg:flex-row lg:items-center lg:justify-between">
      <div class="flex items-start gap-4">
        <div
          class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground"
        >
          <CalendarCheck class="h-6 w-6" />
        </div>
        <div>
          <div class="mb-1 flex flex-wrap items-center gap-2">
            <p class="text-lg font-semibold">{{ getServiceTitle(nextBooking.serviceId) }}</p>
            <Badge>{{ t('bookings.status.confirmed') }}</Badge>
          </div>
          <p class="text-sm text-muted-foreground">
            {{ nextBookingLabel(nextBooking) }} · {{ nextBooking.date }}
            <template v-if="nextBooking.time"> · {{ nextBooking.time }}</template>
          </p>
        </div>
      </div>
      <div class="flex flex-wrap gap-2">
        <Button class="cursor-pointer gap-2" @click="handleViewBooking(nextBooking)">
          <Eye class="h-4 w-4" />
          {{ t('bookings.actions.view', 'Ver detalles') }}
        </Button>
      </div>
    </CardContent>
  </Card>

  <ViewBookingDialog
    v-model:open="viewBookingOpen"
    :booking="selectedBooking"
    :show-footer="false"
  />
</template>
