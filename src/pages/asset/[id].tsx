import type { FC } from 'react';
import React from 'react';
import type { GetServerSideProps } from 'next';
import styles from './index.module.scss';
import { request } from '@/utils/request';

const Asset: FC<any> = ({ data }) => <div className={styles.asset}>{JSON.stringify(data)}</div>;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const {
    query: { id },
  } = ctx;
  const res = await request(`/public/asset/${id}`, { ctx });
  const { data, pathViewCount } = await res.json();
  return {
    props: { data, pathViewCount, title: data.bucket.name },
  };
};

export default Asset;
