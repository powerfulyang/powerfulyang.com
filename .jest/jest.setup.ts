// extend jest matchers
import '@testing-library/jest-dom/jest-globals';
// extend jest matchers
import '@powerfulyang/jest-extended/all';
// canvas mock
import 'jest-canvas-mock';
// metadata
import 'reflect-metadata';
// jest
import { jest } from '@jest/globals';

// @ts-ignore
// import ResizeObserver from 'resize-observer-polyfill';

// @ts-ignore
// global.ResizeObserver = ResizeObserver;

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

import { TextDecoder, TextEncoder } from 'util';

// TextDecoder
global.TextDecoder = TextDecoder;
// TextEncoder
global.TextEncoder = TextEncoder;
