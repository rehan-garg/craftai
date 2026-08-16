import test from 'node:test';
import assert from 'node:assert/strict';
import { deleteSavedProduct, formatIndianCurrency, getDashboardStats, parseEstimatedPrice, updateSavedProductStatus } from './savedProducts.js';

test('parses Indian price strings into numbers', () => {
  assert.equal(parseEstimatedPrice('₹3,250'), 3250);
  assert.equal(parseEstimatedPrice('₹1800'), 1800);
  assert.equal(parseEstimatedPrice('₹4,500'), 4500);
  assert.equal(parseEstimatedPrice('Not available'), 0);
});

test('builds dashboard stats from saved products', () => {
  const products = [
    { status: 'draft', estimatedPrice: '₹3,250', category: 'Home Decor' },
    { status: 'published', estimatedPrice: '₹1,800', category: 'Home Decor' },
    { status: 'published', estimatedPrice: '₹4,500', category: 'Jewelry' },
  ];

  const stats = getDashboardStats(products);

  assert.equal(stats.totalProducts, 3);
  assert.equal(stats.draftProducts, 1);
  assert.equal(stats.publishedProducts, 2);
  assert.equal(stats.averageEstimatedPrice, 3183);
  assert.deepEqual(stats.categorySummary, [
    { category: 'Home Decor', count: 2 },
    { category: 'Jewelry', count: 1 },
  ]);
});

test('formats numbers as Indian currency', () => {
  assert.equal(formatIndianCurrency(3250), '₹3,250');
  assert.equal(formatIndianCurrency(1800), '₹1,800');
});

test('updates an existing product to published without creating duplicates', () => {
  const products = [
    { id: 1, status: 'draft', generatedTitle: 'Ceramic Mug' },
    { id: 2, status: 'draft', generatedTitle: 'Wooden Bowl' },
  ];

  const nextProducts = updateSavedProductStatus(1, 'published', products);

  assert.equal(nextProducts.length, 2);
  assert.equal(nextProducts[0].status, 'published');
  assert.equal(nextProducts[1].status, 'draft');
});

test('deletes a product by id', () => {
  const products = [
    { id: 1, status: 'draft', generatedTitle: 'Ceramic Mug' },
    { id: 2, status: 'published', generatedTitle: 'Wooden Bowl' },
  ];

  const nextProducts = deleteSavedProduct(1, products);

  assert.equal(nextProducts.length, 1);
  assert.equal(nextProducts[0].id, 2);
});
