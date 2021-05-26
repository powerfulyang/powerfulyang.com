import { interval, range } from 'rxjs';
import { concatMap, take } from 'rxjs/operators';

describe('operators', () => {
  it('from', () => {
    const range$ = range(1, 4);
    range$.forEach(console.log);
  });

  it('concatMap', (done) => {
    const source = interval(3000);
    const result = source.pipe(concatMap(() => interval(1000).pipe(take(2))));
    result.subscribe({ next: (x) => console.log(x), complete: done });
  });
});
