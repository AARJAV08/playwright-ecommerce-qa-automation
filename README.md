# Playwright E-Commerce QA Automation

![Playwright Tests](https://github.com/AARJAV08/playwright-ecommerce-qa-automation/actions/workflows/playwright.yml/badge.svg)

End-to-end **UI** and **API** test automation framework for an e-commerce application, built with **Playwright** and **TypeScript** using the **Page Object Model (POM)**.

- UI under test: [SauceDemo](https://www.saucedemo.com) (a public demo online store by Sauce Labs)
- API under test: [DummyJSON](https://dummyjson.com) (a public fake e-commerce REST API: products, carts, users)

## Highlights

- Page Object Model with a shared `BasePage` and one class per page
- Custom Playwright fixtures that inject page objects into tests
- Authenticate once with a setup project and reuse the saved session (`storageState`)
- Cross-browser runs on Chromium, Firefox and WebKit
- Data-driven tests (sorting) and positive and negative scenarios (login, checkout validation)
- REST API tests using Playwright's `request` fixture
- `@smoke` and `@regression` tags to run focused suites
- HTML report, trace on first retry, screenshots and video on failure
- GitHub Actions pipeline that type-checks, runs all tests and uploads the report

## Test Coverage

| Area | What is verified |
| --- | --- |
| Login | Valid login, locked-out user, invalid credentials, required-field errors, logout, protected page access |
| Product catalog | Six products with correct name and price, product detail page, back navigation, sorting (A-Z, Z-A, price low-high, price high-low) |
| Cart | Add one or many items, cart badge count, remove from catalog and cart pages, persistence after reload, continue shopping |
| Checkout | Full order end to end, item total, 8% tax and grand total calculation, required-field validation, cancel, cart cleared after order |
| API | Product list pagination, single product schema, search, 404 for unknown product, get cart, create cart, delete cart |

## Project Structure

```
.
├── .github/workflows/playwright.yml   # CI pipeline
├── src
│   ├── data/                          # Users, products, checkout data, constants
│   ├── fixtures/index.ts              # Custom test with page-object fixtures
│   ├── pages/                         # Page Object classes
│   └── utils/helpers.ts               # Price parsing, rounding, slug helpers
├── tests
│   ├── auth.setup.ts                  # Logs in once and saves the session
│   ├── auth/login.spec.ts
│   ├── inventory/inventory.spec.ts
│   ├── cart/cart.spec.ts
│   ├── checkout/checkout.spec.ts
│   └── api/products-and-carts.spec.ts
├── playwright.config.ts
├── tsconfig.json
└── package.json
```

## Getting Started

**Prerequisites:** Node.js 18 or later and npm.

```bash
# 1. Clone the repository
git clone https://github.com/AARJAV08/playwright-ecommerce-qa-automation.git
cd playwright-ecommerce-qa-automation

# 2. Install dependencies
npm install

# 3. Install Playwright browsers
npx playwright install --with-deps
```

## Running the Tests

| Command | Description |
| --- | --- |
| `npm test` | Run everything (UI on 3 browsers + API) |
| `npm run test:smoke` | Run only `@smoke` tests |
| `npm run test:regression` | Run only `@regression` tests |
| `npm run test:api` | Run only API tests |
| `npm run test:chromium` | Run UI tests on Chromium only |
| `npm run test:headed` | Run on Chromium with a visible browser |
| `npm run test:ui-mode` | Open Playwright's interactive UI mode |
| `npm run test:debug` | Step through tests with the Playwright Inspector |
| `npm run report` | Open the last HTML report |
| `npm run typecheck` | Type-check the TypeScript code |
| `npm run codegen` | Record a new test with Playwright codegen |

The login set-up test is tagged `@smoke @regression`, so filtered runs (`npm run test:smoke`) still sign in before the UI tests start.

Run a single file or test:

```bash
npx playwright test tests/checkout/checkout.spec.ts --project=chromium
npx playwright test -g "add" --project=chromium
```

## Configuration

Defaults live in `playwright.config.ts`. Override them with environment variables (see `.env.example`):

| Variable | Default |
| --- | --- |
| `BASE_URL` | `https://www.saucedemo.com` |
| `API_BASE_URL` | `https://dummyjson.com` |

## Reports and Debugging

- HTML report: `npm run report`
- Traces are captured on the first retry. Open one with `npx playwright show-trace <trace.zip>`
- Screenshots and videos are kept for failed tests in `test-results/`

## Continuous Integration

`.github/workflows/playwright.yml` runs on every push and pull request to `main`. It installs dependencies, type-checks, installs browsers, runs the full suite and uploads the HTML report as a build artifact.

## Design Decisions

- **Page Object Model:** locators and page actions live in `src/pages`, so specs read like test scenarios and UI changes are fixed in one place.
- **Stable locators:** the framework uses `data-test` attributes through `getByTestId` (the test id attribute is configured in `playwright.config.ts`), plus role-based locators where suitable.
- **Independent tests:** each test starts from a fresh browser context with the saved login session, so tests can run in parallel in any order.
- **Test data in one place:** products, users and customer details live in `src/data`.

## Ideas for Future Work

- Visual regression checks with `toHaveScreenshot`
- Accessibility checks with `@axe-core/playwright`
- Tests for the `problem_user` and `performance_glitch_user` accounts
- Mobile viewport projects

## Author

**Aarjav Jain**, Quality Analyst
GitHub: [@AARJAV08](https://github.com/AARJAV08)

## License

MIT
