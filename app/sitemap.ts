import type { MetadataRoute } from 'next'
import { projects } from '@/content/projects'
import { site } from '@/content/site'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ['', '/receipt', '/credits', ...projects.map((p) => `/menu/${p.slug}`)]
  return paths.map((path) => ({ url: `${site.url}${path}`, lastModified: new Date() }))
}
