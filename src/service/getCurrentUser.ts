import type { GetServerSideProps } from 'next';
import { requestAtServer } from '@/utils/server';

export const getCurrentUser: GetServerSideProps = async (ctx) => {
  const res = await requestAtServer('/user/current', {
    ctx,
  });
  const { data: user = null } = await res.json();
  return user;
};
