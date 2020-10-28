import { isNumber } from '@powerfulyang/utils';

describe('1+1=3', () => {
  it('Index shows', () => {
    expect(isNumber(1 + 1)).toBe(true);
  });
});
