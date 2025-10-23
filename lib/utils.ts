/**
 * Utility Functions
 */

/**
 * Clamp a number between min and max values
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

/**
 * Check if a value is a finite number
 */
export function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && isFinite(value)
}

/**
 * Format a number with specified decimal places
 */
export function formatNumber(value: number, decimals: number = 10): string {
  if (!isFiniteNumber(value)) {
    return 'NaN'
  }
  
  // Remove trailing zeros
  return parseFloat(value.toFixed(decimals)).toString()
}

/**
 * Convert degrees to radians
 */
export function degToRad(degrees: number): number {
  return (degrees * Math.PI) / 180
}

/**
 * Convert radians to degrees
 */
export function radToDeg(radians: number): number {
  return (radians * 180) / Math.PI
}

/**
 * Safely parse a number from string
 */
export function parseNumber(value: string): number | null {
  const parsed = parseFloat(value)
  return isFiniteNumber(parsed) ? parsed : null
}

/**
 * Check if string contains any of the given substrings
 */
export function containsAny(str: string, substrings: string[]): boolean {
  return substrings.some((substr) => str.includes(substr))
}

/**
 * Debounce a function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null
      func(...args)
    }
    
    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(later, wait)
  }
}

