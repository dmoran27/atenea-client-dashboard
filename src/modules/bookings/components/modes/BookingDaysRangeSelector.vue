<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { CalendarDays } from '@lucide/vue'
import { Label } from '@/core/components/ui/label'
import { Button } from '@/core/components/ui/button'
import { Badge } from '@/core/components/ui/badge'
import { Popover, PopoverTrigger, PopoverContent } from '@/core/components/ui/popover'
import { RangeCalendar } from '@/core/components/ui/range-calendar'
import { formatLocalDate } from '@/core/lib/utils'

const props = defineProps<{
  error?: string
  todayStr?: string
  context?: {
    isDateDisabled?: (dateStr: string) => boolean
  }
}>()

const date = defineModel<string>('date', { required: true })
const endDate = defineModel<string>('endDate', { required: true })

const { t, locale } = useI18n()
const rangeCalendarOpen = ref(false)
const calendarRange = ref<{ start?: any; end?: any }>({ start: undefined, end: undefined })

function handleRangeChange(range: { start?: any; end?: any }) {
  if (!range) {
    calendarRange.value = { start: undefined, end: undefined }
    date.value = ''
    endDate.value = ''
    return
  }

  calendarRange.value = range

  if (range.start) {
    const startDate =
      typeof range.start.toDate === 'function'
        ? range.start.toDate('UTC')
        : new Date(String(range.start))
    date.value = formatLocalDate(startDate)
  } else {
    date.value = ''
  }

  if (range.end) {
    const endDateObj =
      typeof range.end.toDate === 'function' ? range.end.toDate('UTC') : new Date(String(range.end))
    endDate.value = formatLocalDate(endDateObj)
  } else {
    endDate.value = ''
  }

  if (range.start && range.end) rangeCalendarOpen.value = false
}

function handleIsDateDisabled(val: any): boolean {
  if (!props.context?.isDateDisabled) return false
  const dateStr = typeof val === 'string' ? val : (val?.toString?.() ?? '')
  return props.context.isDateDisabled(dateStr)
}

function formatRangeLabel(): string {
  if (!date.value) return t('bookingModal.selectDates')
  if (!endDate.value) return date.value
  return `${date.value} — ${endDate.value}`
}
</script>

<template>
  <div class="space-y-3">
    <Label>
      {{ t('bookingModal.checkIn') }} / {{ t('bookingModal.checkOut') }}
      <span class="text-destructive">*</span>
    </Label>
    <Popover v-model:open="rangeCalendarOpen">
      <PopoverTrigger as-child>
        <Button variant="outline" class="w-full justify-start gap-2 font-normal">
          <CalendarDays class="h-4 w-4 text-muted-foreground" />
          <span :class="{ 'text-muted-foreground': !date }">
            {{ formatRangeLabel() }}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" class="w-auto p-0">
        <RangeCalendar
          :model-value="calendarRange as any"
          @update:model-value="handleRangeChange"
          :is-date-disabled="handleIsDateDisabled"
          :locale="locale"
          :number-of-months="1"
        />
      </PopoverContent>
    </Popover>
    <p class="text-xs text-muted-foreground">{{ t('bookingModal.rangeHint') }}</p>
    <Badge v-if="error" variant="destructive">{{ error }}</Badge>
  </div>
</template>
