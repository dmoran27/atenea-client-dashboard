import { ref } from 'vue'
import { useQuery, useMutation } from '@tanstack/vue-query'
import { couponsApi } from '../api'
import type { ValidateCouponResponse } from '../api'
import { validateCouponSchema, type ValidateCouponPayload } from '../schemas/coupons.shema'

export function useCoupons() {
  const validationError = ref<string>('')
  const validationResult = ref<ValidateCouponResponse | null>(null)

  // Obtener lista de cupones del usuario
  const {
    data: coupons,
    isLoading: isLoadingCoupons,
    isError: isCouponsError,
    refetch: refetchCoupons,
  } = useQuery({
    queryKey: ['coupons'],
    queryFn: () => couponsApi.getCoupons(),
    staleTime: 1000 * 60 * 5, // 5 minutos de cache
  })

  // Mutación para aplicar / validar cupón
  const {
    mutate: validateCoupon,
    isPending: isValidating,
    reset: resetValidationState,
  } = useMutation({
    mutationFn: (payload: ValidateCouponPayload) => couponsApi.validateCoupon(payload),
    onSuccess: (data) => {
      validationResult.value = data
    },
  })

  // Validación cliente con Zod previa a la llamada
  function validateAndApply(payload: ValidateCouponPayload) {
    validationError.value = ''
    validationResult.value = null

    const result = validateCouponSchema.safeParse(payload)

    if (!result.success) {
      const formatted = result.error.format()
      validationError.value = formatted.code?._errors[0] ?? ''
      return
    }

    validateCoupon(result.data)
  }

  return {
    coupons,
    isLoadingCoupons,
    isCouponsError,
    refetchCoupons,
    isValidating,
    validationError,
    validationResult,
    validateAndApply,
    resetValidationState,
  }
}
