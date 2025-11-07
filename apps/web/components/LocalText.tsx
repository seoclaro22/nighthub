"use client"
import { useI18n } from '@/lib/i18n'

export function LocalText({ value, i18n }: { value?: string | null; i18n?: Record<string,string> | null }) {
  const { locale } = useI18n()
  const txt = (i18n && typeof i18n === 'object' && (i18n as any)[locale]) || value || ''
  return <>{txt}</>
}

