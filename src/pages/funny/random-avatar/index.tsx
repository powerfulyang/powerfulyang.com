import React from 'react';
import { genConfig, FunnyAvatar } from '@powerfulyang/funny-avatar';
import { useImmer } from '@powerfulyang/hooks';
import Image from 'next/image';
import styles from './index.module.scss';

const RandomAvatar = () => {
  const [config, setConfig] = useImmer({});
  const randomAvatar = () => {
    setConfig(genConfig({}));
  };
  return (
    <div className={styles.wrap}>
      <main className={styles.main}>
        <div className={styles.logo}>
          <Image
            src="/icons/apple-touch-icon.png"
            width={50}
            height={50}
            className="rounded-full"
          />
          <span className="ml-4">funny avatar</span>
        </div>
        <div className={styles.avatarPreview}>
          <FunnyAvatar className="w-[30vh] h-[30vh]" {...config} />
          <div className={styles.configOperation}>
            <button type="button" className={styles.doRandom} onClick={randomAvatar}>
              随机一个
            </button>
          </div>
        </div>
      </main>

      <section className={styles.gradientBg} />
    </div>
  );
};

export default RandomAvatar;
