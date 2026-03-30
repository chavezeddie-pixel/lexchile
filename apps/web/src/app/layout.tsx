import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#2563eb',
}

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: {
    default: 'LexChile - Consultoría Legal Inteligente para Chile',
    template: '%s | LexChile',
  },
  description:
    'Plataforma de consultoría legal con inteligencia artificial especializada exclusivamente en el sistema jurídico chileno. Consulta leyes, jurisprudencia y normativa de Chile.',
  keywords: [
    'consultoría legal Chile',
    'abogado Chile',
    'leyes chilenas',
    'jurisprudencia Chile',
    'Código del Trabajo Chile',
    'Código Civil Chile',
    'derecho laboral Chile',
    'derecho civil Chile',
    'derecho penal Chile',
    'derecho de familia Chile',
    'consulta legal online Chile',
    'asesoría jurídica Chile',
    'tribunales Chile',
    'normativa chilena',
    'Ley del Consumidor Chile',
    'inteligencia artificial legal',
    'legal tech Chile',
  ],
  authors: [{ name: 'LexChile' }],
  creator: 'LexChile',
  publisher: 'LexChile',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'es_CL',
    url: '/',
    siteName: 'LexChile',
    title: 'LexChile - Consultoría Legal Inteligente para Chile',
    description:
      'Plataforma de consultoría legal con IA especializada en el sistema jurídico chileno. Leyes, jurisprudencia y normativa de Chile.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'LexChile - Consultoría Legal con IA para Chile',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LexChile - Consultoría Legal Inteligente para Chile',
    description:
      'Consultoría legal con IA especializada en derecho chileno.',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: '/',
    languages: {
      'es-CL': '/',
    },
  },
  category: 'Legal',
  other: {
    'geo.region': 'CL',
    'geo.placename': 'Chile',
    'content-language': 'es-CL',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LegalService',
    name: 'LexChile',
    description:
      'Plataforma de consultoría legal con inteligencia artificial especializada en el sistema jurídico chileno.',
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    logo: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/logo.png`,
    areaServed: {
      '@type': 'Country',
      name: 'Chile',
      sameAs: 'https://es.wikipedia.org/wiki/Chile',
    },
    serviceType: [
      'Consultoría Legal',
      'Asesoría Jurídica',
      'Derecho Laboral',
      'Derecho Civil',
      'Derecho Penal',
      'Derecho de Familia',
      'Derecho Tributario',
      'Derecho del Consumidor',
    ],
    availableLanguage: {
      '@type': 'Language',
      name: 'Español',
      alternateName: 'es',
    },
    priceRange: 'CLP',
  }

  const orgJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'LexChile',
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    logo: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/logo.png`,
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      availableLanguage: 'Spanish',
      areaServed: 'CL',
    },
  }

  return (
    <html lang="es-CL" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
