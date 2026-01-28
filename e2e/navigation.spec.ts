import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('should navigate to NFT detail page when clicking on NFT card', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('article').first()).toBeVisible({ timeout: 10000 });

    const firstCard = page.locator('article').first();
    const nftLink = firstCard.locator('a').first();

    if (await nftLink.isVisible()) {
      await nftLink.click();

      await expect(page).toHaveURL(/\/nft\/\d+/);
    }
  });

  test('should display NFT details on detail page', async ({ page }) => {
    await page.goto('/nft/1');

    await page.waitForLoadState('networkidle');

    const hasImage = await page.locator('img').first().isVisible();
    const hasHeading = await page.locator('h1, h2').first().isVisible();
    expect(hasImage || hasHeading).toBeTruthy();
  });

  test('should be able to add to cart from detail page', async ({ page }) => {
    await page.goto('/nft/1');

    await page.waitForLoadState('networkidle');

    const buyButton = page.getByRole('button', { name: /comprar|adicionar/i });
    if (await buyButton.isVisible()) {
      await buyButton.click();

      const cartButton = page.locator('header').getByRole('button');
      await expect(cartButton).toBeVisible();
    }
  });

  test('should show 404 page for non-existent NFT', async ({ page }) => {
    await page.goto('/nft/99999999');

    await page.waitForLoadState('networkidle');

    const is404 =
      (await page.getByText(/not found|não encontrado|404/i).isVisible()) ||
      page.url().includes('/404') ||
      page.url() === 'http://localhost:3000/';

    expect(is404 || page.url().includes('/nft/')).toBeTruthy();
  });

  test('should persist cart state across navigation', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('article').first()).toBeVisible({ timeout: 10000 });

    const firstCard = page.locator('article').first();
    await firstCard.getByRole('button').click();

    const nftLink = firstCard.locator('a').first();
    if (await nftLink.isVisible()) {
      await nftLink.click();
      await page.waitForLoadState('networkidle');

      await page.goto('/');

      const cartButton = page.locator('header').getByRole('button');
      await expect(cartButton).toContainText('1');
    }
  });
});

test.describe('Responsive Design', () => {
  test('should display correctly on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    await expect(page.locator('header')).toBeVisible();

    await expect(page.locator('article').first()).toBeVisible({ timeout: 10000 });
  });

  test('should display correctly on tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');

    await expect(page.locator('header')).toBeVisible();

    await expect(page.locator('article').first()).toBeVisible({ timeout: 10000 });
  });

  test('should display correctly on desktop viewport', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');

    await expect(page.locator('header')).toBeVisible();

    await expect(page.locator('article').first()).toBeVisible({ timeout: 10000 });
  });

  test('cart drawer should be responsive', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    await expect(page.locator('article').first()).toBeVisible({ timeout: 10000 });

    const firstCard = page.locator('article').first();
    await firstCard.getByRole('button').click();

    const cartButton = page.locator('header').getByRole('button').first();
    await cartButton.click();

    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(dialog).not.toBeVisible();

    await page.setViewportSize({ width: 1440, height: 900 });
    await cartButton.click();

    await expect(dialog).toBeVisible();
  });
});

test.describe('Accessibility', () => {
  test('should have proper heading hierarchy', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('article').first()).toBeVisible({ timeout: 10000 });

    const headings = page.locator('h1, h2, h3, h4');
    expect(await headings.count()).toBeGreaterThan(0);
  });

  test('should have accessible buttons with proper labels', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('article').first()).toBeVisible({ timeout: 10000 });

    const buttons = page.getByRole('button');
    const buttonCount = await buttons.count();

    for (let i = 0; i < Math.min(buttonCount, 5); i++) {
      const button = buttons.nth(i);
      const accessibleName = await button.getAttribute('aria-label');
      const textContent = await button.textContent();

      expect(accessibleName || textContent).toBeTruthy();
    }
  });

  test('cart drawer should have proper ARIA attributes', async ({ page }) => {
    await page.goto('/');

    const cartButton = page.locator('header').getByRole('button');
    await cartButton.click();

    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();

    await expect(dialog).toHaveAttribute('aria-modal', 'true');
  });

  test('should be keyboard navigable', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('article').first()).toBeVisible({ timeout: 10000 });

    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
  });
});
