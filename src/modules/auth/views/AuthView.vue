<script setup lang="ts">
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/core/components/ui/tabs'
import LoginForm from '../components/LoginForm.vue'
import SignupForm from '../components/SignupForm.vue'
import type { AuthTab } from '../types/auth.types.ts'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()

const getTabFromRoute = (): AuthTab => {
  return route.path.includes('register') ? 'signup' : 'login'
}

const activeTab = ref<AuthTab>(getTabFromRoute())

watch(
  () => route.path,
  () => {
    const expectedTab = getTabFromRoute()
    if (activeTab.value !== expectedTab) {
      activeTab.value = expectedTab
    }
  },
)

const handleTabChange = (value: string | number) => {
  const targetPath = value === 'signup' ? '/register' : '/login'
  if (route.path !== targetPath) {
    router.replace(targetPath)
  }
}
</script>

<template>
  <Tabs class="w-full" :model-value="activeTab" @update:model-value="handleTabChange">
    <div class="px-6 pb-2">
      <TabsList class="grid w-full grid-cols-2">
        <TabsTrigger value="login" class="text-sm font-medium">
          {{ t('auth.tabs.login') }}
        </TabsTrigger>
        <TabsTrigger value="signup" class="text-sm font-medium">
          {{ t('auth.tabs.signup') }}
        </TabsTrigger>
      </TabsList>
    </div>

    <!-- Tab Login -->
    <TabsContent value="login" class="p-6 pt-4 space-y-5 focus-visible:outline-none">
      <div class="space-y-1">
        <h3 class="text-xl font-semibold tracking-tight">{{ t('auth.login.welcome') }}</h3>
        <p class="text-xs text-muted-foreground">{{ t('auth.login.welcomeDesc') }}</p>
      </div>
      <LoginForm />
    </TabsContent>

    <!-- Tab Registro -->
    <TabsContent value="signup" class="p-6 pt-4 space-y-5 focus-visible:outline-none">
      <div class="space-y-1">
        <h3 class="text-xl font-semibold tracking-tight">{{ t('auth.signup.title') }}</h3>
        <p class="text-xs text-muted-foreground">{{ t('auth.signup.titleDesc') }}</p>
      </div>
      <SignupForm />
    </TabsContent>
  </Tabs>
</template>
