import type { ChangeEvent, ClipboardEvent } from 'react';
import React, { useRef, useState } from 'react';
import type { GetServerSidePropsContext } from 'next';
import classNames from 'classnames';
import { useBeforeUnload, useImmer } from '@powerfulyang/hooks';
import { interval } from 'rxjs';
import { startWith } from 'rxjs/operators';
import { useMutation, useQueryClient } from 'react-query';
import { Collection } from '@powerfulyang/utils';
import { useForm } from 'react-hook-form';
import { UserLayout } from '@/layout/UserLayout';
import { clientRequest, request } from '@/utils/request';
import type { Feed, FeedCreate } from '@/type/Feed';
import { DateTimeFormat } from '@/utils/lib';
import type { LayoutFC } from '@/type/GlobalContext';
import type { User } from '@/type/User';
import { handlePasteImageAndReturnFileList, uploadFileListAndReturnAsset } from '@/utils/copy';
import type { Asset } from '@/type/Asset';
import { ImagePreview } from '@/components/ImagePreview';
import { AssetImageThumbnail } from '@/components/ImagePreview/AssetImageThumbnail';
import { AssetBucket } from '@/type/Bucket';
import styles from './index.module.scss';
import { Switch } from '@/components/Switch';
import { getCurrentUser } from '@/service/getCurrentUser';
import { useFeeds } from '@/queries/useFeeds';
import { useFormDiscardWarning } from '@/hooks/useFormDiscardWarning';

type TimelineProps = {
  sourceFeeds: Feed[];
  user?: User;
};

const Timeline: LayoutFC<TimelineProps> = ({ sourceFeeds, user }) => {
  const [assets, setAssets, resetAssets] = useImmer<Asset[]>([]);
  const [uploading, setUploading] = useState(false);
  const queryClient = useQueryClient();
  const [, feeds] = useFeeds(sourceFeeds);
  const ref = useRef<HTMLButtonElement>(null);

  const mutation = useMutation({
    mutationFn: async (variables: FeedCreate) => {
      const { poofClickPlay } = await import('@/components/mo.js/Material');
      const subscribe = interval(500)
        .pipe(startWith(0))
        .subscribe(() => {
          ref.current && poofClickPlay(ref.current);
        });
      try {
        await clientRequest('/feed', {
          body: variables,
          method: 'POST',
        });
      } finally {
        subscribe.unsubscribe();
      }
    },
    onSuccess() {
      resetAssets();
      return queryClient.invalidateQueries(useFeeds.Key);
    },
  });

  const uploadImages = async (files: FileList) => {
    setUploading(true);
    const images = await uploadFileListAndReturnAsset(files, AssetBucket.timeline);
    setUploading(false);
    if (images) {
      setAssets((draft) => {
        return Collection.merge(draft, images, 'id');
      });
    }
  };

  const paste = async (e: ClipboardEvent) => {
    const files = await handlePasteImageAndReturnFileList(e);
    if (files) {
      await uploadImages(files);
    }
  };

  async function upload(e: ChangeEvent<HTMLInputElement>) {
    const { files } = e.target;
    if (files) {
      await uploadImages(files);
    }
  }

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
    watch,
  } = useForm<FeedCreate>({
    defaultValues: {
      content: '',
      public: true,
    },
  });

  const watchFields = watch(['content', 'assets']);

  useFormDiscardWarning(watchFields);
  useBeforeUnload(() => {
    const { content, assets: images } = getValues();
    return Boolean(content || images?.length);
  }, '内容或图片未保存，确定离开？');

  const onSubmit = (data: FeedCreate) => {
    mutation.mutate(data);
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.timelineShow}>
        {user && (
          <>
            <div className={styles.banner}>
              <AssetImageThumbnail
                asset={user.timelineBackground}
                containerClassName={styles.bannerBg}
                className={classNames(styles.bannerImage)}
              />
              <div className={styles.authorInfo}>
                <img draggable={false} src={user?.avatar} className={styles.authorAvatar} alt="" />
                <div className={styles.authorNickname}>{user?.nickname}</div>
                <div className={styles.authorBio}>
                  <span>{user?.bio}</span>
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
                      'cursor-progress': uploading,
                    })}
                    onPaste={paste}
                    placeholder="写点什么..."
                  />
                </div>
                <div className={classNames(styles.assets)}>
                  <ImagePreview images={assets}>
                    {assets?.map((asset) => (
                      <AssetImageThumbnail className={styles.img} key={asset.id} asset={asset} />
                    ))}
                  </ImagePreview>
                </div>
                <div className="flex items-center justify-end text-right pr-4 mb-4">
                  <span className="text-red-500 mr-auto ml-4">{errors.content?.message}</span>
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
                      {...register('assets', {
                        onChange: upload,
                      })}
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
                  <img
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
                        <AssetImageThumbnail key={asset.id} className={styles.img} asset={asset} />
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

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const res = await request('/public/feed', { ctx });
  const user = await getCurrentUser(ctx);
  const { data, pathViewCount } = await res.json();
  return {
    props: { sourceFeeds: data, pathViewCount, user, title: '说说' },
  };
};

export default Timeline;
