import { test, expect } from '@playwright/test'

test('simulator page loads', async ({ page }) => {
    await page.goto('http://localhost:3000/simulator')
    await expect(page).toHaveTitle(/ContractLab Pro/i)
})
