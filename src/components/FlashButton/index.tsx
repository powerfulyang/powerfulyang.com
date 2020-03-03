import React from 'react';
import './index.scss';
import { ApproachUrl } from '../../Config/config';
export default function FlashButton({ children }) {
  return (
    <a className="flush-button-border" href={ApproachUrl}>
      <button className="btn btn-primary btn-ghost btn-shine">
        {children}
      </button>
    </a>
  );
}
