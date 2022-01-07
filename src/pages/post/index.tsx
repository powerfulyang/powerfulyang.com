import React, { useMemo, useRef, useState } from 'react';
import type { GetServerSidePropsContext } from 'next';
import classNames from 'classnames';
import { AnimatePresence, AnimateSharedLayout, motion } from 'framer-motion';
import { scrollIntoView } from '@powerfulyang/utils';
import { request } from '@/utils/request';
import type { Post } from '@/type/Post';
import { Link } from '@/components/Link';
import type { LayoutFC } from '@/type/GlobalContext';
import { UserLayout } from '@/layout/UserLayout';
import { CosUtils, DateFormat } from '@/utils/lib';
import styles from './index.module.scss';
import { getCurrentUser } from '@/service/getCurrentUser';
import { AssetImageThumbnail } from '@/components/ImagePreview/AssetImageThumbnail';
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
    scrollIntoView(document.getElementById('main'), {
      behavior: 'smooth',
    });
  };

  const ref = useRef(0);

  const hiddenPost = (postId: number) => {
    setSelectedPostId(0);
    ref.current = postId;
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
        <AnimateSharedLayout>
          <section className="flex-col sm:flex-row flex flex-wrap">
            {posts.map((post) => (
              <motion.div
                id={`post-${post.id}`}
                initial={false}
                layoutId={`post-${post.id}`}
                key={post.id}
                hidden={!!selectedPostId}
                className="sm:flex-grow w-full sm:w-auto sm:max-w-[50%] pointer px-4"
                onClick={() => showPost(post.id)}
              >
                <div className="rounded-xl shadow-lg overflow-hidden mt-8">
                  <div className="h-[12rem] sm:h-[18rem] rounded-t-xl overflow-hidden">
                    <AssetImageThumbnail
                      containerClassName="h-full scale-100 md:hover:scale-110 transition-all duration-500"
                      asset={post.poster}
                      layoutId={`post-poster-${post.id}`}
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="inline-block text-base whitespace-nowrap px-4 mt-2 text-gray-400 font-normal">
                      {DateFormat(post.createAt)}
                    </span>
                    <span title={post.title} className={classNames('flex items-center')}>
                      <span className={classNames(styles.articleTitle, 'truncate')}>
                        {post.title}
                      </span>
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </section>
          <AnimatePresence
            onExitComplete={() => {
              scrollIntoView(document.getElementById(`post-${ref.current}`), {
                behavior: 'smooth',
                block: 'center',
              });
            }}
          >
            {selectedPost && (
              <motion.div
                onClick={() => hiddenPost(selectedPostId)}
                className={classNames(styles.postPreview, 'pointer')}
                layoutId={`post-${selectedPostId}`}
              >
                <motion.div
                  className="flex flex-col items-center w-[900px] rounded-lg overflow-hidden shadow-lg"
                  onClick={(e) => e.stopPropagation()}
                >
                  <motion.img
                    className="h-[12rem] sm:h-[18rem] w-full object-cover"
                    src={CosUtils.getCosObjectThumbnailUrl(selectedPost.poster.objectUrl)}
                    layoutId={`post-poster-${selectedPostId}`}
                  />
                  <MarkdownContainer source={selectedPost.content} />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </AnimateSharedLayout>
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
