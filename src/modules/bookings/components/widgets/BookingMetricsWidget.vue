<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { CalendarCheck, Clock, AlertCircle, XCircle, TrendingUp, TrendingDown } from '@lucide/vue'
import { Card, CardContent } from '@/core/components/ui/card'
import type { Booking } from '@/core/api/booking'
import { formatLocalDate } from '@/core/lib/utils'

const { t } = useI18n()

const props = defineProps<{
  bookings: Booking[]
}>()

// Obtener fecha actual en formato local YYYY-MM-DD sin desfase UTC
const todayStr = computed(() => formatLocalDate(new Date()))

const stats = computed(() => {
  const list = props.bookings ?? []

  return {
    total: list.length,
    upcoming: list.filter((b) => b.date >= todayStr.value && b.status === 'confirmed').length,
    pending: list.filter((b) => b.status === 'pending').length,
    cancelled: list.filter((b) => b.status === 'cancelled').length,
  }
})

const cards = computed(() => [
  {
    key: 'total',
    label: t('bookings.metrics.total'),
    value: stats.value.total,
    icon: CalendarCheck,
    iconBg: 'bg-blue-500/10 text-blue-500',
    trend: '+12.5%',
    trendUp: true,
  },
  {
    key: 'upcoming',
    label: t('bookings.metrics.upcoming'),
    value: stats.value.upcoming,
    icon: Clock,
    iconBg: 'bg-emerald-500/10 text-emerald-500',
    trend: '+8.2%',
    trendUp: true,
  },
  {
    key: 'pending',
    label: t('bookings.metrics.pending'),
    value: stats.value.pending,
    icon: AlertCircle,
    iconBg: 'bg-amber-500/10 text-amber-500',
    trend: '-3.1%',
    trendUp: false,
  },
  {
    key: 'cancelled',
    label: t('bookings.metrics.cancelled'),
    value: stats.value.cancelled,
    icon: XCircle,
    iconBg: 'bg-rose-500/10 text-rose-500',
    trend: '-1.4%',
    trendUp: false,
  },
])
</script>

<template>
  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
    <Card
      v-for="card in cards"
      :key="card.key"
      class="animate-fade-in transition-shadow hover:shadow-md"
    >
      <CardContent class="p-5">
        <div class="flex items-center justify-between">
          <div class="space-y-1">
            <p class="text-sm font-medium text-muted-foreground">{{ card.label }}</p>
            <p class="text-2xl font-bold tracking-tight">{{ card.value }}</p>
          </div>
          <div class="flex h-11 w-11 items-center justify-center rounded-lg" :class="card.iconBg">
            <component :is="card.icon" class="h-5 w-5" />
          </div>
        </div>
        <div class="mt-3 flex items-center gap-1 text-xs">
          <TrendingUp v-if="card.trendUp" class="h-3 w-3 text-emerald-500" />
          <TrendingDown v-else class="h-3 w-3 text-rose-500" />
          <span :class="card.trendUp ? 'text-emerald-500' : 'text-rose-500'" class="font-medium">
            {{ card.trend }}
          </span>
          <span class="text-muted-foreground">{{ t('bookings.metrics.fromLastMonth') }}</span>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
