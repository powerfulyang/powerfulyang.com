'use client';

import type { Post } from '@/__generated__/api';
import type { MarkdownMetadata } from '@/components/MarkdownContainer/LiveMarkdownEditor';
import { NoSSRLiveMarkdownEditor } from '@/components/MarkdownContainer/LiveMarkdownEditor/NoSSR';
import { clientApi } from '@/request/requestTool';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import type { FC } from 'react';
import { useEffect, useState } from 'react';

export const Publish: FC<{ post: Partial<Post> }> = ({ post }) => {
  const router = useRouter();
  const [content, setContent] = useState(post.content || '');

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
        return router.push(`/post/${res.data.id}`);
      },
    },
  );

  const saveDraft = (draft?: string) => {
    setContent(draft || '');
    if (!post.id) {
      localStorage.setItem('draft', draft || '');
    }
  };

  useEffect(() => {
    if (!post.id) {
      setContent(localStorage.getItem('draft') || '');
    }
  }, [post.id]);

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
