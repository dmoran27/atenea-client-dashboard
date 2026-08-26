<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { Globe, Sun, Moon, Bell, Inbox } from '@lucide/vue'
import { Button } from '@/core/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/core/components/ui/dropdown-menu'
import { ScrollArea } from '@/core/components/ui/scroll-area'
import { usePreferencesStore } from '@/core/stores/usePreferencesStore'
import { useNotificationStore } from '@/core/stores/useNotificationStore'

const { t } = useI18n()
const route = useRoute()

const preferencesStore = usePreferencesStore()
const { theme, currentLocale } = storeToRefs(preferencesStore)

const notificationStore = useNotificationStore()
const { notifications, unreadCount, isLoading } = storeToRefs(notificationStore)

const pageTitle = computed(() => {
  const key = route.meta.titleKey as string | undefined
  return key ? t(key) : ''
})

onMounted(() => {
  notificationStore.fetchNotifications()
})
</script>

<template>
  <header
    class="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/95 px-6 backdrop-blur supports-[backdrop-filter]:bg-background/60"
  >
    <!-- Título de la página activa -->
    <div class="flex items-center gap-3">
      <h1 v-if="pageTitle" class="text-lg font-semibold tracking-tight">{{ pageTitle }}</h1>
    </div>

    <!-- Acciones globales -->
    <div class="flex items-center gap-2">
      <!-- Notificaciones -->
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <Button variant="ghost" size="icon" class="relative" :title="t('notifications.title')">
            <Bell class="h-4 w-4" />
            <span class="sr-only">{{ t('notifications.title') }}</span>
            <span
              v-if="unreadCount"
              class="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] text-destructive-foreground animate-in fade-in"
            >
              {{ unreadCount > 99 ? '99+' : unreadCount }}
            </span>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" class="w-[360px] p-0">
          <div class="flex items-center justify-between border-b px-4 py-3">
            <span class="font-semibold text-sm">{{ t('notifications.title') }}</span>
            <button
              class="text-xs text-primary transition-opacity hover:underline disabled:opacity-40 disabled:no-underline"
              :disabled="!unreadCount || isLoading"
              @click="notificationStore.markAllAsRead"
            >
              {{ t('notifications.markAll') }}
            </button>
          </div>

          <ScrollArea class="h-[320px]">
            <!-- Estado sin notificaciones -->
            <div
              v-if="!isLoading && notifications.length === 0"
              class="flex h-[280px] flex-col items-center justify-center p-4 text-center text-muted-foreground"
            >
              <Inbox class="h-8 w-8 mb-2 stroke-[1.5]" />
              <p class="text-sm font-medium">{{ t('notifications.emptyTitle') }}</p>
              <p class="text-xs">{{ t('notifications.emptyDescription') }}</p>
            </div>

            <!-- Lista de notificaciones -->
            <div
              v-for="item in notifications"
              :key="item.id"
              class="relative flex gap-3 border-b px-4 py-3 text-sm transition-colors"
              :class="!item.read ? 'bg-primary/5' : ''"
            >
              <!-- Indicator Dot para no leídas -->
              <span
                v-if="!item.read"
                class="absolute left-2 top-4 h-1.5 w-1.5 rounded-full bg-primary"
              />

              <div class="min-w-0 flex-1 pl-1">
                <p :class="!item.read ? 'font-semibold' : 'font-medium'">{{ item.title }}</p>
                <p class="mt-0.5 text-xs text-muted-foreground leading-relaxed">
                  {{ item.description }}
                </p>
                <!--
                  <p class="mt-1 text-[11px] text-muted-foreground/80">
                    {{ t('notifications.ago') }} {{ relativeTime(item.minutesAgo) }}
                  </p>
                -->
              </div>
            </div>
          </ScrollArea>
        </DropdownMenuContent>
      </DropdownMenu>

      <!-- Selector de Idioma -->
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <Button variant="ghost" size="icon" :title="t('header.language')">
            <Globe class="h-4 w-4" />
            <span class="sr-only">{{ t('header.language') }}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            :class="currentLocale === 'es' ? 'font-semibold text-primary' : ''"
            @click="preferencesStore.setLanguage('es')"
          >
            🇪🇸 Español
          </DropdownMenuItem>
          <DropdownMenuItem
            :class="currentLocale === 'en' ? 'font-semibold text-primary' : ''"
            @click="preferencesStore.setLanguage('en')"
          >
            🇬🇧 English
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <!-- Selector de Tema -->
      <Button
        variant="ghost"
        size="icon"
        :title="theme === 'dark' ? t('header.light') : t('header.dark')"
        @click="preferencesStore.toggleTheme"
      >
        <Sun v-if="theme === 'dark'" class="h-4 w-4" />
        <Moon v-else class="h-4 w-4" />
        <span class="sr-only">{{ t('header.theme') }}</span>
      </Button>
    </div>
  </header>
</template>
