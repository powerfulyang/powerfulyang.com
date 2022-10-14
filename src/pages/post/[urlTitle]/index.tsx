import React from 'react';
import type { GetServerSideProps } from 'next';
import type { Post } from '@/type/Post';
import type { LayoutFC } from '@/type/GlobalContext';
import { UserLayout } from '@/layout/UserLayout';
import { MarkdownTOC } from '@/components/MarkdownContainer/TOC';
import { useHistory } from '@/hooks/useHistory';
import { requestAtServer } from '@/utils/server';
import { MarkdownContainer } from '@/components/MarkdownContainer';
import { generateTOC } from '@/utils/toc';
import { useHotkeys } from 'react-hotkeys-hook';
import styles from './index.module.scss';

type PostProps = {
  data: Post;
};

const PostDetail: LayoutFC<PostProps> = ({ data: { content, toc, urlTitle } }) => {
  const history = useHistory();

  useHotkeys(
    '., 。',
    () => {
      history.pushState(`/post/publish/${urlTitle}`);
    },
    [history, urlTitle],
  );

  return (
    <main className={styles.postWrap}>
      <MarkdownContainer source={content} className={styles.post} />
      <MarkdownTOC toc={toc} />
    </main>
  );
};

PostDetail.getLayout = (page) => {
  const { pathViewCount } = page.props;
  return <UserLayout pathViewCount={pathViewCount}>{page}</UserLayout>;
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const {
    query: { urlTitle },
  } = ctx;
  const res = await requestAtServer(`/public/post/${String(urlTitle)}`, { ctx });
  const { data, pathViewCount } = await res.json();

  const toc = await generateTOC(data.content);

  return {
    props: {
      data: {
        ...data,
        toc,
      },
      pathViewCount,
      title: data.title,
      description: data.title,
      keywords: data.tags.join(', '),
    },
  };
};

export default PostDetail;
