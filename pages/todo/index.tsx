import { LayoutFC } from '@/types/GlobalContext';
import { UserLayout } from '@/layout/UserLayout';
import React from 'react';
import { GetServerSidePropsContext } from 'next';
import { request } from '@/utils/request';
import { Todo } from '@/types/Todo';
import { DateFormat } from '@/utils/lib';
import classNames from 'classnames';
import { constants } from 'http2';
import { login } from '@/components/NavBar';
import styles from './index.module.scss';

type TodoProps = {
  todos: Todo[];
  UNAUTHORIZED: boolean;
};

export const Todos: LayoutFC<TodoProps> = ({ todos, UNAUTHORIZED }) => {
  return (
    <>
      {UNAUTHORIZED && (
        <main className={styles.main}>
          <div className="m-auto text-pink-400 text-center cursor-self-pointer" onClick={login}>
            This page is need Login!
          </div>
        </main>
      )}
      {!UNAUTHORIZED && (
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
      )}
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
  if (res.status === constants.HTTP_STATUS_UNAUTHORIZED) {
    return {
      props: { UNAUTHORIZED: true },
    };
  }
  return {
    props: { todos: data, pathViewCount },
  };
};

export default Todos;
