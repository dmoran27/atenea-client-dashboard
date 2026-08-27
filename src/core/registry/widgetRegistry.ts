import { reactive, markRaw, type Component } from 'vue'

export type WidgetColSpan = 1 | 2 | 3 | 4 | 6 | 8 | 12 | 'full'

export interface DashboardWidget {
  id: string
  titleKey?: string
  component: Component
  order: number
  // Soporte para spans responsivos
  colSpan?:
    | {
        sm?: WidgetColSpan
        md?: WidgetColSpan
        lg?: WidgetColSpan
        xl?: WidgetColSpan
      }
    | WidgetColSpan
}

class WidgetRegistry {
  private _widgets = reactive<DashboardWidget[]>([])

  register(widget: DashboardWidget) {
    const exists = this._widgets.some((w) => w.id === widget.id)
    if (exists) return

    this._widgets.push({
      ...widget,
      component: markRaw(widget.component),
    })

    this._widgets.sort((a, b) => a.order - b.order)
  }

  get widgets(): DashboardWidget[] {
    return this._widgets
  }
}

export const widgetRegistry = new WidgetRegistry()
