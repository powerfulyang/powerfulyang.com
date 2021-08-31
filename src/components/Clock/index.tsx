import React, { FC, HTMLProps, useEffect, useState } from 'react';
import { interval } from 'rxjs';
import classNames from 'classnames';
import { TimeFormat } from '@/utils/lib';
import styles from './index.module.scss';

export const Clock: FC<HTMLProps<HTMLDivElement>> = ({ className }) => {
  const [time, setTime] = useState<string>();
  useEffect(() => {
    const sub = interval().subscribe(() => {
      setTime(TimeFormat());
    });
    return () => {
      sub.unsubscribe();
    };
  }, []);
  return (
    <div className={classNames(styles.clock, className)}>
      {time && (
        <>
          <img src={`/numbers/${time[0]}.gif`} alt="" />
          <img src={`/numbers/${time[1]}.gif`} alt="" />
          <span className="mx-2 text-2xl">:</span>
          <img src={`/numbers/${time[2]}.gif`} alt="" />
          <img src={`/numbers/${time[3]}.gif`} alt="" />
          <span className="mx-2 text-2xl">:</span>
          <img src={`/numbers/${time[4]}.gif`} alt="" />
          <img src={`/numbers/${time[5]}.gif`} alt="" />
        </>
      )}
    </div>
  );
};
