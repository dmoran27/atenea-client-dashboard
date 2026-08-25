<script setup lang="ts">
import { RouterView } from 'vue-router'
import AdminSidebar from '@/core/components/admin/AdminSidebar.vue'
import AdminHeader from '@/core/components/admin/AdminHeader.vue'
</script>

<template>
  <div class="min-h-screen bg-background">
    <!-- El sidebar vive solo aquí -->
    <AdminSidebar />

    <div class="flex min-h-screen flex-col pl-[260px]">
      <!-- El header vive solo aquí -->
      <AdminHeader />

      <!-- Aquí se renderiza la vista activa según la ruta -->
      <main class="flex-1 p-6">
        <RouterView />
      </main>
    </div>
  </div>
</template>
