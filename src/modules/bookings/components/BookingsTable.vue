<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { Badge } from '@/core/components/ui/badge'
import { Avatar, AvatarFallback } from '@/core/components/ui/avatar'

import { useBookingServices } from '../composables/useBookingServices'
import type { Booking, BookingStatus } from '@/core/api/booking'
import { formatLocalDate, getInitials } from '@/core/lib/utils'
import BookingActionsMenu from './ui/BookingActionsMenu.vue'

const { t } = useI18n()
const { getServiceTitle } = useBookingServices()

defineProps<{
  bookings: Booking[]
}>()

const emit = defineEmits<{
  (e: 'cancel', id: string): void
  (e: 'view', booking: Booking): void
  (e: 'reschedule', booking: Booking): void
}>()

const statusVariant: Record<BookingStatus, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  confirmed: 'default',
  pending: 'secondary',
  cancelled: 'destructive',
  completed: 'outline',
}
</script>

<template>
  <div class="overflow-hidden rounded-lg border bg-card">
    <div class="overflow-x-auto">
      <table class="w-full text-sm">
        <thead class="border-b bg-muted/50">
          <tr>
            <th class="px-4 py-3 text-left font-medium text-muted-foreground">
              {{ t('bookings.columns.clientService', 'Cliente / Servicio') }}
            </th>
            <th class="px-4 py-3 text-left font-medium text-muted-foreground">
              {{ t('bookings.columns.dateTime', 'Fecha y Hora') }}
            </th>
            <th class="px-4 py-3 text-left font-medium text-muted-foreground">
              {{ t('bookings.columns.status', 'Estado') }}
            </th>
            <th class="px-4 py-3 text-right font-medium text-muted-foreground">
              {{ t('bookings.columns.actions', 'Acciones') }}
            </th>
          </tr>
        </thead>
        <tbody class="divide-y">
          <tr
            v-for="booking in bookings"
            :key="booking.id"
            class="transition-colors hover:bg-muted/30"
          >
            <!-- Cliente / Servicio -->
            <td class="px-4 py-3">
              <div class="flex items-center gap-3">
                <Avatar class="h-9 w-9">
                  <AvatarFallback class="bg-primary/10 text-xs font-semibold text-primary">
                    {{ getInitials(booking.clientAlias) }}
                  </AvatarFallback>
                </Avatar>
                <div class="overflow-hidden cursor-pointer" @click="emit('view', booking)">
                  <p class="truncate font-medium leading-tight">
                    {{ booking.clientAlias }}
                  </p>
                  <p class="truncate text-xs text-muted-foreground">
                    {{ getServiceTitle(booking.serviceId) }}
                  </p>
                </div>
              </div>
            </td>

            <!-- Fecha y Hora -->
            <td class="px-4 py-3 whitespace-nowrap">
              <div class="flex flex-col">
                <template v-if="booking.endDate">
                  <span class="font-medium">
                    {{ formatLocalDate(booking.date) }} — {{ formatLocalDate(booking.endDate) }}
                  </span>
                </template>

                <template v-else>
                  <span class="font-medium">{{ formatLocalDate(booking.date) }}</span>
                  <span v-if="booking.time" class="text-xs text-muted-foreground">
                    {{ booking.time }}
                    <template v-if="booking.endTime"> - {{ booking.endTime }}</template>
                  </span>
                </template>
              </div>
            </td>

            <!-- Estado -->
            <td class="px-4 py-3 whitespace-nowrap">
              <Badge :variant="statusVariant[booking.status]">
                {{ t(`bookings.status.${booking.status}`, booking.status) }}
              </Badge>
            </td>

            <!-- Acciones -->
            <td class="px-4 py-3 text-right whitespace-nowrap">
              <BookingActionsMenu
                icon="vertical"
                :booking="booking"
                :portal="true"
                @view="emit('view', $event)"
                @reschedule="emit('reschedule', $event)"
                @cancel="emit('cancel', $event.id)"
              />
            </td>
          </tr>

          <tr v-if="bookings.length === 0">
            <td colspan="4" class="px-4 py-8 text-center text-muted-foreground">
              {{ t('bookings.noBookingsFound', 'No se encontraron reservas') }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
