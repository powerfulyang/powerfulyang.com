import { NoSSRLiveMarkdownEditor } from '@/components/MarkdownContainer/LiveMarkdownEditor/NoSSR';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react';
import type { GetServerSideProps } from 'next';
import type { MarkdownMetadata } from '@/components/MarkdownContainer/LiveMarkdownEditor';
import { Footer } from '@/components/Footer';
import type { LayoutFC } from '@/types/GlobalContext';
import { useFormDiscardWarning } from '@/hooks/useFormDiscardWarning';
import { useMutation } from '@tanstack/react-query';
import { isString } from '@powerfulyang/utils';
import type { Post } from '@/__generated__/api';
import { clientApi, serverApi } from '@/request/requestTool';
import { extractRequestHeaders } from '@/utils/extractRequestHeaders';

type PublishProps = {
  post: Post;
};

const Publish: LayoutFC<PublishProps> = ({ post }) => {
  const { push } = useRouter();
  const [content, setContent] = useState(post.content);

  const publishPostMutation = useMutation(
    (metadata: MarkdownMetadata) => {
      if (post.id) {
        return clientApi.updatePost({
          id: post.id,
          ...metadata,
          content,
        });
      }
      return clientApi.createPost({
        ...metadata,
        content,
      });
    },
    {
      onSuccess(res) {
        return push(`/post/${res.data.id}`);
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
    <NoSSRLiveMarkdownEditor
      value={content}
      onChange={saveDraft}
      defaultValue={post.content}
      loading={publishPostMutation.isLoading}
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
    const res = await serverApi.queryPublicPostById(
      Number(id),
      {
        versions: [],
      },
      {
        headers: extractRequestHeaders(ctx.req.headers),
      },
    );
    pathViewCount = res.headers.get('x-path-view-count');
    post = res.data;
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
      },
      layout: {
        pathViewCount,
      },
    },
  };
};

export default Publish;
