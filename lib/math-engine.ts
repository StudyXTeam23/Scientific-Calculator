/**
 * Math Engine
 * 
 * Core calculation engine using Math.js library.
 * Handles expression parsing, evaluation, and formatting.
 */

import { create, all } from 'mathjs'
import type { AngleMode, EvaluationOptions, ValidationResult } from '@/types'
import { CALCULATOR_CONFIG, ERROR_MESSAGES, OPERATOR_MAPPINGS } from './constants'
import { isFiniteNumber } from './utils'

// Create a Math.js instance with custom configuration
const math = create(all)
math.config({
  number: 'BigNumber',
  precision: 64,
})

/**
 * Expression cache for performance optimization
 */
const expressionCache = new Map<string, number>()

/**
 * Clear the expression cache
 */
export function clearCache(): void {
  expressionCache.clear()
}

/**
 * Evaluate a mathematical expression
 * 
 * @param expression - The expression to evaluate
 * @param angleMode - Angle mode for trig functions (deg or rad)
 * @returns The calculated result
 * @throws Error if expression is invalid
 */
export async function evaluateExpression(
  expression: string,
  angleMode: AngleMode = 'deg'
): Promise<number> {
  // Check cache first
  const cacheKey = `${expression}|${angleMode}`
  if (expressionCache.has(cacheKey)) {
    return expressionCache.get(cacheKey)!
  }

  // Validate expression
  const validation = validateExpression(expression)
  if (!validation.valid) {
    throw new Error(validation.error || ERROR_MESSAGES.INVALID_EXPRESSION)
  }

  // Preprocess expression
  const processed = preprocessExpression(expression, angleMode)

  try {
    // Evaluate using Math.js
    const result = math.evaluate(processed)

    // Convert to number
    let numericResult: number
    if (typeof result === 'object' && 'toNumber' in result) {
      numericResult = result.toNumber()
    } else if (typeof result === 'number') {
      numericResult = result
    } else {
      throw new Error(ERROR_MESSAGES.INVALID_EXPRESSION)
    }

    // Validate result
    if (!isFiniteNumber(numericResult)) {
      throw new Error(ERROR_MESSAGES.OUT_OF_RANGE)
    }

    // Add to cache
    if (expressionCache.size >= CALCULATOR_CONFIG.CACHE_SIZE) {
      const firstKey = expressionCache.keys().next().value
      if (firstKey !== undefined) {
        expressionCache.delete(firstKey)
      }
    }
    expressionCache.set(cacheKey, numericResult)

    return numericResult
  } catch (error: any) {
    throw new Error(parseError(error))
  }
}

/**
 * Preprocess expression before evaluation
 * 
 * @param expression - Raw expression
 * @param angleMode - Angle mode for trig functions
 * @returns Processed expression
 */
function preprocessExpression(expression: string, angleMode: AngleMode): string {
  let processed = expression

  // Replace operator symbols
  for (const [symbol, replacement] of Object.entries(OPERATOR_MAPPINGS)) {
    processed = processed.replace(new RegExp(escapeRegex(symbol), 'g'), replacement)
  }

  // Handle degree mode for trigonometric functions
  if (angleMode === 'deg') {
    // Convert deg to rad for trig functions
    const trigFunctions = ['sin', 'cos', 'tan']
    trigFunctions.forEach((fn) => {
      // Match function calls like sin(30) and convert to sin(30 * pi / 180)
      const regex = new RegExp(`\\b${fn}\\s*\\(([^()]+)\\)`, 'g')
      processed = processed.replace(regex, (match, arg) => {
        return `${fn}((${arg}) * pi / 180)`
      })
    })

    // Convert rad to deg for inverse trig functions
    const inverseTrigFunctions = ['asin', 'acos', 'atan']
    inverseTrigFunctions.forEach((fn) => {
      const regex = new RegExp(`\\b${fn}\\s*\\(([^()]+)\\)`, 'g')
      processed = processed.replace(regex, (match, arg) => {
        return `(${fn}(${arg}) * 180 / pi)`
      })
    })
  }

  return processed
}

