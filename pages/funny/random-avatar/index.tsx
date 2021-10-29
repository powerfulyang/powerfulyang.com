import React from 'react';
import { genConfig, FunnyAvatar } from '@powerfulyang/funny-avatar';
import { useImmer } from '@powerfulyang/hooks';
import Image from 'next/Image';
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
        <div className={styles.avatar_preview}>
          <FunnyAvatar className="w-[30vh] h-[30vh]" {...config} />
          <div className={styles.config_operation}>
            <button type="button" className={styles.do_random} onClick={randomAvatar}>
              随机一个
            </button>
          </div>
        </div>
      </main>

      <section className={styles.gradient_bg} />
    </div>
  );
};

export default RandomAvatar;
