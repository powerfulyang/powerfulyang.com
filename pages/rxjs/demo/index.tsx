import { combineLatestWith, map, withLatestFrom } from 'rxjs/operators';
import React, { MouseEvent, useState } from 'react';
import { useEventCallback } from '@powerfulyang/hooks';
import { Observable } from 'rxjs';

const Demo = () => {
  const [count, setCount] = useState(0);
  const [clickCallback, [description, x, y, prevDesc]] = useEventCallback(
    (event$: Observable<MouseEvent<HTMLButtonElement>>, state$, inputs$) =>
      event$.pipe(
        map((event) => [event.currentTarget.innerHTML, event.clientX, event.clientY] as const),
        combineLatestWith(inputs$),
        withLatestFrom(state$),
        map(([eventAndInput, state]) => {
          const [[text, internalX, internalY], [internalCount]] = eventAndInput;
          const prevDescription = state[0];
          return [text, internalX + internalCount, internalY + internalCount, prevDescription];
        }),
      ),
    ['nothing', 0, 0, 'nothing'],
    [count],
  );

  return (
    <div className="App">
      <h1>
        click position: {x}, {y}
      </h1>
      <h1>{description} was clicked.</h1>
      <h1>{prevDesc} was clicked previously.</h1>
      <button type="button" onClick={clickCallback}>
        click me
      </button>
      <button type="button" onClick={clickCallback}>
        click you
      </button>
      <button type="button" onClick={clickCallback}>
        click him
      </button>
      <div>
        <p>
          click buttons above, and then click this `+++` button, the position numbers will grow.
        </p>
        <button onClick={() => setCount(count + 1)}>+++</button>
      </div>
    </div>
  );
};

export default Demo;
