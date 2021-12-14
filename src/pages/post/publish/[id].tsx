import type { FC } from 'react';
import React from 'react';
import type { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import { MarkdownEditor } from '@/components/MarkdownContainer/Editor/inex';
import { clientRequest, request } from '@/utils/request';
import type { Post } from '@/type/Post';
import { extractMetaData, extractTitle } from '@/utils/toc';
import { Footer } from '@/components/Footer';

type PublishProps = {
  post: Post;
};

const Publish: FC<PublishProps> = ({ post }) => {
  const router = useRouter();
  const handlePost = async (input: string) => {
    const [metadata] = extractMetaData(input);
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
    <>
      <MarkdownEditor defaultValue={post.content} onPost={(input) => handlePost(input)} />
      <Footer />
    </>
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
      title: '发布新的日志',
    },
  };
};
export default Publish;
