/**
 * API Type Definitions
 * 
 * Type definitions for API requests and responses.
 */

import { AngleMode } from './calculator'

/**
 * Calculate API request payload
 */
export interface CalculateRequest {
  /** Mathematical expression to evaluate */
  expression: string
  
  /** Angle mode for trigonometric functions */
  angle_mode: AngleMode
  
  /** Decimal precision for the result (1-15) */
  precision?: number
}

/**
 * Calculate API response payload
 */
export interface CalculateResponse {
  /** Whether the calculation was successful */
  success: boolean
  
  /** Calculation result as string */
  result: string | null
  
  /** Original expression */
  expression: string
  
  /** Formatted expression with units/symbols */
  formatted_expression: string | null
  
  /** Error message if calculation failed */
  error: string | null
  
  /** Time taken for computation in milliseconds */
  computation_time_ms: number
}

/**
 * Function information response
 */
export interface FunctionInfo {
  /** Function name (e.g., "sin") */
  name: string
  
  /** Human-readable description */
  description: string
  
  /** Function syntax */
  syntax: string
  
  /** Usage example */
  example: string
  
  /** Function category */
  category: string
}

/**
 * Functions API response payload
 */
export interface FunctionsResponse {
  /** Array of available functions */
  functions: FunctionInfo[]
}

/**
 * Health check response
 */
export interface HealthResponse {
  /** Service health status */
  status: 'healthy' | 'unhealthy'
  
  /** API version */
  version: string
  
  /** Current timestamp */
  timestamp: string
}

/**
 * API error response
 */
export interface APIError {
  /** Error message */
  message: string
  
  /** Error code */
  code?: string
  
  /** Additional error details */
  details?: Record<string, any>
}

