/**
 * CalculatorButtons Component
 * 
 * Grid container for all calculator buttons.
 */

'use client'

import { Button } from './Button'
import { BUTTON_CONFIGS } from '@/lib/button-config'
import type { ButtonConfig } from '@/types'

interface CalculatorButtonsProps {
  onButtonClick: (button: ButtonConfig) => void
  disabledButtons?: string[]
}

/**
 * Calculator Buttons Grid
 */
export function CalculatorButtons({
  onButtonClick,
  disabledButtons = [],
}: CalculatorButtonsProps) {
  return (
    <div className="calculator-grid">
      {BUTTON_CONFIGS.map((button) => (
        <Button
          key={button.id}
          config={button}
          onClick={() => onButtonClick(button)}
          disabled={disabledButtons.includes(button.id)}
        />
      ))}
    </div>
  )
}

