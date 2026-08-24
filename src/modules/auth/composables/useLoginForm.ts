import { ref } from 'vue'
import { useAuthStore } from '@/core/stores/useAuthStore'

export function useLoginForm() {
  const authStore = useAuthStore()

  const email = ref('')
  const password = ref('')
  const remember = ref(false)

  async function handleSubmit() {
    if (!email.value || !password.value) return

    await authStore.login({
      email: email.value,
      password: password.value,
    })
  }

  return {
    email,
    password,
    remember,
    isLoading: authStore.isLoading,
    handleSubmit,
  }
}
