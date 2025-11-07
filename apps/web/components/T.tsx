"use client"
import { useI18n } from '@/lib/i18n'

export function T({ k, as: Tag = 'span' as any, className }: { k: string; as?: any; className?: string }) {
  const { t } = useI18n()
  const text = t(k)
  return <Tag className={className}>{text}</Tag>
}

