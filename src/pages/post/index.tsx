import { firstItem, lastItem } from '@powerfulyang/utils';
import { useInfiniteQuery } from '@tanstack/react-query';
import classNames from 'classnames';
import { motion } from 'framer-motion';
import { flatten } from 'lodash-es';
import type { GetServerSideProps } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { Fragment } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import type { Post } from '@/__generated__/api';
import { LazyAssetImage } from '@/components/LazyImage/LazyAssetImage';
import { UserLayout } from '@/layout/UserLayout';
import { clientApi, serverApi } from '@/request/requestTool';
import type { LayoutFC } from '@/types/GlobalContext';
import { extractRequestHeaders } from '@/utils/extractRequestHeaders';
import { formatDateTime } from '@/utils/lib';
import { InView } from 'react-intersection-observer';
import styles from './index.module.scss';

type IndexProps = {
  posts: Post[];
  years: number[];
  year: number;
  nextCursor: number;
  prevCursor: number;
};

const Index: LayoutFC<IndexProps> = ({ posts, years, year, prevCursor, nextCursor }) => {
  const router = useRouter();
  const { data, isError, fetchPreviousPage, hasPreviousPage, isFetching } = useInfiniteQuery(
    ['posts', posts, nextCursor, prevCursor],
    async ({ pageParam }) => {
      const x = await clientApi.infiniteQueryPublicPost({
        ...pageParam,
        take: 10,
        publishYear: year,
      });
      return x.data;
    },
    {
      enabled: false,
      getNextPageParam(lastPage) {
        return { nextCursor: lastPage.nextCursor };
      },
      getPreviousPageParam(firstPage) {
        const { prevCursor: cursor } = firstPage;
        if (cursor) {
          return { prevCursor: cursor };
        }
        return cursor;
      },
      select(page) {
        return {
          pages: [...page.pages].reverse(),
          pageParams: [...page.pageParams].reverse(),
        };
      },
      initialData: {
        pages: [
          {
            resources: posts,
            nextCursor,
            prevCursor,
          },
        ],
        pageParams: [{ nextCursor: lastItem(posts)?.id, prevCursor: firstItem(posts)?.id }],
      },
      retry: false,
    },
  );

  const res = flatten(data?.pages.map((x) => x.resources) || []);

  useHotkeys(
    '., 。',
    () => {
      return router.push('/post/publish');
    },
    [router],
  );

  return (
    <main className={styles.main}>
      <div className={classNames(styles.years)} role="tablist">
        {years.map((x) => (
          <Link role="tab" key={x} href={`/post/year/${x}`}>
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
        {res.map((post) => (
          <Fragment key={post.id}>
            <motion.a
              title={`${post.id}`}
              className={classNames('pointer', styles.card)}
              href={`/post/${post.id}`}
              onClick={(e) => {
                if (e.ctrlKey || e.metaKey) {
                  return null;
                }
                e.preventDefault();
                return router.push(`/post/${post.id}`);
              }}
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
            </motion.a>
            {post.id === lastItem(res)?.id &&
              ((hasPreviousPage && !isError) || isFetching ? (
                <InView
                  triggerOnce
                  onChange={(inView) => {
                    inView && !isFetching && fetchPreviousPage();
                  }}
                  className={styles.footer}
                  as="div"
                >
                  <span className={styles.loading}>Loading</span>
                </InView>
              ) : (
                <div className={styles.footer}>
                  {isError ? (
                    <button
                      type="button"
                      className="pointer text-red-500"
                      onClick={() => {
                        return fetchPreviousPage();
                      }}
                    >
                      加载失败，点击重试
                    </button>
                  ) : (
                    '已经到达世界的尽头...'
                  )}
                </div>
              ))}
          </Fragment>
        ))}
      </section>
    </main>
  );
};

Index.getLayout = (page) => {
  const { pathViewCount } = page.props.layout;
  return <UserLayout pathViewCount={pathViewCount}>{page}</UserLayout>;
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { query, req } = ctx;
  const reqUrl = req.url;
  // 除了首页，列表页不需要被收录
  const noindex = reqUrl !== '/';

  const requestHeaders = extractRequestHeaders(ctx.req.headers);

  const { data: years } = await serverApi.queryPublicPostYears({
    headers: requestHeaders,
  });
  const year: number = Number(query.year) || years[0].publishYear || new Date().getFullYear();
  const res = await serverApi.infiniteQueryPublicPost(
    {
      publishYear: year,
      take: 10,
    },
    {
      headers: requestHeaders,
    },
  );
  const pathViewCount = res.headers.get('x-path-view-count');
  const { data } = res;
  return {
    props: {
      years: years.map((x) => x.publishYear),
      posts: data.resources,
      nextCursor: data.nextCursor,
      prevCursor: data.prevCursor,
      year,
      layout: {
        pathViewCount,
      },
      meta: {
        title: `日志 - ${year}`,
        description: `发布于 ${year} 年的日志`,
        noindex,
      },
    },
  };
};

export default Index;

export const runtime = 'experimental-edge';
