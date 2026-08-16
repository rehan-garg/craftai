import test from 'node:test';
import assert from 'node:assert/strict';

const storage = new Map();

function createLocalStorageMock() {
  return {
    getItem(key) {
      return storage.has(key) ? storage.get(key) : null;
    },
    setItem(key, value) {
      storage.set(key, String(value));
    },
    removeItem(key) {
      storage.delete(key);
    },
    clear() {
      storage.clear();
    },
  };
}

globalThis.localStorage = createLocalStorageMock();

const { signup, login, getCurrentUser, isLoggedIn, getRole, getUsers } = await import('./authService.js');

test('signup stores a new user and creates a session', () => {
  localStorage.clear();
  const result = signup({ name: 'Ada', email: 'ada@example.com', password: 'secret', role: 'Seller' });

  assert.equal(result.success, true);
  assert.equal(getUsers().length, 1);
  assert.equal(getCurrentUser().email, 'ada@example.com');
  assert.equal(getRole(), 'Seller');
  assert.equal(isLoggedIn(), true);
});

test('login authenticates a matching user', () => {
  localStorage.clear();
  signup({ name: 'Grace', email: 'grace@example.com', password: 'pass123', role: 'Buyer' });

  const result = login('grace@example.com', 'pass123');

  assert.equal(result.success, true);
  assert.equal(getCurrentUser().name, 'Grace');
  assert.equal(getRole(), 'Buyer');
});

test('login rejects invalid credentials', () => {
  localStorage.clear();
  signup({ name: 'Linus', email: 'linus@example.com', password: 'abc', role: 'Seller' });

  const result = login('linus@example.com', 'wrong');

  assert.equal(result.success, false);
  assert.equal(result.message, 'Invalid email or password.');
  assert.equal(isLoggedIn(), false);
});
