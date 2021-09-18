import React, { FC } from 'react';
import { GetServerSidePropsContext } from 'next';
import styles from './index.module.scss';
import { LayoutFC } from '@/types/GlobalContext';
import { request } from '@/utils/request';

const Asset: FC<LayoutFC> = () => {
  return <div className={styles.asset}>111</div>;
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const {
    query: { id },
  } = ctx;
  const res = await request(`/public/asset/${id}`, { ctx });
  const { data, pathViewCount } = await res.json();
  return {
    props: { data, pathViewCount, title: data.bucket.bucketName },
  };
};

export default Asset;
