import type { FC, HTMLProps } from 'react';
import React, { useEffect } from 'react';
import { interval } from 'rxjs';
import classNames from 'classnames';
import { TimeFormat } from '@/utils/lib';
import styles from './index.module.scss';
import { useClientState } from '@/hooks/useClientState';

export const Clock: FC<HTMLProps<HTMLDivElement>> = ({ className }) => {
  const [time, setTime] = useClientState(() => TimeFormat());
  useEffect(() => {
    const sub = interval().subscribe(() => {
      setTime(TimeFormat());
    });
    return () => {
      sub.unsubscribe();
    };
  }, [setTime]);
  return (
    <div className={classNames(styles.clock, className)} title={`当前时间 ${time}`}>
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((item) => (
        <img hidden key={item} src={`/numbers/${item}.gif`} alt="" />
      ))}
      {time && (
        <>
          <img src={`/numbers/${time[0]}.gif`} alt="" />
          <img src={`/numbers/${time[1]}.gif`} alt="" />
          <span className="mx-1 text-xl">:</span>
          <img src={`/numbers/${time[3]}.gif`} alt="" />
          <img src={`/numbers/${time[4]}.gif`} alt="" />
          <span className="mx-1 text-xl">:</span>
          <img src={`/numbers/${time[6]}.gif`} alt="" />
          <img src={`/numbers/${time[7]}.gif`} alt="" />
        </>
      )}
    </div>
  );
};
