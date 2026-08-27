<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { CalendarCheck, Clock, AlertCircle, XCircle, TrendingUp, TrendingDown } from '@lucide/vue'
import { useBookingMetrics } from '../../composables/useBooking'

const { t } = useI18n()
const { metrics } = useBookingMetrics()

const kpiCards = computed(() => {
  if (!metrics.value) return []
  const m = metrics.value

  return [
    {
      key: 'total',
      label: t('bookings.metrics.total'),
      value: m.total,
      icon: CalendarCheck,
      iconBg: 'bg-blue-500/10 text-blue-500',
      trend: m.trends.total.value,
      trendUp: m.trends.total.isUp,
    },
    {
      key: 'upcoming',
      label: t('bookings.metrics.upcoming'),
      value: m.upcoming,
      icon: Clock,
      iconBg: 'bg-emerald-500/10 text-emerald-500',
      trend: m.trends.upcoming.value,
      trendUp: m.trends.upcoming.isUp,
    },
    {
      key: 'pending',
      label: t('bookings.metrics.pending'),
      value: m.pending,
      icon: AlertCircle,
      iconBg: 'bg-amber-500/10 text-amber-500',
      trend: m.trends.pending.value,
      trendUp: m.trends.pending.isUp,
    },
    {
      key: 'cancelled',
      label: t('bookings.metrics.cancelled'),
      value: m.cancelled,
      icon: XCircle,
      iconBg: 'bg-rose-500/10 text-rose-500',
      trend: m.trends.cancelled.value,
      trendUp: m.trends.cancelled.isUp,
    },
  ]
})
</script>

<template>
  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
    <Card
      v-for="card in kpiCards"
      :key="card.key"
      class="animate-fade-in transition-shadow hover:shadow-md text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm border-primary/20 via-card to-card"
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
