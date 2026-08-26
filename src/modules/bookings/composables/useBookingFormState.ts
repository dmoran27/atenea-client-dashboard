import { reactive, toRefs } from 'vue'
import { useAuthStore } from '@/core/stores/useAuthStore'

export function useBookingFormState() {
  const authStore = useAuthStore()

  const state = reactive({
    activeTab: 'service' as 'service' | 'client',
    clientAlias: '',
    clientEmail: '',
    clientPhone: '',
    serviceId: '',
    date: '',
    endDate: '',
    time: '',
    endTime: '',
    notes: '',
  })

  function resetForm() {
    const user = authStore.user
    state.activeTab = 'service'
    state.clientAlias = user?.name ?? ''
    state.clientEmail = user?.email ?? ''
    state.clientPhone = ''
    state.serviceId = ''
    state.date = ''
    state.endDate = ''
    state.time = ''
    state.endTime = ''
    state.notes = ''
  }

  function resetDateTime() {
    state.date = ''
    state.endDate = ''
    state.time = ''
    state.endTime = ''
  }

  return {
    ...toRefs(state),
    resetForm,
    resetDateTime,
  }
}
