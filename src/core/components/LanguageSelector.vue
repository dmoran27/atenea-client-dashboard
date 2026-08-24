<script setup lang="ts">
import { ref } from 'vue'
import { Globe } from '@lucide/vue'
import { Button } from '@/core/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/core/components/ui/dropdown-menu'
import { setLocale, getLocale, type AppLocale } from '@/core/plugins/i18n'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const currentLocale = ref<AppLocale>(getLocale())

function changeLocale(locale: AppLocale) {
  currentLocale.value = locale
  setLocale(locale)
}
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="ghost" size="icon">
        <Globe class="h-4 w-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuItem
        :class="{ 'font-bold': currentLocale === 'es' }"
        @click="changeLocale('es')"
      >
        🇪🇸 {{ t('languages.es') }}
      </DropdownMenuItem>
      <DropdownMenuItem
        :class="{ 'font-bold': currentLocale === 'en' }"
        @click="changeLocale('en')"
      >
        🇬🇧 {{ t('languages.en') }}
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
