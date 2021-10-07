import React, { ChangeEvent, ClipboardEvent, MouseEvent, useRef, useState } from 'react';
import { GetServerSidePropsContext } from 'next';
import classNames from 'classnames';
import { constants } from 'http2';
import { useImmer } from '@powerfulyang/hooks';
import useSWR, { useSWRConfig } from 'swr';
import { UserLayout } from '@/layout/UserLayout';
import { clientRequest, request } from '@/utils/request';
import { Feed } from '@/types/Feed';
import { CosUtils, DateTimeFormat } from '@/utils/lib';
import { LayoutFC } from '@/types/GlobalContext';
import { User } from '@/types/User';
import { handlePasteImageAndReturnAsset, uploadFileListAndReturnAsset } from '@/utils/copy';
import { Asset } from '@/types/Asset';
import { ImagePreview } from '@/components/ImagePreview';
import { ImageThumbnailWrap } from '@/components/ImagePreview/ImageThumbnailWrap';
import { AssetBucket } from '@/types/Bucket';
import styles from './index.module.scss';
import { Switch } from '@/components/Switch';
import { LazyImage } from '@/components/LazyImage';

type TimelineProps = {
  sourceFeeds: Feed[];
  user?: User;
};

const Timeline: LayoutFC<TimelineProps> = ({ sourceFeeds, user }) => {
  const [content, setContent] = useState('');
  const [assets, setAssets] = useImmer<Asset[]>([]);
  const { mutate } = useSWRConfig();
  const { data: feeds } = useSWR(
    'api-fetch-feed',
    async () => {
      let url = '/public/feed';
      if (user) {
        url = '/feed';
      }
      const { data } = await clientRequest<Feed[]>(url);
      return data;
    },
    { fallbackData: sourceFeeds },
  );
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isPublic, setIsPublic] = useState(false);
  const handlePostPrivacy = (checked: boolean) => {
    setIsPublic(checked);
  };
  const submitTimeline = async (e: MouseEvent) => {
    import('@/components/mo.js/Material').then((res) => {
      res.poofClick(e);
    });
    const res = await clientRequest('/feed', {
      body: { content, assets, public: isPublic },
      method: 'POST',
    });
    if (res.status === 'ok') {
      setContent('');
      setAssets([]);
      mutate('api-fetch-feed');
    }
  };

  const paste = async (e: ClipboardEvent) => {
    const images = await handlePasteImageAndReturnAsset(e, AssetBucket.timeline);
    if (images) {
      setAssets((draft) => {
        draft.push(...images);
      });
    }
  };

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
      <div className={styles.timeline_show}>
        {user && (
          <>
            <div className={styles.banner}>
              <LazyImage
                src={CosUtils.getCosObjectUrl(user?.timelineBackground?.objectUrl)}
                blurSrc={CosUtils.getCosObjectBlurUrl(user?.timelineBackground?.objectUrl)}
                className={styles.banner_bg}
              />
              <div className={styles.author_info}>
                <img src={user?.avatar} className={styles.author_avatar} alt="" />
                <div className={styles.author_nickname}>{user?.nickname}</div>
                <div className={styles.author_bio}>
                  <span>{user?.bio}</span>
                </div>
              </div>
            </div>

            <div className={styles.timeline_input}>
              <div className={styles.timeline_textarea}>
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
                  'py-4': assets.length,
                })}
              >
                <ImagePreview images={assets}>
                  {assets?.map((asset) => (
                    <ImageThumbnailWrap key={asset.id} asset={asset} />
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
                    onChange={uploadImages}
                  />
                </label>
                <button
                  onClick={submitTimeline}
                  type="button"
                  disabled={!content}
                  className={classNames(styles.timeline_submit)}
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
                  <img src={feed.createBy.avatar} alt="用户头像" />
                </div>
                <div>
                  <div className={classNames('text-lg', styles.nickname)}>
                    {feed.createBy.nickname}
                  </div>
                  <div className="text-gray-400 text-xs">{DateTimeFormat(feed.createAt)}</div>
                </div>
              </div>
              <div className={styles.content}>
                <div className={styles.text}>{feed.content}</div>
                <div className={classNames(styles.assets, 'py-4')}>
                  <ImagePreview images={feed.assets}>
                    {feed.assets?.map((asset) => (
                      <ImageThumbnailWrap key={asset.id} asset={asset} />
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
  const { pathViewCount } = page.props;
  return <UserLayout pathViewCount={pathViewCount}>{page}</UserLayout>;
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const tmp = await request('/user/current', { ctx });
  let user = null;
  let url = '/public/feed';
  if (tmp.status === constants.HTTP_STATUS_OK) {
    const { data: u } = await tmp.json();
    user = u;
    url = '/feed';
  }
  const res = await request(url, { ctx });
  const { data, pathViewCount } = await res.json();
  return {
    props: { sourceFeeds: data, pathViewCount, user, title: '说说' },
  };
};

export default Timeline;
