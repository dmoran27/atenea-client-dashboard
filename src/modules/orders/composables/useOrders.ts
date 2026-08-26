import { ref, computed } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import type { GetOrdersParams, OrderStatus } from '../api/orders.interface'
import { ordersApi } from '../api'

export function useOrders(initialFilters?: GetOrdersParams) {
  const searchQuery = ref(initialFilters?.search ?? '')
  const dateFrom = ref(initialFilters?.dateFrom ?? '')
  const dateTo = ref(initialFilters?.dateTo ?? '')
  const selectedStatus = ref<OrderStatus | undefined>(initialFilters?.status)

  const queryParams = computed<GetOrdersParams>(() => ({
    search: searchQuery.value.trim() || undefined,
    dateFrom: dateFrom.value || undefined,
    dateTo: dateTo.value || undefined,
    status: selectedStatus.value,
  }))

  const {
    data: orders,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['orders', queryParams],
    queryFn: () => ordersApi.getOrders(queryParams.value),
    staleTime: 1000 * 60 * 5,
  })

  function resetFilters() {
    searchQuery.value = ''
    dateFrom.value = ''
    dateTo.value = ''
    selectedStatus.value = undefined
  }

  return {
    orders: computed(() => orders.value ?? []),
    isLoading,
    isError,
    error,
    refetch,
    // Estado y setters de filtros para binding en la vista
    searchQuery,
    dateFrom,
    dateTo,
    selectedStatus,
    resetFilters,
  }
}
