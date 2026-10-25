import { Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { parsePrice, toSlug } from '../utils/helpers';

export type SortOption = 'az' | 'za' | 'lohi' | 'hilo';

export class InventoryPage extends BasePage {
  readonly path = '/inventory.html';

  readonly title: Locator = this.page.getByTestId('title');
  readonly items: Locator = this.page.getByTestId('inventory-item');
  readonly sortDropdown: Locator = this.page.getByTestId('product-sort-container');
  readonly cartLink: Locator = this.page.getByTestId('shopping-cart-link');
  readonly cartBadge: Locator = this.page.getByTestId('shopping-cart-badge');
  readonly menuButton: Locator = this.page.getByRole('button', { name: 'Open Menu' });
  readonly logoutLink: Locator = this.page.getByTestId('logout-sidebar-link');

  async addToCart(productName: string): Promise<void> {
    await this.page.getByTestId(`add-to-cart-${toSlug(productName)}`).click();
  }

  async removeFromCart(productName: string): Promise<void> {
    await this.page.getByTestId(`remove-${toSlug(productName)}`).click();
  }

  async openCart(): Promise<void> {
    await this.cartLink.click();
  }

  async openProduct(productName: string): Promise<void> {
    await this.page.getByTestId('inventory-item-name').filter({ hasText: productName }).click();
  }

  async sortBy(option: SortOption): Promise<void> {
    await this.sortDropdown.selectOption(option);
  }

  async getProductNames(): Promise<string[]> {
    return this.page.getByTestId('inventory-item-name').allTextContents();
  }

  async getProductPrices(): Promise<number[]> {
    const prices = await this.page.getByTestId('inventory-item-price').allTextContents();
    return prices.map(parsePrice);
  }

  /** Number shown on the cart badge, or 0 when the badge is hidden. */
  async getCartCount(): Promise<number> {
    if (!(await this.cartBadge.isVisible())) return 0;
    return Number(await this.cartBadge.innerText());
  }

  async logout(): Promise<void> {
    await this.menuButton.click();
    await this.logoutLink.click();
  }
}
