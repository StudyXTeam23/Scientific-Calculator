/**
 * Button Configuration
 * 
 * Complete configuration for all calculator buttons.
 * Based on the HTML design in stitch/code.html
 */

import type { ButtonConfig } from '@/types'

/**
 * All calculator button configurations
 * 
 * Buttons are ordered to match the 6-column grid layout:
 * - Row 1-3: Scientific functions
 * - Row 4-6: Numbers and operators
 * - Row 7: Equals button (spans 5 columns)
 */
export const BUTTON_CONFIGS: ButtonConfig[] = [
  // ===== Row 1: Trigonometric functions =====
  {
    id: 'btn-sin',
    label: 'sin',
    type: 'function',
    value: 'sin(',
    category: 'scientific',
  },
  {
    id: 'btn-cos',
    label: 'cos',
    type: 'function',
    value: 'cos(',
    category: 'scientific',
  },
  {
    id: 'btn-tan',
    label: 'tan',
    type: 'function',
    value: 'tan(',
    category: 'scientific',
  },
  {
    id: 'btn-log',
    label: 'log',
    type: 'function',
    value: 'log(',
    category: 'scientific',
  },
  {
    id: 'btn-ln',
    label: 'ln',
    type: 'function',
    value: 'ln(',
    category: 'scientific',
  },
  {
    id: 'btn-exp',
    label: 'eˣ',
    type: 'function',
    value: 'exp(',
    category: 'scientific',
  },

  // ===== Row 2: Powers and roots =====
  {
    id: 'btn-pow',
    label: 'xʸ',
    type: 'operator',
    value: '^',
    category: 'scientific',
  },
  {
    id: 'btn-sqrt',
    label: 'sqrt',
    type: 'function',
    value: 'sqrt(',
    category: 'scientific',
  },
  {
    id: 'btn-cbrt',
    label: 'cbrt',
    type: 'function',
    value: 'cbrt(',
    category: 'scientific',
  },
  {
    id: 'btn-abs',
    label: 'abs',
    type: 'function',
    value: 'abs(',
    category: 'scientific',
  },
  {
    id: 'btn-round',
    label: 'round',
    type: 'function',
    value: 'round(',
    category: 'scientific',
  },
  {
    id: 'btn-floor',
    label: 'floor',
    type: 'function',
    value: 'floor(',
    category: 'scientific',
  },

  // ===== Row 3: More functions =====
  {
    id: 'btn-ceil',
    label: 'ceil',
    type: 'function',
    value: 'ceil(',
    category: 'scientific',
  },
  {
    id: 'btn-mod',
    label: 'mod',
    type: 'function',
    value: ' mod ',
    category: 'scientific',
  },
  {
    id: 'btn-pi',
    label: 'π',
    type: 'constant',
    value: 'π',
    category: 'scientific',
  },
  {
    id: 'btn-factorial',
    label: '!',
    type: 'operator',
    value: '!',
    category: 'scientific',
  },
  {
    id: 'btn-back',
    label: '⌫',
    type: 'control',
    value: 'Back',
    category: 'control',
    className: 'text-primary',
  },
  {
    id: 'btn-ac',
    label: 'AC',
    type: 'control',
    value: 'AC',
    category: 'control',
    className: 'text-primary',
  },

  // ===== Row 4: Parentheses and numbers 7-9 =====
  {
    id: 'btn-lparen',
    label: '(',
    type: 'special',
    value: '(',
    category: 'operation',
  },
  {
    id: 'btn-rparen',
    label: ')',
    type: 'special',
    value: ')',
    category: 'operation',
  },
  {
    id: 'btn-7',
    label: '7',
    type: 'number',
    value: '7',
    category: 'numeric',
  },
  {
    id: 'btn-8',
    label: '8',
    type: 'number',
    value: '8',
    category: 'numeric',
  },
  {
    id: 'btn-9',
    label: '9',
    type: 'number',
    value: '9',
    category: 'numeric',
  },
  {
    id: 'btn-divide',
    label: '÷',
    type: 'operator',
    value: '÷',
    category: 'operation',
    className: 'text-primary',
  },

  // ===== Row 5: Ans, EE and numbers 4-6 =====
  {
    id: 'btn-ans',
    label: 'Ans',
    type: 'special',
    value: 'Ans',
    category: 'control',
  },
  {
    id: 'btn-ee',
    label: 'EE',
    type: 'function',
    value: 'e',
    category: 'scientific',
  },
  {
    id: 'btn-4',
    label: '4',
    type: 'number',
    value: '4',
    category: 'numeric',
  },
  {
    id: 'btn-5',
    label: '5',
    type: 'number',
    value: '5',
    category: 'numeric',
  },
  {
    id: 'btn-6',
    label: '6',
    type: 'number',
    value: '6',
    category: 'numeric',
  },
  {
    id: 'btn-multiply',
    label: '×',
    type: 'operator',
    value: '×',
    category: 'operation',
    className: 'text-primary',
  },

  // ===== Row 6: Memory and numbers 1-3 =====
  {
    id: 'btn-mr',
    label: 'MR',
    type: 'memory',
    value: 'MR',
    category: 'control',
  },
  {
    id: 'btn-m-minus',
    label: 'M-',
    type: 'memory',
    value: 'M-',
    category: 'control',
  },
  {
    id: 'btn-1',
    label: '1',
    type: 'number',
    value: '1',
    category: 'numeric',
  },
  {
    id: 'btn-2',
    label: '2',
    type: 'number',
    value: '2',
    category: 'numeric',
  },
  {
    id: 'btn-3',
    label: '3',
    type: 'number',
    value: '3',
    category: 'numeric',
  },
  {
    id: 'btn-minus',
    label: '-',
    type: 'operator',
    value: '-',
    category: 'operation',
    className: 'text-primary',
  },

  // ===== Row 7: M+, RND, 0, dot, plus =====
  {
    id: 'btn-m-plus',
    label: 'M+',
    type: 'memory',
    value: 'M+',
    category: 'control',
  },
  {
    id: 'btn-rnd',
    label: 'RND',
    type: 'function',
    value: 'random()',
    category: 'control',
  },
  {
    id: 'btn-0',
    label: '0',
    type: 'number',
    value: '0',
    category: 'numeric',
    gridColumn: 'col-span-2', // Spans 2 columns
  },
  {
    id: 'btn-dot',
    label: '.',
    type: 'operator',
    value: '.',
    category: 'numeric',
  },
  {
    id: 'btn-plus',
    label: '+',
    type: 'operator',
    value: '+',
    category: 'operation',
    className: 'text-primary',
  },

  // ===== Row 8: Equals button (spans 5 columns) and EXP =====
  {
    id: 'btn-equals',
    label: '=',
    type: 'control',
    value: '=',
    category: 'control',
    gridColumn: 'col-span-5', // Spans 5 columns
  },
  {
    id: 'btn-exp10',
    label: 'EXP',
    type: 'function',
    value: '* 10^',
    category: 'scientific',
    gridColumn: 'col-span-1', // Explicitly set to 1 column
  },
]

/**
 * Get button configuration by ID
 */
export function getButtonById(id: string): ButtonConfig | undefined {
  return BUTTON_CONFIGS.find((btn) => btn.id === id)
}

/**
 * Get buttons by category
 */
export function getButtonsByCategory(category: string): ButtonConfig[] {
  return BUTTON_CONFIGS.filter((btn) => btn.category === category)
}

/**
 * Get buttons by type
 */
export function getButtonsByType(type: string): ButtonConfig[] {
  return BUTTON_CONFIGS.filter((btn) => btn.type === type)
}

/**
 * Total number of buttons
 */
export const TOTAL_BUTTONS = BUTTON_CONFIGS.length // 48 buttons

