import React, { KeyboardEvent, useEffect } from 'react';
import { fromEvent } from 'rxjs';

const Event = () => {
  useEffect(() => {
    const event$ = fromEvent<KeyboardEvent>(document, 'keydown');
    event$.subscribe((x) => {
      console.log(x.code);
    });
  });
  return (
    <div className="w-full h-full m-auto absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 cursor-pointer">
      click me
    </div>
  );
};

export default Event;
