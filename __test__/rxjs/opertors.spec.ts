import { combineLatest, concat, EMPTY, interval, of, range, timer } from 'rxjs';
import { combineLatestAll, concatAll, delay, map, startWith, take } from 'rxjs/operators';

describe('operators', () => {
  it('from', () => {
    const range$ = range(1, 4);
    range$.forEach(console.log);
  });

  it('combineLatestAll', (done) => {
    // emit every 1s, take 2
    const source$ = interval(1000).pipe(take(2));
    source$.subscribe(console.log);
    // map each emitted value from source to interval observable that takes 5 values
    const example$ = source$.pipe(
      map((val) =>
        interval(1000).pipe(
          map((i) => `Result (${val}): ${i}`),
          take(5),
        ),
      ),
    );

    example$.subscribe((x) => {
      x.subscribe(console.log);
    });
    /*
      2 values from source will map to 2 (inner) interval observables that emit every 1s.
      combineAll uses combineLatest strategy, emitting the last value from each
      whenever either observable emits a value
    */
    example$
      .pipe(combineLatestAll())
      /*
      output:
      ["Result (0): 0", "Result (1): 0"]
      ["Result (0): 1", "Result (1): 0"]
      ["Result (0): 1", "Result (1): 1"]
      ["Result (0): 2", "Result (1): 1"]
      ["Result (0): 2", "Result (1): 2"]
      ["Result (0): 3", "Result (1): 2"]
      ["Result (0): 3", "Result (1): 3"]
      ["Result (0): 4", "Result (1): 3"]
      ["Result (0): 4", "Result (1): 4"]
    */
      .subscribe({
        next(e) {
          console.log(e);
        },
        complete: done,
      });
  });

  it('combineLatest', (done) => {
    // timerOne emits first value at 1s, then once every 4s
    const timerOne$ = timer(1000, 4000);
    // timerTwo emits first value at 2s, then once every 4s
    const timerTwo$ = timer(2000, 4000);
    // timerThree emits first value at 3s, then once every 4s
    const timerThree$ = timer(3000, 4000);

    // when one timer emits, emit the latest values from each timer as an array
    combineLatest([timerOne$, timerTwo$, timerThree$])
      .pipe(take(2))
      .subscribe({
        next: ([timerValOne, timerValTwo, timerValThree]) => {
          /*
          Example:
        timerThree first tick: 'Timer One Latest: 0, Timer Two Latest: 0, Timer Three Latest: 0
        timerOne second tick: 'Timer One Latest: 1, Timer Two Latest: 0, Timer Three Latest: 0
        timerTwo second tick: 'Timer One Latest: 1, Timer Two Latest: 1, Timer Three Latest: 0
      */
          console.log(
            `Timer One Latest: ${timerValOne},
           Timer Two Latest: ${timerValTwo},
           Timer Three Latest: ${timerValThree}`,
          );
        },
        complete: done,
      });
  });

  it('concat', (done) => {
    const delayedMessage = (message: any, delayedTime = 1000) => EMPTY.pipe(startWith(message), delay(delayedTime));

    concat(
      delayedMessage('Get Ready!'),
      delayedMessage(3),
      delayedMessage(2),
      delayedMessage(1),
      delayedMessage('Go!'),
      delayedMessage('fight', 2000),
    ).subscribe({
      next(message) {
        console.log(message);
      },
      complete: done,
    });
  });

  it('concatAll', (complete) => {
    // emit a value every 2 seconds
    const source$ = interval(2000).pipe(take(2));
    const example$ = source$.pipe(
      // for demonstration, add 10 to and return as observable
      map((val) => of(val + 10)),
      // merge values from inner observable
      concatAll(),
    );
    // output: 'Example with Basic Observable 10', 'Example with Basic Observable 11'...
    example$.subscribe({
      next(val) {
        console.log('Example with Basic Observable:', val);
      },
      complete,
    });
  });
});
