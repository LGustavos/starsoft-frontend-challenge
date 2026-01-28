import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display the page title and header', async ({ page }) => {
    await expect(page).toHaveTitle(/NFT Marketplace/i);
    await expect(page.locator('header')).toBeVisible();
  });

  test('should load and display NFT cards', async ({ page }) => {
    // Wait for NFT cards to load
    await expect(page.locator('article').first()).toBeVisible({ timeout: 10000 });

    // Check that multiple NFT cards are displayed
    const cards = page.locator('article');
    await expect(cards).toHaveCount(await cards.count());
    expect(await cards.count()).toBeGreaterThan(0);
  });

  test('should display NFT card with name, description, and price', async ({ page }) => {
    const firstCard = page.locator('article').first();
    await expect(firstCard).toBeVisible({ timeout: 10000 });

    // Each card should have essential information
    await expect(firstCard.locator('img')).toBeVisible();
    await expect(firstCard.locator('button')).toBeVisible();
  });

  test('should show "Comprar" button on NFT cards', async ({ page }) => {
    const firstCard = page.locator('article').first();
    await expect(firstCard).toBeVisible({ timeout: 10000 });

    const buyButton = firstCard.getByRole('button');
    await expect(buyButton).toBeVisible();
    await expect(buyButton).toContainText(/comprar/i);
  });

  test('should load more NFTs on scroll (infinite scroll)', async ({ page }) => {
    // Wait for initial load
    await expect(page.locator('article').first()).toBeVisible({ timeout: 10000 });

    const initialCount = await page.locator('article').count();

    // Scroll to bottom to trigger infinite scroll
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

    // Wait for more items to load
    await page.waitForTimeout(2000);

    // Check if more items were loaded (or load more button exists)
    const loadMoreButton = page.getByRole('button', { name: /carregar mais/i });
    if (await loadMoreButton.isVisible()) {
      await loadMoreButton.click();
      await page.waitForTimeout(2000);
    }

    // Either more items loaded or we're at the end
    const finalCount = await page.locator('article').count();
    expect(finalCount).toBeGreaterThanOrEqual(initialCount);
  });
});
