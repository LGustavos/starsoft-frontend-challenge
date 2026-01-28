import { test, expect } from '@playwright/test';

test.describe('Cart', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for NFT cards to load
    await expect(page.locator('article').first()).toBeVisible({ timeout: 10000 });
  });

  test('should open cart drawer when cart button is clicked', async ({ page }) => {
    // Click the cart button in header
    const cartButton = page.locator('header').getByRole('button');
    await cartButton.click();

    // Cart drawer should be visible
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByText('Mochila de Compras')).toBeVisible();
  });

  test('should show empty cart message initially', async ({ page }) => {
    const cartButton = page.locator('header').getByRole('button');
    await cartButton.click();

    await expect(page.getByText('Sua mochila está vazia')).toBeVisible();
  });

  test('should add item to cart when "Comprar" is clicked', async ({ page }) => {
    // Click buy button on first NFT
    const firstCard = page.locator('article').first();
    const buyButton = firstCard.getByRole('button');
    await buyButton.click();

    // Button should change to "Adicionado"
    await expect(buyButton).toContainText(/adicionado/i);

    // Open cart
    const cartButton = page.locator('header').getByRole('button');
    await cartButton.click();

    // Cart should have the item
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByText('Sua mochila está vazia')).not.toBeVisible();
  });

  test('should update cart counter when items are added', async ({ page }) => {
    // Add first NFT
    const firstCard = page.locator('article').first();
    await firstCard.getByRole('button').click();

    // Cart counter should show 1
    const cartButton = page.locator('header').getByRole('button');
    await expect(cartButton).toContainText('1');
  });

  test('should close cart when back button is clicked', async ({ page }) => {
    // Open cart
    const cartButton = page.locator('header').getByRole('button');
    await cartButton.click();

    await expect(page.getByRole('dialog')).toBeVisible();

    // Click back button
    const backButton = page.getByRole('button', { name: /voltar/i });
    await backButton.click();

    // Cart should be closed
    await expect(page.getByRole('dialog')).not.toBeVisible();
  });

  test('should close cart when pressing Escape', async ({ page }) => {
    // Open cart
    const cartButton = page.locator('header').getByRole('button');
    await cartButton.click();

    await expect(page.getByRole('dialog')).toBeVisible();

    // Press Escape
    await page.keyboard.press('Escape');

    // Cart should be closed
    await expect(page.getByRole('dialog')).not.toBeVisible();
  });

  test('should increment item quantity when buying same NFT multiple times', async ({
    page,
  }) => {
    // Add first NFT multiple times
    const firstCard = page.locator('article').first();
    const buyButton = firstCard.getByRole('button');

    await buyButton.click();
    await buyButton.click();
    await buyButton.click();

    // Cart counter should show 3
    const cartButton = page.locator('header').getByRole('button');
    await expect(cartButton).toContainText('3');
  });

  test('should show checkout button when cart has items', async ({ page }) => {
    // Add item
    const firstCard = page.locator('article').first();
    await firstCard.getByRole('button').click();

    // Open cart
    const cartButton = page.locator('header').getByRole('button');
    await cartButton.click();

    // Checkout button should be visible
    await expect(page.getByRole('button', { name: /finalizar compra/i })).toBeVisible();
  });

  test('should show total price in cart', async ({ page }) => {
    // Add item
    const firstCard = page.locator('article').first();
    await firstCard.getByRole('button').click();

    // Open cart
    const cartButton = page.locator('header').getByRole('button');
    await cartButton.click();

    // Total should be visible in the cart dialog
    const dialog = page.getByRole('dialog');
    await expect(dialog.getByText('TOTAL')).toBeVisible();
    // Just check that ETH is visible somewhere in the total row area
    await expect(dialog.getByText(/ETH/).first()).toBeVisible();
  });
});

test.describe('Cart Checkout Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('article').first()).toBeVisible({ timeout: 10000 });

    // Add item to cart
    const firstCard = page.locator('article').first();
    await firstCard.getByRole('button').click();

    // Open cart
    const cartButton = page.locator('header').getByRole('button');
    await cartButton.click();
  });

  test('should show loading state when checkout is clicked', async ({ page }) => {
    const dialog = page.getByRole('dialog');
    const checkoutButton = dialog.getByRole('button', { name: /finalizar compra/i });
    await checkoutButton.click();

    // Should show loading text in the button
    await expect(dialog.getByRole('button', { name: /processando/i })).toBeVisible();

    // Button should be disabled
    await expect(dialog.getByRole('button', { name: /processando/i })).toBeDisabled();
  });

  test('should show success state after checkout', async ({ page }) => {
    const dialog = page.getByRole('dialog');
    const checkoutButton = dialog.getByRole('button', { name: /finalizar compra/i });
    await checkoutButton.click();

    // Wait for success (2 seconds loading) - check for the success text in paragraph
    await expect(page.getByRole('paragraph').filter({ hasText: 'Compra finalizada!' })).toBeVisible({ timeout: 5000 });
  });

  test('should clear cart and close drawer after successful checkout', async ({ page }) => {
    const checkoutButton = page.getByRole('button', { name: /finalizar compra/i });
    await checkoutButton.click();

    // Wait for the full checkout flow (2s loading + 2.5s success display)
    await page.waitForTimeout(5000);

    // Cart drawer should be closed
    await expect(page.getByRole('dialog')).not.toBeVisible();

    // Cart counter should be empty/gone
    const cartButton = page.locator('header').getByRole('button');
    // Counter should not show a number or should show 0
    await expect(cartButton).not.toContainText(/^[1-9]/);
  });

  test('complete checkout flow end-to-end', async ({ page }) => {
    // Verify item is in cart
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(dialog.getByText('TOTAL')).toBeVisible();

    // Start checkout
    const checkoutButton = dialog.getByRole('button', { name: /finalizar compra/i });
    await checkoutButton.click();

    // Verify loading state
    await expect(dialog.getByRole('button', { name: /processando/i })).toBeVisible();

    // Verify success state
    await expect(page.getByRole('paragraph').filter({ hasText: 'Compra finalizada!' })).toBeVisible({ timeout: 5000 });

    // Wait for drawer to close
    await page.waitForTimeout(3000);

    // Verify cart is empty and closed
    await expect(dialog).not.toBeVisible();
  });
});
