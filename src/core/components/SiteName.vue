<script setup lang="ts">
import { useTenantStore } from '@/core/stores/useTenantStore'

const tenantStore = useTenantStore()
</script>

<template>
  <div class="flex items-center gap-2">
    <span class="text-lg font-semibold tracking-tight text-foreground">
      {{ tenantStore.siteName }}
    </span>
  </div>
</template>
