<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { ShieldCheck, Laptop, Smartphone, LogOut, Loader2 } from '@lucide/vue'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/core/components/ui/card'
import { Button } from '@/core/components/ui/button'
import { Input } from '@/core/components/ui/input'
import { Label } from '@/core/components/ui/label'
import { Badge } from '@/core/components/ui/badge'
import { useProfile } from '../composables/useProfile'

const { t } = useI18n()
const {
  profile,
  sessions,
  isLoadingSessions,
  changePassword,
  isChangingPassword,
  toggleTwoFactor,
  isTogglingTwoFactor,
  revokeOtherSessions,
  isRevokingSessions,
} = useProfile()

const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
})

async function handlePasswordChange() {
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    return
  }

  await changePassword({
    currentPassword: passwordForm.value.currentPassword,
    newPassword: passwordForm.value.newPassword,
    confirmPassword: passwordForm.value.confirmPassword,
  })
  passwordForm.value = { currentPassword: '', newPassword: '', confirmPassword: '' }
}

async function handleToggle2FA() {
  if (!profile.value) return
  await toggleTwoFactor({ enabled: !profile.value.twoFactorEnabled })
}
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>{{ t('profile.security.title') }}</CardTitle>
      <CardDescription>{{ t('profile.security.description') }}</CardDescription>
    </CardHeader>
    <CardContent class="space-y-6">
      <!-- Cambiar Contraseña -->
      <div class="grid gap-4">
        <div class="space-y-2">
          <Label for="current-password">{{ t('profile.security.currentPassword') }}</Label>
          <Input
            id="current-password"
            type="password"
            placeholder="••••••••"
            v-model="passwordForm.currentPassword"
          />
        </div>
        <div class="grid gap-4 sm:grid-cols-2">
          <div class="space-y-2">
            <Label for="new-password">{{ t('profile.security.newPassword') }}</Label>
            <Input
              id="new-password"
              type="password"
              placeholder="••••••••"
              v-model="passwordForm.newPassword"
            />
          </div>
          <div class="space-y-2">
            <Label for="confirm-password">{{ t('profile.security.confirmPassword') }}</Label>
            <Input
              id="confirm-password"
              type="password"
              placeholder="••••••••"
              v-model="passwordForm.confirmPassword"
            />
          </div>
        </div>
        <Button
          variant="outline"
          class="w-fit"
          :disabled="isChangingPassword"
          @click="handlePasswordChange"
        >
          <Loader2 v-if="isChangingPassword" class="mr-2 h-4 w-4 animate-spin" />
          {{ t('profile.security.updatePassword') }}
        </Button>
      </div>

      <!-- Conmutador 2FA -->
      <div class="flex items-center justify-between rounded-lg border p-4">
        <div class="flex items-center gap-3">
          <div
            class="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary"
          >
            <ShieldCheck class="h-5 w-5" />
          </div>
          <div>
            <p class="text-sm font-medium">{{ t('profile.security.twoFactor') }}</p>
            <p class="text-xs text-muted-foreground">
              {{ t('profile.security.twoFactorDesc') }}
            </p>
          </div>
        </div>
        <button
          role="switch"
          :disabled="isTogglingTwoFactor"
          :aria-checked="profile?.twoFactorEnabled"
          @click="handleToggle2FA"
          :class="[
            'relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors',
            profile?.twoFactorEnabled ? 'bg-primary' : 'bg-muted',
          ]"
        >
          <span
            :class="[
              'inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform',
              profile?.twoFactorEnabled ? 'translate-x-5' : 'translate-x-1',
            ]"
          />
        </button>
      </div>

      <!-- Sesiones Activas -->
      <div class="space-y-4 border-t pt-6">
        <div>
          <h3 class="text-sm font-semibold">
            {{ t('profile.security.sessionsTitle') }}
          </h3>
          <p class="text-xs text-muted-foreground">
            {{ t('profile.security.sessionsDescription') }}
          </p>
        </div>

        <div v-if="isLoadingSessions" class="flex justify-center p-4">
          <Loader2 class="h-6 w-6 animate-spin text-primary" />
        </div>

        <template v-else>
          <div
            v-for="session in sessions"
            :key="session.id"
            class="flex items-center gap-3 rounded-lg border p-3"
          >
            <component
              :is="session.device === 'Laptop' ? Laptop : Smartphone"
              class="h-5 w-5 text-muted-foreground"
            />
            <div class="min-w-0 flex-1">
              <p class="text-sm font-medium">{{ session.device }} · {{ session.browser }}</p>
              <p class="truncate text-xs text-muted-foreground">
                {{ session.location }} · {{ session.ip }}
              </p>
            </div>
            <Badge :variant="session.current ? 'default' : 'outline'">
              {{
                session.current
                  ? t('profile.security.currentSession')
                  : t('profile.security.lastActivity')
              }}
            </Badge>
          </div>

          <Button
            variant="outline"
            class="gap-2 text-destructive hover:text-destructive"
            :disabled="isRevokingSessions"
            @click="revokeOtherSessions()"
          >
            <Loader2 v-if="isRevokingSessions" class="h-4 w-4 animate-spin" />
            <LogOut v-else class="h-4 w-4" />
            {{ t('profile.security.logoutOthers') }}
          </Button>
        </template>
      </div>
    </CardContent>
  </Card>
</template>
