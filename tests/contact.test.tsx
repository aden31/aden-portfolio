import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ContactForm } from '@/features/contact/ContactForm'
import { sendContactMessage } from '@/services/contact'
import { handleContact, RATE_LIMIT, type ContactStore } from '../supabase/functions/contact/handler'

vi.mock('@/services/contact', () => ({ sendContactMessage: vi.fn(), contactFormEnabled: true }))
const send = vi.mocked(sendContactMessage)

const valid = { name: 'Rina', email: 'rina@example.com', subject: '', message: 'Hello' }

function store(count = 0) {
  const insert = vi.fn(async () => {})
  return { countSince: vi.fn(async () => count), insert } satisfies ContactStore
}

async function fill() {
  await userEvent.type(screen.getByLabelText('Name'), valid.name)
  await userEvent.type(screen.getByLabelText('Email'), valid.email)
  await userEvent.type(screen.getByLabelText('Message'), valid.message)
}

beforeEach(() => send.mockReset())

describe('ContactForm', () => {
  it('shows field errors and sends nothing when invalid', async () => {
    render(<ContactForm />)
    await userEvent.click(screen.getByRole('button', { name: 'Send message' }))
    expect(screen.getByText('Enter your name.')).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toHaveAttribute('aria-invalid', 'true')
    expect(send).not.toHaveBeenCalled()
  })

  it('confirms only after the server accepts', async () => {
    send.mockResolvedValue({ ok: true })
    render(<ContactForm />)
    await fill()
    await userEvent.click(screen.getByRole('button', { name: 'Send message' }))
    expect(await screen.findByText('Message sent.')).toBeInTheDocument()
  })

  it('keeps the message and shows the reason when sending fails', async () => {
    send.mockResolvedValue({ ok: false, message: 'Too many messages.' })
    render(<ContactForm />)
    await fill()
    await userEvent.click(screen.getByRole('button', { name: 'Send message' }))
    expect(await screen.findByRole('alert')).toHaveTextContent('Too many messages.')
    expect(screen.queryByText('Message sent.')).not.toBeInTheDocument()
    expect(screen.getByLabelText('Message')).toHaveValue(valid.message)
  })
})

describe('handleContact', () => {
  it('stores a valid message', async () => {
    const db = store()
    const result = await handleContact(valid, 'hash', db)
    expect(result.status).toBe(201)
    expect(db.insert).toHaveBeenCalledWith({ ...valid, ip_hash: 'hash' })
  })

  it('rejects invalid input', async () => {
    const db = store()
    const result = await handleContact({ ...valid, email: 'nope' }, 'hash', db)
    expect(result.status).toBe(400)
    expect(db.insert).not.toHaveBeenCalled()
  })

  it('limits repeat senders', async () => {
    const db = store(RATE_LIMIT)
    expect((await handleContact(valid, 'hash', db)).status).toBe(429)
    expect(db.insert).not.toHaveBeenCalled()
  })

  it('drops honeypot submissions without storing them', async () => {
    const db = store()
    await handleContact({ ...valid, website: 'spam.example' }, 'hash', db)
    expect(db.insert).not.toHaveBeenCalled()
  })

  it('surfaces storage failures instead of reporting success', async () => {
    const db = store()
    db.insert.mockRejectedValue(new Error('db down'))
    await expect(handleContact(valid, 'hash', db)).rejects.toThrow('db down')
  })
})
