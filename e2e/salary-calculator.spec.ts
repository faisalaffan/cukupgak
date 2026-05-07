import { test, expect } from '@playwright/test'

test.describe('Jakarta Salary Calculator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('renders form with default values and results', async ({ page }) => {
    await expect(page.locator('h1')).toHaveText('Kalkulator Kelayakan Gaji Jakarta')
    await expect(page.locator('#salary')).toBeVisible()
    await expect(page.locator('#salary')).toHaveValue('8000000')
    await expect(page.getByText(/Layak banget|Layak|Pas-pasan|Mepet sekali|Tidak layak/)).toBeVisible()
  })

  test('changing salary updates results', async ({ page }) => {
    await page.fill('#salary', '5000000')
    await expect(page.getByText(/Take-home/i)).toBeVisible()
  })

  test('changing zone updates expense breakdown', async ({ page }) => {
    await page.selectOption('#zone', 'central')
    await expect(page.getByText(/Total pengeluaran/i)).toBeVisible()
  })

  test('toggling salary type from gross to net preserves take-home', async ({ page }) => {
    await page.fill('#salary', '10000000')
    await page.selectOption('#salaryType', 'net')
    await expect(page.getByText('Rp 10.000.000')).toBeVisible()
  })

  test('can reach verdict Tidak layak with extreme settings', async ({ page }) => {
    await page.fill('#salary', '4000000')
    await page.selectOption('#zone', 'central')
    await page.selectOption('#status', 'family2')
    await page.selectOption('#housing', 'rent')
    await page.selectOption('#transport', 'car')
    await page.selectOption('#food', 'resto')
    await page.selectOption('#lifestyle', 'social')
    await expect(page.getByText('Tidak layak')).toBeVisible()
  })

  test('responsive layout shows form on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 })
    await expect(page.locator('#salary')).toBeVisible()
  })
})
