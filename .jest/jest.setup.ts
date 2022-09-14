import '@testing-library/jest-dom/extend-expect';
import 'jest-canvas-mock';

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

jest.mock('@tanstack/react-query', () => ({
  useQuery: () => ({ isLoading: false, error: {}, data: [] }),
}));
