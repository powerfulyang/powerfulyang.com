import React from 'react';
import Image from 'next/image';
import styles from './index.module.scss';

const RandomAvatar = () => (
  <main className="bg-[#14161a] h-full">
    <div className={styles.logo}>
      <Image src="/icons/apple-touch-icon.png" width={50} height={50} className="rounded-xl" />
      <span className="ml-4">funny avatar</span>
    </div>
    <div className={styles.content} />
    <section className={styles.gradient_bg} />
  </main>
);

export default RandomAvatar;
