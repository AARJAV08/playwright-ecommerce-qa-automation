import { test as setup, expect } from '@playwright/test';
import { LoginPage } from '../src/pages/LoginPage';
import { InventoryPage } from '../src/pages/InventoryPage';
import { USERS } from '../src/data/users';
import { AUTH_FILE } from '../src/data/constants';

// Tagged so that filtered runs (--grep @smoke / @regression) still execute the login set-up
setup('authenticate as standard_user @smoke @regression', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const inventoryPage = new InventoryPage(page);

  await loginPage.goto();
  await loginPage.loginAs(USERS.standard);
  await expect(inventoryPage.title).toHaveText('Products');

  await page.context().storageState({ path: AUTH_FILE });
});
