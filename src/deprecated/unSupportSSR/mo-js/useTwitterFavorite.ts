import { fromEvent } from 'rxjs';
import { useEffectOnce } from '@powerfulyang/hooks';
import { useMemo } from 'react';
import { CreateElements } from './CustomShape/Heart';

export const useTwitterFavorite = () => {
  const memoize = useMemo(CreateElements, []);
  useEffectOnce(() => {
    const click = fromEvent<MouseEvent>(window, 'click');
    const [burst, circle, heart] = memoize;
    const subscribe = click.subscribe((e) => {
      const coords = { x: e.pageX, y: e.pageY };
      burst.tune(coords).replay();
      circle.tune(coords).replay();
      heart.tune(coords).replay();
    });
    return () => {
      subscribe.unsubscribe();
    };
  });
};
