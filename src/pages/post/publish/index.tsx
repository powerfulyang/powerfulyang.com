import { usePageQuery } from '@powerfulyang/hooks';
import type { GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import type { MarkdownMetadata } from '@/components/MarkdownContainer/LiveMarkdownEditor';
import { Footer } from '@/components/Footer';
import type { LayoutFC } from '@/types/GlobalContext';
import { useFormDiscardWarning } from '@/hooks/useFormDiscardWarning';
import { clientApi } from '@/request/requestTool';
import { NoSSRLiveMarkdownEditor } from '@/components/MarkdownContainer/LiveMarkdownEditor/NoSSR';

type PublishProps = {};

const Publish: LayoutFC<PublishProps> = () => {
  const { push } = useRouter();
  const [content, setContent] = useState('');

  const id = usePageQuery('id');

  const { data: post, isFetching } = useQuery({
    queryKey: ['post', id],
    enabled: Boolean(id),
    async queryFn() {
      const postId = Number(id);
      const result = await clientApi.queryPublicPostById(postId, {
        versions: [],
      });
      const { data } = result;
      setContent(data.content);
      return data;
    },
  });

  const publishPostMutation = useMutation(
    (metadata: MarkdownMetadata) => {
      if (post?.id) {
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
      if (!post?.id) {
        localStorage.setItem('draft', draft || '');
      }
    },
    [post?.id],
  );

  useEffect(() => {
    if (!post?.id) {
      setContent(localStorage.getItem('draft') || '');
    }
  }, [post?.id]);

  useFormDiscardWarning(() => {
    return content !== post?.content && Boolean(post?.id) && !publishPostMutation.isLoading;
  }, [content, post?.content, post?.id, publishPostMutation.isLoading]);

  return (
    <NoSSRLiveMarkdownEditor
      value={content}
      onChange={saveDraft}
      loading={publishPostMutation.isLoading || isFetching}
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

export const getStaticProps: GetStaticProps = () => {
  return {
    props: {
      meta: {
        title: '发布日志',
        description: `发布日志的页面`,
      },
      layout: {
        pathViewCount: 0,
      },
    },
  };
};

export default Publish;
