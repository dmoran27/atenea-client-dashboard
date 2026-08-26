<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { Label } from '@/core/components/ui/label'
import { Input } from '@/core/components/ui/input'
import { Badge } from '@/core/components/ui/badge'

defineProps<{
  id?: string
  label?: string
  error?: string
  todayStr: string
  isDateDisabled?: (dateStr: string) => boolean
}>()

const date = defineModel<string>({ required: true })
const { t } = useI18n()
</script>

<template>
  <div class="space-y-2">
    <Label :for="id || 'booking-date'">
      {{ label || t('bookingModal.date') }} <span class="text-destructive">*</span>
    </Label>
    <Input :id="id || 'booking-date'" type="date" v-model="date" :min="todayStr" />
    <Badge v-if="error" variant="destructive" class="mt-1">
      {{ error }}
    </Badge>
  </div>
</template>
