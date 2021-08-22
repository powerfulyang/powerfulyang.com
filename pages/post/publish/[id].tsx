import React, { FC } from 'react';
import { MarkdownEditor } from '@/components/MarkdownWrap/Editor/inex';
import { GetServerSidePropsContext } from 'next';
import { request } from '@/utils/request';
import { Post } from '@/types/Post';

type PublishProps = {
  post: Post;
};

const Publish: FC<PublishProps> = ({ post }) => {
  return <MarkdownEditor defaultValue={post.content} />;
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { query } = ctx;
  const { id } = query;
  const res = await request(`/public/post/${id}`, {
    ctx,
  });
  const json = await res.json();
  return {
    props: {
      post: json.data,
    },
  };
};
export default Publish;
