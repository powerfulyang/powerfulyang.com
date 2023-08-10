import classNames from 'classnames';
import type { Metadata } from 'next';
import { headers } from 'next/headers';
import Link from 'next/link';
import type { FC } from 'react';
import React from 'react';
import { UsePostPublish } from '@/hooks/usePostPublish';
import type { Post } from '@/__generated__/api';
import { LazyAssetImage } from '@/components/LazyImage/LazyAssetImage';
import styles from '@/pages/post/index.module.scss';
import { serverApi } from '@/request/requestTool';
import { extractRequestHeaders } from '@/utils/extractRequestHeaders';
import { formatDateTime } from '@/utils/lib';

type Params = {
  searchParams: {
    year: string;
  };
};

export const generateMetadata = async ({ searchParams }: Params): Promise<Metadata> => {
  const { year: _year } = searchParams;
  const _headers = headers();
  const { data: _years } = await serverApi.queryPublicPostYears({
    headers: extractRequestHeaders(_headers),
  });
  const year = (_year && Number(_year)) || _years[0].publishYear;
  return {
    title: `Post ${year}`,
    description: `发布于 ${year} 年的文章`,
  };
};

const Index: FC<Params> = async ({ searchParams }) => {
  const { year: _year } = searchParams;
  const _headers = headers();
  const { data: _years } = await serverApi.queryPublicPostYears({
    headers: extractRequestHeaders(_headers),
  });
  const year = (_year && Number(_year)) || _years[0].publishYear;
  const years = _years.map((x) => x.publishYear);
  const { data: posts } = await serverApi.queryPublicPosts(
    {
      publishYear: year,
    },
    {
      headers: extractRequestHeaders(_headers),
    },
  );

  return (
    <main className={styles.main}>
      <UsePostPublish />
      <div className={classNames(styles.years)} role="tablist">
        {years.map((x) => (
          <Link role="tab" key={x} href={`/app_post/year/${x}`}>
            <span
              className={classNames(styles.year, 'pr-1', {
                [styles.active]: x === year,
              })}
            >
              #{x}
            </span>
          </Link>
        ))}
      </div>
      <section className="m-auto flex w-[100%] max-w-[1000px] flex-col">
        {posts.map((post: Post) => (
          <Link
            key={post.id}
            title={`${post.id}`}
            className={classNames('pointer', styles.card)}
            href={`/app_post/${post.id}`}
          >
            <LazyAssetImage
              containerClassName={styles.bg}
              thumbnail="poster"
              draggable={false}
              asset={post.poster}
            />
            <h2>{post.title}</h2>
            <summary>{post.summary}</summary>
            <section className="leading-6 text-gray-400">
              <span>Date: {formatDateTime(post.createdAt)}</span>
              <br />
              <span>Author: {post.createBy.nickname}</span>
            </section>
          </Link>
        ))}
      </section>
    </main>
  );
};

export default Index;