/**
 * Format calculation result for display
 * 
 * @param value - The numeric value to format
 * @param precision - Number of significant digits
 * @returns Formatted string
 */
export function formatResult(value: number, precision: number = CALCULATOR_CONFIG.DEFAULT_PRECISION): string {
  // Handle special cases
  if (!isFiniteNumber(value)) {
    return ERROR_MESSAGES.OUT_OF_RANGE
  }

  // Handle very small numbers as zero
  if (Math.abs(value) < 1e-10) {
    return '0'
  }

  // Scientific notation for very large or very small numbers
  if (Math.abs(value) > 1e10 || (Math.abs(value) < 1e-6 && value !== 0)) {
    return value.toExponential(6)
  }

  // Normal formatting with precision
  const formatted = value.toPrecision(precision)
  
  // Remove trailing zeros and unnecessary decimal point
  return parseFloat(formatted).toString()
}

/**
 * Validate an expression
 * 
 * @param expression - The expression to validate
 * @returns Validation result
 */
export function validateExpression(expression: string): ValidationResult {
  // Check if empty
  if (!expression || !expression.trim()) {
    return { valid: false, error: 'Expression is empty' }
  }

  // Check length
  if (expression.length > CALCULATOR_CONFIG.MAX_EXPRESSION_LENGTH) {
    return { valid: false, error: ERROR_MESSAGES.TOO_LONG }
  }

  // Check parentheses matching
  let openCount = 0
  for (const char of expression) {
    if (char === '(') openCount++
    if (char === ')') openCount--
    if (openCount < 0) {
      return { valid: false, error: 'Unmatched parentheses' }
    }
  }

  if (openCount !== 0) {
    return { valid: false, error: 'Unmatched parentheses' }
  }

  // Check for dangerous patterns
  const dangerousPatterns = ['__', 'import', 'eval', 'exec']
  for (const pattern of dangerousPatterns) {
    if (expression.toLowerCase().includes(pattern)) {
      return { valid: false, error: 'Invalid characters in expression' }
    }
  }

  return { valid: true }
}

/**
 * Parse error messages from Math.js
 * 
 * @param error - The error object
 * @returns User-friendly error message
 */
function parseError(error: any): string {
  const message = error.message || String(error)

  if (message.includes('Division by zero') || message.includes('divide by zero')) {
    return ERROR_MESSAGES.DIVISION_BY_ZERO
  }

  if (message.includes('Undefined symbol') || message.includes('undefined')) {
    return ERROR_MESSAGES.UNDEFINED_FUNCTION
  }

  if (message.includes('Syntax error') || message.includes('syntax')) {
    return ERROR_MESSAGES.SYNTAX_ERROR
  }

  if (message.includes('out of range') || message.includes('Infinity')) {
    return ERROR_MESSAGES.OUT_OF_RANGE
  }

  return ERROR_MESSAGES.INVALID_EXPRESSION
}

/**
 * Escape special regex characters
 */
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/**
 * Quick evaluation for simple expressions (optimized path)
 * 
 * @param expression - Simple expression like "2+3"
 * @returns Result or null if not a simple expression
 */
export function quickEvaluate(expression: string): number | null {
  // Only handle very simple expressions like "2+3", "10-5"
  const simplePattern = /^(\d+\.?\d*)\s*([\+\-\*\/])\s*(\d+\.?\d*)$/
  const match = expression.match(simplePattern)

  if (!match) return null

  const a = parseFloat(match[1])
  const op = match[2]
  const b = parseFloat(match[3])

  switch (op) {
    case '+':
      return a + b
    case '-':
      return a - b
    case '*':
      return a * b
    case '/':
      return b !== 0 ? a / b : null
    default:
      return null
  }
}

