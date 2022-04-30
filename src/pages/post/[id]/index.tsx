import type { KeyboardEvent } from 'react';
import React, { useEffect } from 'react';
import type { GetServerSideProps } from 'next';
import { fromEvent } from 'rxjs';
import type { Post } from '@/type/Post';
import { MarkdownContainer } from '@/components/MarkdownContainer';
import type { LayoutFC } from '@/type/GlobalContext';
import { UserLayout } from '@/layout/UserLayout';
import { getCurrentUser } from '@/service/getCurrentUser';
import { MarkdownToc } from '@/components/MarkdownContainer/Toc';
import { useHistory } from '@/hooks/useHistory';
import { requestAtServer } from '@/utils/server';
import styles from './index.module.scss';

type PostProps = {
  data: Post;
};

const PostDetail: LayoutFC<PostProps> = ({ data }) => {
  const { content } = data;
  const history = useHistory();
  useEffect(() => {
    const keydown$ = fromEvent<KeyboardEvent>(document, 'keydown').subscribe((e) => {
      if (e.key === '.') {
        history.pushState(`/post/publish/${data.id}`);
      }
    });
    return () => {
      keydown$.unsubscribe();
    };
  }, [history, data.id]);

  return (
    <main className={styles.postWrap}>
      <MarkdownContainer source={content} className={styles.post} />
      <MarkdownToc content={content} />
    </main>
  );
};

PostDetail.getLayout = (page) => {
  const { pathViewCount, user } = page.props;
  return (
    <UserLayout user={user} pathViewCount={pathViewCount}>
      {page}
    </UserLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const {
    query: { id },
  } = ctx;
  const res = await requestAtServer(`/public/post/${id as string}`, { ctx });
  const { data, pathViewCount } = await res.json();
  const user = await getCurrentUser(ctx);

  return {
    props: { data, pathViewCount, title: data.title, user },
  };
};

export default PostDetail;
