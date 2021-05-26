import { range } from 'rxjs';

describe('operators', () => {
  it('from', () => {
    const range$ = range(1, 4);
    range$.forEach(console.log);
  });
});
