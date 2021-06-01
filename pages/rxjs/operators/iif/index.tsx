// RxJS v6+
import { fromEvent, iif, of } from 'rxjs';
import { mergeMap, map, throttleTime, filter } from 'rxjs/operators';
import React, { useEffect } from 'react';

const Iif = () => {
  useEffect(() => {
    const r$ = of(`I'm saying R!!`);
    const x$ = of(`X's always win!!`);

    fromEvent<MouseEvent>(document, 'mousemove')
      .pipe(
        throttleTime(50),
        filter((move) => move.clientY < 210),
        map((move) => move.clientY),
        mergeMap((yCoord) => iif(() => yCoord < 110, r$, x$)),
      )
      .subscribe(console.log);
  }, []);

  return <>click me!</>;
};

export default Iif;
