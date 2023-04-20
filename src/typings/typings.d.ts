import type { Matchers as _M } from 'expect';
import type { expect } from '@jest/globals';
import type { TestingLibraryMatchers } from '@testing-library/jest-dom/matchers';

declare module 'expect' {
  interface Matchers<R extends void | Promise<void>, T = unknown>
    extends _M<R, T>,
      TestingLibraryMatchers<typeof expect.stringContaining, R> {}
}
