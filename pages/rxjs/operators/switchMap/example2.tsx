import React, { useEffect } from 'react';
import { EMPTY, fromEvent, interval, merge } from 'rxjs';
import { mapTo, scan, startWith, switchMap, takeWhile, tap } from 'rxjs/operators';

// Countdown timer with pause and resume
const Example2 = () => {
  useEffect(() => {
    const COUNTDOWN_SECONDS = 10;

    // elem refs
    const remainingLabel = document.getElementById('remaining');
    const pauseButton = document.getElementById('pause');
    const resumeButton = document.getElementById('resume');
    // streams
    const interval$ = interval(1000).pipe(mapTo(-1));
    const pause$ = fromEvent(pauseButton!, 'click').pipe(mapTo(false));
    const resume$ = fromEvent(resumeButton!, 'click').pipe(mapTo(true));

    merge(pause$, resume$)
      .pipe(
        tap((d) => {
          console.log(d);
        }),
        startWith(true),
        switchMap((val) => (val ? interval$ : EMPTY)),
        scan((acc, curr: number) => (curr ? curr + acc : acc), COUNTDOWN_SECONDS),
        takeWhile((v: number) => v >= 0),
      )
      .subscribe((val: any) => {
        remainingLabel!.innerHTML = val;
      });
  }, []);
  return (
    <>
      <div id="remaining" />
      <div>
        <button id="pause" type="button">
          pause
        </button>
      </div>
      <div>
        <button id="resume" type="button">
          resume
        </button>
      </div>
    </>
  );
};

export default Example2;
