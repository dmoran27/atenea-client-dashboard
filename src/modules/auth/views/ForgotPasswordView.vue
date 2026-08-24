<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { RouterLink } from 'vue-router'
import { ArrowLeft, CheckCircle2 } from '@lucide/vue'
import { Button } from '@/core/components/ui/button'
import { Input } from '@/core/components/ui/input'
import { Label } from '@/core/components/ui/label'
import { useForgotPasswordForm } from '../composables/useForgotPasswordForm'

const { t } = useI18n()
const { email, isLoading, isSent, handleSubmit, resetState } = useForgotPasswordForm()
</script>

<template>
  <div class="p-6">
    <!-- Estado 1: Formulario de envío -->
    <div v-if="!isSent" class="space-y-6">
      <div class="space-y-2 text-center sm:text-left">
        <h3 class="text-xl font-semibold tracking-tight">
          {{ t('auth.forgotPassword.title') }}
        </h3>
        <p class="text-xs text-muted-foreground leading-relaxed">
          {{ t('auth.forgotPassword.description') }}
        </p>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div class="space-y-2">
          <Label for="forgot-email">{{ t('auth.forgotPassword.email') }}</Label>
          <Input
            id="forgot-email"
            type="email"
            v-model="email"
            :placeholder="t('auth.forgotPassword.emailPlaceholder')"
            required
          />
        </div>

        <Button type="submit" class="w-full" size="lg" :disabled="isLoading">
          {{ t('auth.forgotPassword.submit') }}
        </Button>
      </form>

      <div class="text-center pt-2">
        <RouterLink
          to="/login"
          class="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft class="h-3.5 w-3.5" />
          {{ t('auth.forgotPassword.backToLogin') }}
        </RouterLink>
      </div>
    </div>

    <!-- Estado 2: Confirmación de envío exitoso -->
    <div v-else class="space-y-6 text-center py-2">
      <div
        class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500"
      >
        <CheckCircle2 class="h-6 w-6" />
      </div>

      <div class="space-y-2">
        <h3 class="text-xl font-semibold tracking-tight">
          {{ t('auth.forgotPassword.successTitle') }}
        </h3>
        <p class="text-xs text-muted-foreground leading-relaxed">
          {{ t('auth.forgotPassword.successDescription') }}
          <span class="font-medium text-foreground">{{ email }}</span>
        </p>
      </div>

      <div class="space-y-3 pt-2">
        <RouterLink to="/login" class="block w-full">
          <Button class="w-full" size="lg">
            {{ t('auth.forgotPassword.backToLogin') }}
          </Button>
        </RouterLink>

        <button
          type="button"
          @click="resetState"
          class="text-xs text-muted-foreground hover:text-foreground underline transition-colors"
        >
          {{ t('auth.forgotPassword.resend') }}
        </button>
      </div>
    </div>
  </div>
</template>
