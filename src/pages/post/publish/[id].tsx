import React, { useCallback, useEffect, useState } from 'react';
import type { GetServerSideProps } from 'next';
import { useBeforeUnload } from '@powerfulyang/hooks';
import { MarkdownEditor } from '@/components/MarkdownContainer/Editor/inex';
import { requestAtClient } from '@/utils/client';
import type { Post } from '@/type/Post';
import { extractMetaData, extractTitle } from '@/utils/toc';
import { Footer } from '@/components/Footer';
import { useHistory } from '@/hooks/useHistory';
import { requestAtServer } from '@/utils/server';
import type { LayoutFC } from '@/type/GlobalContext';

type PublishProps = {
  post: Post;
};

const Publish: LayoutFC<PublishProps> = ({ post }) => {
  const { pushState } = useHistory();
  const [content, setContent] = useState(post.content);

  const handlePost = async () => {
    const [metadata] = extractMetaData(content);
    const res = await requestAtClient<Post>('/post', {
      method: 'POST',
      body: {
        ...metadata,
        content,
        title: extractTitle(content),
        id: post.id,
      },
    });
    return pushState(`/post/${res.data.id}`);
  };

  const saveDraft = useCallback(
    (draft?: string) => {
      setContent(draft || '');
      if (!post.id) {
        localStorage.setItem('draft', draft || '');
      }
    },
    [post.id],
  );

  useEffect(() => {
    if (!post.id) {
      setContent(localStorage.getItem('draft') || '');
    }
  }, [post]);

  useBeforeUnload(Boolean(post.id));

  return (
    <MarkdownEditor
      value={content}
      onChange={saveDraft}
      defaultValue={post.content}
      onPost={handlePost}
    />
  );
};

Publish.displayName = 'Publish';
Publish.getLayout = (page) => {
  const { pathViewCount } = page.props;
  return (
    <>
      {page}
      <Footer pathViewCount={pathViewCount} />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { query } = ctx;
  const { id } = query;

  let post;
  let pathViewCount = 0;
  if (Number(id)) {
    const res = await requestAtServer(`/public/post/${id}`, {
      ctx,
    });
    const result = await res.json();
    post = result.data;
    pathViewCount = result.pathViewCount;
  } else {
    post = {};
  }

  return {
    props: {
      post,
      title: '发布新的日志',
      pathViewCount,
    },
  };
};
export default Publish;
