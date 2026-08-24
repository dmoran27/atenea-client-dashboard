<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { Button } from '@/core/components/ui/button'
import { Input } from '@/core/components/ui/input'
import { Label } from '@/core/components/ui/label'
import { Checkbox } from '@/core/components/ui/checkbox'
import { useSignupForm } from '../composables/useSignupForm'

const { t } = useI18n()
const { name, email, password, confirmPassword, terms, isLoading, handleSubmit } = useSignupForm()
</script>

<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <div class="space-y-2">
      <Label for="signup-name">{{ t('auth.signup.fullName') }}</Label>
      <Input
        id="signup-name"
        v-model="name"
        :placeholder="t('auth.signup.fullNamePlaceholder')"
        required
      />
    </div>

    <div class="space-y-2">
      <Label for="signup-email">{{ t('auth.signup.email') }}</Label>
      <Input
        id="signup-email"
        type="email"
        v-model="email"
        :placeholder="t('auth.signup.emailPlaceholder')"
        required
      />
    </div>

    <div class="space-y-2">
      <Label for="signup-password">{{ t('auth.signup.password') }}</Label>
      <Input
        id="signup-password"
        type="password"
        v-model="password"
        :placeholder="t('auth.signup.passwordPlaceholder')"
        required
      />
    </div>

    <div class="space-y-2">
      <Label for="signup-confirm">{{ t('auth.signup.confirmPassword') }}</Label>
      <Input
        id="signup-confirm"
        type="password"
        v-model="confirmPassword"
        :placeholder="t('auth.signup.confirmPlaceholder')"
        required
      />
    </div>

    <div class="flex items-center gap-3 pt-2 pb-2">
      <Checkbox id="signup-terms" v-model:checked="terms" />
      <Label
        for="signup-terms"
        class="text-xs text-muted-foreground leading-normal cursor-pointer select-none"
      >
        {{ t('auth.signup.terms') }}
      </Label>
    </div>

    <Button type="submit" class="w-full" size="lg" :disabled="isLoading">
      {{ t('auth.signup.submit') }}
    </Button>
  </form>
</template>
