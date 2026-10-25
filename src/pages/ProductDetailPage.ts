import { Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProductDetailPage extends BasePage {
  readonly path = '/inventory-item.html';

  readonly name: Locator = this.page.getByTestId('inventory-item-name');
  readonly price: Locator = this.page.getByTestId('inventory-item-price');
  readonly description: Locator = this.page.getByTestId('inventory-item-desc');
  readonly backButton: Locator = this.page.getByTestId('back-to-products');
}
