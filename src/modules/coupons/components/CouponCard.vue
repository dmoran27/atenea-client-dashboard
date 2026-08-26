<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Calendar, CheckCircle2, Clock, XCircle, Copy, Check, Ticket } from '@lucide/vue'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/core/components/ui/card'
import { Badge } from '@/core/components/ui/badge'
import { Button } from '@/core/components/ui/button'
import type { Coupon } from '../api'
import { formatLocalDate } from '@/core/lib/utils'

const props = defineProps<{
  coupon: Coupon
}>()

const { t } = useI18n()

const copied = ref(false)

async function handleCopyCode() {
  if (props.coupon.status !== 'active') return

  try {
    await navigator.clipboard.writeText(props.coupon.code)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (err) {
    console.error('Error al copiar el código:', err)
  }
}
</script>

<template>
  <Card
    class="relative overflow-hidden transition-all duration-200"
    :class="{ 'opacity-65 bg-muted/30': props.coupon.status !== 'active' }"
  >
    <CardHeader class="pb-3">
      <div class="flex items-center justify-between gap-2">
        <CardTitle class="text-2xl font-black text-primary">
          {{ props.coupon.discount }}
        </CardTitle>

        <!-- Badge de Estado -->
        <Badge
          v-if="props.coupon.status === 'active'"
          class="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/20 gap-1"
        >
          <CheckCircle2 class="h-3.5 w-3.5" />
          {{ t('coupons.status.active') }}
        </Badge>
        <Badge
          v-else-if="props.coupon.status === 'expired'"
          variant="destructive"
          class="gap-1 opacity-80"
        >
          <Clock class="h-3.5 w-3.5" />
          {{ t('coupons.status.expired') }}
        </Badge>
        <Badge v-else variant="secondary" class="gap-1">
          <XCircle class="h-3.5 w-3.5" />
          {{ t('coupons.status.used') }}
        </Badge>
      </div>

      <CardDescription class="pt-1">{{ props.coupon.description }}</CardDescription>
    </CardHeader>

    <CardContent class="space-y-3 pt-0">
      <!-- Bloque del Código de Cupón con Etiqueta Explícita -->
      <div class="space-y-1.5">
        <span
          class="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase flex items-center gap-1 pb-1"
        >
          <Ticket class="h-3 w-3 text-primary" />
          {{ t('coupons.codeLabel') }}
        </span>

        <div
          class="flex items-center justify-between rounded-lg border-2 border-dashed border-primary/30 bg-muted/40 p-2 pl-3"
        >
          <code
            class="font-mono text-base font-extrabold tracking-widest text-primary uppercase select-all"
          >
            {{ props.coupon.code }}
          </code>

          <Button
            variant="secondary"
            size="sm"
            class="h-8 gap-1.5 px-3 text-xs font-medium shadow-none"
            :disabled="props.coupon.status !== 'active'"
            @click="handleCopyCode"
          >
            <template v-if="copied">
              <Check class="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              <span class="text-emerald-600 dark:text-emerald-400 font-semibold">
                {{ t('coupons.copied') }}
              </span>
            </template>
            <template v-else>
              <Copy class="h-3.5 w-3.5 text-muted-foreground" />
              <span>{{ t('coupons.copy') }}</span>
            </template>
          </Button>
        </div>
      </div>

      <!-- Fecha de expiración -->
      <div class="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Calendar class="h-3.5 w-3.5" />
        <span>{{ t('coupons.expiresAt', { date: formatLocalDate(props.coupon.expiresAt) }) }}</span>
      </div>
    </CardContent>
  </Card>
</template>
