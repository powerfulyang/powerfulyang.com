import React, { FC } from 'react';
import { GetServerSidePropsContext } from 'next';
import { request } from '@/utils/request';
import styles from './index.module.scss';

const Timeline: FC<any> = ({ data }) => {
  return (
    <div className={styles.wrap}>
      <div className={styles.container}>
        <div className={styles.author}>
          <div className={styles.avatar} />
        </div>
        {JSON.stringify(data)}
        <div className={styles.content}>有多少笑容，就有多少泪水。</div>
      </div>
      <div className={styles.container}>
        <textarea className="border border-solid border-black px-2 py-1 cursor-text" />
      </div>
    </div>
  );
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const res = await request(`/user/current`, { ctx });
  const { data } = await res.json();
  console.log(data);
  return {
    props: { data },
  };
};

export default Timeline;
