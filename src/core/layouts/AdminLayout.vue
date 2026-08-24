<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <div class="min-h-screen bg-background">
    <!-- El sidebar vive solo aquí -->

    <div class="flex min-h-screen flex-col pl-[260px]">
      <!-- El header vive solo aquí -->

      <!-- Aquí se renderiza la vista activa según la ruta -->
      <main class="flex-1 p-6">
        <RouterView />
      </main>
    </div>
  </div>
</template>
