import { Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class CheckoutCompletePage extends BasePage {
  readonly path = '/checkout-complete.html';

  readonly header: Locator = this.page.getByTestId('complete-header');
  readonly text: Locator = this.page.getByTestId('complete-text');
  readonly backHomeButton: Locator = this.page.getByTestId('back-to-products');
}
