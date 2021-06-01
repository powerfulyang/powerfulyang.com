import { generate } from 'rxjs';

describe('operators', () => {
  it('generate', (complete) => {
    generate({ initialState: 2, condition: (x) => x < 3, iterate: (x) => x + 1 }).subscribe({
      next: console.log,
      complete,
    });
  });
});
