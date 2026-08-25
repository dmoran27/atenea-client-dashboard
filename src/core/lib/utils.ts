import type { ClassValue } from 'clsx'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Combina y resuelve conflictos de clases de Tailwind CSS de forma dinámica.
 *
 * - `clsx`: Permite condicionales y combinación de cadenas/objetos de clases.
 * - `twMerge`: Fusiona y resuelve conflictos de especificidad (ej. prevalece 'px-4' sobre 'px-2').
 *
 * @param inputs - Lista de clases, objetos condicionales o arreglos de clases CSS.
 * @returns Cadena limpia de clases Tailwind optimizadas sin duplicados ni conflictos.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

/**
 * Genera una fecha en formato YYYY-MM-DD relativa a la fecha actual sumando o restando días.
 *
 * @param days - Número de días a sumar (positivo) o restar (negativo) a la fecha actual.
 * @returns Fecha resultante formateada como una cadena en formato `YYYY-MM-DD`.
 */
export function dateOffset(days: number): string {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return d.toISOString().substring(0, 10)
}

/**
 * Convierte un valor numérico en minutos a una representación de tiempo relativo legible.
 *
 * - Menos de 60 minutos: Devuelve los minutos (ej. `45 min`).
 * - Menos de un día (1440 min): Devuelve las horas redondeadas (ej. `3 h`).
 * - Un día o más: Devuelve los días redondeados (ej. `2 d`).
 *
 * @param minutes - Cantidad de minutos a formatear.
 * @returns Cadena con el tiempo relativo abreviado.
 */
export function relativeTime(minutes: number): string {
  if (minutes < 60) return `${minutes} min`
  if (minutes < 1440) return `${Math.floor(minutes / 60)} h`
  return `${Math.floor(minutes / 1440)} d`
}

/**
 * Obtiene las iniciales de un nombre completo o cadena de texto (máximo 2 caracteres).
 *
 * @param name - Nombre completo o texto opcional del cual extraer las iniciales.
 * @returns Una cadena con las iniciales en mayúsculas (ej. "Diana Morán" -> "DM"), o cadena vacía si no es válido.
 */
export function getInitials(name?: string): string {
  if (!name?.trim()) return ''

  return name
    .trim()
    .split(/\s+/)
    .map((word) => word[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

/**
 * Formatea un objeto de tipo Date a una cadena de fecha local en formato `YYYY-MM-DD`.
 * Utiliza los métodos de la fecha local para evitar desfases de zona horaria (UTC vs Local).
 *
 * @param date - Objeto Date opcional (por defecto toma la fecha y hora actual).
 * @returns Cadena de texto con la fecha formateada como `YYYY-MM-DD`.
 */
export function formatLocalDate(date = new Date()): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}
