const React = require('react');

const icon = (testId) => () => React.createElement('div', { 'data-testid': testId });

if (typeof expect !== 'undefined' && typeof expect.extend === 'function') {
  require('@testing-library/jest-dom');
}

jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '/',
      query: {},
      asPath: '/',
      push: jest.fn(),
      pop: jest.fn(),
      reload: jest.fn(),
      back: jest.fn(),
      prefetch: jest.fn().mockResolvedValue(undefined),
      beforePopState: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
      },
      isFallback: false,
    };
  },
}));

jest.mock('next/navigation', () => ({
  usePathname() {
    return '/';
  },
  useSearchParams() {
    return new URLSearchParams();
  },
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
    };
  },
}));

jest.mock('framer-motion', () => ({
  motion: {
    div: 'div',
    button: 'button',
    section: 'section',
    h1: 'h1',
    h2: 'h2',
    h3: 'h3',
    p: 'p',
    span: 'span',
    ul: 'ul',
    li: 'li',
  },
  AnimatePresence: ({ children }) => children,
}));

jest.mock('lucide-react', () => ({
  Menu: icon('menu-icon'),
  X: icon('close-icon'),
  Sun: icon('sun-icon'),
  Moon: icon('moon-icon'),
}));

jest.mock('react-icons/fi', () => ({
  FiActivity: icon('activity-icon'),
  FiArrowLeft: icon('arrow-left-icon'),
  FiCheck: icon('check-icon'),
  FiDownload: icon('download-icon'),
  FiLock: icon('lock-icon'),
  FiUnlock: icon('unlock-icon'),
  FiStar: icon('star-icon'),
  FiTrendingUp: icon('trending-up-icon'),
  FiCalendar: icon('calendar-icon'),
}));

jest.mock('@radix-ui/react-slot', () => ({
  Slot: ({ children, ...props }) => React.createElement('div', props, children),
}));

jest.mock('classnames', () => jest.fn((...args) => args.filter(Boolean).join(' ')));
jest.mock('uuid', () => ({ v4: () => 'mock-uuid-123' }));

global.localStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
}

global.IntersectionObserver = class IntersectionObserver {
  disconnect() {}
  observe() {}
  unobserve() {}
};

global.ResizeObserver = class ResizeObserver {
  disconnect() {}
  observe() {}
  unobserve() {}
};
