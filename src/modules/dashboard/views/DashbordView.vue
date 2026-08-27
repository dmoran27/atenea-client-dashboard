<script setup lang="ts">
import { t } from '@/core/plugins/i18n'
import { useAuthStore } from '@/core/stores/useAuthStore'
import { widgetRegistry } from '@/core/registry/widgetRegistry'
import { getWidgetClasses } from '@/core/utils/widgetLayout'

const widgets = widgetRegistry.widgets
const authStore = useAuthStore()
</script>

<template>
  <div class="space-y-6">
    <!-- Encabezado -->
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold tracking-tight">
          {{ t('dashboard.welcome') }},
          {{ authStore?.user?.name || authStore?.user?.email || 'Cliente' }}
        </h2>
        <p class="text-muted-foreground">{{ t('dashboard.welcomeDesc') }}</p>
      </div>
    </div>

    <!-- Grid Flex-Fluid de 12 Columnas -->
    <div class="grid grid-cols-12 gap-6">
      <div v-for="widget in widgets" :key="widget.id" :class="getWidgetClasses(widget)">
        <component :is="widget.component" />
      </div>
    </div>
  </div>
</template>
