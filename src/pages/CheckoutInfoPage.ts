import { Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { CustomerInfo } from '../data/checkout';

export class CheckoutInfoPage extends BasePage {
  readonly path = '/checkout-step-one.html';

  readonly firstNameInput: Locator = this.page.getByTestId('firstName');
  readonly lastNameInput: Locator = this.page.getByTestId('lastName');
  readonly postalCodeInput: Locator = this.page.getByTestId('postalCode');
  readonly continueButton: Locator = this.page.getByTestId('continue');
  readonly cancelButton: Locator = this.page.getByTestId('cancel');
  readonly errorMessage: Locator = this.page.getByTestId('error');

  /** Fills any provided fields; omitted fields are left empty (useful for validation tests). */
  async fillInfo(info: Partial<CustomerInfo>): Promise<void> {
    if (info.firstName !== undefined) await this.firstNameInput.fill(info.firstName);
    if (info.lastName !== undefined) await this.lastNameInput.fill(info.lastName);
    if (info.postalCode !== undefined) await this.postalCodeInput.fill(info.postalCode);
  }

  async continue(): Promise<void> {
    await this.continueButton.click();
  }

  async submit(info: Partial<CustomerInfo>): Promise<void> {
    await this.fillInfo(info);
    await this.continue();
  }
}
