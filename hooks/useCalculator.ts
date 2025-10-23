/**
 * useCalculator Hook
 * 
 * Core calculator state management hook.
 * Handles all calculator logic including expression building, evaluation,
 * memory operations, and error handling.
 */

'use client'

import { useState, useCallback, useRef } from 'react'
import type { AngleMode, ButtonConfig, CalculatorState, UseCalculatorReturn } from '@/types'
import { evaluateExpression, formatResult } from '@/lib/math-engine'

/**
 * Calculator Hook
 * 
 * Manages calculator state and provides methods for all calculator operations.
 */
export function useCalculator(): UseCalculatorReturn {
  // State management
  const [state, setState] = useState<CalculatorState>({
    expression: '',
    result: '0',
    error: null,
    angleMode: 'deg',
    memory: 0,
    ans: 0,
    isEvaluating: false,
    lastAction: null,
  })

  // Use ref to track the latest state
  const stateRef = useRef(state)
  stateRef.current = state

  /**
   * Insert value into expression
   */
  const insertValue = useCallback((value: string) => {
    setState((prev) => {
      let newExpression = prev.expression

      // Define basic operator characters (not including - since it can be a negative sign)
      const basicOperators = ['+', '×', '÷', '^', '*', '/']
      
      // Check if the value being inserted is an operator
      const isBasicOperator = basicOperators.includes(value)
      const isMinusOperator = value === '-'
      
      // Get the last non-whitespace character
      const trimmedExpression = newExpression.trim()
      const lastChar = trimmedExpression.slice(-1)
      const lastIsBasicOperator = basicOperators.includes(lastChar)
      const lastIsMinus = lastChar === '-'

      // Handle consecutive operators
      if (trimmedExpression.length > 0) {
        // If inserting a basic operator and last char is any operator
        if (isBasicOperator && (lastIsBasicOperator || lastIsMinus)) {
          // Replace the last operator
          newExpression = trimmedExpression.slice(0, -1) + value
        }
        // If inserting minus and last char is also minus
        else if (isMinusOperator && lastIsMinus) {
          // Replace with minus (avoid --)
          newExpression = trimmedExpression.slice(0, -1) + value
        }
        // If inserting minus after a basic operator, allow it (for negative numbers)
        // e.g., "5×-3" is valid
        else if (isMinusOperator && lastIsBasicOperator) {
          // Allow the minus sign
          newExpression = newExpression + value
        }
        else {
          // Normal append
          newExpression = newExpression + value
        }
      } else {
        // Empty expression, just add the value
        newExpression = value
      }

      return {
        ...prev,
        expression: newExpression,
        error: null,
        lastAction: 'insert',
      }
    })
  }, [])

  /**
   * Evaluate current expression
   */
  const evaluate = useCallback(async () => {
    const currentExpression = stateRef.current.expression
    const currentAngleMode = stateRef.current.angleMode

    // Early return if no expression
    if (!currentExpression.trim()) return

    // Set evaluating state
    setState((prev) => ({ ...prev, isEvaluating: true }))

    try {
      const result = await evaluateExpression(currentExpression, currentAngleMode)
      const formatted = formatResult(result)

      setState((prev) => ({
        ...prev,
        result: formatted,
        ans: result,
        error: null,
        isEvaluating: false,
        lastAction: 'evaluate',
      }))
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        error: error.message || 'Error: Invalid expression',
        isEvaluating: false,
        lastAction: 'error',
      }))
    }
  }, [])

  /**
   * Clear all (reset calculator)
   */
  const clearAll = useCallback(() => {
    setState((prev) => ({
      ...prev,
      expression: '',
      result: '0',
      error: null,
      lastAction: 'clear',
    }))
  }, [])

  /**
   * Backspace (delete last character)
   */
  const backspace = useCallback(() => {
    setState((prev) => ({
      ...prev,
      expression: prev.expression.slice(0, -1),
      error: null,
      lastAction: 'backspace',
    }))
  }, [])

  /**
   * Handle control button operations
   */
  const handleControl = useCallback(
    (buttonId: string) => {
      switch (buttonId) {
        case 'btn-ac':
          clearAll()
          break
        case 'btn-back':
          backspace()
          break
        case 'btn-equals':
          evaluate()
          break
      }
    },
    [clearAll, backspace, evaluate]
  )

  /**
   * Handle memory operations
   */
  const handleMemory = useCallback((buttonId: string) => {
    setState((prev) => {
      const currentValue = parseFloat(prev.result) || 0

      switch (buttonId) {
        case 'btn-m-plus':
          // M+ : Add to memory
          return {
            ...prev,
            memory: prev.memory + currentValue,
            lastAction: 'm-plus',
          }

        case 'btn-m-minus':
          // M- : Subtract from memory
          return {
            ...prev,
            memory: prev.memory - currentValue,
            lastAction: 'm-minus',
          }

        case 'btn-mr':
          // MR : Recall memory
          return {
            ...prev,
            expression: prev.expression + prev.memory.toString(),
            lastAction: 'mr',
          }

        default:
          return prev
      }
    })
  }, [])

  /**
   * Handle special operations (Ans, parentheses)
   */
  const handleSpecial = useCallback((buttonId: string) => {
    setState((prev) => {
      switch (buttonId) {
        case 'btn-ans':
          // Ans : Insert last answer
          return {
            ...prev,
            expression: prev.expression + prev.ans.toString(),
            lastAction: 'ans',
          }

        case 'btn-lparen':
        case 'btn-rparen':
          // Parentheses handled by insertValue
          return prev

        default:
          return prev
      }
    })
  }, [])

  /**
   * Handle button click events
   */
  const handleButtonClick = useCallback((button: ButtonConfig) => {
    switch (button.type) {
      case 'number':
      case 'operator':
      case 'function':
      case 'constant':
        insertValue(button.value)
        break
      case 'control':
        handleControl(button.id)
        break
      case 'memory':
        handleMemory(button.id)
        break
      case 'special':
        handleSpecial(button.id)
        break
    }
  }, [insertValue, handleControl, handleMemory, handleSpecial])

  /**
   * Set angle mode
   */
  const setAngleMode = useCallback((mode: AngleMode) => {
    setState((prev) => ({
      ...prev,
      angleMode: mode,
      lastAction: 'mode-change',
    }))
  }, [])

  /**
   * Determine which buttons should be disabled
   */
  const disabledButtons: string[] = state.isEvaluating ? ['btn-equals'] : []

  return {
    ...state,
    handleButtonClick,
    setAngleMode,
    evaluate,
    clearAll,
    backspace,
    disabledButtons,
  }
}

