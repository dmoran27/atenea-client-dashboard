import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { toast } from 'vue-sonner'
import { notificationApi, type AppNotification } from '@/core/api/notification'

export const useNotificationStore = defineStore('notifications', () => {
  const { t } = useI18n()

  const notifications = ref<AppNotification[]>([])
  const isLoading = ref(false)

  const unreadCount = computed(() => notifications.value.filter((item) => !item.read).length)

  async function fetchNotifications() {
    isLoading.value = true
    try {
      notifications.value = await notificationApi.getNotifications()
    } catch (error) {
      console.error('Error obteniendo las notificaciones:', error)
      toast.error(t('notifications.errors.fetchFailed'))
    } finally {
      isLoading.value = false
    }
  }

  async function markAllAsRead() {
    if (unreadCount.value === 0) return

    const previousNotifications = notifications.value.map((item) => ({ ...item }))
    notifications.value.forEach((item) => (item.read = true))

    try {
      await notificationApi.markAllAsRead()
      toast.success(t('notifications.success.markedAllAsRead'))
    } catch (error) {
      console.error('Error marcando las noificaciones leidas:', error)
      notifications.value = previousNotifications
      toast.error(t('notifications.errors.markAllFailed'))
    }
  }

  return {
    notifications,
    isLoading,
    unreadCount,
    fetchNotifications,
    markAllAsRead,
  }
})
