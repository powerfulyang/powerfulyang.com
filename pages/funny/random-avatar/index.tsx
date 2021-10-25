import React from 'react';
import { ReactNiceAvatar } from '@powerfulyang/funny-avatar';
import styles from './index.module.scss';

const RandomAvatar = () => (
  <main className="bg-[#14161a] h-full">
    <div className={styles.logo}>
      <ReactNiceAvatar />
      <span className="ml-4">funny avatar</span>
    </div>
    <div className={styles.content} />
    <section className={styles.gradient_bg} />
  </main>
);

export default RandomAvatar;
