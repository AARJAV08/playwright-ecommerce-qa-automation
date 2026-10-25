import { test, expect } from '@playwright/test';

// REST API checks against DummyJSON (https://dummyjson.com), a public fake e-commerce API.
test.describe('Products API', () => {
  test('GET /products returns a paginated product list @api', async ({ request }) => {
    const response = await request.get('/products?limit=10');

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.products).toHaveLength(10);
    expect(body.limit).toBe(10);
    expect(body.total).toBeGreaterThan(10);
  });

  test('GET /products/:id returns a single product with required fields @api', async ({ request }) => {
    const response = await request.get('/products/1');

    expect(response.status()).toBe(200);
    const product = await response.json();
    expect(product).toMatchObject({
      id: 1,
      title: expect.any(String),
      price: expect.any(Number),
      category: expect.any(String),
    });
  });

  test('GET /products/search filters results by keyword @api', async ({ request }) => {
    const response = await request.get('/products/search?q=phone');

    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(body.products.length).toBeGreaterThan(0);
  });

  test('GET /products/:id returns 404 for an unknown product @api', async ({ request }) => {
    const response = await request.get('/products/999999');

    expect(response.status()).toBe(404);
  });
});

test.describe('Carts API', () => {
  test('GET /carts/:id returns a cart with products and totals @api', async ({ request }) => {
    const response = await request.get('/carts/1');

    expect(response.status()).toBe(200);
    const cart = await response.json();
    expect(cart.products.length).toBeGreaterThan(0);
    expect(cart.total).toBeGreaterThan(0);
    expect(cart.totalProducts).toBe(cart.products.length);
  });

  test('POST /carts/add creates a cart for a user @api', async ({ request }) => {
    const response = await request.post('/carts/add', {
      data: {
        userId: 1,
        products: [
          { id: 1, quantity: 2 },
          { id: 50, quantity: 1 },
        ],
      },
    });

    expect(response.status()).toBe(201);
    const cart = await response.json();
    expect(cart.userId).toBe(1);
    expect(cart.products).toHaveLength(2);
    expect(cart.totalQuantity).toBe(3);
  });

  test('DELETE /carts/:id marks the cart as deleted @api', async ({ request }) => {
    const response = await request.delete('/carts/1');

    expect(response.ok()).toBeTruthy();
    const cart = await response.json();
    expect(cart.isDeleted).toBe(true);
  });
});
