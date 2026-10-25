import { test, expect } from '../../src/fixtures';
import { PRODUCTS } from '../../src/data/products';
import { CUSTOMER } from '../../src/data/checkout';
import { TAX_RATE } from '../../src/data/constants';
import { round2 } from '../../src/utils/helpers';

test.describe('Checkout', () => {
  test.beforeEach(async ({ inventoryPage, cartPage }) => {
    await inventoryPage.goto();
    await inventoryPage.addToCart(PRODUCTS.backpack.name);
    await inventoryPage.addToCart(PRODUCTS.bikeLight.name);
    await inventoryPage.openCart();
    await cartPage.proceedToCheckout();
  });

  test('user can complete an order end to end @smoke @regression', async ({
    checkoutInfoPage,
    checkoutOverviewPage,
    checkoutCompletePage,
    page,
  }) => {
    await checkoutInfoPage.submit(CUSTOMER);

    await expect(page).toHaveURL(/checkout-step-two\.html/);
    expect(await checkoutOverviewPage.getItemNames()).toEqual([
      PRODUCTS.backpack.name,
      PRODUCTS.bikeLight.name,
    ]);

    await checkoutOverviewPage.finish();

    await expect(page).toHaveURL(/checkout-complete\.html/);
    await expect(checkoutCompletePage.header).toHaveText('Thank you for your order!');
  });

  test('order summary calculates item total, tax and total correctly @regression', async ({
    checkoutInfoPage,
    checkoutOverviewPage,
  }) => {
    await checkoutInfoPage.submit(CUSTOMER);

    const expectedSubtotal = round2(PRODUCTS.backpack.price + PRODUCTS.bikeLight.price);
    const subtotal = await checkoutOverviewPage.getSubtotal();
    const tax = await checkoutOverviewPage.getTax();
    const total = await checkoutOverviewPage.getTotal();

    expect(subtotal).toBe(expectedSubtotal);
    expect(tax).toBeCloseTo(round2(expectedSubtotal * TAX_RATE), 2);
    expect(total).toBeCloseTo(round2(subtotal + tax), 2);
  });

  test('first name is required @regression', async ({ checkoutInfoPage }) => {
    await checkoutInfoPage.submit({ lastName: CUSTOMER.lastName, postalCode: CUSTOMER.postalCode });

    await expect(checkoutInfoPage.errorMessage).toContainText('First Name is required');
  });

  test('last name is required @regression', async ({ checkoutInfoPage }) => {
    await checkoutInfoPage.submit({ firstName: CUSTOMER.firstName, postalCode: CUSTOMER.postalCode });

    await expect(checkoutInfoPage.errorMessage).toContainText('Last Name is required');
  });

  test('postal code is required @regression', async ({ checkoutInfoPage }) => {
    await checkoutInfoPage.submit({ firstName: CUSTOMER.firstName, lastName: CUSTOMER.lastName });

    await expect(checkoutInfoPage.errorMessage).toContainText('Postal Code is required');
  });

  test('cancel returns the user to the cart @regression', async ({ checkoutInfoPage, page }) => {
    await checkoutInfoPage.cancelButton.click();

    await expect(page).toHaveURL(/cart\.html/);
  });

  test('cart is emptied after the order is placed @regression', async ({
    checkoutInfoPage,
    checkoutOverviewPage,
    checkoutCompletePage,
    inventoryPage,
  }) => {
    await checkoutInfoPage.submit(CUSTOMER);
    await checkoutOverviewPage.finish();
    await checkoutCompletePage.backHomeButton.click();

    await expect(inventoryPage.cartBadge).toBeHidden();
  });
});
