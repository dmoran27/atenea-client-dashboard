<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  Calendar,
  Clock,
  User,
  Mail,
  Phone,
  FileText,
  CalendarSync,
  XCircle,
  Info,
} from '@lucide/vue'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/core/components/ui/dialog'
import { Button } from '@/core/components/ui/button'
import { Badge } from '@/core/components/ui/badge'
import { Separator } from '@/core/components/ui/separator'
import type { Booking } from '@/core/api/booking'
import { useBookingServices } from '../composables/useBookingServices'
import { useBookingPermissions } from '../composables/useBookingPermissions'

const props = withDefaults(
  defineProps<{
    open: boolean
    booking: Booking | null
    allowPastReschedule?: boolean
  }>(),
  {
    allowPastReschedule: false,
  },
)

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
  (e: 'reschedule', booking: Booking): void
  (e: 'cancel', id: string): void
}>()

const { t } = useI18n()

const { getServiceTitle, getServiceConfig } = useBookingServices()

const currentConfig = computed(() => {
  return props.booking?.serviceId ? getServiceConfig(props.booking.serviceId) : null
})

const { canReschedule, isPast } = useBookingPermissions(() => props.booking, {
  allowPastReschedule: () => props.allowPastReschedule,
})

function getStatusBadgeVariant(status: string) {
  switch (status) {
    case 'confirmed':
      return 'default'
    case 'pending':
      return 'secondary'
    case 'completed':
      return 'outline'
    case 'cancelled':
      return 'destructive'
    default:
      return 'outline'
  }
}
</script>

<template>
  <Dialog :open="props.open" @update:open="(v: boolean) => emit('update:open', v)">
    <DialogContent v-if="booking" class="max-w-md">
      <!-- Header unificado -->
      <DialogHeader class="pr-6 space-y-1">
        <div class="flex items-start justify-between gap-3">
          <DialogTitle class="text-base font-semibold leading-snug text-foreground">
            {{ getServiceTitle(booking.serviceId) }}
          </DialogTitle>
          <Badge
            :variant="getStatusBadgeVariant(booking.status)"
            class="capitalize shrink-0 mt-0.5"
          >
            {{ t(`bookings.status.${booking.status}`) }}
          </Badge>
        </div>
        <p v-if="booking.number" class="text-xs text-muted-foreground">
          {{ t('bookings.viewModal.title', 'Reserva') }} #{{ booking.number }}
        </p>
      </DialogHeader>

      <div class="space-y-4 py-1 text-sm">
        <div class="space-y-3">
          <!-- Descripción destacada con acento lateral suave -->
          <div
            v-if="currentConfig?.description"
            class="rounded-r-md border-l-2 border-primary/70 bg-muted/30 px-3 py-2 text-xs text-muted-foreground leading-relaxed"
          >
            {{ currentConfig.description }}
          </div>

          <!-- Metadatos (Modo, Fecha, Hora) -->
          <div
            class="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground pt-0.5"
          >
            <div v-if="currentConfig?.mode" class="flex items-center gap-1.5">
              <Info class="h-3.5 w-3.5 text-primary shrink-0" />
              <span class="font-medium text-foreground">
                {{ t(`bookingModal.modes.${currentConfig.mode}`, currentConfig.mode) }}
              </span>
            </div>

            <div v-if="booking.date" class="flex items-center gap-1.5">
              <Calendar class="h-3.5 w-3.5 text-primary shrink-0" />
              <span>
                {{ booking.date }}
                <template v-if="booking.endDate">— {{ booking.endDate }}</template>
              </span>
            </div>

            <div v-if="booking.time" class="flex items-center gap-1.5">
              <Clock class="h-3.5 w-3.5 text-primary shrink-0" />
              <span>
                {{ booking.time }}
                <template v-if="booking.endTime"> - {{ booking.endTime }}</template>
              </span>
            </div>
          </div>
        </div>

        <Separator />

        <!-- Cliente -->
        <div class="space-y-2">
          <p class="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80">
            {{ t('bookings.viewModal.clientInfo', 'Cliente') }}
          </p>
          <div class="grid gap-2">
            <div v-if="booking.clientAlias" class="flex items-center gap-2.5">
              <User class="h-4 w-4 text-muted-foreground shrink-0" />
              <span class="font-semibold text-foreground">{{ booking.clientAlias }}</span>
            </div>
            <div
              v-if="booking.clientEmail"
              class="flex items-center gap-2.5 text-xs text-muted-foreground"
            >
              <Mail class="h-4 w-4 shrink-0" />
              <span>{{ booking.clientEmail }}</span>
            </div>
            <div
              v-if="booking.clientPhone"
              class="flex items-center gap-2.5 text-xs text-muted-foreground"
            >
              <Phone class="h-4 w-4 shrink-0" />
              <span>{{ booking.clientPhone }}</span>
            </div>
          </div>
        </div>

        <!-- Notas -->
        <template v-if="booking.notes">
          <Separator />
          <div class="space-y-1.5">
            <p
              class="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80 flex items-center gap-1.5"
            >
              <FileText class="h-3.5 w-3.5" />
              {{ t('bookings.viewModal.notes', 'Notas') }}
            </p>
            <p class="text-xs text-muted-foreground leading-relaxed italic pl-5">
              "{{ booking.notes }}"
            </p>
          </div>
        </template>
      </div>

      <!-- Acciones -->
      <DialogFooter class="flex-col sm:flex-row gap-2 pt-2">
        <Button
          v-if="canReschedule"
          variant="outline"
          class="w-full sm:w-auto gap-1.5"
          @click="emit('reschedule', booking)"
        >
          <CalendarSync class="h-4 w-4" />
          {{ t('bookings.actions.reschedule', 'Reagendar') }}
        </Button>

        <Button
          v-if="booking.status !== 'cancelled' && !isPast"
          variant="destructive"
          class="w-full sm:w-auto gap-1.5"
          @click="emit('cancel', booking.id)"
        >
          <XCircle class="h-4 w-4" />
          {{ t('bookings.actions.cancel', 'Cancelar') }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
