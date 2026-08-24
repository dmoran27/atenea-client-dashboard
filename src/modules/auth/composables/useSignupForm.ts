import { ref } from 'vue'

export function useSignupForm() {
  const name = ref('')
  const email = ref('')
  const password = ref('')
  const confirmPassword = ref('')
  const terms = ref(false)
  const isLoading = ref(false)

  async function handleSubmit() {
    if (!name.value || !email.value || !password.value || !terms.value) return
    if (password.value !== confirmPassword.value) return

    isLoading.value = true
    try {
      // Llamada futura a api.signup() o autenticar tras registro
    } finally {
      isLoading.value = false
    }
  }

  return {
    name,
    email,
    password,
    confirmPassword,
    terms,
    isLoading,
    handleSubmit,
  }
}
