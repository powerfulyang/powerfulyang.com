import type { FC, RefObject } from 'react';
import React, { Suspense, useCallback, useMemo, useRef, useState } from 'react';
import type { GetServerSideProps } from 'next';
import classNames from 'classnames';
import { AnimatePresence, motion } from 'framer-motion';
import type { Post } from '@/type/Post';
import { Link } from '@/components/Link';
import type { LayoutFC } from '@/type/GlobalContext';
import { UserLayout } from '@/layout/UserLayout';
import { DateTimeFormat } from '@/utils/lib';
import { LazyAssetImage } from '@/components/LazyImage/LazyAssetImage';
import { useHistory } from '@/hooks/useHistory';
import { useHiddenHtmlOverflow } from '@/hooks/useHiddenHtmlOverflow';
import { requestAtServer } from '@/utils/server';
import { isString } from '@powerfulyang/utils';
import { useIsomorphicLayoutEffect } from '@powerfulyang/hooks';
import { Skeleton } from '@/components/Skeleton';
import { useQuery } from '@tanstack/react-query';
import { requestAtClient } from '@/utils/client';
import { LazyMarkdownContainer } from '@/components/MarkdownContainer/lazy';
import { useHotkeys } from 'react-hotkeys-hook';
import { BackToTop } from '@/components/BackToTop';
import Lottie from 'lottie-react';
import CuteUnicorn from '@/lottie/CuteUnicorn.json';
import styles from './index.module.scss';

export type Props = {
  selectedPost?: Post;
  containerRef: RefObject<HTMLDivElement>;
  hiddenPost: () => void;
};

