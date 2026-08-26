import { ref, computed } from 'vue'
import { useQuery, useMutation } from '@tanstack/vue-query'
import { supportApi, type CreateTicketPayload } from '../api'
import { createTicketSchema } from '../schemas/support.shema'

export function useSupport() {
  const searchQuery = ref('')
  const validationErrors = ref<Record<string, string>>({})

  // Fetch FAQs con TanStack Query
  const {
    data: faqs,
    isLoading: isLoadingFaqs,
    isError: isFaqError,
  } = useQuery({
    queryKey: ['support', 'faqs'],
    queryFn: () => supportApi.getFaqs(),
    staleTime: 1000 * 60 * 15, // 15 minutos de cache
  })

  // Búsqueda / Filtrado en el cliente
  const filteredFaqs = computed(() => {
    if (!faqs.value) return []
    if (!searchQuery.value.trim()) return faqs.value

    const queryLower = searchQuery.value.toLowerCase()
    return faqs.value.filter(
      (faq) =>
        faq.question.toLowerCase().includes(queryLower) ||
        faq.answer.toLowerCase().includes(queryLower),
    )
  })

  // Mutación para creación de Ticket con TanStack Query
  const {
    mutate: submitTicket,
    isPending: isSubmittingTicket,
    isSuccess: isTicketSent,
    reset: resetTicketState,
  } = useMutation({
    mutationFn: (payload: CreateTicketPayload) => supportApi.createTicket(payload),
    onSuccess: () => {
      validationErrors.value = {}
    },
  })

  // Validación mediante Zod previa al submit
  function validateAndSubmitTicket(payload: CreateTicketPayload) {
    validationErrors.value = {}
    const result = createTicketSchema.safeParse(payload)

    if (!result.success) {
      const formatted = result.error.format()
      validationErrors.value = {
        subject: formatted.subject?._errors[0] ?? '',
        category: formatted.category?._errors[0] ?? '',
        message: formatted.message?._errors[0] ?? '',
      }
      return
    }

    submitTicket(result.data)
  }

  return {
    searchQuery,
    faqs,
    filteredFaqs,
    isLoadingFaqs,
    isFaqError,
    validationErrors,
    isSubmittingTicket,
    isTicketSent,
    validateAndSubmitTicket,
    resetTicketState,
  }
}
