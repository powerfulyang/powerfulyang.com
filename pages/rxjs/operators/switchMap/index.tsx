import React, { useRef } from 'react';
import { useEffectOnce } from '@powerfulyang/hooks';
import { fromEvent, interval } from 'rxjs';
import { switchMap } from 'rxjs/operators';

const Index = () => {
  const switchMapRef = useRef<HTMLDivElement>(null);
  useEffectOnce(() => {
    fromEvent(switchMapRef.current!, 'click')
      .pipe(
        // restart counter on every click
        switchMap(() => interval(1000)),
      )
      .subscribe(console.log);
  });
  return (
    <div className="pointer" ref={switchMapRef}>
      restart counter on every click!
    </div>
  );
};

export default Index;
