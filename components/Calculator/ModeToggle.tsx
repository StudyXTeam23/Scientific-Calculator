/**
 * ModeToggle Component
 * 
 * Toggles between Degree and Radian modes for trigonometric functions.
 */

'use client'

import type { AngleMode } from '@/types'
import clsx from 'clsx'

interface ModeToggleProps {
  mode: AngleMode
  onChange: (mode: AngleMode) => void
}

/**
 * Angle Mode Toggle (Deg/Rad)
 */
export function ModeToggle({ mode, onChange }: ModeToggleProps) {
  const toggleClass = (isActive: boolean) =>
    clsx(
      'flex cursor-pointer h-full grow items-center justify-center',
      'overflow-hidden rounded-lg px-2 text-sm font-medium',
      'transition-all duration-200',
      {
        'bg-white dark:bg-zinc-700 shadow-sm text-zinc-800 dark:text-white': isActive,
        'text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300':
          !isActive,
      }
    )

  return (
    <div className="flex px-0 py-1">
      <div className="flex h-10 flex-1 items-center justify-center rounded-lg bg-background-light dark:bg-background-dark p-1">
        {/* Deg option */}
        <label className={toggleClass(mode === 'deg')}>
          <span className="truncate">Deg</span>
          <input
            type="radio"
            name="angle-mode"
            value="deg"
            checked={mode === 'deg'}
            onChange={() => onChange('deg')}
            className="invisible w-0"
            aria-label="Degree mode"
          />
        </label>

        {/* Rad option */}
        <label className={toggleClass(mode === 'rad')}>
          <span className="truncate">Rad</span>
          <input
            type="radio"
            name="angle-mode"
            value="rad"
            checked={mode === 'rad'}
            onChange={() => onChange('rad')}
            className="invisible w-0"
            aria-label="Radian mode"
          />
        </label>
      </div>
    </div>
  )
}

