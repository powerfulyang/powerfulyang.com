import React from 'react';
import styles from './index.module.scss';

const Timeline = () => {
  return (
    <div className={styles.wrap}>
      <div className={styles.container}>
        <div className={styles.author}>
          <div className={styles.avatar} />
        </div>
        <div className={styles.content}>有多少笑容，就有多少泪水。</div>
      </div>
      <div className={styles.container}>
        <textarea className="border border-solid border-black px-2 py-1 cursor-text" />
      </div>
    </div>
  );
};

export default Timeline;
