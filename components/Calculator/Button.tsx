/**
 * Button Component
 * 
 * Individual calculator button component.
 * Supports different types with appropriate styling.
 */

'use client'

import { type ButtonConfig } from '@/types'
import clsx from 'clsx'

interface ButtonProps {
  config: ButtonConfig
  onClick: () => void
  disabled?: boolean
}

/**
 * Calculator Button
 */
export function Button({ config, onClick, disabled = false }: ButtonProps) {
  // Determine base class based on button type
  const getButtonClass = () => {
    // Handle special cases first
    if (config.id === 'btn-equals') {
      return 'calculator-button-equals'
    }

    // Type-based classes
    switch (config.type) {
      case 'number':
        return 'calculator-button-number'
      case 'operator':
        return config.className?.includes('text-primary')
          ? 'calculator-button-operator'
          : 'calculator-button-number'
      case 'function':
      case 'constant':
        return 'calculator-button-function'
      case 'control':
      case 'memory':
      case 'special':
        return 'calculator-button-control'
      default:
        return 'calculator-button'
    }
  }

  const buttonClass = clsx(
    getButtonClass(),
    config.gridColumn, // Apply grid column span if specified
    config.className, // Apply custom class name
    {
      'opacity-50 cursor-not-allowed': disabled,
    }
  )

  return (
    <button
      type="button"
      className={buttonClass}
      onClick={onClick}
      disabled={disabled}
      aria-label={`${config.label} button`}
      aria-disabled={disabled}
      data-button-id={config.id}
      data-button-type={config.type}
    >
      <span>{config.label}</span>
    </button>
  )
}

