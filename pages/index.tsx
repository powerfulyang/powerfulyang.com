import React, { FC } from 'react';
import { Header } from '@/components/Head';
import './index.scss';
import { DateFormat, initialProps } from '@/utils/Utils';
import { Link } from '@/components/Link';
import { GlobalContextProvider } from '@/context/GlobalContextProvider';

type IndexProps = {
  data: {
    posts: {
      id: number;
      title: string;
      content: string;
      createAt: Date;
    }[];
  };
};

const Index: FC<IndexProps> = ({ data }) => {
  return (
    <GlobalContextProvider>
      <Header />
      {data.posts.map((post) => (
        <p className="index_title" key={post.id}>
          <Link to={`/post/${post.id}`}>{post.title}</Link>
          <span className="index_create">creatAt:{DateFormat(post.createAt)}</span>
        </p>
      ))}
    </GlobalContextProvider>
  );
};

export const getServerSideProps = initialProps('posts');

export default Index;
