const RFC_5322_EMAIL = /^(?:[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[^"\\]|\\.)+")@(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,})$/

const DISPOSABLE_DOMAIN_PARTS = [
  '10minutemail',
  'guerrillamail',
  'maildrop',
  'mailinator',
  'tempmail',
  'throwaway',
  'yopmail',
]

export function isValidEmail(value) {
  const email = String(value || '').trim()
  if (!RFC_5322_EMAIL.test(email)) return false

  const domain = email.slice(email.lastIndexOf('@') + 1).toLowerCase()
  return !DISPOSABLE_DOMAIN_PARTS.some((part) => domain === part || domain.startsWith(`${part}.`) || domain.includes(`.${part}.`))
}

export function isDisposableEmail(value) {
  const email = String(value || '').trim().toLowerCase()
  const domain = email.slice(email.lastIndexOf('@') + 1)
  return DISPOSABLE_DOMAIN_PARTS.some((part) => domain === part || domain.startsWith(`${part}.`) || domain.includes(`.${part}.`))
}

export const CONTACT_RATE_LIMIT_MS = 60 * 1000
export const CONTACT_RATE_LIMIT_KEY = 'sa-studio-contact-last-submit'
