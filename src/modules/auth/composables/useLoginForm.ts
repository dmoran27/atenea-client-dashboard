import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { useMutation } from '@tanstack/vue-query'
import { toast } from 'vue-sonner'
import { useAuthStore } from '@/core/stores/useAuthStore'
import router from '@/core/router'
import { loginSchema, type LoginInput } from '../schemas/login.schema'
import { authApi } from '@/core/api/auth'
import { t } from '@/core/plugins/i18n'

export function useLoginForm() {
  const authStore = useAuthStore()

  // 1. Control y validación con VeeValidate + Zod
  const { handleSubmit, errors, defineField, resetForm } = useForm<LoginInput>({
    validationSchema: toTypedSchema(loginSchema),
    initialValues: {
      email: '',
      password: '',
      remember: false,
    },
  })

  const [email, emailAttrs] = defineField('email')
  const [password, passwordAttrs] = defineField('password')
  const [remember, rememberAttrs] = defineField('remember')

  // 2. Mutación de TanStack Query para la API
  const loginMutation = useMutation({
    mutationFn: (credentials: LoginInput) => authApi.login(credentials),
    onSuccess: (data) => {
      authStore.setSession(data.token, data.user)
      toast.success(t('auth.notifications.loginSuccess'))
      router.push({ name: 'dashboard' })
    },
    onError: (error: any) => {
      if (error.response?.status === 401) {
        toast.error(t('auth.errors.invalidCredentials'))
      } else {
        console.error('[LoginForm] Error inesperado en login:', error)
      }
    },
  })

  // 3. Handler de submit
  const onSubmit = handleSubmit((values) => {
    loginMutation.reset()
    loginMutation.mutate(values)
  })

  return {
    email,
    emailAttrs,
    password,
    passwordAttrs,
    remember,
    rememberAttrs,
    errors,
    onSubmit,
    isLoading: loginMutation.isPending,
    serverError: loginMutation.error,
  }
}
