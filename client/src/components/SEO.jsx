import { useEffect } from 'react'

export const SITE_URL = 'https://sastudio-sy.com'
const DEFAULT_IMAGE = `${SITE_URL}/SA%20LOGO%201.jpg`

const toAbsoluteUrl = (value) => {
  if (!value) return DEFAULT_IMAGE
  return new URL(value, SITE_URL).toString()
}

export default function SEO({ title, description, image = DEFAULT_IMAGE, product, noindex = false }) {
  useEffect(() => {
    const absoluteUrl = new URL(window.location.pathname, SITE_URL).toString()
    const absoluteImage = toAbsoluteUrl(image)
    const tags = {
      description,
      'og:title': title,
      'og:description': description,
      'og:image': absoluteImage,
      'og:image:alt': `${title} — SA Studio`,
      'og:site_name': 'SA Studio',
      'og:url': absoluteUrl,
      'og:type': 'website',
      'og:locale': 'en_US',
      'twitter:card': 'summary_large_image',
      'twitter:title': title,
      'twitter:description': description,
      'twitter:image': absoluteImage,
      'twitter:image:alt': `${title} — SA Studio`,
      robots: noindex ? 'noindex, nofollow' : 'index, follow',
    }

    document.title = title
    Object.entries(tags).forEach(([key, content]) => {
      const attribute = key.startsWith('og:') || key.startsWith('twitter:') ? 'property' : 'name'
      let element = document.head.querySelector(`meta[${attribute}="${key}"]`)
      if (!element) {
        element = document.createElement('meta')
        element.setAttribute(attribute, key)
        document.head.appendChild(element)
      }
      element.setAttribute('content', content)
    })

    let canonical = document.head.querySelector('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.rel = 'canonical'
      document.head.appendChild(canonical)
    }
    canonical.href = absoluteUrl

    let structuredData = document.head.querySelector('script[data-sa-schema]')
    if (!structuredData) {
      structuredData = document.createElement('script')
      structuredData.type = 'application/ld+json'
      structuredData.dataset.saSchema = 'true'
      document.head.appendChild(structuredData)
    }

    const graph = [
      {
        '@type': 'Organization',
        '@id': `${SITE_URL}/#organization`,
        name: 'SA Studio',
        url: SITE_URL,
        logo: toAbsoluteUrl('/SA%20LOGO%201.jpg'),
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        name: 'SA Studio',
        url: SITE_URL,
        publisher: { '@id': `${SITE_URL}/#organization` },
      },
      {
        '@type': 'WebPage',
        '@id': `${absoluteUrl}#webpage`,
        url: absoluteUrl,
        name: title,
        description,
        isPartOf: { '@id': `${SITE_URL}/#website` },
      },
    ]

    if (product) {
      graph.push({
        '@type': 'Product',
        '@id': `${absoluteUrl}#product`,
        name: product.name,
        description: product.description || description,
        image: (product.images?.length ? product.images : [absoluteImage]).map(toAbsoluteUrl),
        sku: product.reference || undefined,
        category: product.categories?.join(', '),
        brand: { '@type': 'Brand', name: 'SA Studio', url: SITE_URL },
        url: absoluteUrl,
      })
    }
    structuredData.textContent = JSON.stringify({ '@context': 'https://schema.org', '@graph': graph })

    return () => {
      Object.keys(tags).forEach((key) => {
        const attribute = key.startsWith('og:') || key.startsWith('twitter:') ? 'property' : 'name'
        document.head.querySelector(`meta[${attribute}="${key}"]`)?.remove()
      })
      document.head.querySelector('link[rel="canonical"]')?.remove()
      document.head.querySelector('script[data-sa-schema]')?.remove()
    }
  }, [description, image, noindex, product, title])

  return null
}
