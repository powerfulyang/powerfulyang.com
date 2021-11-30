import classNames from 'classnames';
import type { FC } from 'react';
import React, { useRef, useState } from 'react';
import { inc } from 'ramda';
import styles from './index.module.scss';

type SwitchProps = {
  checkedDescription?: string;
  uncheckedDescription?: string;
  onChange?: (checked: boolean) => void;
  checked?: boolean;
};

export const Switch: FC<SwitchProps> = ({
  checkedDescription = '是',
  uncheckedDescription = '否',
  onChange,
  checked,
}) => {
  const i = useRef(0);
  const [id] = useState(() => {
    i.current = inc(i.current);
    return `internal_switch_id_${i.current}`;
  });

  return (
    <>
      <input
        id={id}
        hidden
        className={styles.switch}
        type="checkbox"
        checked={checked}
        onChange={(e) => {
          onChange?.(e.target.checked);
        }}
      />
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className={styles.toggleItem} htmlFor={id}>
        <div
          className={styles.desc}
          data-checked-desc={checkedDescription}
          data-unchecked-desc={uncheckedDescription}
        />
        <div className={styles.dog}>
          <div className={styles.ear} />
          <div className={classNames(styles.right, styles.ear)} />
          <div className={styles.face}>
            <div className={styles.eyes} />
            <div className={styles.mouth}>
              <div className={styles.tongue} />
            </div>
          </div>
        </div>
      </label>
    </>
  );
};
