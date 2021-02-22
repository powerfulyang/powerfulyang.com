import React, { FC, useMemo } from 'react';
import { initialProps } from '@/utils/Utils';
import { Header } from '@/components/Head';
import { GlobalContextProvider } from '@/context/GlobalContextProvider';
import { TagCloudWithNoSSR } from '@/components/dynamic';

type TagsProps = {
  data: Record<string, number>;
};

const Tags: FC<TagsProps> = ({ data }) => {
  const sorted = useMemo(() => Object.entries(data).sort((a, b) => b[1] - a[1]), []);
  return (
    <GlobalContextProvider>
      <Header />
      <TagCloudWithNoSSR list={sorted} />
    </GlobalContextProvider>
  );
};

export const getServerSideProps = initialProps('posts/tags');

export default Tags;
