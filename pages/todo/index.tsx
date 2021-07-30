import { LayoutFC } from '@/types/GlobalContext';
import { UserLayout } from '@/layout/UserLayout';
import React from 'react';

export const Todo: LayoutFC = () => {
  return <>hello todo!</>;
};

Todo.getLayout = (page) => <UserLayout>{page}</UserLayout>;

export default Todo;
