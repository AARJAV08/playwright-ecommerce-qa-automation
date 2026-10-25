import { test, expect } from '../../src/fixtures';
import { USERS } from '../../src/data/users';

// Login tests must start logged out, so the saved session is cleared.
test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Login', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test('valid user can log in @smoke @regression', async ({ loginPage, inventoryPage, page }) => {
    await loginPage.loginAs(USERS.standard);

    await expect(page).toHaveURL(/inventory\.html/);
    await expect(inventoryPage.title).toHaveText('Products');
  });

  test('locked out user sees an error @regression', async ({ loginPage, page }) => {
    await loginPage.loginAs(USERS.lockedOut);

    await expect(loginPage.errorMessage).toContainText('this user has been locked out');
    await expect(page).not.toHaveURL(/inventory\.html/);
  });

  test('invalid credentials show an error @regression', async ({ loginPage }) => {
    await loginPage.loginAs(USERS.invalid);

    await expect(loginPage.errorMessage).toContainText(
      'Username and password do not match any user in this service',
    );
  });

  test('username is required @regression', async ({ loginPage }) => {
    await loginPage.login('', USERS.standard.password);

    await expect(loginPage.errorMessage).toContainText('Username is required');
  });

  test('password is required @regression', async ({ loginPage }) => {
    await loginPage.login(USERS.standard.username, '');

    await expect(loginPage.errorMessage).toContainText('Password is required');
  });

  test('user can log out @regression', async ({ loginPage, inventoryPage }) => {
    await loginPage.loginAs(USERS.standard);
    await expect(inventoryPage.title).toBeVisible();

    await inventoryPage.logout();

    await expect(loginPage.loginButton).toBeVisible();
  });

  test('inventory page is not reachable without logging in @regression', async ({
    inventoryPage,
    loginPage,
  }) => {
    await inventoryPage.goto();

    await expect(loginPage.errorMessage).toContainText('You can only access');
    await expect(loginPage.loginButton).toBeVisible();
  });
});
