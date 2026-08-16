const USERS_STORAGE_KEY = 'craftai_users';
const SESSION_STORAGE_KEY = 'craftai_session';

function getStorage() {
  if (typeof window !== 'undefined' && window.localStorage) {
    return window.localStorage;
  }

  if (typeof globalThis !== 'undefined' && globalThis.localStorage) {
    return globalThis.localStorage;
  }

  return null;
}

function readSession() {
  const storage = getStorage();

  if (!storage) {
    return null;
  }

  try {
    const storedValue = storage.getItem(SESSION_STORAGE_KEY);
    return storedValue ? JSON.parse(storedValue) : null;
  } catch (error) {
    console.error('Failed to read session:', error);
    return null;
  }
}

function persistSession(session) {
  const storage = getStorage();

  if (!storage) {
    return;
  }

  if (session) {
    storage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
    return;
  }

  storage.removeItem(SESSION_STORAGE_KEY);
}

export function getUsers() {
  const storage = getStorage();

  if (!storage) {
    return [];
  }

  try {
    const storedValue = storage.getItem(USERS_STORAGE_KEY);
    const parsedValue = storedValue ? JSON.parse(storedValue) : [];
    return Array.isArray(parsedValue) ? parsedValue : [];
  } catch (error) {
    console.error('Failed to read users:', error);
    return [];
  }
}

function persistUsers(users) {
  const storage = getStorage();

  if (!storage) {
    return;
  }

  storage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

export function signup(user) {
  const users = getUsers();
  const normalizedEmail = user?.email?.trim().toLowerCase();
  const existingUser = users.find((candidate) => candidate.email?.trim().toLowerCase() === normalizedEmail);

  if (existingUser) {
    return { success: false, message: 'User already exists.' };
  }

  const newUser = {
    id: globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    name: user?.name?.trim() || '',
    email: normalizedEmail || '',
    password: user?.password || '',
    role: user?.role || 'Buyer',
  };

  persistUsers([...users, newUser]);
  persistSession({ userId: newUser.id, loggedIn: true });

  return { success: true, user: newUser };
}

export function login(email, password) {
  const users = getUsers();
  const normalizedEmail = email?.trim().toLowerCase();
  const foundUser = users.find((candidate) => candidate.email?.trim().toLowerCase() === normalizedEmail && candidate.password === password);

  if (!foundUser) {
    persistSession(null);
    return { success: false, message: 'Invalid email or password.' };
  }

  persistSession({ userId: foundUser.id, loggedIn: true });
  return { success: true, user: foundUser };
}

export function getCurrentUser() {
  const session = readSession();

  if (!session?.userId) {
    return null;
  }

  const users = getUsers();
  return users.find((user) => user.id === session.userId) || null;
}

export function logout() {
  persistSession(null);
}

export function isLoggedIn() {
  return Boolean(readSession()?.loggedIn && getCurrentUser());
}

export function getRole() {
  return getCurrentUser()?.role || null;
}
