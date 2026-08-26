<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { Download, Loader2 } from '@lucide/vue'
import { Card, CardContent } from '@/core/components/ui/card'
import { Button } from '@/core/components/ui/button'
import { Badge } from '@/core/components/ui/badge'
import type { Order, OrderStatus } from '../api/orders.interface'
import { formatLocalDate } from '@/core/lib/utils'

defineProps<{
  orders: Order[]
  isLoading?: boolean
}>()

const { t, n } = useI18n()

const statusVariant: Record<OrderStatus, 'default' | 'secondary' | 'outline' | 'destructive'> = {
  paid: 'default',
  pending: 'secondary',
  refunded: 'outline',
  failed: 'destructive',
}

// Formato de moneda usando las reglas configuradas en i18n
function formatAmount(amount: number): string {
  return n(amount, 'currencyUSD')
}
</script>

<template>
  <Card>
    <CardContent class="p-0">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b bg-muted/30">
              <th class="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">
                {{ t('orders.columns.id') }}
              </th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">
                {{ t('orders.columns.concept') }}
              </th>
              <th
                class="hidden px-4 py-3 text-left text-xs font-semibold text-muted-foreground sm:table-cell"
              >
                {{ t('orders.columns.date') }}
              </th>
              <th class="px-4 py-3 text-right text-xs font-semibold text-muted-foreground">
                {{ t('orders.columns.amount') }}
              </th>
              <th class="px-4 py-3 text-center text-xs font-semibold text-muted-foreground">
                {{ t('orders.columns.status') }}
              </th>
              <th class="px-4 py-3 text-center text-xs font-semibold text-muted-foreground">
                {{ t('orders.columns.actions') }}
              </th>
            </tr>
          </thead>
          <tbody>
            <!-- State: Loading -->
            <tr v-if="isLoading">
              <td colspan="6" class="px-4 py-10 text-center">
                <Loader2 class="mx-auto h-6 w-6 animate-spin text-muted-foreground" />
              </td>
            </tr>

            <!-- State: Items -->
            <template v-else-if="orders.length">
              <tr
                v-for="order in orders"
                :key="order.id"
                class="border-b transition-colors hover:bg-accent/30"
              >
                <td class="px-4 py-3 font-mono text-sm font-medium">{{ order.id }}</td>
                <td class="px-4 py-3 text-sm">{{ order.concept }}</td>
                <td class="hidden px-4 py-3 text-sm text-muted-foreground sm:table-cell">
                  {{ formatLocalDate(order.date) }}
                </td>
                <td class="px-4 py-3 text-right text-sm font-semibold">
                  {{ formatAmount(order.amount) }}
                </td>
                <td class="px-4 py-3 text-center">
                  <Badge :variant="statusVariant[order.status]">
                    {{ t(`orders.status.${order.status}`) }}
                  </Badge>
                </td>
                <td class="px-4 py-3 text-center">
                  <Button
                    v-if="order.invoiceUrl"
                    variant="ghost"
                    size="sm"
                    class="gap-1.5"
                    :title="t('orders.downloadInvoice')"
                    as="a"
                    :href="order.invoiceUrl"
                    target="_blank"
                  >
                    <Download class="h-4 w-4" />
                    <span class="hidden lg:inline">{{ t('orders.downloadInvoice') }}</span>
                  </Button>
                  <span v-else class="text-xs text-muted-foreground">—</span>
                </td>
              </tr>
            </template>

            <!-- State: Empty -->
            <tr v-else>
              <td colspan="6" class="px-4 py-10 text-center text-sm text-muted-foreground">
                {{ t('orders.emptyList') }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </CardContent>
  </Card>
</template>
