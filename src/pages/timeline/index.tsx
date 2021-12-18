import type { ChangeEvent, ClipboardEvent } from 'react';
import React, { useEffect, useRef, useState } from 'react';
import type { GetServerSidePropsContext } from 'next';
import classNames from 'classnames';
import { useBeforeUnload, useImmer } from '@powerfulyang/hooks';
import { interval } from 'rxjs';
import { startWith } from 'rxjs/operators';
import { useQueryClient } from 'react-query';
import { UserLayout } from '@/layout/UserLayout';
import { clientRequest, request } from '@/utils/request';
import type { Feed } from '@/type/Feed';
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
import { SUCCESS } from '@/constant/Constant';

type TimelineProps = {
  sourceFeeds: Feed[];
  user?: User;
};

const Timeline: LayoutFC<TimelineProps> = ({ sourceFeeds, user }) => {
  const [content, setContent] = useState('');
  const [assets, setAssets, resetAssets] = useImmer<Asset[]>([]);
  const [disable, setDisable] = useState(true);
  const [uploading, setUploading] = useState(false);
  const queryClient = useQueryClient();
  const [, feeds] = useFeeds(sourceFeeds);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isPublic, setIsPublic] = useState(false);
  const handlePostPrivacy = (checked: boolean) => {
    setIsPublic(checked);
  };
  const ref = useRef<HTMLButtonElement>(null);
  const [submitting, setSubmitting] = useState(false);
  const submitTimeline = async () => {
    setSubmitting(true);
    const { poofClickPlay } = await import('@/components/mo.js/Material');
    const subscribe = interval(500)
      .pipe(startWith(0))
      .subscribe(() => {
        ref.current && poofClickPlay(ref.current);
      });
    const res = await clientRequest('/feed', {
      body: { content, assets, public: isPublic },
      method: 'POST',
    });
    subscribe.unsubscribe();
    if (res.status === SUCCESS) {
      setContent('');
      resetAssets();
      await queryClient.invalidateQueries(useFeeds.Key);
    }
    setSubmitting(false);
  };

  const uploadImages = async (files: FileList) => {
    setUploading(true);
    const images = await uploadFileListAndReturnAsset(files, AssetBucket.timeline);
    setUploading(false);
    if (images) {
      setAssets((draft) => {
        images.forEach((image) => {
          if (!draft.find((asset) => asset.id === image.id)) {
            draft.push(image);
          }
        });
      });
    }
  };

  const paste = async (e: ClipboardEvent) => {
    const files = await handlePasteImageAndReturnFileList(e);
    if (files) {
      await uploadImages(files);
    }
  };

  useEffect(() => {
    if (submitting) {
      setDisable(true);
    } else if (content) {
      setDisable(false);
    } else {
      setDisable(true);
    }
  }, [content, submitting]);

  async function upload(e: ChangeEvent<HTMLInputElement>) {
    const { files } = e.target;
    if (files) {
      await uploadImages(files);
    }
  }

  useBeforeUnload(() => {
    return !!(content || assets.length);
  }, '您的内容尚未发布，确定要离开吗？');

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
                <img src={user?.avatar} className={styles.authorAvatar} alt="" />
                <div className={styles.authorNickname}>{user?.nickname}</div>
                <div className={styles.authorBio}>
                  <span>{user?.bio}</span>
                </div>
              </div>
            </div>

            <div className={styles.timelineInput}>
              <div className={styles.timelineTextarea}>
                <textarea
                  className={classNames({
                    'cursor-progress': uploading,
                  })}
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
                    <AssetImageThumbnail className={styles.img} key={asset.id} asset={asset} />
                  ))}
                </ImagePreview>
              </div>
              <div className="flex items-center justify-end text-right pr-4 mt-4 mb-4">
                <Switch
                  onChange={handlePostPrivacy}
                  checkedDescription="公开"
                  uncheckedDescription="私密"
                />
                <label htmlFor="upload" className="inline-block px-4 text-pink-400 text-lg pointer">
                  上传图片
                  <input
                    id="upload"
                    hidden
                    type="file"
                    accept="image/*,image/heic,image/heif"
                    multiple
                    onChange={upload}
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
                  <img className="rounded" src={feed.createBy.avatar} alt="用户头像" />
                </div>
                <div>
                  <div className={classNames('text-lg', styles.nickname)}>
                    {feed.createBy.nickname}
                  </div>
                  <div className="text-gray-600 text-xs">{DateTimeFormat(feed.createAt)}</div>
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
                      <AssetImageThumbnail key={asset.id} className={styles.img} asset={asset} />
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
