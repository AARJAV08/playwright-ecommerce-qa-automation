import { Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { toSlug } from '../utils/helpers';

export class CartPage extends BasePage {
  readonly path = '/cart.html';

  readonly title: Locator = this.page.getByTestId('title');
  readonly items: Locator = this.page.getByTestId('inventory-item');
  readonly checkoutButton: Locator = this.page.getByTestId('checkout');
  readonly continueShoppingButton: Locator = this.page.getByTestId('continue-shopping');

  async getItemNames(): Promise<string[]> {
    return this.page.getByTestId('inventory-item-name').allTextContents();
  }

  async removeItem(productName: string): Promise<void> {
    await this.page.getByTestId(`remove-${toSlug(productName)}`).click();
  }

  async proceedToCheckout(): Promise<void> {
    await this.checkoutButton.click();
  }

  async continueShopping(): Promise<void> {
    await this.continueShoppingButton.click();
  }
}
