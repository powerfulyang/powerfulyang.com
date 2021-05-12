import { BehaviorSubject, fromEvent, interval, merge } from 'rxjs';
import { map, tap, mergeMap } from 'rxjs/operators';
import React, { useEffect } from 'react';

const Demo = () => {
  useEffect(() => {
    const setElementText = (elemId: string, text: string) => {
      document.getElementById(elemId)!.innerText = text.toString();
    };
    const addHtmlElement = (coords: any) => {
      document.body.innerHTML += `
  <div
    id=${coords.id}
    style="
      position: absolute;
      height: 30px;
      width: 30px;
      text-align: center;
      top: ${coords.y}px;
      left: ${coords.x}px;
      background: silver;
      border-radius: 80%;"
    >
  </div>`;
    };

    const subject = new BehaviorSubject(0);

    const click$ = fromEvent(document, 'click').pipe(
      map((e: any) => ({
        x: e.clientX,
        y: e.clientY,
        id: Math.random(),
      })),
      tap(addHtmlElement),
      mergeMap((coords) => subject.pipe(tap((v) => setElementText(coords.id, v.toString())))),
    );

    const interval$ = interval(1000).pipe(
      tap((v) => subject.next(v)),
      tap((v) => setElementText('intervalValue', v.toString())),
    );

    merge(click$, interval$).subscribe();
  }, []);
  return (
    <>
      <div id="intervalValue" />
    </>
  );
};

export default Demo;
