<script setup lang="ts">
import BookingDateField from '../ui/BookingDateField.vue'

const props = defineProps<{
  error?: string
  todayStr: string
  context?: {
    isDateDisabled?: (dateStr: string) => boolean
  }
}>()

const date = defineModel<string>('date', { required: true })
</script>

<template>
  <BookingDateField
    v-model="date"
    :today-str="todayStr"
    :error="error"
    :is-date-disabled="props.context?.isDateDisabled"
  />
</template>
