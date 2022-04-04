import type { KeyboardEvent } from 'react';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import type { GetServerSideProps } from 'next';
import classNames from 'classnames';
import { AnimatePresence, motion } from 'framer-motion';
import { fromEvent } from 'rxjs';
import type { Post } from '@/type/Post';
import { Link } from '@/components/Link';
import type { LayoutFC } from '@/type/GlobalContext';
import { UserLayout } from '@/layout/UserLayout';
import styles from './index.module.scss';
import { getCurrentUser } from '@/service/getCurrentUser';
import { MarkdownContainer } from '@/components/MarkdownContainer';
import { DateTimeFormat } from '@/utils/lib';
import { AssetImageThumbnail } from '@/components/ImagePreview/AssetImageThumbnail';
import { useHistory } from '@/hooks/useHistory';
import { useHiddenHtmlOverflow } from '@/hooks/useHiddenHtmlOverflow';
import { requestAtServer } from '@/utils/server';

type IndexProps = {
  posts: Post[];
  years: number[];
  year: number;
  selectedPostId: number;
};

const Index: LayoutFC<IndexProps> = ({ posts, years, year, selectedPostId }) => {
  const selectedPost = useMemo(
    () => posts.find((post) => post.id === selectedPostId),
    [posts, selectedPostId],
  );

  const history = useHistory();

  useEffect(() => {
    history.router.beforePopState((draft) => {
      draft.options.scroll = false;
      return true;
    });
  }, [history.router]);

  const ref = useRef<HTMLDivElement>(null);

  useHiddenHtmlOverflow(Boolean(selectedPostId));

  const showPost = useCallback(
    (postId: number) => {
      const closing = ref.current?.getAttribute('data-id');
      const isDifferent = String(postId) !== closing;
      return (
        isDifferent &&
        history.router.push(
          {
            pathname: `/post/thumbnail/${postId}`,
            query: {
              year: String(year),
            },
          },
          undefined,
          { scroll: false },
        )
      );
    },
    [history.router, year],
  );

  const hiddenPost = useCallback(() => {
    if (ref.current && ref.current.style.pointerEvents !== 'none') {
      // 为了能点击再出现
      ref.current.style.pointerEvents = 'none';
      return history.router.back();
    }
    return Promise.resolve();
  }, [history.router]);

  useEffect(() => {
    const sub = fromEvent<KeyboardEvent>(document, 'keydown').subscribe((e) => {
      if (e.key === 'Escape') {
        return hiddenPost();
      }
      if (e.key === '.') {
        if (selectedPostId) {
          return history.pushState(`/post/publish/${selectedPostId}`);
        }
        return history.pushState('/post/publish');
      }
      return null;
    });
    return () => {
      sub.unsubscribe();
    };
  }, [hiddenPost, history, selectedPostId]);

  return (
    <>
      <div className={styles.body}>
        <main className={styles.main}>
          <div className={classNames(styles.years)}>
            {years.map((x) => (
              <Link key={x} to={`?year=${x}`}>
                <span className={classNames(styles.year)}>
                  <span
                    className={classNames('pr-1', {
                      [styles.active]: x === year,
                    })}
                  >
                    #{x}
                  </span>
                </span>
              </Link>
            ))}
          </div>
          <section className="flex flex-wrap w-[100%] max-w-[1000px] m-auto">
            {posts.map((post) => (
              <motion.div
                key={post.id}
                title={`${post.id}`}
                className={classNames('pointer', styles.card)}
                onTap={async (e) => {
                  if (e.metaKey || e.ctrlKey) {
                    return history.pushState(`/post/${post.id}`);
                  }
                  return showPost(post.id);
                }}
              >
                <AnimatePresence initial={false}>
                  {selectedPostId !== post.id && (
                    <motion.a
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className={styles.cardHeader}
                      href={`/post/${post.id}`}
                      onClick={(e) => e.preventDefault()}
                    >
                      <div className={styles.cardHeaderTitle}>
                        <div>{post.title}</div>
                        <div className={styles.cardHeaderDate}>{DateTimeFormat(post.createAt)}</div>
                      </div>
                    </motion.a>
                  )}
                </AnimatePresence>
                <motion.div
                  layoutId={`post-container-${post.id}`}
                  className={classNames(styles.container)}
                >
                  <motion.a
                    onClick={(e) => e.preventDefault()}
                    className={styles.image}
                    layoutId={`post-poster-${post.id}`}
                    href={`/post/${post.id}`}
                  >
                    <AssetImageThumbnail thumbnail={false} asset={post.poster} />
                  </motion.a>
                  <motion.div className={styles.content} layoutId={`post-content-${post.id}`}>
                    <MarkdownContainer blur={false} source={post.content} />
                  </motion.div>
                </motion.div>
              </motion.div>
            ))}
          </section>
        </main>
      </div>
      <AnimatePresence>
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
              ref={ref}
              data-id={selectedPost.id}
              onClick={() => hiddenPost()}
              key={selectedPostId}
            >
              <motion.div
                transition={{
                  type: 'spring',
                  stiffness: 200,
                  damping: 50,
                }}
                layoutId={`post-container-${selectedPost.id}`}
                className={classNames(styles.container, 'default')}
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <motion.div
                  onTap={() => hiddenPost()}
                  className={styles.image}
                  layoutId={`post-poster-${selectedPost.id}`}
                >
                  <AssetImageThumbnail thumbnail={false} blur={false} asset={selectedPost.poster} />
                </motion.div>
                <motion.div className={styles.content} layoutId={`post-content-${selectedPost.id}`}>
                  <MarkdownContainer blur={false} source={selectedPost.content} />
                </motion.div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

Index.getLayout = (page) => {
  const { pathViewCount, user } = page.props;
  return (
    <UserLayout user={user} pathViewCount={pathViewCount}>
      {page}
    </UserLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { query } = ctx;
  const tmp = await requestAtServer('/public/post/years', {
    ctx,
  });
  const { id = 0 } = query;
  const { data: years = [] } = await tmp.json();
  const year = Number(query.year) || years[0];
  const res = await requestAtServer('/public/post', {
    ctx,
    query: { publishYear: year },
  });
  const { data, pathViewCount } = await res.json();
  const user = await getCurrentUser(ctx);
  return {
    props: {
      pathViewCount,
      years,
      posts: data,
      year,
      title: '日志',
      user,
      selectedPostId: Number(id),
    },
  };
};

export default Index;
