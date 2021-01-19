import { GithubCommitTable } from '@/components/GithubCommitTable';
import React from 'react';
import dayjs from 'dayjs';
import { Header } from '@/components/Head';
import { GlobalContextProvider } from '@/context/GlobalContextProvider';

const CommitLog = () => {
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
    </GlobalContextProvider>
  );
};

export default CommitLog;
