import React from 'react';
import styles from './index.module.scss';

const Timeline = () => {
  return (
    <div className={styles.wrap}>
      <div className={styles.container}>有多少笑容，就有多少泪水。</div>
      <div className={styles.container}>
        <input type="text" className="border border-solid border-black" />
      </div>
    </div>
  );
};

export default Timeline;
