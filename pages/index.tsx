import React, { FC } from 'react';
import { Header } from '@/components/Head';
import './index.scss';
import { DateFormat, initialProps } from '@/utils/Utils';
import { Link } from '@/components/Link';

type IndexProps = {
  data: {
    id: number;
    title: string;
    content: string;
    createAt: Date;
  }[];
};

const Index: FC<IndexProps> = ({ data }) => {
  return (
    <>
      <Header />
      {data.map((post) => (
        <p className="index_title" key={post.id}>
          <Link to={`/post/${post.id}`}>{post.title}</Link>
          <span className="index_create">crateAt:{DateFormat(post.createAt)}</span>
        </p>
      ))}
    </>
  );
};

export const getServerSideProps = initialProps('posts');

export default Index;
