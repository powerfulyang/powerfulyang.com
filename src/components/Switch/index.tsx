import classNames from 'classnames';
import type { FC, InputHTMLAttributes } from 'react';
import { forwardRef, useId } from 'react';
import styles from './index.module.scss';

type SwitchProps = {
  checkedDescription?: string;
  uncheckedDescription?: string;
} & InputHTMLAttributes<HTMLInputElement>;

export const Switch: FC<SwitchProps> = forwardRef<HTMLInputElement, SwitchProps>(
  ({ checkedDescription = '是', uncheckedDescription = '否', ...props }, ref) => {
    const id = useId();
    return (
      <>
        {/* 这里的顺序很有特点的哦，因为 css 使用 + 符号，即紧跟着的下一个元素的样式被 input 的 checked 属性控制 */}
        <input
          {...props}
          role="switch"
          id={id}
          ref={ref}
          hidden
          className={styles.switch}
          type="checkbox"
        />
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <label htmlFor={id} className={classNames(styles.toggleItem)}>
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
  },
);

Switch.displayName = 'Switch';
