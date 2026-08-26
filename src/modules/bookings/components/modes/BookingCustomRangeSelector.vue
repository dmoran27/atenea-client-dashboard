<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { Label } from '@/core/components/ui/label'
import { Input } from '@/core/components/ui/input'
import { Badge } from '@/core/components/ui/badge'
import BookingDateField from '../ui/BookingDateField.vue'

const props = defineProps<{
  error?: string
  todayStr: string
  context?: {
    currentDaySchedule?: { operationalHours?: { start: string; end: string } }
    isDateDisabled?: (dateStr: string) => boolean
  }
}>()

const date = defineModel<string>('date', { required: true })
const time = defineModel<string>('time', { required: true })
const endTime = defineModel<string>('endTime', { required: true })
const { t } = useI18n()
</script>

<template>
  <div class="space-y-3">
    <BookingDateField
      id="custom-date"
      v-model="date"
      :today-str="todayStr"
      :is-date-disabled="props.context?.isDateDisabled"
    />

    <div class="grid grid-cols-2 gap-3">
      <div class="space-y-2">
        <Label for="start-time">
          {{ t('bookingModal.startTime') }} <span class="text-destructive">*</span>
        </Label>
        <Input id="start-time" type="time" v-model="time" />
      </div>
      <div class="space-y-2">
        <Label for="end-time">
          {{ t('bookingModal.endTime') }} <span class="text-destructive">*</span>
        </Label>
        <Input id="end-time" type="time" v-model="endTime" />
      </div>
    </div>

    <p
      v-if="props.context?.currentDaySchedule?.operationalHours"
      class="text-xs text-muted-foreground"
    >
      {{ t('bookingModal.operationalHours') }}:
      {{ props.context.currentDaySchedule.operationalHours.start }} -
      {{ props.context.currentDaySchedule.operationalHours.end }}
    </p>

    <Badge v-if="error" variant="destructive">{{ error }}</Badge>
  </div>
</template>
