import { ref } from 'vue'

export function useForgotPasswordForm() {
  const email = ref('')
  const isLoading = ref(false)
  const isSent = ref(false)
  const errorMessage = ref('')

  async function handleSubmit() {
    if (!email.value) return

    isLoading.value = true
    errorMessage.value = ''

    try {
      // Reemplazar por llamada a API real: await api.post('/auth/forgot-password', { email: email.value })
      await new Promise((resolve) => setTimeout(resolve, 1200))
      isSent.value = true
    } catch (error: any) {
      errorMessage.value = error.response?.data?.message || 'Error al enviar el correo'
    } finally {
      isLoading.value = false
    }
  }

  function resetState() {
    isSent.value = false
    email.value = ''
    errorMessage.value = ''
  }

  return {
    email,
    isLoading,
    isSent,
    errorMessage,
    handleSubmit,
    resetState,
  }
}
