import React, { FC } from 'react';
import classNames from 'classnames';
import { ButtonProps } from '@/components/Button/types/BaseButtonProps';
import { Loading } from '@/components/Loading';
import styles from './index.module.scss';

export const Button: FC<ButtonProps> = (props) => {
  const { htmlType = 'button', children, className, icon, loading = false, ...rest } = props;
  return (
    <button {...rest} type={htmlType} className={classNames(className, styles.button)}>
      {icon}
      {loading && <Loading />}
      {children}
    </button>
  );
};

Button.displayName = 'Button';
