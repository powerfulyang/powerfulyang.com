import React, { useCallback, useEffect, useState } from 'react';
import type { GetServerSideProps } from 'next';
import { useBeforeUnload } from '@powerfulyang/hooks';
import { MarkdownEditor } from '@/components/MarkdownContainer/Editor/inex';
import { requestAtClient } from '@/utils/client';
import type { Post } from '@/type/Post';
import { Footer } from '@/components/Footer';
import { useHistory } from '@/hooks/useHistory';
import { requestAtServer } from '@/utils/server';
import type { LayoutFC } from '@/type/GlobalContext';
import { isNumeric, isString } from '@powerfulyang/utils';

type PublishProps = {
  post: Post;
};

const Publish: LayoutFC<PublishProps> = ({ post }) => {
  const { pushState } = useHistory();
  const [content, setContent] = useState(post.content);
  const [metadata, setMetadata] = useState({});

  const handlePost = async () => {
    const res = await requestAtClient<Post>('/post', {
      method: 'POST',
      body: {
        ...metadata,
        content,
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
  }, [post.id]);

  useBeforeUnload(Boolean(post.id));

  return (
    <MarkdownEditor
      value={content}
      onChange={saveDraft}
      defaultValue={post.content}
      onPost={handlePost}
      onGenerateMetadata={setMetadata}
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
  const {
    query,
    req: { url },
  } = ctx;
  const { id } = query;

  let post;
  let pathViewCount = 0;
  if (isString(id) && isNumeric(id) && id !== '0') {
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
      currentUrl: url,
      post,
      title: '发布日志',
      pathViewCount,
    },
  };
};
export default Publish;
