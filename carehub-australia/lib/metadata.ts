import type { Metadata } from 'next'

const SITE_NAME = 'Scribe & Thrive Australia'

type PageMetadataInput = {
  /** Page title without the site-name suffix (the layout template appends it). */
  title: string
  description: string
  /** Route path used for the canonical URL and og:url, e.g. '/pricing'. */
  path: string
  /** Set for pages that should not be indexed (auth, admin). */
  noIndex?: boolean
}

// Builds page metadata with a canonical URL and page-specific Open Graph /
// Twitter tags. Page-level `openGraph` replaces the root layout's wholesale,
// so type/locale/siteName are restated here.
export function pageMetadata({
  title,
  description,
  path,
  noIndex,
}: PageMetadataInput): Metadata {
  const fullTitle = path === '/' ? title : `${title} | ${SITE_NAME}`

  return {
    // The root layout's title template appends the site name; the homepage
    // supplies its full title as-is.
    title: path === '/' ? { absolute: title } : title,
    description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      type: 'website',
      locale: 'en_AU',
      siteName: SITE_NAME,
      url: path,
      title: fullTitle,
      description,
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
    },
    ...(noIndex ? { robots: { index: false, follow: false } } : {}),
  }
}
