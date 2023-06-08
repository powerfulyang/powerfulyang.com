// extend jest matchers
import '@testing-library/jest-dom/extend-expect';
// extend jest matchers
import '@powerfulyang/jest-extended/all';
// canvas mock
import 'jest-canvas-mock';
// metadata
import 'reflect-metadata';

global.ResizeObserver = require('resize-observer-polyfill');

// mock next/router
jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '',
      query: '',
      asPath: '',
      push: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
      },
      beforePopState: jest.fn(() => null),
      prefetch: jest.fn(() => null),
    };
  },
}));

// mock @tanstack/react-query
jest.mock('@tanstack/react-query', () => ({
  useQuery: () => ({ isLoading: false, error: {}, data: [] }),
}));

// mock @/styles/variables.module.scss
jest.mock('@/styles/variables.module.scss', () => {
  return {
    CDN_ORIGIN: JSON.stringify('https://cdn.example.com'),
  };
});
