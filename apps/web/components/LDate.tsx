"use client"
import { useI18n } from '@/lib/i18n'

export function LDate({ value, options }: { value: string | number | Date; options?: Intl.DateTimeFormatOptions }) {
  const { locale } = useI18n()
  const map: Record<string, string> = { es: 'es-ES', en: 'en-GB', de: 'de-DE' }
  const fmt = new Date(value)
  const text = fmt.toLocaleString(map[locale] || 'es-ES', options)
  return <>{text}</>
}

