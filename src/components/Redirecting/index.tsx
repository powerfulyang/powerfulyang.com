import React, { FC, useContext } from 'react';
import classNames from 'classnames';
import './index.scss';
import { LinkContext } from '@/context/LinkContext';

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
