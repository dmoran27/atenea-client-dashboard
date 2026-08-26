<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { Label } from '@/core/components/ui/label'
import { Input } from '@/core/components/ui/input'

const clientAlias = defineModel<string>('alias', { required: true })
const clientEmail = defineModel<string>('email', { required: true })
const clientPhone = defineModel<string>('phone', { required: true })
const notes = defineModel<string>('notes', { default: '' })

const { t } = useI18n()
</script>

<template>
  <div class="space-y-4 pt-4">
    <div class="space-y-2">
      <Label for="client-name">
        {{ t('bookingModal.fullName') }} <span class="text-destructive">*</span>
      </Label>
      <Input
        id="client-name"
        v-model="clientAlias"
        :placeholder="t('bookingModal.fullNamePlaceholder')"
      />
    </div>

    <div class="space-y-2">
      <Label for="client-email">
        {{ t('bookingModal.email') }} <span class="text-destructive">*</span>
      </Label>
      <Input
        id="client-email"
        type="email"
        v-model="clientEmail"
        :placeholder="t('bookingModal.emailPlaceholder')"
      />
    </div>

    <div class="space-y-2">
      <Label for="client-phone">
        {{ t('bookingModal.phone') }} <span class="text-destructive">*</span>
      </Label>
      <Input
        id="client-phone"
        type="tel"
        v-model="clientPhone"
        :placeholder="t('bookingModal.phonePlaceholder')"
      />
    </div>

    <div class="space-y-2">
      <Label for="booking-notes">{{ t('bookingModal.notes') }}</Label>
      <textarea
        id="booking-notes"
        v-model="notes"
        :placeholder="t('bookingModal.notesPlaceholder')"
        class="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      />
    </div>
  </div>
</template>
