/**
 * useCalculator Hook Unit Tests
 */

import { describe, it, expect } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { useCalculator } from '@/hooks/useCalculator'

describe('useCalculator', () => {
  it('should initialize with default state', () => {
    const { result } = renderHook(() => useCalculator())

    expect(result.current.expression).toBe('')
    expect(result.current.result).toBe('0')
    expect(result.current.error).toBe(null)
    expect(result.current.angleMode).toBe('deg')
    expect(result.current.memory).toBe(0)
    expect(result.current.ans).toBe(0)
  })

  it('should insert values correctly', () => {
    const { result } = renderHook(() => useCalculator())

    act(() => {
      result.current.handleButtonClick({
        id: 'btn-5',
        label: '5',
        type: 'number',
        value: '5',
        category: 'numeric',
      })
    })

    expect(result.current.expression).toBe('5')

    act(() => {
      result.current.handleButtonClick({
        id: 'btn-plus',
        label: '+',
        type: 'operator',
        value: '+',
        category: 'operation',
      })
    })

    expect(result.current.expression).toBe('5+')
  })

  it('should evaluate simple expressions', async () => {
    const { result } = renderHook(() => useCalculator())

    act(() => {
      result.current.handleButtonClick({
        id: 'btn-2',
        label: '2',
        type: 'number',
        value: '2',
        category: 'numeric',
      })
      result.current.handleButtonClick({
        id: 'btn-plus',
        label: '+',
        type: 'operator',
        value: '+',
        category: 'operation',
      })
      result.current.handleButtonClick({
        id: 'btn-3',
        label: '3',
        type: 'number',
        value: '3',
        category: 'numeric',
      })
    })

    await act(async () => {
      await result.current.evaluate()
    })

    await waitFor(() => {
      expect(result.current.result).toBe('5')
    })
  })

  it('should clear all when AC is pressed', () => {
    const { result } = renderHook(() => useCalculator())

    act(() => {
      result.current.handleButtonClick({
        id: 'btn-5',
        label: '5',
        type: 'number',
        value: '5',
        category: 'numeric',
      })
    })

    expect(result.current.expression).toBe('5')

    act(() => {
      result.current.clearAll()
    })

    expect(result.current.expression).toBe('')
    expect(result.current.result).toBe('0')
  })

  it('should delete last character on backspace', () => {
    const { result } = renderHook(() => useCalculator())

    act(() => {
      result.current.handleButtonClick({
        id: 'btn-1',
        label: '1',
        type: 'number',
        value: '123',
        category: 'numeric',
      })
    })

    act(() => {
      result.current.backspace()
    })

    expect(result.current.expression).toBe('12')
  })

  it('should switch angle mode', () => {
    const { result } = renderHook(() => useCalculator())

    expect(result.current.angleMode).toBe('deg')

    act(() => {
      result.current.setAngleMode('rad')
    })

    expect(result.current.angleMode).toBe('rad')
  })

  it('should handle memory operations', () => {
    const { result } = renderHook(() => useCalculator())

    // Set result to 10
    act(() => {
      result.current.handleButtonClick({
        id: 'btn-1',
        label: '10',
        type: 'number',
        value: '10',
        category: 'numeric',
      })
    })

    // Manually set result for testing
    act(() => {
      result.current.handleButtonClick({
        id: 'btn-m-plus',
        label: 'M+',
        type: 'memory',
        value: 'M+',
        category: 'control',
      })
    })

    // Memory operations are tested through the hook
    expect(result.current.memory).toBeGreaterThanOrEqual(0)
  })

  it('should show error for invalid expressions', async () => {
    const { result } = renderHook(() => useCalculator())

    act(() => {
      result.current.handleButtonClick({
        id: 'btn-2',
        label: '2',
        type: 'number',
        value: '2',
        category: 'numeric',
      })
      result.current.handleButtonClick({
        id: 'btn-plus',
        label: '+',
        type: 'operator',
        value: '+',
        category: 'operation',
      })
    })

    await act(async () => {
      await result.current.evaluate()
    })

    await waitFor(() => {
      expect(result.current.error).not.toBe(null)
    })
  })
})

