import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://scientific-calculator.app'),
  title: {
    default: 'Scientific Calculator | Free Online Calculator',
    template: '%s | Scientific Calculator',
  },
  description: 'Free online scientific calculator with trigonometric functions, logarithms, exponentials, and more. Supports degree/radian modes, memory functions, and keyboard input. Fast, accurate, and easy to use.',
  keywords: [
    'calculator',
    'scientific calculator',
    'online calculator',
    'math calculator',
    'free calculator',
    'trigonometry calculator',
    'logarithm calculator',
    'exponential calculator',
    'web calculator',
    'calculator with memory',
  ],
  authors: [{ name: 'Scientific Calculator Team' }],
  creator: 'Scientific Calculator Team',
  publisher: 'Scientific Calculator',
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
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
    locale: 'en_US',
    url: 'https://scientific-calculator.app',
    title: 'Scientific Calculator | Free Online Calculator',
    description: 'Free online scientific calculator with trigonometric functions, logarithms, and more. Supports degree/radian modes, memory functions, and keyboard input.',
    siteName: 'Scientific Calculator',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Scientific Calculator - Free Online Tool',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Scientific Calculator | Free Online Calculator',
    description: 'Free online scientific calculator with trigonometric functions, logarithms, and more. Fast, accurate, and easy to use.',
    images: ['/og-image.png'],
    creator: '@ScientificCalc',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },
  icons: {
    icon: [
      { url: '/icon.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/manifest.json',
  category: 'technology',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen flex items-center justify-center">
        {children}
        <Script
          defer
          data-domain="bestcalculator.im"
          src="https://p.studyx.ai/js/script.js"
        />
      </body>
    </html>
  )
}

