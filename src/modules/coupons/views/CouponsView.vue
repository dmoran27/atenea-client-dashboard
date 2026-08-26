<script setup lang="ts">
import { reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { Sparkles, Loader2, CheckCircle, AlertCircle } from '@lucide/vue'
import { Card, CardHeader, CardTitle, CardContent } from '@/core/components/ui/card'
import { Input } from '@/core/components/ui/input'
import { Button } from '@/core/components/ui/button'
import { useCoupons } from '../composables/useCoupons'
import CouponCard from '../components/CouponCard.vue'

const { t } = useI18n()

const {
  coupons,
  isLoadingCoupons,
  isValidating,
  validationError,
  validationResult,
  validateAndApply,
} = useCoupons()

const form = reactive({
  code: '',
})

function handleApplyCode() {
  validateAndApply({ code: form.code })
}
</script>

<template>
  <div class="mx-autospace-y-8">
    <!-- Formulario para canjear código -->
    <Card class="border-dashed border-2">
      <CardHeader class="pb-4">
        <CardTitle class="text-base flex items-center gap-2">
          <Sparkles class="h-4 w-4 text-amber-500" />
          {{ t('coupons.inputPlaceholder') }}
        </CardTitle>
      </CardHeader>
      <CardContent class="space-y-3">
        <div class="flex flex-col sm:flex-row gap-3">
          <Input
            v-model="form.code"
            class="uppercase tracking-widest font-mono"
            placeholder="ATENEA20"
            :disabled="isValidating"
            @keyup.enter="handleApplyCode"
          />
          <Button
            class="sm:w-auto w-full min-w-36 gap-2"
            :disabled="isValidating || !form.code.trim()"
            @click="handleApplyCode"
          >
            <Loader2 v-if="isValidating" class="h-4 w-4 animate-spin" />
            <Sparkles v-else class="h-4 w-4" />
            {{ t('coupons.applyBtn') }}
          </Button>
        </div>

        <!-- Mensajes de Error / Éxito -->
        <p v-if="validationError" class="text-xs text-destructive flex items-center gap-1">
          <AlertCircle class="h-3.5 w-3.5" />
          {{ validationError }}
        </p>

        <div
          v-if="validationResult"
          class="rounded-md p-3 text-sm border"
          :class="
            validationResult.valid
              ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
              : 'border-destructive/30 bg-destructive/10 text-destructive'
          "
        >
          <div class="flex items-center gap-2">
            <CheckCircle v-if="validationResult.valid" class="h-4 w-4 shrink-0" />
            <AlertCircle v-else class="h-4 w-4 shrink-0" />
            <span>
              {{
                validationResult.valid
                  ? t('coupons.validation.success')
                  : t(validationResult.message || 'coupons.validation.notFound')
              }}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Lista / Grilla de Cupones -->
    <div v-if="isLoadingCoupons" class="flex justify-center py-12">
      <Loader2 class="h-8 w-8 animate-spin text-muted-foreground" />
    </div>

    <div v-else-if="coupons?.length" class="grid gap-4 sm:grid-cols-3 pt-4">
      <CouponCard v-for="coupon in coupons" :key="coupon.id" :coupon="coupon" />
    </div>

    <div v-else class="py-12 text-center text-sm text-muted-foreground">
      {{ t('coupons.emptyList') }}
    </div>
  </div>
</template>
