import { useEffect } from 'react'

const SITE_URL = 'https://sa-studio.sy'
const DEFAULT_IMAGE = `${SITE_URL}/SA%20LOGO%201.jpg`

export default function SEO({ title, description, image = DEFAULT_IMAGE }) {
  useEffect(() => {
    const absoluteUrl = new URL(window.location.pathname + window.location.search, SITE_URL).toString()
    const tags = {
      description,
      'og:title': title,
      'og:description': description,
      'og:image': image,
      'og:url': absoluteUrl,
      'og:type': 'website',
      'twitter:card': 'summary_large_image',
      'twitter:title': title,
      'twitter:description': description,
      'twitter:image': image,
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

    return () => {
      Object.keys(tags).forEach((key) => {
        const attribute = key.startsWith('og:') || key.startsWith('twitter:') ? 'property' : 'name'
        document.head.querySelector(`meta[${attribute}="${key}"]`)?.remove()
      })
      document.head.querySelector('link[rel="canonical"]')?.remove()
    }
  }, [description, image, title])

  return null
}
