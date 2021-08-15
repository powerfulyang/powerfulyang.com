import { LayoutFC } from '@/types/GlobalContext';
import { UserLayout } from '@/layout/UserLayout';
import React from 'react';
import { GetServerSidePropsContext } from 'next';
import { request } from '@/utils/request';
import { Todo } from '@/types/Todo';
import { DateFormat } from '@/utils/lib';
import classNames from 'classnames';
import styles from './index.module.scss';

type TodoProps = {
  todos: Todo[];
};

export const Todos: LayoutFC<TodoProps> = ({ todos }) => {
  return (
    <>
      <main className={styles.main}>
        <ul className="mx-6">
          {todos.map((todo) => (
            <li key={todo.id} className={classNames('text-center mb-2', styles.todo)}>
              <div className="text-pink-400">{todo.info}</div>
              <div>{todo.desc}</div>
              <div>author:{todo.createBy.nickname}</div>
              <div>createAt:{DateFormat(todo.createAt)}</div>
              <div className="text-red-400">expired:{DateFormat(todo.deadline)}</div>
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
