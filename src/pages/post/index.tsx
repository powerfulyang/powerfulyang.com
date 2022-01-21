import React, { useState } from 'react';
import type { GetServerSidePropsContext } from 'next';
import classNames from 'classnames';
import { motion } from 'framer-motion';
import { request } from '@/utils/request';
import type { Post } from '@/type/Post';
import { Link } from '@/components/Link';
import type { LayoutFC } from '@/type/GlobalContext';
import { UserLayout } from '@/layout/UserLayout';
import { DateFormat } from '@/utils/lib';
import styles from './index.module.scss';
import { getCurrentUser } from '@/service/getCurrentUser';
import { MarkdownContainer } from '@/components/MarkdownContainer';
import { AssetImageThumbnail } from '@/components/ImagePreview/AssetImageThumbnail';

type IndexProps = {
  posts: Post[];
  years: number[];
  year: number;
};

const Index: LayoutFC<IndexProps> = ({ posts, years, year }) => {
  const [selectedPostId, setSelectedPostId] = useState(0);

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
              {selectedPostId === post.id && <div className={styles.overlay} />}
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
                transition={
                  selectedPostId
                    ? {
                        type: 'spring',
                        stiffness: 200,
                        damping: 30,
                      }
                    : {
                        type: 'spring',
                        stiffness: 300,
                        damping: 35,
                      }
                }
                className={classNames('pointer w-full h-full overflow-hidden rounded-xl', {
                  [styles.postPreview]: selectedPostId === post.id,
                })}
                onClick={() => togglePost(post.id)}
              >
                <div
                  className={classNames({
                    'w-[60%] overflow-auto': selectedPostId === post.id,
                    'overflow-hidden mt-8': selectedPostId !== post.id,
                  })}
                >
                  <motion.div
                    className="h-[400px] rounded-t-xl overflow-hidden"
                    layoutId={`post-poster-${post.id}`}
                    style={{
                      originX: 0,
                      originY: 0,
                    }}
                  >
                    <AssetImageThumbnail
                      asset={post.poster}
                      containerClassName="h-full scale-100 md:hover:scale-110 transition-all duration-500"
                    />
                  </motion.div>
                  <motion.div
                    style={{
                      originX: 0,
                      originY: 0,
                    }}
                    layoutId={`post-content-${post.id}`}
                  >
                    <MarkdownContainer source={post.content} />
                  </motion.div>
                </div>
              </motion.div>
            </div>
          ))}
        </section>
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
