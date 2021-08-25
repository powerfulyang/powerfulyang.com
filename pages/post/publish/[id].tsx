import React, { FC } from 'react';
import { MarkdownEditor } from '@/components/MarkdownWrap/Editor/inex';
import { GetServerSidePropsContext } from 'next';
import { clientRequest, request } from '@/utils/request';
import { Post } from '@/types/Post';
import { extractTitle } from '@/utils/toc';
import { useRouter } from 'next/router';

type PublishProps = {
  post: Post;
};

const Publish: FC<PublishProps> = ({ post }) => {
  const router = useRouter();
  const handlePost = async (metadata: Record<string, any>, input: string) => {
    const res = await clientRequest<Post>('/post', {
      method: 'POST',
      body: {
        ...metadata,
        content: input,
        title: extractTitle(input),
        id: post.id,
      },
    });
    return router.push(`/post/${res.data.id}`);
  };
  return (
    <MarkdownEditor
      defaultValue={post.content}
      onPost={(metadata, input) => handlePost(metadata, input)}
    />
  );
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
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
    },
  };
};
export default Publish;