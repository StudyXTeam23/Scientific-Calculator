/**
 * CalculatorDisplay Component
 * 
 * Displays the current expression and result.
 */

'use client'

interface CalculatorDisplayProps {
  expression: string
  result: string
  error: string | null
}

/**
 * Calculator Display Area
 */
export function CalculatorDisplay({
  expression,
  result,
  error,
}: CalculatorDisplayProps) {
  return (
    <div className="bg-primary/90 dark:bg-primary/80 rounded-lg p-4 text-right space-y-2">
      {/* Expression preview */}
      <p
        className="text-base font-normal text-white/80 min-h-[24px] truncate"
        data-testid="expression-display"
      >
        {expression || '\u00A0'}
      </p>

      {/* Result display */}
      <h1
        className={clsx(
          'text-4xl font-bold tracking-tight transition-colors duration-200',
          error ? 'text-red-300' : 'text-white'
        )}
        data-testid="result-display"
      >
        {error || result || '0'}
      </h1>
    </div>
  )
}

// Import clsx for className utility
import clsx from 'clsx'

