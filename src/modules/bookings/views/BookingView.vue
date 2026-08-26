<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Search, Calendar, Plus, Table as TableIcon } from '@lucide/vue'
import { Input } from '@/core/components/ui/input'
import { Button } from '@/core/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/core/components/ui/tabs'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/core/components/ui/select'

// Componentes del módulo
import BookingMetricsWidget from '@/modules/bookings/components/widgets/BookingMetricsWidget.vue'
import BookingsTable from '@/modules/bookings/components/BookingsTable.vue'
import BookingsCalendar from '@/modules/bookings/components/BookingsCalendar.vue'
import NewBookingDialog from '@/modules/bookings/components/NewBookingDialog.vue'
import ViewBookingDialog from '@/modules/bookings/components/ViewBookingDialog.vue'
import RescheduleBookingDialog from '@/modules/bookings/components/RescheduleBookingDialog.vue'

// Composable & Tipos
import type { ViewMode } from '../types'
import type { CreateBookingSchema } from '../schemas/booking.schema'
import type { Booking, BookingStatus } from '@/core/api/booking'
import { useBookings } from '../composables/useBooking'

const { t } = useI18n()

// --- Estado local de la vista ---
const newBookingOpen = ref(false)
const viewBookingOpen = ref(false)
const rescheduleBookingOpen = ref(false)
const selectedBooking = ref<Booking | null>(null)

const searchQuery = ref('')
const statusFilter = ref<BookingStatus | 'all'>('all')
const viewMode = ref<ViewMode>('table')

// --- Filtros reactivos pasados a TanStack Query ---
const filters = computed(() => ({
  search: searchQuery.value,
  status: statusFilter.value,
}))

// --- Composable de reservas ---
const { bookings, isLoadingBookings, createBooking, updateBooking, cancelBooking } =
  useBookings(filters)

const statusOptions: { value: BookingStatus | 'all'; key: string }[] = [
  { value: 'all', key: 'all' },
  { value: 'pending', key: 'pending' },
  { value: 'confirmed', key: 'confirmed' },
  { value: 'completed', key: 'completed' },
  { value: 'cancelled', key: 'cancelled' },
]

// --- Manejadores de acciones ---
const handleCancelBooking = async (id: string, reason?: string) => {
  await cancelBooking({ id, payload: reason ? { reason } : undefined })
  viewBookingOpen.value = false
}

const handleCreateBooking = async (payload: CreateBookingSchema) => {
  await createBooking(payload)
  newBookingOpen.value = false
}

const handleViewBooking = (booking: Booking) => {
  selectedBooking.value = booking
  viewBookingOpen.value = true
}

const handleOpenReschedule = (booking: Booking) => {
  selectedBooking.value = booking
  viewBookingOpen.value = false
  rescheduleBookingOpen.value = true
}

const handleRescheduleBooking = async (payload: {
  date: string
  time: string
  endDate?: string
  endTime?: string
}) => {
  if (!selectedBooking.value) return

  await updateBooking({
    id: selectedBooking.value.id,
    payload: {
      date: payload.date,
      time: payload.time,
      endDate: payload.endDate,
      endTime: payload.endTime,
    },
  })

  rescheduleBookingOpen.value = false
  selectedBooking.value = null
}
</script>

<template>
  <div class="space-y-6">
    <!-- Métrica de Reservas -->
    <BookingMetricsWidget :bookings="bookings" />

    <!-- Barra de Controles: Búsqueda, Filtros y Modo de Vista -->
    <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <!-- Filtros -->
      <div class="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center">
        <div class="relative flex-1 sm:max-w-xs">
          <Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            v-model="searchQuery"
            :placeholder="t('bookings.searchPlaceholder')"
            class="pl-9"
          />
        </div>

        <Select v-model="statusFilter">
          <SelectTrigger class="sm:w-[160px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem v-for="opt in statusOptions" :key="opt.value" :value="opt.value">
              {{ t(`bookings.status.${opt.key}`) }}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <!-- Conmutador de Vista (Tabla / Calendario) -->
      <div class="flex items-center gap-3">
        <Tabs v-model="viewMode" default-value="table">
          <TabsList class="grid w-full grid-cols-2 sm:w-auto">
            <TabsTrigger value="table" class="gap-1.5">
              <TableIcon class="h-4 w-4" />
              <span class="hidden sm:inline">{{ t('bookings.tableView') }}</span>
            </TabsTrigger>
            <TabsTrigger value="calendar" class="gap-1.5">
              <Calendar class="h-4 w-4" />
              <span class="hidden sm:inline">{{ t('bookings.calendarView') }}</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <Button
          @click="newBookingOpen = true"
          class="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors bg-primary text-primary-foreground cursor-pointer"
        >
          <Plus class="h-4 w-4" />
          <span>{{ t('bookings.actions.new', 'Nueva Reserva') }}</span>
        </Button>
      </div>
    </div>

    <!-- Indicador de Carga o Vistas de Datos -->
    <div
      v-if="isLoadingBookings"
      class="flex h-40 items-center justify-center text-muted-foreground"
    >
      <span>{{ t('bookings.loading') }}</span>
    </div>

    <template v-else>
      <div v-if="viewMode === 'table'" class="animate-fade-in">
        <BookingsTable
          :bookings="bookings"
          @cancel="handleCancelBooking"
          @view="handleViewBooking"
          @reschedule="handleOpenReschedule"
        />
      </div>
      <div v-else class="animate-fade-in">
        <BookingsCalendar
          :bookings="bookings"
          @view="handleViewBooking"
          @reschedule="handleOpenReschedule"
        />
      </div>
    </template>
  </div>

  <!-- Diálogos Modales -->
  <NewBookingDialog v-model:open="newBookingOpen" @confirm="handleCreateBooking" />

  <ViewBookingDialog
    v-model:open="viewBookingOpen"
    :booking="selectedBooking"
    @reschedule="handleOpenReschedule"
    @cancel="handleCancelBooking"
  />

  <RescheduleBookingDialog
    v-model:open="rescheduleBookingOpen"
    :booking="selectedBooking"
    @confirm="handleRescheduleBooking"
  />
</template>
