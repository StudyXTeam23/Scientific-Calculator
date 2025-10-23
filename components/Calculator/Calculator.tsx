/**
 * Calculator Component
 * 
 * Main calculator container that combines all sub-components.
 */

'use client'

import { CalculatorDisplay } from './CalculatorDisplay'
import { CalculatorButtons } from './CalculatorButtons'
import { ModeToggle } from './ModeToggle'
import { useCalculator } from '@/hooks/useCalculator'
import { useKeyboard } from '@/hooks/useKeyboard'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'

/**
 * Calculator Main Container
 */
export function Calculator() {
  // Use calculator hook for state and logic
  const calculator = useCalculator()

  // Enable keyboard input
  useKeyboard({
    handleButtonClick: calculator.handleButtonClick,
    evaluate: calculator.evaluate,
    backspace: calculator.backspace,
    clearAll: calculator.clearAll,
  })

  return (
    <ErrorBoundary>
      <div className="calculator-container">
        {/* Display */}
        <CalculatorDisplay
          expression={calculator.expression}
          result={calculator.result}
          error={calculator.error}
        />

        {/* Mode Toggle */}
        <ModeToggle mode={calculator.angleMode} onChange={calculator.setAngleMode} />

        {/* Buttons */}
        <CalculatorButtons
          onButtonClick={calculator.handleButtonClick}
          disabledButtons={calculator.disabledButtons}
        />
      </div>
    </ErrorBoundary>
  )
}

