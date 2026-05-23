import { expect, test } from '@playwright/test'

test('worker can build an order, search menu, and review without losing cart', async ({
  page,
}) => {
  await page.goto('/')

  await expect(page.getByText('Connected to Supabase')).toBeVisible()
  await expect(page.getByText('Categories')).toBeVisible()
  await expect(page.getByText('52')).toBeVisible()

  await page.getByRole('combobox', { name: 'Worker' }).selectOption({
    label: 'Vishal',
  })

  await page.getByRole('button', { name: 'Add Tea' }).click()
  await page.getByRole('button', { name: 'Add Tea' }).click()
  await page.getByRole('button', { name: 'Add Allam Tea' }).click()
  await page.getByRole('button', { name: 'Remove Tea' }).click()
  await expect(page.getByText('2 items - ₹50')).toBeVisible()

  await page.getByRole('button', { name: 'Natural Tea 4 items' }).click()
  await expect(page.getByRole('button', { name: 'Add Black Tea' })).toBeHidden()
  await page.getByRole('button', { name: 'Natural Tea 4 items' }).click()
  await expect(page.getByRole('button', { name: 'Add Black Tea' })).toBeVisible()

  await page.getByRole('searchbox', { name: 'Search menu' }).fill('momo')
  await expect(page.getByRole('button', { name: 'Momos 3 matches' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Add Veg Momos' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Add Tea' })).toBeHidden()
  await expect(page.getByText('2 items - ₹50')).toBeVisible()

  await page.getByRole('button', { name: 'Clear search' }).click()
  await expect(page.getByRole('button', { name: 'Add Tea' })).toBeVisible()

  await page.getByRole('searchbox', { name: 'Search menu' }).fill('zzzz')
  await expect(page.getByText('No items found for "zzzz"')).toBeVisible()
  await page.getByRole('button', { name: 'Clear search' }).click()

  await page.getByRole('button', { name: 'Review Order' }).click()
  await expect(page.getByRole('heading', { name: 'Review Order' })).toBeVisible()
  await expect(page.getByText('Vishal')).toBeVisible()
  await expect(page.getByText('Tea', { exact: true })).toBeVisible()
  await expect(page.getByText('Allam Tea', { exact: true })).toBeVisible()
  await expect(page.getByText('Total items')).toBeVisible()
  await expect(page.getByText('₹50')).toBeVisible()

  const submitButton = page.getByRole('button', { name: 'Submit Order' })
  await expect(submitButton).toBeDisabled()
  await page.getByRole('button', { name: 'UPI' }).click()
  await expect(submitButton).toBeEnabled()

  await page.getByRole('button', { name: 'Back', exact: true }).click()
  await expect(page.getByText('2 items - ₹50')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Add Tea' })).toBeVisible()
})
