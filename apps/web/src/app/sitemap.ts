import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://lexchile.cl'

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/registro`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ]

  // Páginas por área legal para SEO
  const areasLegales = [
    'LABORAL', 'CIVIL', 'FAMILIA', 'PENAL', 'COMERCIAL',
    'TRIBUTARIO', 'ADMINISTRATIVO', 'CONSUMIDOR', 'ARRENDAMIENTO',
  ]

  const areaPages: MetadataRoute.Sitemap = areasLegales.map((area) => ({
    url: `${baseUrl}/leyes?area=${area}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }))

  return [...staticPages, ...areaPages]
}
