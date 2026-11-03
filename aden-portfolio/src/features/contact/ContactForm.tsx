import { useState, type FormEvent } from 'react'
import { sendContactMessage } from '@/services/contact'
import { validateContact, type ContactErrors, type ContactInput } from '../../../supabase/functions/contact/validate'

const EMPTY: ContactInput = { name: '', email: '', subject: '', message: '' }
const fieldStyle = 'w-full border border-line-strong bg-ink px-3 py-3 text-paper aria-[invalid=true]:border-accent'

function Field({ id, label, error, required, children }: {
  id: string
  label: string
  error?: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block font-medium">{label}{!required && <span className="text-muted"> (optional)</span>}</label>
      {children}
      {error && <p id={`${id}-error`} className="mt-1.5 text-sm text-accent">{error}</p>}
    </div>
  )
}

export function ContactForm() {
  const [values, setValues] = useState(EMPTY)
  const [website, setWebsite] = useState('')
  const [errors, setErrors] = useState<ContactErrors>({})
  const [state, setState] = useState<'idle' | 'sending' | 'sent'>('idle')
  const [failure, setFailure] = useState('')

  const bind = (key: keyof ContactInput) => ({
    id: `contact-${key}`,
    name: key,
    value: values[key],
    onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setValues({ ...values, [key]: event.target.value }),
    'aria-invalid': Boolean(errors[key]),
    'aria-describedby': errors[key] ? `contact-${key}-error` : undefined,
    className: fieldStyle,
  })

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    setFailure('')
    const check = validateContact(values)
    setErrors(check.errors)
    if (!check.valid) return
    setState('sending')
    const result = await sendContactMessage({ ...check.values, website })
    if (result.ok) {
      setValues(EMPTY)
      setState('sent')
      return
    }
    setState('idle')
    setErrors(result.errors ?? {})
    setFailure(result.message)
  }

  if (state === 'sent') {
    return (
      <div role="status" className="border border-accent p-6">
        <p className="font-medium">Message sent.</p>
        <p className="mt-1 text-muted">I’ll reply to your email.</p>
        <button type="button" onClick={() => setState('idle')} className="mt-3 min-h-11 underline underline-offset-4">Send another message</button>
      </div>
    )
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-5">
      <Field id="contact-name" label="Name" error={errors.name} required><input {...bind('name')} autoComplete="name" /></Field>
      <Field id="contact-email" label="Email" error={errors.email} required><input {...bind('email')} type="email" autoComplete="email" /></Field>
      <Field id="contact-subject" label="Subject" error={errors.subject}><input {...bind('subject')} /></Field>
      <Field id="contact-message" label="Message" error={errors.message} required><textarea {...bind('message')} rows={6} /></Field>
      <div aria-hidden="true" className="absolute -left-[9999px]">
        <label>Website<input tabIndex={-1} autoComplete="off" value={website} onChange={(event) => setWebsite(event.target.value)} /></label>
      </div>
      {failure && <p role="alert" className="border border-accent p-3">{failure}</p>}
      <button type="submit" disabled={state === 'sending'} className="min-h-12 bg-accent px-6 py-3 font-medium text-ink transition-colors hover:bg-paper disabled:opacity-60">
        {state === 'sending' ? 'Sending' : 'Send message'}
      </button>
    </form>
  )
}
