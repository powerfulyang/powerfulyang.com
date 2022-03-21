import type { ClipboardEvent } from 'react';
import React, { useMemo, useRef } from 'react';
import type { GetServerSideProps } from 'next';
import classNames from 'classnames';
import { useBeforeUnload } from '@powerfulyang/hooks';
import { interval } from 'rxjs';
import { startWith } from 'rxjs/operators';
import { useMutation, useQueryClient } from 'react-query';
import { useForm } from 'react-hook-form';
import { UserLayout } from '@/layout/UserLayout';
import { clientRequest, request } from '@/utils/request';
import type { Feed, FeedCreate } from '@/type/Feed';
import { DateTimeFormat } from '@/utils/lib';
import type { LayoutFC } from '@/type/GlobalContext';
import type { User } from '@/type/User';
import { fileListToFormData, handlePasteImageAndReturnFileList } from '@/utils/copy';
import { ImagePreview } from '@/components/ImagePreview';
import { AssetImageThumbnail } from '@/components/ImagePreview/AssetImageThumbnail';
import styles from './index.module.scss';
import { Switch } from '@/components/Switch';
import { getCurrentUser } from '@/service/getCurrentUser';
import { useFeeds } from '@/queries/useFeeds';
import { useFormDiscardWarning } from '@/hooks/useFormDiscardWarning';
import { LazyImage } from '@/components/LazyImage';

type TimelineProps = {
  sourceFeeds: Feed[];
  user?: User;
};

const Timeline: LayoutFC<TimelineProps> = ({ sourceFeeds, user }) => {
  const queryClient = useQueryClient();
  const [, feeds] = useFeeds(sourceFeeds);
  const ref = useRef<HTMLButtonElement>(null);

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors },
    watch,
    reset,
  } = useForm<FeedCreate>({
    defaultValues: {
      content: '',
      public: true,
    },
  });

  const mutation = useMutation({
    mutationFn: (variables: FeedCreate) => {
      const formData = fileListToFormData(variables.assets, 'assets');
      formData.append('content', variables.content);
      formData.append('public', variables.public ? 'true' : 'false');
      return clientRequest('/feed', {
        body: formData,
        method: 'POST',
      });
    },
    onSuccess() {
      reset();
      return queryClient.invalidateQueries(useFeeds.Key);
    },
  });

  const paste = async (e: ClipboardEvent) => {
    const files = await handlePasteImageAndReturnFileList(e);
    if (files) {
      setValue('assets', files);
    }
  };

  const watchFields = watch(['content', 'assets']);

  const assets = useMemo(() => {
    const files = watchFields[1];
    if (!files) {
      return [];
    }
    const arr = [];
    for (let i = 0; i < files.length; i++) {
      arr.push({
        src: URL.createObjectURL(files[i]),
        key: i,
      });
    }
    return arr;
  }, [watchFields]);

  useFormDiscardWarning(watchFields);
  useBeforeUnload(() => {
    const { content, assets: images } = getValues();
    return Boolean(content || images?.length);
  }, '内容或图片未保存，确定离开？');

  const onSubmit = async (data: FeedCreate) => {
    const { poofClickPlay } = await import('@/components/mo.js/Material');
    const source$ = interval(500)
      .pipe(startWith(0))
      .subscribe(() => {
        ref.current && poofClickPlay(ref.current);
      });
    mutation.mutate(data, {
      onSettled() {
        source$.unsubscribe();
      },
    });
  };

  const bannerUser = useMemo(() => {
    return user || sourceFeeds[0]?.createBy || {};
  }, [user, sourceFeeds]);

  return (
    <div className={styles.wrap}>
      <div className={styles.timelineShow}>
        {bannerUser && (
          <>
            <div className={styles.banner}>
              <AssetImageThumbnail
                asset={bannerUser.timelineBackground}
                containerClassName={styles.bannerBg}
                className={classNames(styles.bannerImage)}
              />
              <div className={styles.authorInfo}>
                <img
                  draggable={false}
                  src={bannerUser.avatar}
                  className={styles.authorAvatar}
                  alt=""
                />
                <div className={styles.authorNickname}>{bannerUser.nickname}</div>
                <div className={styles.authorBio}>
                  <span>{bannerUser.bio}</span>
                </div>
              </div>
            </div>

            <div className={styles.timelineInput}>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className={styles.timelineTextarea}>
                  <textarea
                    {...register('content', {
                      required: '请写点什么~~~',
                    })}
                    className={classNames({
                      'cursor-progress': mutation.isLoading,
                    })}
                    onPaste={paste}
                    placeholder="写点什么..."
                  />
                </div>
                <div className={classNames(styles.assets)}>
                  {assets.map((item) => (
                    <LazyImage
                      containerClassName="rounded shadow-lg"
                      className={styles.img}
                      key={item.key}
                      src={item.src}
                    />
                  ))}
                </div>
                <span className="text-red-400 my-1 mr-4 block text-right">
                  {errors.content?.message}
                </span>
                <div className="flex items-center justify-end text-right pr-4 mb-4">
                  <Switch
                    {...register('public', {
                      required: true,
                    })}
                    checkedDescription="公开"
                    uncheckedDescription="私密"
                  />
                  <label
                    htmlFor="assets"
                    className="inline-block px-4 text-pink-400 text-lg pointer"
                  >
                    上传图片
                    <input
                      {...register('assets')}
                      id="assets"
                      hidden
                      type="file"
                      accept="image/*,image/heic,image/heif"
                      multiple
                    />
                  </label>
                  <button
                    disabled={mutation.isLoading}
                    type="submit"
                    ref={ref}
                    className={classNames(styles.timelineSubmit)}
                  >
                    发送
                  </button>
                </div>
              </form>
            </div>
          </>
        )}
        <div className={styles.feeds}>
          {feeds?.map((feed) => (
            <div key={feed.id} className={styles.container}>
              <div className={styles.author}>
                <div className={styles.avatar}>
                  <LazyImage
                    draggable={false}
                    className="rounded select-none"
                    src={feed.createBy.avatar}
                    alt="用户头像"
                  />
                </div>
                <div>
                  <div className={classNames('text-lg', styles.nickname)}>
                    {feed.createBy.nickname}
                  </div>
                  <div className="text-gray-600 text-xs cursor-text">
                    {DateTimeFormat(feed.createAt)}
                  </div>
                </div>
              </div>
              <div className={styles.content}>
                <div className={styles.text}>{feed.content}</div>
                {!!feed.assets?.length && (
                  <div className={classNames(styles.assets)}>
                    <ImagePreview images={feed.assets}>
                      {feed.assets?.map((asset) => (
                        <AssetImageThumbnail
                          containerClassName="rounded"
                          key={asset.id}
                          className={styles.img}
                          asset={asset}
                        />
                      ))}
                    </ImagePreview>
                  </div>
                )}
              </div>
            </div>
          ))}
          {!feeds?.length && (
            <div className="text-lg text-pink-400 text-center pt-4">No Content!</div>
          )}
        </div>
      </div>
    </div>
  );
};

Timeline.getLayout = (page) => {
  const { pathViewCount, user } = page.props;
  return (
    <UserLayout user={user} pathViewCount={pathViewCount}>
      {page}
    </UserLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const res = await request('/public/feed', { ctx });
  const user = await getCurrentUser(ctx);
  const { data, pathViewCount } = await res.json();
  return {
    props: { sourceFeeds: data, pathViewCount, user, title: '说说' },
  };
};

export default Timeline;
