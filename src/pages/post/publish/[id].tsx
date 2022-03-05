import type { FC } from 'react';
import React, { useCallback, useEffect, useState } from 'react';
import type { GetServerSideProps } from 'next';
import { useBeforeUnload } from '@powerfulyang/hooks';
import { MarkdownEditor } from '@/components/MarkdownContainer/Editor/inex';
import { clientRequest, request } from '@/utils/request';
import type { Post } from '@/type/Post';
import { extractMetaData, extractTitle } from '@/utils/toc';
import { Footer } from '@/components/Footer';
import { useHistory } from '@/hooks/useHistory';

type PublishProps = {
  post: Post;
};

const Publish: FC<PublishProps> = ({ post }) => {
  const { pushState } = useHistory();
  const [content, setContent] = useState(post.content);

  const handlePost = async () => {
    const [metadata] = extractMetaData(content);
    const res = await clientRequest<Post>('/post', {
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
    (draft) => {
      setContent(draft);
      if (!post.id) {
        localStorage.setItem('draft', draft);
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
    <>
      <MarkdownEditor
        value={content}
        onChange={saveDraft}
        defaultValue={post.content}
        onPost={handlePost}
      />
      <Footer />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { query } = ctx;
  const { id } = query;

  let post;
  if (Number(id)) {
    const res = await request(`/public/post/${id}`, {
      ctx,
    });
    const { data } = await res.json();
    post = data;
  } else {
    post = {};
  }

  return {
    props: {
      post,
      title: '发布新的日志',
    },
  };
};
export default Publish;
