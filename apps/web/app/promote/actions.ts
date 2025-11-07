"use server"
import { getSupabaseClient } from '@/lib/supabase'
import { redirect } from 'next/navigation'

export async function submitSubmission(formData: FormData) {
  const payload = {
    name: formData.get('name'),
    address: formData.get('address'),
    description: formData.get('description'),
    referral_link: formData.get('ref') || null,
    phone: formData.get('phone') || null,
  }
  const contact_email = String(formData.get('email') || '')
  const sb = getSupabaseClient()
  const { error } = await sb.from('submissions').insert({ type: 'club', payload, contact_email })
  if (error) throw error
  redirect('/promote?ok=1')
}
