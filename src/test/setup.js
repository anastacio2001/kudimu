import '@testing-library/jest-dom';

// Mock do localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
global.localStorage = localStorageMock;

// Mock do sessionStorage
const sessionStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
global.sessionStorage = sessionStorageMock;

// Mock do fetch
global.fetch = vi.fn();

// Mock do Web Push API
global.Notification = {
  permission: 'default',
  requestPermission: vi.fn(() => Promise.resolve('granted')),
};

global.navigator = {
  ...global.navigator,
  serviceWorker: {
    register: vi.fn(() => Promise.resolve({
      pushManager: {
        subscribe: vi.fn(),
        getSubscription: vi.fn(() => Promise.resolve(null)),
      }
    })),
    getRegistration: vi.fn(() => Promise.resolve(null)),
  },
  userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
};

// Mock do window.atob para service worker
global.atob = vi.fn((str) => Buffer.from(str, 'base64').toString('binary'));

// Cleanup após cada teste
afterEach(() => {
  vi.clearAllMocks();
});