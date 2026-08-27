import type { DashboardWidget } from '../registry/widgetRegistry'

const colSpanMap: Record<number | string, string> = {
  1: 'col-span-1',
  2: 'col-span-2',
  3: 'col-span-3',
  4: 'col-span-4',
  6: 'col-span-6',
  8: 'col-span-8',
  12: 'col-span-12',
  full: 'col-span-full',
}

const lgColSpanMap: Record<number | string, string> = {
  1: 'lg:col-span-1',
  2: 'lg:col-span-2',
  3: 'lg:col-span-3',
  4: 'lg:col-span-4',
  6: 'lg:col-span-6',
  8: 'lg:col-span-8',
  12: 'lg:col-span-12',
  full: 'lg:col-span-full',
}

export function getWidgetClasses(widget: DashboardWidget): string {
  if (!widget.colSpan) return 'col-span-12 lg:col-span-3' // Por defecto 1/4 en desktop (KPI)

  if (typeof widget.colSpan === 'object') {
    const sm = widget.colSpan.sm ? colSpanMap[widget.colSpan.sm] : ''
    const lg = widget.colSpan.lg ? lgColSpanMap[widget.colSpan.lg] : ''
    return `${sm} ${lg}`.trim()
  }

  return colSpanMap[widget.colSpan] || 'col-span-12'
}
