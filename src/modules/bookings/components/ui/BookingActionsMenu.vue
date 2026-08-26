<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { MoreHorizontal, MoreVertical, Eye, CalendarClock, X } from '@lucide/vue'
import { Button } from '@/core/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/core/components/ui/dropdown-menu'
import type { Booking } from '@/core/api/booking'
import { useBookingPermissions } from '../../composables/useBookingPermissions'

const props = withDefaults(
  defineProps<{
    booking: Booking
    icon?: 'vertical' | 'horizontal'
    allowPastReschedule?: boolean
    portal?: boolean
  }>(),
  {
    icon: 'horizontal',
    allowPastReschedule: false,
    portal: true,
  },
)

const emit = defineEmits<{
  (e: 'view', booking: Booking): void
  (e: 'reschedule', booking: Booking): void
  (e: 'cancel', booking: Booking): void
}>()

const { t } = useI18n()

const { canReschedule, isPast } = useBookingPermissions(() => props.booking, {
  allowPastReschedule: () => props.allowPastReschedule,
})
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child @click.stop>
      <Button
        variant="ghost"
        size="icon"
        class="h-8 w-8 shrink-0 text-muted-foreground hover:text-foreground"
      >
        <MoreHorizontal v-if="icon === 'horizontal'" class="h-4 w-4" />
        <MoreVertical v-else class="h-4 w-4" />
      </Button>
    </DropdownMenuTrigger>

    <DropdownMenuContent align="end" :portal="portal">
      <!-- Ver detalle -->
      <DropdownMenuItem class="cursor-pointer gap-2" @click.stop="emit('view', booking)">
        <Eye class="h-4 w-4" />
        {{ t('bookings.actions.view', 'Ver detalle') }}
      </DropdownMenuItem>

      <!-- Reagendar -->
      <DropdownMenuItem
        v-if="canReschedule"
        class="cursor-pointer gap-2"
        @click.stop="emit('reschedule', booking)"
      >
        <CalendarClock class="h-4 w-4" />
        {{ t('bookings.actions.reschedule', 'Reagendar') }}
      </DropdownMenuItem>

      <!-- Cancelar -->
      <template v-if="booking.status !== 'cancelled' && !isPast">
        <DropdownMenuSeparator />
        <DropdownMenuItem
          class="cursor-pointer gap-2 text-destructive focus:text-destructive"
          @click.stop="emit('cancel', booking)"
        >
          <X class="h-4 w-4" />
          {{ t('bookings.actions.cancel', 'Cancelar') }}
        </DropdownMenuItem>
      </template>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
