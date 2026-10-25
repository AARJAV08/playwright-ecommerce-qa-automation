import { Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { parsePrice } from '../utils/helpers';

export class CheckoutOverviewPage extends BasePage {
  readonly path = '/checkout-step-two.html';

  readonly items: Locator = this.page.getByTestId('inventory-item');
  readonly subtotalLabel: Locator = this.page.getByTestId('subtotal-label');
  readonly taxLabel: Locator = this.page.getByTestId('tax-label');
  readonly totalLabel: Locator = this.page.getByTestId('total-label');
  readonly finishButton: Locator = this.page.getByTestId('finish');

  async getItemNames(): Promise<string[]> {
    return this.page.getByTestId('inventory-item-name').allTextContents();
  }

  async getSubtotal(): Promise<number> {
    return parsePrice(await this.subtotalLabel.innerText());
  }

  async getTax(): Promise<number> {
    return parsePrice(await this.taxLabel.innerText());
  }

  async getTotal(): Promise<number> {
    return parsePrice(await this.totalLabel.innerText());
  }

  async finish(): Promise<void> {
    await this.finishButton.click();
  }
}
