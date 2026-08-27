<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Globe, Check } from '@lucide/vue'
import { Label } from '@/core/components/ui/label'
import { Button } from '@/core/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/core/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/core/components/ui/dropdown-menu'
import { usePreferencesStore } from '../stores/usePreferencesStore'
import type { AppLocale } from '../plugins/i18n'

const { setLanguage } = usePreferencesStore()

interface Props {
  variant?: 'select' | 'dropdown'
  showLabel?: boolean
  triggerClass?: string
  /** Callback opcional. Si no se pasa, se usa la lógica de cambio interna */
  changeLanguage?: (lang: AppLocale) => void
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'select',
  showLabel: true,
  triggerClass: 'w-full sm:w-[200px]',
  changeLanguage: undefined,
})

const { locale, t } = useI18n()

const languages = computed(() => [
  { code: 'es' as AppLocale, label: t('languages.es', 'Español') },
  { code: 'en' as AppLocale, label: t('languages.en', 'English') },
])

const currentLocale = computed(() => locale.value as AppLocale)

const handleChangeLanguage = (newLocale: AppLocale) => {
  if (props.changeLanguage) {
    props.changeLanguage(newLocale)
  } else {
    setLanguage(newLocale)
  }
}
</script>

<template>
  <!-- Variante 1: Select para formularios / preferencias -->
  <div v-if="variant === 'select'" class="space-y-2">
    <Label v-if="showLabel">{{ t('profile.preferences.language', 'Idioma') }}</Label>
    <Select
      :model-value="currentLocale"
      @update:model-value="(v) => v && handleChangeLanguage(v as AppLocale)"
    >
      <SelectTrigger :class="triggerClass">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem v-for="lang in languages" :key="lang.code" :value="lang.code">
          <span class="flex items-center gap-2">
            <span>{{ lang.label }}</span>
          </span>
        </SelectItem>
      </SelectContent>
    </Select>
  </div>

  <!-- Variante 2: DropdownMenu para Header / Navbar -->
  <DropdownMenu v-else-if="variant === 'dropdown'">
    <DropdownMenuTrigger as-child>
      <Button
        variant="ghost"
        size="icon"
        class="relative"
        :title="t('header.language', 'Cambiar idioma')"
      >
        <Globe class="h-4 w-4" />
        <span class="sr-only">{{ t('header.language', 'Cambiar idioma') }}</span>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" class="w-[150px] z-50">
      <DropdownMenuItem
        v-for="lang in languages"
        :key="lang.code"
        class="flex items-center justify-between cursor-pointer"
        :class="currentLocale === lang.code ? 'font-semibold text-primary bg-accent/50' : ''"
        @select="handleChangeLanguage(lang.code)"
      >
        <span>{{ lang.label }}</span>
        <Check v-if="currentLocale === lang.code" class="h-4 w-4 text-primary" />
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
