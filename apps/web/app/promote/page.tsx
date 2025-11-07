import { submitSubmission } from './actions'
import { T } from '@/components/T'
import { InputField, TextAreaField } from '@/components/forms/LocalizedField'

export default function PromotePage({ searchParams }: { searchParams?: { ok?: string } }) {
  const ok = searchParams?.ok === '1'
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold"><T k="promote.title" /></h1>
      <div className="card p-3 text-sm text-white/80">
        <T k="promote.disclaimer" />
      </div>
      {ok && <div className="card p-3 text-emerald-300"><T k="promote.success" /></div>}
      <form className="card p-4 space-y-3" action={submitSubmission}>
        <InputField name="name" labelKey="promote.name" placeholderKey="promote.name" required />
        <InputField name="address" labelKey="promote.address" placeholderKey="promote.address" />
        <TextAreaField name="description" labelKey="promote.description" placeholderKey="promote.description" rows={3} />
        <InputField name="email" type="email" labelKey="promote.email" placeholderKey="promote.email" required />
        <InputField name="phone" labelKey="promote.phone" placeholderKey="promote.phone" />
        <InputField name="ref" labelKey="promote.ref" placeholderKey="promote.ref" />
        <button className="btn btn-primary"><T k="promote.submit" /></button>
      </form>
    </div>
  )
}
