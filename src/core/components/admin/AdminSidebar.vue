<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { Sparkles, LogOut } from '@lucide/vue'
import { Avatar, AvatarFallback } from '@/core/components/ui/avatar'
import { Button } from '@/core/components/ui/button'
import { Badge } from '@/core/components/ui/badge'
import { useTenantStore } from '@/core/stores/useTenantStore'
import { useAuthStore } from '@/core/stores/useAuthStore'
import { getInitials } from '@/core/lib/utils'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const { user, logout } = useAuthStore()
const tenantStore = useTenantStore()

const navItems = computed(() => {
  return router
    .getRoutes()
    .filter((r) => r.meta?.showInNav && tenantStore.hasModule(r.meta.moduleKey as string))
    .map((r) => ({
      routeName: r.name as string,
      titleKey: r.meta.titleKey as string,
      icon: r.meta.icon,
      order: (r.meta.order as number) || 99,
      soon: Boolean(r.meta.soon),
    }))
    .sort((a, b) => a.order - b.order)
})
</script>

<template>
  <aside class="fixed inset-y-0 left-0 z-40 flex w-[260px] flex-col border-r bg-card">
    <!-- Logo -->
    <div class="flex h-16 items-center gap-2 border-b px-6">
      <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
        <Sparkles class="h-5 w-5 text-primary-foreground" />
      </div>
      <span class="text-xl font-bold tracking-tight">Atenea</span>
    </div>

    <!-- Navigation Dinámica -->
    <nav class="flex-1 space-y-1 overflow-y-auto p-4">
      <RouterLink
        v-for="item in navItems"
        :key="item.routeName"
        v-slot="{ navigate }"
        :to="item.soon ? { name: 'dashboard' } : { name: item.routeName }"
        custom
      >
        <button
          :disabled="item.soon"
          @click="!item.soon && navigate()"
          :class="[
            'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
            !item.soon && route.name === item.routeName
              ? 'bg-primary text-primary-foreground'
              : item.soon
                ? 'cursor-not-allowed text-muted-foreground'
                : 'text-foreground hover:bg-accent',
          ]"
        >
          <component :is="item.icon" class="h-4 w-4 shrink-0" />
          <span class="flex-1 text-left">{{ t(item.titleKey) }}</span>
          <Badge v-if="item.soon" variant="outline" class="text-xs">
            {{ t('nav.soon') }}
          </Badge>
        </button>
      </RouterLink>
    </nav>

    <!-- Footer: User + Logout -->
    <div class="border-t p-4">
      <div class="flex items-center gap-3 rounded-lg px-2 py-2">
        <Avatar>
          <AvatarFallback class="bg-primary/10 text-primary">
            {{ getInitials(user?.name) }}
          </AvatarFallback>
        </Avatar>
        <div class="flex-1 overflow-hidden">
          <p class="truncate text-sm font-medium">{{ user?.name }}</p>
          <p class="truncate text-xs text-muted-foreground">{{ user?.email }}</p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          class="h-8 w-8 text-muted-foreground hover:text-destructive"
          :title="t('nav.logout')"
          @click="logout"
        >
          <LogOut class="h-4 w-4" />
        </Button>
      </div>
    </div>
  </aside>
</template>
