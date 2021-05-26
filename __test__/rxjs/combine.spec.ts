import { interval, of } from 'rxjs';
import { combineLatestAll, map, take } from 'rxjs/operators';

describe('The combineAll operator examples', () => {
  describe('Example 1 - mapping to an inner observable', () => {
    it('should emit the result of both observables as an array', (done) => {
      let results: any[] = [];
      const source = interval(1000).pipe(take(2));
      const expected = [[0, 1]];
      source.subscribe({
        next: (val) => results.push(val),
        complete: () => {
          expect(results).toStrictEqual(expected);
        },
      });
      const example = source.pipe(map((val) => of(val)));
      const combined = example.pipe(combineLatestAll());
      combined.subscribe({
        next: (val) => results.push(val),
        complete: () => {
          expect(results).toStrictEqual(expected);
          done();
        },
      });
    });
  });
});
