import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { useMutation } from '@tanstack/vue-query'
import { toast } from 'vue-sonner'
import { useAuthStore } from '@/core/stores/useAuthStore'
import router from '@/core/router'
import { signupSchema, type SignupInput } from '../schemas/signup.schema'
import { authApi } from '@/core/api/auth'
import i18n from '@/core/plugins/i18n'

export function useSignupForm() {
  const authStore = useAuthStore()

  // 1. Control y validación con VeeValidate + Zod
  const { handleSubmit, errors, defineField } = useForm<SignupInput>({
    validationSchema: toTypedSchema(signupSchema),
    initialValues: {
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      terms: false,
    },
  })

  const [name] = defineField('name')
  const [email] = defineField('email')
  const [phone] = defineField('phone')
  const [password] = defineField('password')
  const [confirmPassword] = defineField('confirmPassword')
  const [terms] = defineField('terms')

  // 2. Mutación de TanStack Query para el Registro
  const signupMutation = useMutation({
    mutationFn: (payload: SignupInput) => authApi.register(payload),
    onSuccess: (data) => {
      authStore.setSession(data.token, data.user)
      toast.success(t('auth.notifications.signupSuccess'))
      router.push({ name: 'dashboard' })
    },
    onError: (error: any) => {
      if (error.response?.status === 422) {
        toast.error(t('auth.errors.emailAlreadyExists'))
      } else {
        console.error('[SignupForm] Error inesperado en registro:', error)
      }
    },
  })

  // 3. Handler de submit procesado por VeeValidate
  const onSubmit = handleSubmit((values) => {
    signupMutation.reset()
    signupMutation.mutate(values)
  })

  return {
    name,
    email,
    phone,
    password,
    confirmPassword,
    terms,
    errors,
    onSubmit,
    isLoading: signupMutation.isPending,
    serverError: signupMutation.error,
  }
}
