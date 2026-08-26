import { ref, computed } from 'vue'
import { t } from '@/core/plugins/i18n'
import { formatLocalDate } from '@/core/lib/utils'

export function useCalendar() {
  const today = new Date()

  const currentYear = ref(today.getFullYear())
  const currentMonth = ref(today.getMonth())
  const selectedDay = ref<string>(formatLocalDate(today))

  const monthLabel = computed(() => {
    return `${t(`bookings.calendar.months.${currentMonth.value}`)} ${currentYear.value}`
  })

  const weekdayLabels = computed(() => {
    const keys = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']
    return keys.map((k) => t(`bookings.calendar.weekdays.${k}`))
  })

  const calendarDays = computed(() => {
    const year = currentYear.value
    const month = currentMonth.value
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startOffset = firstDay.getDay()
    const totalDays = lastDay.getDate()
    const todayStr = formatLocalDate(new Date())

    const days: { date: string | null; dayNumber: number | null; isToday: boolean }[] = []

    for (let i = 0; i < startOffset; i++) {
      days.push({ date: null, dayNumber: null, isToday: false })
    }

    for (let d = 1; d <= totalDays; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
      days.push({
        date: dateStr,
        dayNumber: d,
        isToday: dateStr === todayStr,
      })
    }

    return days
  })

  function selectDay(date: string) {
    selectedDay.value = date
  }

  function prevMonth() {
    if (currentMonth.value === 0) {
      currentMonth.value = 11
      currentYear.value--
    } else {
      currentMonth.value--
    }
  }

  function nextMonth() {
    if (currentMonth.value === 11) {
      currentMonth.value = 0
      currentYear.value++
    } else {
      currentMonth.value++
    }
  }

  function goToToday() {
    const now = new Date()
    currentYear.value = now.getFullYear()
    currentMonth.value = now.getMonth()
    selectedDay.value = formatLocalDate(now)
  }

  return {
    currentYear,
    currentMonth,
    selectedDay,
    monthLabel,
    weekdayLabels,
    calendarDays,
    selectDay,
    prevMonth,
    nextMonth,
    goToToday,
  }
}
