import React, { FC, useContext } from 'react';
import classNames from 'classnames';
import { LinkContext } from '@/context/LinkContext';
import './index.module.scss';

export const Redirecting: FC = () => {
  const { state } = useContext(LinkContext);
  return (
    <div
      className={classNames('redirecting', {
        invisible: !state.isRedirecting,
      })}
    />
  );
};
