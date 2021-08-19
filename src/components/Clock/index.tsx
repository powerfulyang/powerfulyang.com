import React, { FC, HTMLProps, useEffect, useState } from 'react';
import { interval } from 'rxjs';
import classNames from 'classnames';
import { TimeFormat } from '@/utils/lib';
import styles from './index.module.scss';

export const Clock: FC<HTMLProps<HTMLDivElement>> = ({ className }) => {
  const [time, setTime] = useState<string>();
  const [start, setStart] = useState(false);
  useEffect(() => {
    const sub = interval().subscribe(() => {
      setTime(TimeFormat());
    });
    return () => {
      sub.unsubscribe();
    };
  }, []);
  useEffect(() => {
    if (time?.[5] === '0') {
      setStart(true);
    }
  }, [time]);
  return (
    <div className={classNames(styles.clock, className)}>
      {time && (
        <>
          <img src={`/numbers/${time[0]}.gif`} alt="" />
          <img src={`/numbers/${time[1]}.gif`} alt="" />
          <img src={`/numbers/${time[2]}.gif`} alt="" />
          <img src={`/numbers/${time[3]}.gif`} alt="" />
          <img
            src={`/numbers/${time[4]}.gif`}
            alt=""
            className={classNames({
              [styles.rotate]: start,
            })}
          />
          <img src={`/numbers/${time[5]}.gif`} alt="" />
        </>
      )}
    </div>
  );
};
