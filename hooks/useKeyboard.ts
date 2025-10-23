/**
 * useKeyboard Hook
 * 
 * Handles keyboard input for the calculator.
 * Maps keyboard events to calculator operations.
 */

'use client'

import { useEffect } from 'react'
import type { ButtonConfig } from '@/types'

interface UseKeyboardProps {
  handleButtonClick: (button: ButtonConfig) => void
  evaluate: () => void | Promise<void>
  backspace: () => void
  clearAll: () => void
}

/**
 * Keyboard input hook
 * 
 * Listens for keyboard events and maps them to calculator operations.
 */
export function useKeyboard({
  handleButtonClick,
  evaluate,
  backspace,
  clearAll,
}: UseKeyboardProps): void {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const { key } = event

      // Digits 0-9
      if (/^[0-9]$/.test(key)) {
        event.preventDefault()
        handleButtonClick({
          id: `kbd-${key}`,
          label: key,
          type: 'number',
          value: key,
          category: 'numeric',
        })
        return
      }

      // Operators
      const operatorMap: Record<string, { label: string; value: string }> = {
        '+': { label: '+', value: '+' },
        '-': { label: '-', value: '-' },
        '*': { label: '×', value: '×' },
        '/': { label: '÷', value: '÷' },
        '(': { label: '(', value: '(' },
        ')': { label: ')', value: ')' },
        '.': { label: '.', value: '.' },
      }

      if (key in operatorMap) {
        event.preventDefault()
        const op = operatorMap[key]
        handleButtonClick({
          id: `kbd-${key}`,
          label: op.label,
          type: 'operator',
          value: op.value,
          category: 'operation',
        })
        return
      }

      // Enter = Calculate
      if (key === 'Enter') {
        event.preventDefault()
        evaluate()
        return
      }

      // Backspace = Delete last character
      if (key === 'Backspace') {
        event.preventDefault()
        backspace()
        return
      }

      // Escape = Clear all
      if (key === 'Escape') {
        event.preventDefault()
        clearAll()
        return
      }

      // Special keys
      if (key === 'c' || key === 'C') {
        if (event.ctrlKey || event.metaKey) {
          // Allow Ctrl+C for copy
          return
        }
      }
    }

    // Add event listener
    window.addEventListener('keydown', handleKeyDown)

    // Cleanup
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleButtonClick, evaluate, backspace, clearAll])
}

