import { ref } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { useMutation } from '@tanstack/vue-query'
import { toast } from 'vue-sonner'
import { authApi } from '@/core/api/auth'
import { t } from '@/core/plugins/i18n'
import { forgotSchema, type ForgotInput } from '../schemas/forgot.schema'

export function useForgotPasswordForm() {
  const isSent = ref(false)

  // 1. Control y validación con VeeValidate + Zod
  const { handleSubmit, errors, defineField, resetForm } = useForm<ForgotInput>({
    validationSchema: toTypedSchema(forgotSchema),
    initialValues: {
      email: '',
    },
  })

  const [email] = defineField('email')

  // 2. Mutación de TanStack Query para el envío del correo de recuperación
  const forgotMutation = useMutation({
    mutationFn: (payload: ForgotInput) => authApi.forgotPassword(payload),
    onSuccess: () => {
      isSent.value = true
      toast.success(t('auth.notifications.forgotSuccess'))
    },
    onError: (error: any) => {
      if (error.response?.status === 404) {
        toast.error(t('auth.errors.emailNotFound'))
      } else {
        console.error('[ForgotPasswordForm] Error al enviar correo:', error)
      }
    },
  })

  // 3. Handler de submit procesado por VeeValidate
  const onSubmit = handleSubmit((values) => {
    forgotMutation.reset()
    forgotMutation.mutate(values)
  })

  function resetState() {
    isSent.value = false
    resetForm()
    forgotMutation.reset()
  }

  return {
    email,
    errors,
    isLoading: forgotMutation.isPending,
    isSent,
    onSubmit,
    resetState,
  }
}
