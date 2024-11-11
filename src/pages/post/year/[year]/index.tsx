import type {Post} from '@/__generated__/api';
import {LazyAssetImage} from '@/components/LazyImage/LazyAssetImage';
import {UserLayout} from '@/layout/UserLayout';
import {clientApi, serverApi} from '@/request/requestTool';
import type {LayoutFC} from '@/types/GlobalContext';
import {formatDateTime} from '@/utils/format';
import {firstItem, isEmpty, lastItem} from '@powerfulyang/utils';
import {useInfiniteQuery} from '@tanstack/react-query';
import classNames from 'classnames';
import {motion} from 'framer-motion';
import {flatten} from 'lodash-es';
import Link from 'next/link';
import {useRouter} from 'next/router';
import {Fragment} from 'react';
import {useHotkeys} from 'react-hotkeys-hook';
import {InView} from 'react-intersection-observer';
import styles from './index.module.scss';

type IndexProps = {
  posts: Post[];
  years: number[];
  year: number;
  nextCursor: number;
  prevCursor: number;
};

const Index: LayoutFC<IndexProps> = ({posts, years, year, prevCursor, nextCursor}) => {
  const router = useRouter();
  const {data, isError, fetchPreviousPage, hasPreviousPage, isFetching} = useInfiniteQuery(
    {
      queryKey: ['posts', posts, nextCursor, prevCursor],
      // @ts-expect-error
      queryFn: async ({pageParam}) => {
        const x = await clientApi.infiniteQueryPublicPost({
          ...pageParam,
          take: 10,
          publishYear: year,
        });
        return x.data;
      },
      enabled: false,
      getNextPageParam(lastPage) {
        return {nextCursor: lastPage.nextCursor, prevCursor: undefined};
      },
      getPreviousPageParam(firstPage) {
        const {prevCursor: cursor} = firstPage;
        if (cursor) {
          return {prevCursor: cursor, nextCursor: undefined};
        }
        return null;
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
        pageParams: [{nextCursor: lastItem(posts)?.id, prevCursor: firstItem(posts)?.id}],
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
                <br/>
                <span>Author: {post.createBy.nickname}</span>
              </section>
            </motion.a>
          </Fragment>
        ))}
        {!isError &&
          !isFetching &&
          !isEmpty(res) &&
          (hasPreviousPage ? (
            <InView
              triggerOnce
              onChange={(inView) => {
                inView && fetchPreviousPage();
              }}
              rootMargin="10px"
              className={styles.footer}
              as="div"
              children={''}/>
          ) : (
            <div className={styles.footer}>已经到达世界的尽头...</div>
          ))}
        {isEmpty(res) && !isFetching && !isError && (
          <div className={styles.footer}>这里只有一片虚无...</div>
        )}
        {isFetching && (
          <div className={styles.footer}>
            <span className={styles.loading}>Loading</span>
          </div>
        )}
        {isError && (
          <div className={styles.footer}>
            <button
              type="button"
              className="pointer text-red-500"
              onClick={() => {
                return fetchPreviousPage();
              }}
            >
              加载失败，点击重试
            </button>
          </div>
        )}
      </section>
    </main>
  );
};

Index.getLayout = (page) => {
  return <UserLayout>{page}</UserLayout>;
};

export const getStaticPaths = async () => {
  const res = await serverApi.queryPublicPostYears();
  const {data} = res;
  return {
    paths: data.map((x) => ({
      params: {
        year: x.publishYear.toString(),
      },
    })),
    fallback: false,
  };
};

export const getStaticProps = async ({params}: { params: { year: string } }) => {
  const years = (await serverApi.queryPublicPostYears()).data.map((x) => x.publishYear);
  const res = await serverApi.infiniteQueryPublicPost({
    publishYear: Number(params.year),
    take: 10,
  });
  const pathViewCount = res.headers.get('x-path-view-count');
  const {data} = res;

  return {
    props: {
      years,
      posts: data.resources,
      nextCursor: data.nextCursor,
      prevCursor: data.prevCursor,
      year: Number(params.year),
      layout: {
        pathViewCount,
      },
      meta: {
        title: `日志 - ${params.year}`,
        description: `发布于 ${params.year} 年的日志`,
        noindex: true,
      },
    },
  };
};

export default Index;
