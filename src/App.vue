<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

import { onMounted } from 'vue'
import { useTenantStore } from '@/core/stores/useTenantStore'

const tenantStore = useTenantStore()

onMounted(() => {
  tenantStore.fetchTenantConfig()
})

const AuthLayout = defineAsyncComponent(() => import('@/core/layouts/AuthLayout.vue'))
const AdminLayout = defineAsyncComponent(() => import('@/core/layouts/AdminLayout.vue'))

const currentLayout = computed(() => {
  return route.meta.layout === 'AuthLayout' ? AuthLayout : AdminLayout
})
</script>

<template>
  <component :is="currentLayout">
    <RouterView />
  </component>
</template>
