import type { ChangeEvent, ClipboardEvent } from 'react';
import React, { useEffect, useRef, useState } from 'react';
import type { GetServerSidePropsContext } from 'next';
import classNames from 'classnames';
import { useImmer } from '@powerfulyang/hooks';
import { interval } from 'rxjs';
import { startWith } from 'rxjs/operators';
import { useQueryClient } from 'react-query';
import { UserLayout } from '@/layout/UserLayout';
import { clientRequest, request } from '@/utils/request';
import type { Feed } from '@/type/Feed';
import { CosUtils, DateTimeFormat } from '@/utils/lib';
import type { LayoutFC } from '@/type/GlobalContext';
import type { User } from '@/type/User';
import { handlePasteImageAndReturnAsset, uploadFileListAndReturnAsset } from '@/utils/copy';
import type { Asset } from '@/type/Asset';
import { ImagePreview } from '@/components/ImagePreview';
import { AssetImageThumbnail } from '@/components/ImagePreview/AssetImageThumbnail';
import { AssetBucket } from '@/type/Bucket';
import styles from './index.module.scss';
import { Switch } from '@/components/Switch';
import { LazyImage } from '@/components/LazyImage';
import { getCurrentUser } from '@/service/getCurrentUser';
import { useFeeds } from '@/queries/useFeeds';
import { SUCCESS } from '@/constant/Constant';

type TimelineProps = {
  sourceFeeds: Feed[];
  user?: User;
};

const Timeline: LayoutFC<TimelineProps> = ({ sourceFeeds, user }) => {
  const [content, setContent] = useState('');
  const [assets, setAssets] = useImmer<Asset[]>([]);
  const [disable, setDisable] = useState(true);
  const queryClient = useQueryClient();
  const [, feeds] = useFeeds(sourceFeeds);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isPublic, setIsPublic] = useState(false);
  const handlePostPrivacy = (checked: boolean) => {
    setIsPublic(checked);
  };
  const ref = useRef<HTMLButtonElement>(null);
  const submitTimeline = async () => {
    const { poofClickPlay } = await import('@/components/mo.js/Material');
    const subscribe = interval(500)
      .pipe(startWith(0))
      .subscribe(() => {
        poofClickPlay(ref.current!);
        setDisable(true);
      });
    const res = await clientRequest('/feed', {
      body: { content, assets, public: isPublic },
      method: 'POST',
    });
    subscribe.unsubscribe();
    if (res.status === SUCCESS) {
      setContent('');
      setAssets([]);
      await queryClient.invalidateQueries(useFeeds.name);
    }
    setDisable(false);
  };

  const paste = async (e: ClipboardEvent) => {
    const images = await handlePasteImageAndReturnAsset(e, AssetBucket.timeline);
    if (images) {
      setAssets((draft) => {
        draft.push(...images);
      });
    }
  };

  useEffect(() => {
    if (content) {
      setDisable(false);
    }
  }, [content]);

  const uploadImages = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files!;
    const images = await uploadFileListAndReturnAsset(files, AssetBucket.timeline);
    if (images) {
      setAssets((draft) => {
        draft.push(...images);
      });
    }
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.timelineShow}>
        {user && (
          <>
            <div className={styles.banner}>
              <LazyImage
                src={CosUtils.getCosObjectUrl(user?.timelineBackground?.objectUrl)}
                blurSrc={CosUtils.getCosObjectBlurUrl(user?.timelineBackground?.objectUrl)}
                containerClassName="z-[-1]"
                className={styles.bannerBg}
              />
              <div className={styles.authorInfo}>
                <LazyImage src={user?.avatar} containerClassName={styles.authorAvatar} alt="" />
                <div className={styles.authorNickname}>{user?.nickname}</div>
                <div className={styles.authorBio}>
                  <span>{user?.bio}</span>
                </div>
              </div>
            </div>

            <div className={styles.timelineInput}>
              <div className={styles.timelineTextarea}>
                <textarea
                  name="timeline_input"
                  onChange={(e) => {
                    setContent(e.target.value);
                  }}
                  ref={textareaRef}
                  value={content}
                  onPaste={paste}
                  placeholder="写点什么..."
                />
              </div>
              <div
                className={classNames(styles.assets, {
                  'py-2': assets.length,
                })}
              >
                <ImagePreview images={assets}>
                  {assets?.map((asset) => (
                    <AssetImageThumbnail key={asset.id} asset={asset} />
                  ))}
                </ImagePreview>
              </div>
              <div className="flex items-center justify-end text-right pr-4 mt-4 mb-4">
                <Switch
                  onChange={handlePostPrivacy}
                  checkedDescription="公开"
                  uncheckedDescription="私密"
                />
                <label htmlFor="upload" className="inline-block px-4 text-pink-400 text-lg">
                  上传图片
                  <input
                    id="upload"
                    hidden
                    type="file"
                    accept="image/*,image/heic,image/heif"
                    multiple
                    onChange={uploadImages}
                  />
                </label>
                <button
                  onClick={submitTimeline}
                  type="button"
                  ref={ref}
                  disabled={disable}
                  className={classNames(styles.timelineSubmit)}
                >
                  发送
                </button>
              </div>
            </div>
          </>
        )}
        <div className={styles.feeds}>
          {feeds?.map((feed) => (
            <div key={feed.id} className={styles.container}>
              <div className={styles.author}>
                <div className={styles.avatar}>
                  <LazyImage
                    containerClassName="rounded-full"
                    src={feed.createBy.avatar}
                    alt="用户头像"
                  />
                </div>
                <div>
                  <div className={classNames('text-lg', styles.nickname)}>
                    {feed.createBy.nickname}
                  </div>
                  <div className="text-gray-400 text-xs">{DateTimeFormat(feed.createAt)}</div>
                </div>
              </div>
              <div className={styles.content}>
                <div className={styles.text}>
                  {feed.content.split('\n').map((line, index) => (
                    <div key={String(index)}>{line}</div>
                  ))}
                </div>
                <div hidden={!feed.assets?.length} className={classNames(styles.assets, 'mb-2')}>
                  <ImagePreview images={feed.assets}>
                    {feed.assets?.map((asset) => (
                      <AssetImageThumbnail
                        key={asset.id}
                        containerClassName={styles.img}
                        asset={asset}
                      />
                    ))}
                  </ImagePreview>
                </div>
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
