<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { Mail } from '@lucide/vue'
import { Button } from '@/core/components/ui/button'
import { Input } from '@/core/components/ui/input'
import { Label } from '@/core/components/ui/label'
import { Checkbox } from '@/core/components/ui/checkbox'
import { useLoginForm } from '../composables/useLoginForm'

const { t } = useI18n()

const { email, password, remember, isLoading, onSubmit, errors } = useLoginForm()
</script>

<template>
  <form @submit.prevent="onSubmit" class="space-y-4">
    <div class="space-y-2">
      <Label for="login-email">{{ t('auth.login.email') }}</Label>
      <Input id="login-email" type="email" v-model="email" placeholder="email@example.com" />
      <!-- Mensaje de error de Zod para el email -->
      <span v-if="errors.email" class="text-xs text-destructive">
        {{ errors.email }}
      </span>
    </div>

    <div class="space-y-2">
      <div class="flex items-center justify-between">
        <Label for="login-password">{{ t('auth.login.password') }}</Label>
        <RouterLink
          to="/forgot-password"
          class="text-xs font-medium text-muted-foreground hover:text-primary transition-colors"
        >
          {{ t('auth.login.forgotPassword') }}
        </RouterLink>
      </div>
      <Input
        id="login-password"
        type="password"
        v-model="password"
        :placeholder="t('auth.login.passwordPlaceholder')"
      />
      <!-- Mensaje de error de Zod para la contraseña -->
      <span v-if="errors.password" class="text-xs text-destructive">
        {{ errors.password }}
      </span>
    </div>

    <div class="flex items-center gap-2">
      <Checkbox id="login-remember" v-model:checked="remember" />
      <Label for="login-remember" class="text-sm font-normal cursor-pointer">
        {{ t('auth.login.remember') }}
      </Label>
    </div>

    <div class="flex-col gap-4 space-y-4">
      <Button type="submit" class="w-full" :disabled="isLoading">
        {{ t('auth.login.submit') }}
      </Button>

      <div class="flex w-full items-center gap-3">
        <div class="h-px flex-1 bg-border"></div>
        <span class="text-xs text-muted-foreground">{{ t('auth.login.orContinueWith') }}</span>
        <div class="h-px flex-1 bg-border"></div>
      </div>

      <div class="flex w-full flex-col gap-2">
        <Button variant="outline" type="button" class="w-full gap-2">
          <svg class="h-4 w-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"
            />
          </svg>
          {{ t('auth.login.google') }}
        </Button>
        <Button variant="outline" type="button" class="w-full gap-2">
          <Mail class="h-4 w-4" />
          {{ t('auth.login.magicLink') }}
        </Button>
      </div>
    </div>
  </form>
</template>
