import SEO from '../components/SEO'

export default function Privacy() {
  return (
    <article className="mx-auto max-w-3xl px-6 py-16 lg:px-10 lg:py-24">
      <SEO title="Privacy Policy | SA Studio" description="Learn how SA Studio collects and uses contact and quotation inquiry details." />
      <p className="eyebrow">SA Studio</p>
      <h1 className="mt-5 font-serif text-5xl font-light text-charcoal">Privacy Policy</h1>
      <p className="mt-6 text-sm leading-8 text-charcoal-light">Last updated: September 9, 2026</p>
      <div className="mt-10 space-y-8 text-sm leading-8 text-charcoal-light">
        <section>
          <h2 className="font-serif text-3xl text-charcoal">Information we collect</h2>
          <p className="mt-3">When you contact us or request a quotation, we collect the name, email address, subject and message you submit. We may also receive basic technical information needed to deliver the website securely.</p>
        </section>
        <section>
          <h2 className="font-serif text-3xl text-charcoal">How we use it</h2>
          <p className="mt-3">We use inquiry details only to respond to your request, discuss a project, arrange showroom visits or provide a quotation. We do not sell your personal data to third parties.</p>
        </section>
        <section>
          <h2 className="font-serif text-3xl text-charcoal">Retention and contact</h2>
          <p className="mt-3">We keep inquiry details only as long as reasonably needed to respond and maintain business records. To ask about your data or request deletion, email sameraroudaki@gmail.com.</p>
        </section>
      </div>
    </article>
  )
}
