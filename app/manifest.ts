import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Scientific Calculator - Free Online Tool',
    short_name: 'Calculator',
    description: 'Free online scientific calculator with trigonometric functions, logarithms, and more. Fast, accurate, and easy to use.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#5d89ee',
    orientation: 'portrait',
    icons: [
      {
        src: '/icon.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    categories: ['utilities', 'productivity', 'education'],
  }
}

