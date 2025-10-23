/**
 * Button Configuration Unit Tests
 */

import { describe, it, expect } from 'vitest'
import {
  BUTTON_CONFIGS,
  getButtonById,
  getButtonsByCategory,
  getButtonsByType,
  TOTAL_BUTTONS,
} from '@/lib/button-config'

describe('Button Configuration', () => {
  it('should have all buttons defined', () => {
    expect(BUTTON_CONFIGS).toBeDefined()
    expect(BUTTON_CONFIGS.length).toBeGreaterThan(0)
    expect(TOTAL_BUTTONS).toBe(BUTTON_CONFIGS.length)
  })

  it('should have unique button IDs', () => {
    const ids = BUTTON_CONFIGS.map((btn) => btn.id)
    const uniqueIds = new Set(ids)
    expect(ids.length).toBe(uniqueIds.size)
  })

  it('should have all required properties', () => {
    BUTTON_CONFIGS.forEach((button) => {
      expect(button.id).toBeDefined()
      expect(button.label).toBeDefined()
      expect(button.type).toBeDefined()
      expect(button.value).toBeDefined()
      expect(button.category).toBeDefined()
    })
  })

  it('should get button by ID correctly', () => {
    const button = getButtonById('btn-1')
    expect(button).toBeDefined()
    expect(button?.label).toBe('1')

    const nonExistent = getButtonById('btn-nonexistent')
    expect(nonExistent).toBeUndefined()
  })

  it('should get buttons by category', () => {
    const numericButtons = getButtonsByCategory('numeric')
    expect(numericButtons.length).toBeGreaterThan(0)
    numericButtons.forEach((btn) => {
      expect(btn.category).toBe('numeric')
    })
  })

  it('should get buttons by type', () => {
    const numberButtons = getButtonsByType('number')
    expect(numberButtons.length).toBeGreaterThan(0)
    numberButtons.forEach((btn) => {
      expect(btn.type).toBe('number')
    })
  })

  it('should have number buttons from 0-9', () => {
    const numberButtons = getButtonsByType('number')
    const labels = numberButtons.map((btn) => btn.label)
    
    for (let i = 0; i <= 9; i++) {
      expect(labels).toContain(i.toString())
    }
  })

  it('should have all operator buttons', () => {
    const operators = ['+', '-', '×', '÷']
    const operatorButtons = getButtonsByType('operator')
    const labels = operatorButtons.map((btn) => btn.label)
    
    operators.forEach((op) => {
      expect(labels).toContain(op)
    })
  })

  it('should have equals button with correct span', () => {
    const equalsButton = getButtonById('btn-equals')
    expect(equalsButton).toBeDefined()
    expect(equalsButton?.gridColumn).toBe('col-span-5')
  })

  it('should have zero button with correct span', () => {
    const zeroButton = getButtonById('btn-0')
    expect(zeroButton).toBeDefined()
    expect(zeroButton?.gridColumn).toBe('col-span-2')
  })
})

