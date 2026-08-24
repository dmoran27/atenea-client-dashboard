<script setup lang="ts">
import { Sun, Moon } from '@lucide/vue'
import { Button } from '@/core/components/ui/button'
import { useTheme } from '@/core/composables/useTheme'

const { theme, toggleTheme } = useTheme()
</script>

<template>
  <Button variant="ghost" size="icon" @click="toggleTheme()">
    <Sun v-if="theme === 'dark'" class="h-4 w-4" />
    <Moon v-else class="h-4 w-4" />
  </Button>
</template>
