import React, { FC } from 'react';
import { Header } from '@/components/Head';
import './index.scss';
import { DateFormat, initialProps } from '@/utils/Utils';
import { Link } from '@/components/Link';
import { GlobalContextProvider } from '@/context/GlobalContextProvider';
import { GithubCommitTable } from '@/components/GithubCommitTable';
import dayjs from 'dayjs';

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
  const cols = 52;
  const rows = 7;
  const thisWeek = dayjs().day() + 1;
  const range = cols * rows + thisWeek;
  const commitLogs = new Array(range).fill({}).map((_, index) => {
    const draft = {} as any;
    draft.date = dayjs().subtract(index, 'day').format('LL');
    draft.count = Math.random() * 1000;
    return draft;
  });
  return (
    <GlobalContextProvider>
      <Header />
      <GithubCommitTable data={commitLogs} />
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
