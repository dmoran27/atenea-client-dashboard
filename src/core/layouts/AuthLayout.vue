<script setup lang="ts">
import { RouterView } from 'vue-router'
import LanguageSelector from '@/core/components/LanguageSelector.vue'
import ThemeToggle from '@/core/components/ThemeToggle.vue'
import { Card } from '@/core/components/ui/card'
import AppFooter from '@/core/components/AppFooter.vue'
import SiteName from '@/core/components/SiteName.vue'
</script>

<template>
  <main
    class="relative flex min-h-screen items-center justify-center overflow-hidden bg-muted/40 p-4"
  >
    <div
      class="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-3xl"
    ></div>

    <div class="absolute right-4 top-4 z-10 flex items-center gap-2">
      <!-- Selector de Idioma -->
      <LanguageSelector variant="dropdown" />
      <!-- Selector de Tema -->
      <ThemeToggle />
    </div>

    <div class="relative z-10 w-full max-w-md animate-scale-in">
      <div class="mb-6 flex items-center justify-center gap-2">
        <SiteName />
      </div>

      <Card class="w-full max-w-md border-border/60">
        <RouterView />
      </Card>
      <AppFooter />
    </div>
  </main>
</template>
