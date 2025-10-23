/**
 * Math Engine Unit Tests
 */

import { describe, it, expect } from 'vitest'
import {
  evaluateExpression,
  formatResult,
  validateExpression,
  quickEvaluate,
} from '@/lib/math-engine'

describe('Math Engine', () => {
  describe('evaluateExpression', () => {
    it('should evaluate basic arithmetic operations', async () => {
      expect(await evaluateExpression('2 + 3', 'deg')).toBe(5)
      expect(await evaluateExpression('10 - 4', 'deg')).toBe(6)
      expect(await evaluateExpression('3 × 4', 'deg')).toBe(12)
      expect(await evaluateExpression('15 ÷ 3', 'deg')).toBe(5)
    })

    it('should handle complex expressions', async () => {
      const result = await evaluateExpression('(2 + 3) × 4', 'deg')
      expect(result).toBe(20)
    })

    it('should evaluate scientific functions', async () => {
      const sqrtResult = await evaluateExpression('sqrt(16)', 'deg')
      expect(sqrtResult).toBe(4)

      const logResult = await evaluateExpression('log(100)', 'deg')
      expect(logResult).toBeCloseTo(2, 5)
    })

    it('should handle trigonometric functions in deg mode', async () => {
      const sin30 = await evaluateExpression('sin(30)', 'deg')
      expect(sin30).toBeCloseTo(0.5, 5)

      const cos0 = await evaluateExpression('cos(0)', 'deg')
      expect(cos0).toBeCloseTo(1, 5)
    })

    it('should handle constants', async () => {
      const piResult = await evaluateExpression('π × 2', 'deg')
      expect(piResult).toBeCloseTo(6.28318, 4)
    })

    it('should throw error for division by zero', async () => {
      await expect(evaluateExpression('1 ÷ 0', 'deg')).rejects.toThrow()
    })

    it('should throw error for invalid expressions', async () => {
      await expect(evaluateExpression('2 +', 'deg')).rejects.toThrow()
      await expect(evaluateExpression('(2 + 3', 'deg')).rejects.toThrow()
    })
  })

  describe('formatResult', () => {
    it('should format normal numbers correctly', () => {
      expect(formatResult(5)).toBe('5')
      expect(formatResult(3.14159)).toMatch(/3\.14159/)
    })

    it('should format very small numbers as zero', () => {
      expect(formatResult(1e-11)).toBe('0')
    })

    it('should use scientific notation for very large numbers', () => {
      const result = formatResult(1e12)
      expect(result).toContain('e')
    })

    it('should use scientific notation for very small numbers', () => {
      const result = formatResult(1e-7)
      expect(result).toContain('e')
    })

    it('should handle infinite values', () => {
      expect(formatResult(Infinity)).toContain('Error')
      expect(formatResult(-Infinity)).toContain('Error')
    })
  })

  describe('validateExpression', () => {
    it('should validate correct expressions', () => {
      expect(validateExpression('2 + 3').valid).toBe(true)
      expect(validateExpression('sin(30)').valid).toBe(true)
      expect(validateExpression('(2 + 3) × 4').valid).toBe(true)
    })

    it('should reject empty expressions', () => {
      expect(validateExpression('').valid).toBe(false)
      expect(validateExpression('   ').valid).toBe(false)
    })

    it('should reject expressions that are too long', () => {
      const longExpr = '1 + '.repeat(200) + '1'
      expect(validateExpression(longExpr).valid).toBe(false)
    })

    it('should reject unmatched parentheses', () => {
      expect(validateExpression('(2 + 3').valid).toBe(false)
      expect(validateExpression('2 + 3)').valid).toBe(false)
    })

    it('should reject dangerous patterns', () => {
      expect(validateExpression('__import__("os")').valid).toBe(false)
      expect(validateExpression('eval("2+2")').valid).toBe(false)
    })
  })

  describe('quickEvaluate', () => {
    it('should quickly evaluate simple expressions', () => {
      expect(quickEvaluate('2+3')).toBe(5)
      expect(quickEvaluate('10-4')).toBe(6)
      expect(quickEvaluate('3*4')).toBe(12)
      expect(quickEvaluate('15/3')).toBe(5)
    })

    it('should return null for complex expressions', () => {
      expect(quickEvaluate('2 + 3 × 4')).toBe(null)
      expect(quickEvaluate('sin(30)')).toBe(null)
    })

    it('should handle division by zero', () => {
      expect(quickEvaluate('1/0')).toBe(null)
    })
  })
})

