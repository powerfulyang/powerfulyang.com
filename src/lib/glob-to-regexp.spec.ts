import globToRegExp from 'glob-to-regexp';
import { describe, expect, it } from '@jest/globals';

describe('glob to regex', () => {
  it('should work', () => {
    const glob = '**/*.spec.ts';
    const reg = globToRegExp(glob, {
      globstar: true,
      extended: true,
    });
    expect(reg.source).toBe('^((?:[^/]*(?:\\/|$))*)([^/]*)\\.spec\\.ts$');
  });

  it('should work', () => {
    const glob = '*/*.spec.ts';
    const reg = globToRegExp(glob, {
      globstar: true,
      extended: true,
    });
    expect(reg.source).toBe('^([^/]*)\\/([^/]*)\\.spec\\.ts$');
  });

  it('should work', () => {
    const glob = 'src/**/*.spec.ts';
    const reg = globToRegExp(glob, {
      globstar: true,
      extended: true,
    });
    expect(reg.source).toBe('^src\\/((?:[^/]*(?:\\/|$))*)([^/]*)\\.spec\\.ts$');
  });
});
