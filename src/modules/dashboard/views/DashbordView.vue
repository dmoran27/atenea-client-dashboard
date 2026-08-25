<script setup lang="ts">
import { t } from '@/core/plugins/i18n'
import { useAuthStore } from '@/core/stores/useAuthStore'

const authStore = useAuthStore()
</script>

<template>
  <div class="space-y-6">
    <!-- Bienvenida -->
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold tracking-tight">
          {{ t('dashboard.welcome') }},
          {{ authStore?.user?.name || authStore?.user?.email || 'Cliente' }}
        </h2>
        <p class="text-muted-foreground">{{ t('dashboard.welcomeDesc') }}</p>
      </div>
    </div>
  </div>
</template>
