<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { Button } from '@/core/components/ui/button'
import { Input } from '@/core/components/ui/input'
import { Label } from '@/core/components/ui/label'
import { Checkbox } from '@/core/components/ui/checkbox'
import { useSignupForm } from '../composables/useSignupForm'

const { t } = useI18n()
const { name, email, phone, password, confirmPassword, terms, isLoading, onSubmit, errors } =
  useSignupForm()
</script>

<template>
  <form @submit.prevent="onSubmit" class="space-y-4">
    <div class="space-y-2">
      <Label for="signup-name">{{ t('auth.signup.fullName') }}</Label>
      <Input id="signup-name" v-model="name" :placeholder="t('auth.signup.fullNamePlaceholder')" />
      <span v-if="errors.name" class="text-xs text-destructive">
        {{ errors.name }}
      </span>
    </div>

    <div class="space-y-2">
      <Label for="signup-email">{{ t('auth.signup.email') }}</Label>
      <Input id="signup-email" type="email" v-model="email" placeholder="email@example.com" />
      <span v-if="errors.email" class="text-xs text-destructive">
        {{ errors.email }}
      </span>
    </div>

    <div class="space-y-2">
      <Label for="signup-phone">{{ t('auth.signup.phone') }}</Label>
      <Input
        id="signup-phone"
        type="tel"
        v-model="phone"
        :placeholder="t('auth.signup.phonePlaceholder')"
      />
      <span v-if="errors.phone" class="text-xs text-destructive">
        {{ errors.phone }}
      </span>
    </div>

    <div class="space-y-2">
      <Label for="signup-password">{{ t('auth.signup.password') }}</Label>
      <Input
        id="signup-password"
        type="password"
        v-model="password"
        :placeholder="t('auth.signup.passwordPlaceholder')"
      />
      <span v-if="errors.password" class="text-xs text-destructive">
        {{ errors.password }}
      </span>
    </div>

    <div class="space-y-2">
      <Label for="signup-confirm">{{ t('auth.signup.confirmPassword') }}</Label>
      <Input
        id="signup-confirm"
        type="password"
        v-model="confirmPassword"
        :placeholder="t('auth.signup.confirmPlaceholder')"
      />
      <span v-if="errors.confirmPassword" class="text-xs text-destructive">
        {{ errors.confirmPassword }}
      </span>
    </div>

    <div class="space-y-1">
      <div class="flex items-center gap-3 pt-2 pb-2">
        <Checkbox id="signup-terms" v-model:checked="terms" />
        <Label
          for="signup-terms"
          class="text-xs text-muted-foreground leading-normal cursor-pointer select-none"
        >
          {{ t('auth.signup.terms') }}
        </Label>
      </div>
      <span v-if="errors.terms" class="text-xs text-destructive block">
        {{ errors.terms }}
      </span>
    </div>

    <Button type="submit" class="w-full" size="lg" :disabled="isLoading">
      {{ t('auth.signup.submit') }}
    </Button>
  </form>
</template>
