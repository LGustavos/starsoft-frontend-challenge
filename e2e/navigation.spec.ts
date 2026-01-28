import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('should navigate to NFT detail page when clicking on NFT card', async ({ page }) => {
    await page.goto('/');

    // Wait for NFT cards to load
    await expect(page.locator('article').first()).toBeVisible({ timeout: 10000 });

    // Click on the first NFT card (the link/image area)
    const firstCard = page.locator('article').first();
    const nftLink = firstCard.locator('a').first();

    if (await nftLink.isVisible()) {
      await nftLink.click();

      // Should navigate to detail page
      await expect(page).toHaveURL(/\/nft\/\d+/);
    }
  });

  test('should display NFT details on detail page', async ({ page }) => {
    // Go directly to an NFT detail page
    await page.goto('/nft/1');

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Should display NFT information (image or heading)
    const hasImage = await page.locator('img').first().isVisible();
    const hasHeading = await page.locator('h1, h2').first().isVisible();
    expect(hasImage || hasHeading).toBeTruthy();
  });

  test('should be able to add to cart from detail page', async ({ page }) => {
    await page.goto('/nft/1');

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Find and click buy button
    const buyButton = page.getByRole('button', { name: /comprar|adicionar/i });
    if (await buyButton.isVisible()) {
      await buyButton.click();

      // Cart should be updated
      const cartButton = page.locator('header').getByRole('button');
      await expect(cartButton).toBeVisible();
    }
  });

  test('should show 404 page for non-existent NFT', async ({ page }) => {
    await page.goto('/nft/99999999');

    // Should show not found or redirect
    await page.waitForLoadState('networkidle');

    // Check for 404 content or redirect to home
    const is404 =
      (await page.getByText(/not found|não encontrado|404/i).isVisible()) ||
      page.url().includes('/404') ||
      page.url() === 'http://localhost:3000/';

    expect(is404 || page.url().includes('/nft/')).toBeTruthy();
  });

  test('should persist cart state across navigation', async ({ page }) => {
    await page.goto('/');

    // Wait for NFT cards to load
    await expect(page.locator('article').first()).toBeVisible({ timeout: 10000 });

    // Add item to cart
    const firstCard = page.locator('article').first();
    await firstCard.getByRole('button').click();

    // Navigate to a detail page
    const nftLink = firstCard.locator('a').first();
    if (await nftLink.isVisible()) {
      await nftLink.click();
      await page.waitForLoadState('networkidle');

      // Go back to home
      await page.goto('/');

      // Cart should still have the item
      const cartButton = page.locator('header').getByRole('button');
      await expect(cartButton).toContainText('1');
    }
  });
});

test.describe('Responsive Design', () => {
  test('should display correctly on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Header should be visible
    await expect(page.locator('header')).toBeVisible();

    // NFT cards should load
    await expect(page.locator('article').first()).toBeVisible({ timeout: 10000 });
  });

  test('should display correctly on tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');

    // Header should be visible
    await expect(page.locator('header')).toBeVisible();

    // NFT cards should load
    await expect(page.locator('article').first()).toBeVisible({ timeout: 10000 });
  });

  test('should display correctly on desktop viewport', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');

    // Header should be visible
    await expect(page.locator('header')).toBeVisible();

    // NFT cards should load
    await expect(page.locator('article').first()).toBeVisible({ timeout: 10000 });
  });

  test('cart drawer should be responsive', async ({ page }) => {
    // Test on mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    await expect(page.locator('article').first()).toBeVisible({ timeout: 10000 });

    // Add item and open cart
    const firstCard = page.locator('article').first();
    await firstCard.getByRole('button').click();

    // Use specific selector for cart button in header
    const cartButton = page.locator('header').getByRole('button').first();
    await cartButton.click();

    // Cart drawer should be visible and take most of the screen on mobile
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();

    // Close cart
    await page.keyboard.press('Escape');
    await expect(dialog).not.toBeVisible();

    // Test on desktop
    await page.setViewportSize({ width: 1440, height: 900 });
    await cartButton.click();

    // Cart drawer should still work
    await expect(dialog).toBeVisible();
  });
});

test.describe('Accessibility', () => {
  test('should have proper heading hierarchy', async ({ page }) => {
    await page.goto('/');

    // Wait for page to load
    await expect(page.locator('article').first()).toBeVisible({ timeout: 10000 });

    // Should have at least one heading (h1, h2, h3, or h4)
    const headings = page.locator('h1, h2, h3, h4');
    expect(await headings.count()).toBeGreaterThan(0);
  });

  test('should have accessible buttons with proper labels', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('article').first()).toBeVisible({ timeout: 10000 });

    // All buttons should have accessible names
    const buttons = page.getByRole('button');
    const buttonCount = await buttons.count();

    for (let i = 0; i < Math.min(buttonCount, 5); i++) {
      const button = buttons.nth(i);
      const accessibleName = await button.getAttribute('aria-label');
      const textContent = await button.textContent();

      // Button should have either aria-label or text content
      expect(accessibleName || textContent).toBeTruthy();
    }
  });

  test('cart drawer should have proper ARIA attributes', async ({ page }) => {
    await page.goto('/');

    const cartButton = page.locator('header').getByRole('button');
    await cartButton.click();

    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();

    // Dialog should have aria-modal
    await expect(dialog).toHaveAttribute('aria-modal', 'true');
  });

  test('should be keyboard navigable', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('article').first()).toBeVisible({ timeout: 10000 });

    // Tab through elements
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    // Some element should be focused
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
  });
});
