import React, { useCallback, useEffect, useState } from 'react';
import type { GetServerSideProps } from 'next';
import type { MarkdownMetadata } from '@/components/MarkdownContainer/LiveMarkdownEditor';
import { LiveMarkdownEditor } from '@/components/MarkdownContainer/LiveMarkdownEditor';
import { requestAtClient } from '@/utils/client';
import type { Post } from '@/type/Post';
import { Footer } from '@/components/Footer';
import { useHistory } from '@/hooks/useHistory';
import { requestAtServer } from '@/utils/server';
import type { LayoutFC } from '@/type/GlobalContext';
import { useFormDiscardWarning } from '@/hooks/useFormDiscardWarning';
import { useMutation } from '@tanstack/react-query';
import { isString } from '@powerfulyang/utils';
import { defaultAuthor } from '@/components/Head';

type PublishProps = {
  post: Post;
};

const Publish: LayoutFC<PublishProps> = ({ post }) => {
  const { pushState } = useHistory();
  const [content, setContent] = useState(post.content);

  const publishPostMutation = useMutation(
    (metadata: MarkdownMetadata) => {
      if (post.id) {
        return requestAtClient<Post>(`/post/${post.id}`, {
          method: 'PATCH',
          body: {
            ...metadata,
            content,
          },
        });
      }
      return requestAtClient<Post>('/post', {
        method: 'POST',
        body: {
          ...metadata,
          content,
        },
      });
    },
    {
      onSuccess(data) {
        return pushState(`/post/${data.id}`);
      },
    },
  );

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

  useFormDiscardWarning(() => {
    return content !== post.content && Boolean(post.id) && !publishPostMutation.isLoading;
  }, [content, post.content, post.id, publishPostMutation.isLoading]);

  return (
    <LiveMarkdownEditor
      value={content}
      onChange={saveDraft}
      defaultValue={post.content}
      onPost={publishPostMutation.mutate}
    />
  );
};

Publish.displayName = 'Publish';
Publish.getLayout = (page) => {
  const { pathViewCount } = page.props.layout;
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
  let pathViewCount;
  if (isString(id) && id !== '0') {
    const res = await requestAtServer(`/public/post/${id}`, {
      ctx,
    });
    pathViewCount = res.headers.get('x-path-view-count');
    post = await res.json();
  } else {
    post = {};
    pathViewCount = 0;
  }

  return {
    props: {
      post,
      meta: {
        title: '发布日志',
        description: `发布日志的页面`,
        author: defaultAuthor,
        keywords: `日志发布页面`,
      },
      layout: {
        pathViewCount,
      },
    },
  };
};

export default Publish;
