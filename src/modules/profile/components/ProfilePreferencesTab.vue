<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/core/components/ui/card'
import { Button } from '@/core/components/ui/button'
import { Label } from '@/core/components/ui/label'
import { useProfile } from '../composables/useProfile'
import { usePreferencesStore } from '@/core/stores/usePreferencesStore'
import type { AppLocale } from '@/core/plugins/i18n'
import type { ThemeMode } from '@/core/types/global'
import LanguageSelector from '@/core/components/LanguageSelector.vue'

const { t } = useI18n()
const { profile, updatePreferences } = useProfile()

const preferencesStore = usePreferencesStore()
const { theme } = storeToRefs(preferencesStore)

function changeLanguage(locale: AppLocale) {
  preferencesStore.setLanguage(locale)
  updatePreferences({ preferredLocale: locale })
}

function changeTheme(mode: ThemeMode) {
  preferencesStore.setTheme(mode)
  updatePreferences({ preferredTheme: mode })
}

function handleToggleNotification(type: 'email' | 'sms') {
  if (!profile.value) return
  updatePreferences({
    emailNotifications:
      type === 'email' ? !profile.value.emailNotifications : profile.value.emailNotifications,
    smsNotifications:
      type === 'sms' ? !profile.value.smsNotifications : profile.value.smsNotifications,
  })
}
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>{{ t('profile.preferences.title') }}</CardTitle>
      <CardDescription>{{ t('profile.preferences.description') }}</CardDescription>
    </CardHeader>

    <CardContent class="space-y-6">
      <!-- Selección de Idioma -->
      <LanguageSelector variant="select" :change-language="(lang) => changeLanguage(lang)" />

      <!-- Selección de Tema -->
      <div class="space-y-2">
        <Label>{{ t('profile.preferences.theme') }}</Label>
        <div class="flex gap-2">
          <Button
            :variant="theme === 'light' ? 'default' : 'outline'"
            size="sm"
            @click="changeTheme('light')"
          >
            {{ t('header.light') }}
          </Button>
          <Button
            :variant="theme === 'dark' ? 'default' : 'outline'"
            size="sm"
            @click="changeTheme('dark')"
          >
            {{ t('header.dark') }}
          </Button>
        </div>
      </div>

      <!-- Notificaciones -->
      <div class="space-y-4">
        <Label>{{ t('profile.preferences.notifications') }}</Label>

        <div class="flex items-center justify-between rounded-lg border p-4">
          <div>
            <p class="text-sm font-medium">{{ t('profile.preferences.emailNotif') }}</p>
            <p class="text-xs text-muted-foreground">
              {{ t('profile.preferences.emailNotifDesc') }}
            </p>
          </div>
          <button
            role="switch"
            :aria-checked="profile?.emailNotifications"
            @click="handleToggleNotification('email')"
            :class="[
              'relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors',
              profile?.emailNotifications ? 'bg-primary' : 'bg-muted',
            ]"
          >
            <span
              :class="[
                'inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform',
                profile?.emailNotifications ? 'translate-x-5' : 'translate-x-1',
              ]"
            />
          </button>
        </div>

        <div class="flex items-center justify-between rounded-lg border p-4">
          <div>
            <p class="text-sm font-medium">{{ t('profile.preferences.smsNotif') }}</p>
            <p class="text-xs text-muted-foreground">
              {{ t('profile.preferences.smsNotifDesc') }}
            </p>
          </div>
          <button
            role="switch"
            :aria-checked="profile?.smsNotifications"
            @click="handleToggleNotification('sms')"
            :class="[
              'relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors',
              profile?.smsNotifications ? 'bg-primary' : 'bg-muted',
            ]"
          >
            <span
              :class="[
                'inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform',
                profile?.smsNotifications ? 'translate-x-5' : 'translate-x-1',
              ]"
            />
          </button>
        </div>
      </div>
    </CardContent>
  </Card>
</template>