const PostPreview: FC<Props> = ({ selectedPost, containerRef, hiddenPost }) => {
  const [show, setShow] = useState(false);

  useIsomorphicLayoutEffect(() => {
    if (!selectedPost) {
      setShow(false);
    }
  }, [selectedPost]);

  const { data: source } = useQuery(
    ['post', selectedPost?.id],
    () => {
      return requestAtClient<Post>(`/public/post/${selectedPost!.id}`);
    },
    {
      enabled: show && !!selectedPost,
      select: (data) => {
        return data.data.content;
      },
    },
  );

  return (
    <AnimatePresence custom={{ show, source }} mode="wait">
      {selectedPost && (
        <>
          <motion.div
            className={styles.overlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
            transition={{ duration: 0.8 }}
          />
          <motion.div
            className={classNames(styles.postPreview, 'pointer')}
            ref={containerRef}
            onClick={hiddenPost}
            key={selectedPost.id}
          >
            <motion.div
              onLayoutAnimationComplete={() => {
                setShow(true);
              }}
              transition={{
                type: 'spring',
                stiffness: 200,
                damping: 50,
              }}
              layoutId={`post-container-${selectedPost.id}`}
              className={classNames(styles.container, 'default')}
            >
              <motion.div className={styles.image} layoutId={`post-poster-${selectedPost.id}`}>
                <LazyAssetImage
                  draggable={false}
                  onClick={hiddenPost}
                  asset={selectedPost.poster}
                  thumbnail={700}
                />
              </motion.div>
              <motion.div
                onClick={(e) => {
                  e.stopPropagation();
                }}
                className={styles.content}
                layoutId={`post-content-${selectedPost.id}`}
              >
                <Suspense fallback={<Skeleton rows={8} />}>
                  {(source && (
                    <motion.div layout="position">
                      <LazyMarkdownContainer source={source} />
                    </motion.div>
                  )) || <Skeleton rows={8} />}
                </Suspense>
              </motion.div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

type IndexProps = {
  posts: Post[];
  years: number[];
  year: number;
};

const Index: LayoutFC<IndexProps> = ({ posts, years, year }) => {
  const history = useHistory();
  const { id } = history.router.query;
  const [selectedPostId, setSelectedPostId] = useState(0);
  useIsomorphicLayoutEffect(() => {
    if (isString(id)) {
      const postId = parseInt(id, 10);
      setSelectedPostId(postId);
    } else {
      setSelectedPostId(0);
    }
  }, [id]);
  const selectedPost = useMemo(
    () => posts.find((post) => post.id === selectedPostId),
    [posts, selectedPostId],
  );

  const ref = useRef<HTMLDivElement>(null);

  useHiddenHtmlOverflow(Boolean(selectedPostId));

  const showPost = useCallback(
    (postId: number) => {
      if (ref.current) {
        ref.current.style.pointerEvents = 'auto';
      }
      return history.router.push(
        {
          pathname: `/post/thumbnail/${postId}`,
          query: {
            year: String(year),
          },
        },
        undefined,
        { shallow: true },
      );
    },
    [history.router, year],
  );

  const hiddenPost = useCallback(() => {
    if (ref.current) {
      ref.current.style.pointerEvents = 'none';
    }
    return history.router.push(
      {
        pathname: '/post',
        query: {
          year: String(year),
        },
      },
      undefined,
      { shallow: true },
    );
  }, [history.router, year]);

  useHotkeys(
    'escape',
    () => {
      selectedPostId && hiddenPost();
    },
    [selectedPostId, hiddenPost],
  );

  useHotkeys(
    '.',
    () => {
      if (selectedPostId) {
        return history.pushState(`/post/publish/${selectedPostId}`);
      }
      return history.pushState('/post/publish');
    },
    [selectedPostId, history],
  );

  return (
    <>
      <div className={styles.wrap}>
        <main className={styles.main}>
          <div className={classNames(styles.years)} role="tablist">
            {years.map((x) => (
              <Link role="tab" key={x} href={`?year=${x}`}>
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
          <section className="m-auto flex w-[100%] max-w-[1000px] flex-wrap">
            {posts.map((post) => (
              <motion.a
                key={post.id}
                title={`${post.id}`}
                className={classNames('pointer', styles.card)}
                href={`/post/${post.urlTitle}`}
                onClick={(e) => {
                  if (e.ctrlKey || e.metaKey) {
                    return Promise.resolve();
                  }
                  e.preventDefault();
                  if (e.shiftKey) {
                    return showPost(post.id);
                  }
                  return history.pushState(`/post/${post.urlTitle}`);
                }}
              >
                <AnimatePresence initial={false}>
                  {selectedPostId !== post.id && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className={styles.cardHeader}
                    >
                      <div className={styles.cardHeaderTitle}>
                        <div>{post.title}</div>
                        <div className={styles.cardHeaderDate}>{DateTimeFormat(post.createAt)}</div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                <motion.div
                  layoutId={`post-container-${post.id}`}
                  className={classNames(styles.container)}
                >
                  <motion.div className={styles.image} layoutId={`post-poster-${post.id}`}>
                    <LazyAssetImage thumbnail={700} draggable={false} asset={post.poster} />
                  </motion.div>
                  <motion.div className={styles.content} layoutId={`post-content-${post.id}`}>
                    <Skeleton rows={8} />
                  </motion.div>
                </motion.div>
              </motion.a>
            ))}
          </section>
        </main>
      </div>
      <PostPreview hiddenPost={hiddenPost} selectedPost={selectedPost} containerRef={ref} />
      <BackToTop />
      <Lottie
        className="fixed left-10 bottom-28 hidden w-44 sm:block"
        animationData={CuteUnicorn}
      />
    </>
  );
};

Index.getLayout = (page) => {
  const { pathViewCount } = page.props;
  return <UserLayout pathViewCount={pathViewCount}>{page}</UserLayout>;
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { query } = ctx;
  const tmp = await requestAtServer('/public/post/years', {
    ctx,
  });
  const { data: years = [] } = await tmp.json();
  const year = Number(query.year) || years[0] || new Date().getFullYear();
  const res = await requestAtServer('/public/post', {
    ctx,
    query: { publishYear: year },
  });
  const { data, pathViewCount } = await res.json();
  return {
    props: {
      pathViewCount,
      years,
      posts: data,
      year,
      title: '日志',
    },
  };
};

export default Index;
