"use client"
import { useI18n } from '@/lib/i18n'

export function InputField({ name, labelKey, placeholderKey, type='text', required=false }: { name: string; labelKey: string; placeholderKey: string; type?: string; required?: boolean }) {
  const { t } = useI18n()
  return (
    <div>
      <label className="block text-sm">{t(labelKey)}</label>
      <input name={name} type={type} required={required} className="w-full bg-transparent border border-white/10 rounded-xl p-2" placeholder={t(placeholderKey)} />
    </div>
  )
}

export function TextAreaField({ name, labelKey, placeholderKey, rows=3 }: { name: string; labelKey: string; placeholderKey: string; rows?: number }) {
  const { t } = useI18n()
  return (
    <div>
      <label className="block text-sm">{t(labelKey)}</label>
      <textarea name={name} rows={rows} className="w-full bg-transparent border border-white/10 rounded-xl p-2" placeholder={t(placeholderKey)} />
    </div>
  )
}

