<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { Sun, Moon } from '@lucide/vue'
import { Button } from '@/core/components/ui/button'
import { usePreferencesStore } from '../stores/usePreferencesStore'
import { t } from '../plugins/i18n'

const preferencesStore = usePreferencesStore()
const { theme } = storeToRefs(preferencesStore)
const { toggleTheme } = preferencesStore
</script>

<template>
  <Button
    variant="ghost"
    size="icon"
    :title="theme === 'dark' ? t('header.light') : t('header.dark')"
    @click="toggleTheme"
  >
    <Sun v-if="theme === 'dark'" class="h-4 w-4" />
    <Moon v-else class="h-4 w-4" />
    <span class="sr-only">{{ t('header.theme') }}</span>
  </Button>
</template>
