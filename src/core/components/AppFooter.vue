<script setup lang="ts">
import { APP_CONFIG } from '@/core/config/app.config'
</script>

<template>
  <footer class="py-4 text-center text-xs text-muted-foreground">
    Powered by {{ APP_CONFIG.name }} v{{ APP_CONFIG.version }} &copy; {{ APP_CONFIG.copyrightYear }}
  </footer>
</template>
