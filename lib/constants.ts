/**
 * Mathematical Constants
 */

export const MATH_CONSTANTS = {
  PI: Math.PI,
  E: Math.E,
  PHI: (1 + Math.sqrt(5)) / 2, // Golden ratio
} as const

/**
 * Calculator Configuration
 */
export const CALCULATOR_CONFIG = {
  MAX_EXPRESSION_LENGTH: 500,
  DEFAULT_PRECISION: 10, 
  MAX_PRECISION: 15,
  CACHE_SIZE: 100,
} as const

/**
 * Error Messages
 */
export const ERROR_MESSAGES = {
  DIVISION_BY_ZERO: 'Error: Division by zero',
  INVALID_EXPRESSION: 'Error: Invalid expression',
  OUT_OF_RANGE: 'Error: Out of range',
  UNDEFINED_FUNCTION: 'Error: Undefined function',
  SYNTAX_ERROR: 'Error: Syntax error',
  TOO_LONG: 'Error: Expression too long',
} as const

/**
 * Operator Symbol Mappings
 */
export const OPERATOR_MAPPINGS = {
  '×': '*',
  '÷': '/',
  'π': 'pi',
  '^': '**',
} as const

