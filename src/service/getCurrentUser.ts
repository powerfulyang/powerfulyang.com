import type { GetServerSideProps } from 'next';
import { requestAtServer } from '@/utils/server';

export const getCurrentUser: GetServerSideProps = async (ctx) => {
  const { cookies } = ctx.req;
  const { authorization } = cookies;
  if (authorization) {
    // 避免不必要的请求
    const res = await requestAtServer('/user/current', {
      ctx,
    });
    const { data: user = null } = await res.json();
    return user;
  }
  return null;
};
