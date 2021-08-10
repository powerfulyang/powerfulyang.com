import { LayoutFC } from '@/types/GlobalContext';
import { UserLayout } from '@/layout/UserLayout';
import React from 'react';
import { GetServerSidePropsContext } from 'next';
import { request } from '@/utils/request';
import { Todo } from '@/types/Todo';

type TodoProps = {
  todos: Todo[];
};

export const Todos: LayoutFC<TodoProps> = ({ todos }) => {
  return (
    <>
      {todos.map((todo) => (
        <div key={todo.id}>{todo.id}</div>
      ))}
    </>
  );
};

Todos.getLayout = (page) => {
  const { pathViewCount } = page.props;
  return <UserLayout pathViewCount={pathViewCount}>{page}</UserLayout>;
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const res = await request(`/todo`, { ctx });
  const { data, pathViewCount } = await res.json();
  return {
    props: { todos: data || [], pathViewCount },
  };
};

export default Todos;
