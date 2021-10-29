import type { GetServerSidePropsContext } from 'next';
import { request } from '@/utils/request';

export const getCurrentUser = async (ctx: GetServerSidePropsContext) => {
  const res = await request('/user/current', {
    ctx,
  });
  const { data: user = null } = await res.json();
  return user;
};
