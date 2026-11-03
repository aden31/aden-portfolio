export type ContactInput = { name: string; email: string; subject: string; message: string }
export type ContactErrors = Partial<Record<keyof ContactInput, string>>

const LIMITS = { name: 120, email: 254, subject: 200, message: 5000 }
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** Shared by the form and the Edge Function, so both apply the same rules. */
export function validateContact(input: Partial<Record<keyof ContactInput, unknown>>) {
  const text = (value: unknown) => (typeof value === 'string' ? value.trim() : '')
  const values: ContactInput = {
    name: text(input.name),
    email: text(input.email),
    subject: text(input.subject),
    message: text(input.message),
  }
  const errors: ContactErrors = {}
  if (!values.name) errors.name = 'Enter your name.'
  else if (values.name.length > LIMITS.name) errors.name = `Use ${LIMITS.name} characters or fewer.`
  if (!EMAIL.test(values.email) || values.email.length > LIMITS.email) errors.email = 'Enter a valid email address.'
  if (values.subject.length > LIMITS.subject) errors.subject = `Use ${LIMITS.subject} characters or fewer.`
  if (!values.message) errors.message = 'Enter your message.'
  else if (values.message.length > LIMITS.message) errors.message = `Use ${LIMITS.message} characters or fewer.`
  return { values, errors, valid: Object.keys(errors).length === 0 }
}
