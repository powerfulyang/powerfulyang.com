import type { KeyboardEvent } from 'react';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import type { GetServerSideProps } from 'next';
import classNames from 'classnames';
import { AnimatePresence, motion } from 'framer-motion';
import { fromEvent } from 'rxjs';
import { request } from '@/utils/request';
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

type IndexProps = {
  posts: Post[];
  years: number[];
  year: number;
};

const Index: LayoutFC<IndexProps> = ({ posts, years, year }) => {
  const [selectedPostId, setSelectedPostId] = useState(0);

  const selectedPost = useMemo(
    () => posts.find((post) => post.id === selectedPostId),
    [posts, selectedPostId],
  );

  const ref = useRef<HTMLDivElement>(null);

  useHiddenHtmlOverflow(Boolean(selectedPostId));

  const showPost = (postId: number) => {
    setSelectedPostId(postId);
    if (ref.current) {
      ref.current.style.pointerEvents = 'auto';
    }
  };

  const hiddenPost = () => {
    if (ref.current) {
      // 必须设置 key，否则会导致 选择新的 post 后，依然渲染在旧的 preview container 上
      // 加 layoutId 感觉应该也可以解决问题 但是加了之后 ref 似乎不太对，导致 pointerEvents 设置为 none 无效
      // 应该来说是 layoutId 的 bug
      ref.current.style.pointerEvents = 'none';
    }
    setSelectedPostId(0);
  };

  useEffect(() => {
    const sub = fromEvent<KeyboardEvent>(document, 'keydown').subscribe((e) => {
      if (e.key === 'Escape') {
        hiddenPost();
      }
    });
    return () => {
      sub.unsubscribe();
    };
  }, []);

  const { pushState } = useHistory();

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
                    return pushState(`/post/${post.id}`);
                  }
                  return showPost(post.id);
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
                    <AssetImageThumbnail thumbnail={false} asset={post.poster} />
                  </motion.div>
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
              onClick={() => {
                hiddenPost();
              }}
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
  const tmp = await request('/public/post/years', {
    ctx,
  });
  const { data: years = [] } = await tmp.json();
  const year = query.year || years[0];
  const res = await request('/public/post', {
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
    },
  };
};

export default Index;
