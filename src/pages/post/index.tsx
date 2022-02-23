import type { KeyboardEvent } from 'react';
import React, { useEffect, useMemo, useState } from 'react';
import type { GetServerSidePropsContext } from 'next';
import classNames from 'classnames';
import { AnimatePresence, motion } from 'framer-motion';
import { fromEvent } from 'rxjs';
import { useRouter } from 'next/router';
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

  useEffect(() => {
    if (selectedPostId) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prevOverflow;
      };
    }
    return () => {};
  }, [selectedPostId]);

  const showPost = (postId: number) => {
    setSelectedPostId(postId);
  };

  const hiddenPost = () => {
    setSelectedPostId(0);
  };

  const togglePost = (postId: number) => {
    if (selectedPostId === postId) {
      hiddenPost();
    } else {
      showPost(postId);
    }
  };

  const router = useRouter();

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

  return (
    <>
      <div className={styles.body}>
        <main className={styles.main} id="main">
          <div className={classNames(styles.years, 'mx-8')}>
            {years.map((x) => (
              <Link key={x} to={`?year=${x}`}>
                <span className={classNames(styles.year)}>
                  <span
                    className={classNames('pr-1', {
                      [`text-lg ${styles.active}`]: x === year,
                    })}
                  >
                    #{x}
                  </span>
                </span>
              </Link>
            ))}
          </div>
          <section className="flex flex-wrap w-[100%] max-w-[1300px] m-auto">
            {posts.map((post) => (
              <motion.div
                key={post.id}
                className={classNames('pointer', styles.card)}
                onClick={(e) => {
                  if (e.metaKey || e.ctrlKey) {
                    return router.push(`/post/${post.id}`);
                  }
                  return togglePost(post.id);
                }}
              >
                <AnimatePresence initial={false}>
                  {selectedPostId !== post.id && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className={styles.cardHeader}
                    >
                      <div>
                        <div className={styles.cardHeaderTitle}>{post.title}</div>
                      </div>
                      <div>
                        <div className={styles.cardHeaderDate}>{DateTimeFormat(post.createAt)}</div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                <motion.div layoutId={`post-container-${post.id}`} className={styles.container}>
                  <motion.div className={styles.image} layoutId={`post-poster-${post.id}`}>
                    <AssetImageThumbnail className="object-none" asset={post.poster} />
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
              style={{ pointerEvents: 'auto' }}
            />
            <motion.div
              className={classNames(styles.postPreview, 'pointer')}
              onClick={() => {
                togglePost(selectedPostId);
              }}
            >
              <motion.div
                transition={{ type: 'spring', stiffness: 150, damping: 35 }}
                layoutId={`post-container-${selectedPost.id}`}
                className={classNames(styles.container, 'default')}
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <motion.div className={styles.image} layoutId={`post-poster-${selectedPost.id}`}>
                  <AssetImageThumbnail
                    blur={false}
                    className="object-none"
                    asset={selectedPost.poster}
                  />
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

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
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
