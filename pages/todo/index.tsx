import { LayoutFC } from '@/types/GlobalContext';
import { UserLayout } from '@/layout/UserLayout';
import React from 'react';
import { GetServerSidePropsContext } from 'next';
import { request } from '@/utils/request';
import { Todo } from '@/types/Todo';
import { DateFormat } from '@/utils/lib';

type TodoProps = {
  todos: Todo[];
};

export const Todos: LayoutFC<TodoProps> = ({ todos }) => {
  return (
    <>
      <main>
        <ul className="mt-4">
          {todos.map((todo) => (
            <li key={todo.id} className="text-center mb-2">
              {todo.info} createAt:{DateFormat(todo.createAt)} author:{todo.createBy.nickname}
            </li>
          ))}
        </ul>
      </main>
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
