/**
 * Calculator Type Definitions
 * 
 * This file contains all TypeScript type definitions for the calculator application.
 */

/**
 * Angle mode for trigonometric functions
 */
export type AngleMode = 'deg' | 'rad'

/**
 * Button types categorized by functionality
 */
export type ButtonType =
  | 'number'       // Digits 0-9
  | 'operator'     // +, -, ×, ÷
  | 'function'     // sin, cos, log, sqrt, etc.
  | 'constant'     // π, e
  | 'memory'       // M+, M-, MR
  | 'control'      // AC, Back, =
  | 'special'      // Ans, (, )

/**
 * Button categories for UI grouping
 */
export type ButtonCategory =
  | 'scientific'   // Scientific functions section
  | 'numeric'      // Number pad section
  | 'operation'    // Operators section
  | 'control'      // Control buttons section

/**
 * Calculator state interface
 * 
 * Represents the complete state of the calculator at any given time.
 */
export interface CalculatorState {
  /** Current expression being built (e.g., "2 + 3 * 4") */
  expression: string
  
  /** Calculated result or current display value */
  result: string
  
  /** Error message if calculation failed, null otherwise */
  error: string | null
  
  /** Current angle mode for trigonometric functions */
  angleMode: AngleMode
  
  /** Memory storage value */
  memory: number
  
  /** Last calculated answer (for Ans button) */
  ans: number
  
  /** Whether a calculation is currently being evaluated */
  isEvaluating: boolean
  
  /** Last action performed (for debugging/undo) */
  lastAction: string | null
}

/**
 * Button configuration interface
 * 
 * Defines the properties of each calculator button.
 */
export interface ButtonConfig {
  /** Unique identifier for the button (e.g., "btn-sin") */
  id: string
  
  /** Display label shown on the button */
  label: string
  
  /** Type of button determining its behavior */
  type: ButtonType
  
  /** Actual value inserted into expression (e.g., "sin(") */
  value: string
  
  /** Category for UI grouping and styling */
  category: ButtonCategory
  
  /** Optional grid column span (e.g., "col-span-2") */
  gridColumn?: string
  
  /** Optional custom CSS classes */
  className?: string
}

/**
 * Calculator hook return type
 * 
 * Defines the API returned by useCalculator hook.
 */
export interface UseCalculatorReturn extends CalculatorState {
  /** Handle button click events */
  handleButtonClick: (button: ButtonConfig) => void
  
  /** Set angle mode (degrees or radians) */
  setAngleMode: (mode: AngleMode) => void
  
  /** Evaluate the current expression */
  evaluate: () => Promise<void>
  
  /** Clear all (reset calculator) */
  clearAll: () => void
  
  /** Delete last character (backspace) */
  backspace: () => void
  
  /** List of button IDs that should be disabled */
  disabledButtons: string[]
}

/**
 * Math engine evaluation options
 */
export interface EvaluationOptions {
  /** Expression to evaluate */
  expression: string
  
  /** Angle mode for trigonometric functions */
  angleMode: AngleMode
  
  /** Precision for the result */
  precision?: number
}

/**
 * Math engine validation result
 */
export interface ValidationResult {
  /** Whether the expression is valid */
  valid: boolean
  
  /** Error message if invalid */
  error?: string
}

