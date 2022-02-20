import React, { useMemo, useState } from 'react';
import type { GetServerSidePropsContext } from 'next';
import classNames from 'classnames';
import { AnimatePresence, motion } from 'framer-motion';
import { request } from '@/utils/request';
import type { Post } from '@/type/Post';
import { Link } from '@/components/Link';
import type { LayoutFC } from '@/type/GlobalContext';
import { UserLayout } from '@/layout/UserLayout';
import { DateFormat } from '@/utils/lib';
import styles from './index.module.scss';
import { getCurrentUser } from '@/service/getCurrentUser';
import { MarkdownContainer } from '@/components/MarkdownContainer';

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

  return (
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
        <section className="flex flex-wrap">
          {posts.map((post) => (
            <div key={post.id} className={styles.card}>
              <div className={classNames('flex flex-col', styles.postTitle)}>
                <span className="flex">
                  <span className={classNames(styles.articleTitle)}>
                    {DateFormat(post.createAt)}
                  </span>
                </span>
                <span title={post.title} className={classNames('flex items-center')}>
                  <span className={classNames(styles.articleTitle, 'truncate')}>{post.title}</span>
                </span>
              </div>
              <motion.div
                id={`post-${post.id}`}
                layoutId={`post-${post.id}`}
                className={classNames('pointer w-full h-full overflow-hidden rounded-xl')}
                onClick={() => togglePost(post.id)}
              >
                <div className={classNames('overflow-hidden mt-8')}>
                  <motion.div
                    className="h-[400px] rounded-t-xl overflow-hidden"
                    layoutId={`post-poster-${post.id}`}
                  >
                    <motion.img
                      layoutId={`post-poster-img-${post.id}`}
                      src={post.poster.objectUrl}
                      alt=""
                    />
                  </motion.div>
                  <motion.div
                    className={styles.layout}
                    layoutId={`post-content-${post.id}`}
                    layout="position"
                  >
                    <MarkdownContainer source={post.content} />
                  </motion.div>
                </div>
              </motion.div>
            </div>
          ))}
        </section>
        <AnimatePresence>
          {selectedPost && (
            <>
              <motion.div
                className={styles.overlay}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.15 } }}
                transition={{ duration: 0.2, delay: 0.15 }}
                style={{ pointerEvents: 'auto' }}
              />
              <div className={styles.postPreview}>
                <motion.div
                  id={`post-${selectedPost.id}`}
                  layoutId={`post-${selectedPost.id}`}
                  className={classNames(
                    'pointer w-full h-full overflow-hidden rounded-xl',
                    styles.postPreview,
                  )}
                  onClick={() => togglePost(selectedPostId)}
                >
                  <div className={styles.layout}>
                    <motion.div
                      className="h-[400px] rounded-t-xl overflow-hidden"
                      layoutId={`post-poster-${selectedPost.id}`}
                    >
                      <motion.img
                        layoutId={`post-poster-img-${selectedPost.id}`}
                        src={selectedPost.poster.objectUrl}
                        alt=""
                      />
                    </motion.div>
                    <motion.div
                      className={styles.layout}
                      layoutId={`post-content-${selectedPost.id}`}
                      layout="position"
                    >
                      <MarkdownContainer source={selectedPost.content} />
                    </motion.div>
                  </div>
                </motion.div>
              </div>
            </>
          )}
        </AnimatePresence>
      </main>
    </div>
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
