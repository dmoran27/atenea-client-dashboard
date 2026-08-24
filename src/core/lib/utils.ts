import type { ClassValue } from 'clsx'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Combina y resuelve conflictos de clases de Tailwind CSS de forma dinámica.
 *
 * - `clsx`: Permite condicionales y combinación de cadenas/objetos de clases.
 * - `twMerge`: Fusiona y resuelve conflictos de especificidad (ej. prevalece 'px-4' sobre 'px-2').
 *
 * @param inputs Lista de clases, objetos condicionales o arreglos de clases CSS.
 * @returns Cadena limpia de clases Tailwind optimizadas sin duplicados ni conflictos.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Genera una fecha en formato YYYY-MM-DD relativa a la fecha actual.
 * @param days Número de días a sumar o restar
 */
export function dateOffset(days: number): string {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return d.toISOString().substring(0, 10)
}

export function relativeTime(minutes: number): string {
  if (minutes < 60) return `${minutes} min`
  if (minutes < 1440) return `${Math.floor(minutes / 60)} h`
  return `${Math.floor(minutes / 1440)} d`
}

export function getInitials(name?: string): string {
  if (!name?.trim()) return ''

  return name
    .trim()
    .split(/\s+/) // Maneja espacios dobles o múltiples espacios
    .map((word) => word[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}
