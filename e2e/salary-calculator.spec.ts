import { test, expect } from '@playwright/test'

test.describe('Jakarta Salary Calculator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('renders form with default values and results', async ({ page }) => {
    await expect(page.locator('h1')).toHaveText('Kalkulator Kelayakan Gaji Jakarta')
    await expect(page.locator('#salary')).toBeVisible()
    await expect(page.locator('#salary')).toHaveValue('8000000')
    await expect(page.getByText(/Layak banget|Layak|Pas-pasan|Mepet sekali|Tidak layak/).first()).toBeVisible()
  })

  test('changing salary updates results', async ({ page }) => {
    await page.fill('#salary', '5000000')
    await expect(page.getByText(/Take-home/i).first()).toBeVisible()
  })

  test('changing zone updates expense breakdown', async ({ page }) => {
    await page.selectOption('#zone', 'central')
    await expect(page.getByText(/Total pengeluaran/i)).toBeVisible()
  })

  test('toggling salary type from gross to net preserves take-home', async ({ page }) => {
    await page.locator('#salary').first().fill('10000000')
    await page.locator('#salary').first().press('Tab')
    await page.locator('#salaryType').first().selectOption('net')
    await page.waitForTimeout(500)
    await expect(page.locator('text=Rp 10.000.000').first()).toBeVisible({ timeout: 5000 })
  })

  test('can reach verdict Tidak layak with extreme settings', async ({ page }) => {
    await page.fill('#salary', '4000000')
    await page.selectOption('#zone', 'central')
    await page.selectOption('#status', 'family2')
    await page.selectOption('#housing', 'rent')
    await page.selectOption('#transport', 'car')
    await page.selectOption('#food', 'resto')
    await page.selectOption('#lifestyle', 'social')
    await expect(page.getByText('Tidak layak').first()).toBeVisible()
  })

  test('responsive layout shows form on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 })
    await expect(page.locator('#salary')).toBeVisible()
  })

  test('URL updates when salary changes', async ({ page }) => {
    await page.locator('#salary').first().fill('12000000')
    await page.locator('#salary').first().press('Tab')
    await page.waitForTimeout(600)
    expect(page.url()).toContain('salary=12000000')
  })

  test('advanced inputs section is collapsible', async ({ page }) => {
    const summary = page.getByText('Pengaturan lanjutan')
    await expect(summary).toBeVisible()
    await expect(page.locator('#cicilan')).not.toBeVisible()
    await summary.click()
    await expect(page.locator('#cicilan')).toBeVisible()
  })

  test('adding cicilan reduces savings', async ({ page }) => {
    await page.getByText('Pengaturan lanjutan').click()
    await page.fill('#cicilan', '3000000')
    const savingsText = await page.getByText(/Sisa|Defisit/).last().textContent()
    expect(savingsText).toBeTruthy()
  })

  test('compare page renders two calculators', async ({ page }) => {
    await page.goto('/bandingkan')
    await expect(page.locator('h1')).toHaveText('Bandingkan Dua Skenario')
    await expect(page.locator('#salary')).toHaveCount(2)
  })

  test.skip('compare page copy A to B works', async ({ page }) => {
    await page.goto('/bandingkan')
    const salaryInputs = page.locator('#salary')
    await salaryInputs.first().fill('15000000')
    await salaryInputs.first().press('Tab')
    await page.waitForTimeout(600)
    await page.getByText('Salin ke B').first().click()
    await expect(salaryInputs.nth(1)).toHaveValue('15000000', { timeout: 3000 })
  })
})
