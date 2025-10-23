/**
 * useMemory Hook (Optional)
 * 
 * Separate memory management hook for better code organization.
 * This is an optional enhancement to the main useCalculator hook.
 */

'use client'

import { useState, useCallback } from 'react'

interface UseMemoryReturn {
  memory: number
  memoryAdd: (value: number) => void
  memorySubtract: (value: number) => void
  memoryRecall: () => number
  memoryClear: () => void
}

/**
 * Memory management hook
 * 
 * Manages calculator memory operations (M+, M-, MR, MC).
 */
export function useMemory(initialValue: number = 0): UseMemoryReturn {
  const [memory, setMemory] = useState<number>(initialValue)

  /**
   * M+ : Add to memory
   */
  const memoryAdd = useCallback((value: number) => {
    setMemory((prev) => prev + value)
  }, [])

  /**
   * M- : Subtract from memory
   */
  const memorySubtract = useCallback((value: number) => {
    setMemory((prev) => prev - value)
  }, [])

  /**
   * MR : Recall memory value
   */
  const memoryRecall = useCallback(() => {
    return memory
  }, [memory])

  /**
   * MC : Clear memory
   */
  const memoryClear = useCallback(() => {
    setMemory(0)
  }, [])

  return {
    memory,
    memoryAdd,
    memorySubtract,
    memoryRecall,
    memoryClear,
  }
}

