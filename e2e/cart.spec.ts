import { test, expect } from '@playwright/test';

test.describe('Cart', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('article').first()).toBeVisible({ timeout: 10000 });
  });

  test('should open cart drawer when cart button is clicked', async ({ page }) => {
    const cartButton = page.locator('header').getByRole('button');
    await cartButton.click();

    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByText('Mochila de Compras')).toBeVisible();
  });

  test('should show empty cart message initially', async ({ page }) => {
    const cartButton = page.locator('header').getByRole('button');
    await cartButton.click();

    await expect(page.getByText('Sua mochila está vazia')).toBeVisible();
  });

  test('should add item to cart when "Comprar" is clicked', async ({ page }) => {
    const firstCard = page.locator('article').first();
    const buyButton = firstCard.getByRole('button');
    await buyButton.click();

    await expect(buyButton).toContainText(/adicionado/i);

    const cartButton = page.locator('header').getByRole('button');
    await cartButton.click();

    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByText('Sua mochila está vazia')).not.toBeVisible();
  });

  test('should update cart counter when items are added', async ({ page }) => {
    const firstCard = page.locator('article').first();
    await firstCard.getByRole('button').click();

    const cartButton = page.locator('header').getByRole('button');
    await expect(cartButton).toContainText('1');
  });

  test('should close cart when back button is clicked', async ({ page }) => {
    const cartButton = page.locator('header').getByRole('button');
    await cartButton.click();

    await expect(page.getByRole('dialog')).toBeVisible();

    const backButton = page.getByRole('button', { name: /voltar/i });
    await backButton.click();

    await expect(page.getByRole('dialog')).not.toBeVisible();
  });

  test('should close cart when pressing Escape', async ({ page }) => {
    const cartButton = page.locator('header').getByRole('button');
    await cartButton.click();

    await expect(page.getByRole('dialog')).toBeVisible();

    await page.keyboard.press('Escape');

    await expect(page.getByRole('dialog')).not.toBeVisible();
  });

  test('should increment item quantity when buying same NFT multiple times', async ({
    page,
  }) => {
    const firstCard = page.locator('article').first();
    const buyButton = firstCard.getByRole('button');

    await buyButton.click();
    await buyButton.click();
    await buyButton.click();

    const cartButton = page.locator('header').getByRole('button');
    await expect(cartButton).toContainText('3');
  });

  test('should show checkout button when cart has items', async ({ page }) => {
    const firstCard = page.locator('article').first();
    await firstCard.getByRole('button').click();

    const cartButton = page.locator('header').getByRole('button');
    await cartButton.click();

    await expect(page.getByRole('button', { name: /finalizar compra/i })).toBeVisible();
  });

  test('should show total price in cart', async ({ page }) => {
    const firstCard = page.locator('article').first();
    await firstCard.getByRole('button').click();

    const cartButton = page.locator('header').getByRole('button');
    await cartButton.click();

    const dialog = page.getByRole('dialog');
    await expect(dialog.getByText('TOTAL')).toBeVisible();
    await expect(dialog.getByText(/ETH/).first()).toBeVisible();
  });
});

test.describe('Cart Checkout Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('article').first()).toBeVisible({ timeout: 10000 });

    const firstCard = page.locator('article').first();
    await firstCard.getByRole('button').click();

    const cartButton = page.locator('header').getByRole('button');
    await cartButton.click();
  });

  test('should show loading state when checkout is clicked', async ({ page }) => {
    const dialog = page.getByRole('dialog');
    const checkoutButton = dialog.getByRole('button', { name: /finalizar compra/i });
    await checkoutButton.click();

    await expect(dialog.getByRole('button', { name: /processando/i })).toBeVisible();

    await expect(dialog.getByRole('button', { name: /processando/i })).toBeDisabled();
  });

  test('should show success state after checkout', async ({ page }) => {
    const dialog = page.getByRole('dialog');
    const checkoutButton = dialog.getByRole('button', { name: /finalizar compra/i });
    await checkoutButton.click();

    await expect(page.getByRole('paragraph').filter({ hasText: 'Compra finalizada!' })).toBeVisible({ timeout: 5000 });
  });

  test('should clear cart and close drawer after successful checkout', async ({ page }) => {
    const checkoutButton = page.getByRole('button', { name: /finalizar compra/i });
    await checkoutButton.click();

    await page.waitForTimeout(5000);

    await expect(page.getByRole('dialog')).not.toBeVisible();

    const cartButton = page.locator('header').getByRole('button');
    await expect(cartButton).not.toContainText(/^[1-9]/);
  });

  test('complete checkout flow end-to-end', async ({ page }) => {
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(dialog.getByText('TOTAL')).toBeVisible();

    const checkoutButton = dialog.getByRole('button', { name: /finalizar compra/i });
    await checkoutButton.click();

    await expect(dialog.getByRole('button', { name: /processando/i })).toBeVisible();

    await expect(page.getByRole('paragraph').filter({ hasText: 'Compra finalizada!' })).toBeVisible({ timeout: 5000 });

    await page.waitForTimeout(3000);

    await expect(dialog).not.toBeVisible();
  });
});
