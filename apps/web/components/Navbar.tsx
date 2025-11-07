"use client"
import Link from 'next/link'
import { LocaleSwitcher } from './LocaleSwitcher'
import { useI18n } from '@/lib/i18n'
import { UserMenu } from './UserMenu'

export function Navbar() {
  const { t } = useI18n()
  return (
    <nav className="sticky top-0 z-10 backdrop-blur bg-black/30 border-b border-white/10">
      <div className="max-w-xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="font-semibold tracking-wide text-gold">NightHub</Link>
        <div className="flex items-center gap-3 text-sm">
          <Link className="hover:text-gold" href="/">{t('nav.home')}</Link>
          <Link className="hover:text-gold" href="/promote">{t('nav.promote')}</Link>
          <LocaleSwitcher />
          <UserMenu />
        </div>
      </div>
    </nav>
  )
}
