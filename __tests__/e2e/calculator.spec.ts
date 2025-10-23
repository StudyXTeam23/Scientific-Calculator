/**
 * Calculator E2E Tests
 */

import { test, expect } from '@playwright/test'

test.describe('Scientific Calculator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should display calculator correctly', async ({ page }) => {
    // Check if calculator is visible
    await expect(page.locator('[data-testid="expression-display"]')).toBeVisible()
    await expect(page.locator('[data-testid="result-display"]')).toBeVisible()
    
    // Check initial state
    await expect(page.locator('[data-testid="result-display"]')).toHaveText('0')
  })

  test('should perform basic calculation: 2 + 3', async ({ page }) => {
    // Click buttons
    await page.click('button:has-text("2")')
    await page.click('button:has-text("+")')
    await page.click('button:has-text("3")')
    await page.click('button:has-text("=")')
    
    // Verify result
    await expect(page.locator('[data-testid="result-display"]')).toHaveText('5')
  })

  test('should perform multiplication: 7 × 8', async ({ page }) => {
    await page.click('button:has-text("7")')
    await page.click('button:has-text("×")')
    await page.click('button:has-text("8")')
    await page.click('button:has-text("=")')
    
    await expect(page.locator('[data-testid="result-display"]')).toHaveText('56')
  })

  test('should handle keyboard input', async ({ page }) => {
    // Type expression using keyboard
    await page.keyboard.type('5*6')
    await page.keyboard.press('Enter')
    
    // Verify result
    await expect(page.locator('[data-testid="result-display"]')).toHaveText('30')
  })

  test('should clear expression with AC', async ({ page }) => {
    // Enter some numbers
    await page.click('button:has-text("1")')
    await page.click('button:has-text("2")')
    await page.click('button:has-text("3")')
    
    // Verify expression is shown
    const expression = await page.locator('[data-testid="expression-display"]').textContent()
    expect(expression).toContain('123')
    
    // Click AC
    await page.click('button:has-text("AC")')
    
    // Verify cleared
    await expect(page.locator('[data-testid="result-display"]')).toHaveText('0')
  })

  test('should delete last character with backspace', async ({ page }) => {
    // Enter numbers
    await page.click('button:has-text("1")')
    await page.click('button:has-text("2")')
    await page.click('button:has-text("3")')
    
    // Press backspace button
    await page.click('button:has-text("⌫")')
    
    // Verify last character is removed
    const expression = await page.locator('[data-testid="expression-display"]').textContent()
    expect(expression).toBe('12')
  })

  test('should switch between Deg and Rad modes', async ({ page }) => {
    // Check Deg is selected by default
    const degInput = page.locator('input[value="deg"]')
    await expect(degInput).toBeChecked()
    
    // Click Rad
    await page.click('label:has-text("Rad")')
    
    // Verify Rad is selected
    const radInput = page.locator('input[value="rad"]')
    await expect(radInput).toBeChecked()
  })

  test('should handle scientific function: sqrt(16)', async ({ page }) => {
    await page.click('button:has-text("sqrt")')
    await page.click('button:has-text("1")')
    await page.click('button:has-text("6")')
    await page.click('button:has-text(")")')
    await page.click('button:has-text("=")')
    
    await expect(page.locator('[data-testid="result-display"]')).toHaveText('4')
  })

  test('should show error for division by zero', async ({ page }) => {
    await page.click('button:has-text("1")')
    await page.click('button:has-text("÷")')
    await page.click('button:has-text("0")')
    await page.click('button:has-text("=")')
    
    // Should show error
    const result = await page.locator('[data-testid="result-display"]').textContent()
    expect(result).toContain('Error')
  })

  test('should handle decimal numbers', async ({ page }) => {
    await page.click('button:has-text("3")')
    await page.click('button:has-text(".")')
    await page.click('button:has-text("1")')
    await page.click('button:has-text("4")')
    await page.click('button:has-text("+")')
    await page.click('button:has-text("2")')
    await page.click('button:has-text("=")')
    
    const result = await page.locator('[data-testid="result-display"]').textContent()
    expect(parseFloat(result || '0')).toBeCloseTo(5.14, 1)
  })

  test('should handle complex expressions with parentheses', async ({ page }) => {
    // (2 + 3) × 4 = 20
    await page.click('button:has-text("(")')
    await page.click('button:has-text("2")')
    await page.click('button:has-text("+")')
    await page.click('button:has-text("3")')
    await page.click('button:has-text(")")')
    await page.click('button:has-text("×")')
    await page.click('button:has-text("4")')
    await page.click('button:has-text("=")')
    
    await expect(page.locator('[data-testid="result-display"]')).toHaveText('20')
  })

  test('should be responsive on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    
    // Calculator should still be visible and functional
    await expect(page.locator('[data-testid="result-display"]')).toBeVisible()
    
    // Test a calculation
    await page.click('button:has-text("9")')
    await page.click('button:has-text("+")')
    await page.click('button:has-text("1")')
    await page.click('button:has-text("=")')
    
    await expect(page.locator('[data-testid="result-display"]')).toHaveText('10')
  })
})

