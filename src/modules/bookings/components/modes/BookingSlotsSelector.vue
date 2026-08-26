<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { Users } from '@lucide/vue'
import { Label } from '@/core/components/ui/label'
import { Badge } from '@/core/components/ui/badge'
import type { BookingServiceConfig } from '@/core/api/booking'
import BookingDateField from '../ui/BookingDateField.vue'

const props = defineProps<{
  error?: string
  todayStr: string
  context?: {
    currentConfig?: BookingServiceConfig
    generatedSlots?: string[]
    isDateDisabled?: (dateStr: string) => boolean
    isSlotDisabled?: (slotStr: string) => boolean
    getSlotCapacityText?: (slotStr: string) => string
  }
}>()

const date = defineModel<string>('date', { required: true })
const time = defineModel<string>('time', { required: true })
const { t } = useI18n()
</script>

<template>
  <div class="space-y-3">
    <BookingDateField
      v-model="date"
      :today-str="todayStr"
      :is-date-disabled="props.context?.isDateDisabled"
    />

    <div
      v-if="date && (!props.context?.isDateDisabled || !props.context.isDateDisabled(date))"
      class="space-y-2"
    >
      <Label>{{ t('bookingModal.selectSlot') }}</Label>
      <div class="grid grid-cols-3 gap-2 sm:grid-cols-4">
        <button
          v-for="slot in props.context?.generatedSlots || []"
          :key="slot"
          type="button"
          :disabled="props.context?.isSlotDisabled?.(slot)"
          @click="time = slot"
          :class="[
            'flex flex-col items-center justify-center rounded-lg border p-2 text-center text-sm font-medium transition-colors',
            props.context?.isSlotDisabled?.(slot)
              ? 'cursor-not-allowed border-muted bg-muted/50 text-muted-foreground/50'
              : time === slot
                ? 'border-primary bg-primary text-primary-foreground'
                : 'hover:bg-accent',
          ]"
        >
          <span>{{ slot }}</span>
          <span
            v-if="
              props.context?.currentConfig?.capacityType === 'group' &&
              props.context?.getSlotCapacityText
            "
            class="mt-1 flex items-center gap-1 text-[10px] opacity-80"
          >
            <Users class="h-3 w-3" />
            {{ props.context.getSlotCapacityText(slot) }}
          </span>
        </button>
      </div>
    </div>
    <Badge v-if="error" variant="destructive">{{ error }}</Badge>
  </div>
</template>
