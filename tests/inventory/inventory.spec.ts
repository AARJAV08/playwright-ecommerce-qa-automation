import { test, expect } from '../../src/fixtures';
import { ALL_PRODUCTS, PRODUCTS } from '../../src/data/products';
import { SortOption } from '../../src/pages/InventoryPage';

test.describe('Product catalog', () => {
  test.beforeEach(async ({ inventoryPage }) => {
    await inventoryPage.goto();
  });

  test('displays all products with correct name and price @smoke @regression', async ({
    inventoryPage,
  }) => {
    await expect(inventoryPage.items).toHaveCount(ALL_PRODUCTS.length);

    const names = await inventoryPage.getProductNames();
    const prices = await inventoryPage.getProductPrices();

    for (const product of ALL_PRODUCTS) {
      const index = names.indexOf(product.name);
      expect(index, `${product.name} should be listed`).toBeGreaterThanOrEqual(0);
      expect(prices[index], `${product.name} price`).toBe(product.price);
    }
  });

  test('opens the product detail page @regression', async ({ inventoryPage, productDetailPage, page }) => {
    await inventoryPage.openProduct(PRODUCTS.backpack.name);

    await expect(page).toHaveURL(/inventory-item\.html/);
    await expect(productDetailPage.name).toHaveText(PRODUCTS.backpack.name);
    await expect(productDetailPage.price).toHaveText(`$${PRODUCTS.backpack.price}`);
    await expect(productDetailPage.description).not.toBeEmpty();
  });

  test('back button returns to the catalog @regression', async ({
    inventoryPage,
    productDetailPage,
    page,
  }) => {
    await inventoryPage.openProduct(PRODUCTS.onesie.name);
    await productDetailPage.backButton.click();

    await expect(page).toHaveURL(/inventory\.html/);
    await expect(inventoryPage.items).toHaveCount(ALL_PRODUCTS.length);
  });

  const sortCases: { option: SortOption; label: string }[] = [
    { option: 'az', label: 'Name (A to Z)' },
    { option: 'za', label: 'Name (Z to A)' },
    { option: 'lohi', label: 'Price (low to high)' },
    { option: 'hilo', label: 'Price (high to low)' },
  ];

  for (const { option, label } of sortCases) {
    test(`sorts products by ${label} @regression`, async ({ inventoryPage }) => {
      await inventoryPage.sortBy(option);

      if (option === 'az' || option === 'za') {
        const names = await inventoryPage.getProductNames();
        const expected = [...names].sort((a, b) => a.localeCompare(b));
        if (option === 'za') expected.reverse();
        expect(names).toEqual(expected);
      } else {
        const prices = await inventoryPage.getProductPrices();
        const expected = [...prices].sort((a, b) => a - b);
        if (option === 'hilo') expected.reverse();
        expect(prices).toEqual(expected);
      }
    });
  }
});
