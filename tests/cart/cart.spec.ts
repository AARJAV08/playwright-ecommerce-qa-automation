import { test, expect } from '../../src/fixtures';
import { PRODUCTS } from '../../src/data/products';

test.describe('Shopping cart', () => {
  test.beforeEach(async ({ inventoryPage }) => {
    await inventoryPage.goto();
  });

  test('adding a product updates the cart badge @smoke @regression', async ({ inventoryPage }) => {
    await inventoryPage.addToCart(PRODUCTS.backpack.name);

    await expect(inventoryPage.cartBadge).toHaveText('1');
  });

  test('added product appears in the cart @smoke @regression', async ({
    inventoryPage,
    cartPage,
  }) => {
    await inventoryPage.addToCart(PRODUCTS.backpack.name);
    await inventoryPage.openCart();

    await expect(cartPage.items).toHaveCount(1);
    expect(await cartPage.getItemNames()).toEqual([PRODUCTS.backpack.name]);
  });

  test('multiple products can be added @regression', async ({ inventoryPage, cartPage }) => {
    await inventoryPage.addToCart(PRODUCTS.backpack.name);
    await inventoryPage.addToCart(PRODUCTS.bikeLight.name);
    await inventoryPage.addToCart(PRODUCTS.boltTShirt.name);

    await expect(inventoryPage.cartBadge).toHaveText('3');
    await inventoryPage.openCart();

    expect(await cartPage.getItemNames()).toEqual([
      PRODUCTS.backpack.name,
      PRODUCTS.bikeLight.name,
      PRODUCTS.boltTShirt.name,
    ]);
  });

  test('product can be removed from the catalog page @regression', async ({ inventoryPage }) => {
    await inventoryPage.addToCart(PRODUCTS.onesie.name);
    await expect(inventoryPage.cartBadge).toHaveText('1');

    await inventoryPage.removeFromCart(PRODUCTS.onesie.name);

    await expect(inventoryPage.cartBadge).toBeHidden();
  });

  test('product can be removed from the cart page @regression', async ({
    inventoryPage,
    cartPage,
  }) => {
    await inventoryPage.addToCart(PRODUCTS.backpack.name);
    await inventoryPage.addToCart(PRODUCTS.fleeceJacket.name);
    await inventoryPage.openCart();

    await cartPage.removeItem(PRODUCTS.backpack.name);

    await expect(cartPage.items).toHaveCount(1);
    expect(await cartPage.getItemNames()).toEqual([PRODUCTS.fleeceJacket.name]);
  });

  test('cart contents persist after a page reload @regression', async ({
    inventoryPage,
    cartPage,
    page,
  }) => {
    await inventoryPage.addToCart(PRODUCTS.redTShirt.name);
    await inventoryPage.openCart();

    await page.reload();

    expect(await cartPage.getItemNames()).toEqual([PRODUCTS.redTShirt.name]);
  });

  test('continue shopping returns to the catalog @regression', async ({
    inventoryPage,
    cartPage,
    page,
  }) => {
    await inventoryPage.openCart();
    await cartPage.continueShopping();

    await expect(page).toHaveURL(/inventory\.html/);
  });
});
