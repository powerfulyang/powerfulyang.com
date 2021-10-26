import React from 'react';
import { genConfig, ReactNiceAvatar } from '@powerfulyang/funny-avatar';
import { useImmer } from '@powerfulyang/hooks';
import { NiceAvatarProps } from '@powerfulyang/funny-avatar/src/types';
import html2canvas from 'html2canvas';
import styles from './index.module.scss';

const RandomAvatar = () => {
  const [config, setConfig] = useImmer<NiceAvatarProps>({});
  const randomAvatar = () => {
    setConfig(genConfig());
  };
  const download = async () => {
    const res = await html2canvas(document.getElementById('AvatarPreview')!);
    const link = document.createElement('a');
    link.download = 'avatar.png';
    link.href = res.toDataURL();
    console.log(link.href);
    link.click();
  };
  return (
    <div className={styles.wrap}>
      <main className={styles.main}>
        <div className={styles.logo}>
          <ReactNiceAvatar shape="square" className="w-16 h-16" />
          <span className="ml-4">funny avatar</span>
        </div>
        <div id="AvatarPreview" className={styles.avatar_preview}>
          <ReactNiceAvatar className="w-[20rem] h-[20rem] m-auto" {...config} />
          <div className={styles.config_operation}>
            <button type="button" className={styles.do_random} onClick={randomAvatar}>
              随机一个
            </button>
            <button type="button" className={styles.download} onClick={download}>
              下载图片
            </button>
          </div>
        </div>
      </main>

      <section className={styles.gradient_bg} />
    </div>
  );
};

export default RandomAvatar;
