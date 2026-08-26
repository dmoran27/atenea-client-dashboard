<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { Search } from '@lucide/vue'
import { Card, CardContent } from '@/core/components/ui/card'
import { Input } from '@/core/components/ui/input'
import { useOrders } from '../composables/useOrders'
import OrdersTable from '../components/OrdersTable.vue'

const { t } = useI18n()

const { orders, isLoading, searchQuery, dateFrom, dateTo } = useOrders()
</script>

<template>
  <div class="mx-auto space-y-6">
    <Card>
      <CardContent>
        <div class="flex flex-col gap-4 lg:flex-row lg:items-end">
          <div class="relative flex-1">
            <Search
              class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              v-model="searchQuery"
              :placeholder="t('orders.searchPlaceholder')"
              class="pl-9"
            />
          </div>
          <div class="flex flex-col gap-2 sm:flex-row sm:items-end">
            <div class="space-y-1">
              <label class="text-xs text-muted-foreground">{{ t('orders.dateFrom') }}</label>
              <Input v-model="dateFrom" type="date" class="sm:w-[160px]" />
            </div>
            <div class="space-y-1">
              <label class="text-xs text-muted-foreground">{{ t('orders.dateTo') }}</label>
              <Input v-model="dateTo" type="date" class="sm:w-[160px]" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    <OrdersTable :orders="orders" :is-loading="isLoading" />
  </div>
</template>
