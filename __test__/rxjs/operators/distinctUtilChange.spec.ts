import { of } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

describe('distinctUtilChange', () => {
  it('test', () => {
    const source$ = of(1, 2, 2, 1, 2);
    source$.pipe(distinctUntilChanged()).subscribe({
      next: console.log,
    });
  });
});
