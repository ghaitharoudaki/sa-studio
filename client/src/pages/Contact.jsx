import { useState } from 'react'
import { SHOWROOMS, WHATSAPP_BASE } from '../data/fabrics'
import { useSite } from '../context/SiteContext'
import SEO from '../components/SEO'

export default function Contact() {
  const { t } = useSite()
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState({})

  function handleSubmit(event) {
    event.preventDefault()
    const form = event.currentTarget
    const values = Object.fromEntries(new FormData(form).entries())
    const nextErrors = {}
    if (values.website) return
    if (!values.firstName?.trim()) nextErrors.firstName = 'Please enter your first name.'
    if (!values.lastName?.trim()) nextErrors.lastName = 'Please enter your last name.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email || '')) nextErrors.email = 'Please enter a valid email address.'
    if (!values.subject?.trim()) nextErrors.subject = 'Please enter a subject.'
    if (!values.message?.trim()) nextErrors.message = 'Please tell us a little about your project.'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length === 0) setSubmitted(true)
  }

  return (
    <div className="contact-page" style={{ background: 'var(--bg)' }}>
      <SEO title="Contact SA Studio | Request a Quotation" description="Contact SA Studio in Damascus for luxury fabrics, wallpaper, interior collaborations and tailored quotations." image="https://sa-studio.sy/Contact%20Page%20Pic.webp" />
      <section className="mx-auto max-w-6xl px-6 py-14 md:px-10 md:py-20 lg:px-16">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">{t('getInTouch')}</p>
          <h1 className="mt-5 text-6xl md:text-7xl" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)', fontWeight: 400 }}>
            {t('contactUs')}
          </h1>
          <p className="mx-auto mt-5 max-w-lg text-base leading-8" style={{ color: 'var(--text-secondary)' }}>{t('contactIntro')}</p>
        </div>

        <div className="contact-layout mt-12 grid gap-12 md:mt-16 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
          <div className="contact-image-wrap overflow-hidden">
            <img
              src="/Contact Page Pic.jpg"
              alt="Close-up of a richly textured SA Studio upholstery fabric"
              className="contact-image h-full w-full object-cover"
            />
          </div>

          <div className="flex flex-col justify-center">
            {submitted ? (
              <div className="border-t pt-8" style={{ borderColor: 'var(--border)' }}>
                <p className="eyebrow">{t('requestSent')}</p>
                <h2 className="mt-4 text-4xl" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
                  {t('thankYouContact')}
                </h2>
                <p className="mt-4 text-sm leading-7" style={{ color: 'var(--text-secondary)' }}>
                  {t('contactFollowUp')}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="contact-form" noValidate>
                <div className="grid gap-8 sm:grid-cols-2">
                  <label>
                    <span>{t('firstName')}</span>
                    <input name="firstName" required aria-invalid={Boolean(errors.firstName)} />
                    {errors.firstName && <small className="form-error" role="alert">{errors.firstName}</small>}
                  </label>
                  <label>
                    <span>{t('lastName')}</span>
                    <input name="lastName" required aria-invalid={Boolean(errors.lastName)} />
                    {errors.lastName && <small className="form-error" role="alert">{errors.lastName}</small>}
                  </label>
                </div>
                <label>
                  <span>{t('email')}</span>
                  <input name="email" type="email" required aria-invalid={Boolean(errors.email)} />
                  {errors.email && <small className="form-error" role="alert">{errors.email}</small>}
                </label>
                <label>
                  <span>{t('subject')}</span>
                  <input name="subject" required aria-invalid={Boolean(errors.subject)} />
                  {errors.subject && <small className="form-error" role="alert">{errors.subject}</small>}
                </label>
                <label>
                  <span>{t('yourMessage')}</span>
                  <textarea name="message" required rows="4" aria-invalid={Boolean(errors.message)} />
                  {errors.message && <small className="form-error" role="alert">{errors.message}</small>}
                </label>
                <label className="contact-honeypot" aria-hidden="true">
                  <span>Website</span>
                  <input name="website" tabIndex="-1" autoComplete="off" />
                </label>
                <button type="submit" className="contact-submit primary-cta">
                  {t('sendRequest')}
                </button>
              </form>
            )}

            <div className="contact-details mt-10 border-t pt-7" style={{ borderColor: 'var(--border)' }}>
              <a href="mailto:sameraroudaki@gmail.com" dir="ltr" style={{ unicodeBidi: 'isolate' }}>sameraroudaki@gmail.com</a>
              <a href={WHATSAPP_BASE} target="_blank" rel="noreferrer">WhatsApp +963 944 231 337</a>
            </div>
          </div>
        </div>

        <section className="mt-20 border-t pt-12" style={{ borderColor: 'var(--border)' }}>
          <p className="eyebrow">{t('visitDamascus')}</p>
          <div className="mt-8 grid gap-8 md:grid-cols-2">
            {SHOWROOMS.map((showroom) => (
              <article key={showroom.id} className="contact-showroom">
                <h2 dir="ltr" style={{ unicodeBidi: 'isolate' }}>{showroom.name}</h2>
                <p className="mt-3" dir="ltr" style={{ unicodeBidi: 'isolate' }}>{showroom.address}</p>
                <p className="mt-3 text-sm">{t('showroomHours')}</p>
                <p className="text-sm">{t('whatsapp')} <span dir="ltr" style={{ unicodeBidi: 'isolate' }}>{showroom.whatsapp}</span></p>
                <a href={showroom.mapsLink} target="_blank" rel="noreferrer" className="mt-5 inline-flex min-h-[44px] items-center border px-5 text-[11px] font-semibold uppercase tracking-[0.16em]" style={{ borderColor: 'var(--green)', color: 'var(--green)' }}>
                  {t('viewGoogleMaps')}
                </a>
              </article>
            ))}
          </div>
        </section>
      </section>
    </div>
  )
}
