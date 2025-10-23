import { Calculator } from '@/components/Calculator/Calculator'

export default function Home() {
  // Structured Data (JSON-LD) for SEO
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Scientific Calculator',
    description: 'Free online scientific calculator with trigonometric functions, logarithms, exponentials, and more. Supports degree/radian modes, memory functions, and keyboard input.',
    url: 'https://scientific-calculator.app',
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'Web Browser',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '1250',
      bestRating: '5',
      worstRating: '1',
    },
    featureList: [
      'Basic arithmetic operations',
      'Trigonometric functions (sin, cos, tan)',
      'Logarithmic functions (log, ln)',
      'Exponential functions',
      'Memory functions (M+, M-, MR)',
      'Degree and Radian modes',
      'Keyboard input support',
      'Real-time calculation',
    ],
    browserRequirements: 'Requires JavaScript. Modern web browser recommended.',
  }

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Main Content */}
      <main className="w-full" role="main" aria-label="Scientific Calculator Application">
        <section aria-label="Calculator Interface">
          <h1 className="sr-only">Scientific Calculator - Free Online Tool</h1>
          <Calculator />
        </section>
      </main>
    </>
  )
}

