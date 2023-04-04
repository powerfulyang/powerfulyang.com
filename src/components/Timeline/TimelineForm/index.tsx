import classNames from 'classnames';
import type { ChangeEvent, ClipboardEvent } from 'react';
import React, { memo, useCallback, useEffect, useMemo, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { LazyImage } from '@/components/LazyImage';
import { Switch } from '@/components/Switch';
import {
  appendToFileList,
  handlePasteImageAndReturnFileList,
  removeFromFileList,
  sourceUrlToFile,
} from '@/utils/copy';
import { useFormDiscardWarning } from '@/hooks/useFormDiscardWarning';
import type { ImagePreviewItem } from '@/components/ImagePreview';
import { ImagePreview } from '@/components/ImagePreview';
import { Icon } from '@powerfulyang/components';
import { useImmer, useIsomorphicLayoutEffect } from '@powerfulyang/hooks';
import { useEditTimeLineItem } from '@/components/Timeline/TimelineItem';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import type { CreateFeedDto, Feed, UpdateFeedDto } from '@/__generated__/api';
import { clientApi } from '@/request/requestTool';
import confetti from 'canvas-confetti';
import styles from './index.module.scss';

type Props = {
  onSubmitSuccess: (type: 'create' | 'modify', feed: Feed) => void;
};

export const TimeLineForm = memo<Props>(({ onSubmitSuccess }) => {
  const submitButtonRef = useRef<HTMLButtonElement>(null);
  const [editItem, setEditItem] = useEditTimeLineItem();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
    reset,
  } = useForm<UpdateFeedDto | CreateFeedDto>({
    defaultValues: {
      content: '',
      public: true,
    },
    resolver: zodResolver(
      z.object({
        content: z.string().min(1, '请写点什么~~~').max(1000, '内容不能超过1000个字符'),
        public: z.boolean(),
        assets: z.any(),
        id: z.number().optional(),
      }),
    ),
  });

  useEffect(() => {
    if (editItem) {
      setValue('id', editItem.id);
      setValue('content', editItem.content);
      setValue('public', editItem.public);
      (async () => {
        const files = [];
        for (let i = 0; i < editItem.assets?.length; i++) {
          const asset = editItem.assets[i];
          // eslint-disable-next-line no-await-in-loop
          const file = await sourceUrlToFile(asset.objectUrl.original);
          files.push(file);
        }
        setValue('assets', files);
      })();
    }
  }, [editItem, setValue]);

  const mutation = useMutation({
    onMutate() {
      confetti();
    },
    mutationFn: (variables: CreateFeedDto | UpdateFeedDto) => {
      if ('id' in variables) {
        return clientApi.updateFeed(variables).then((res) => res.data);
      }
      return clientApi.createFeed(variables).then((res) => res.data);
    },
    onSuccess(data) {
      reset();
      if (editItem) {
        onSubmitSuccess('modify', data);
        setEditItem(undefined);
      } else {
        onSubmitSuccess('create', data);
      }
    },
  });

  const watchContent = watch('content');
  const watchAssets = watch('assets');

  const paste = useCallback(
    (e: ClipboardEvent) => {
      const files = handlePasteImageAndReturnFileList(e);
      if (files) {
        const tmp = appendToFileList(watchAssets, files);
        setValue('assets', tmp);
      }
    },
    [setValue, watchAssets],
  );

  const handledFile = useRef(new WeakMap<File, any>());

  const [images, setImages] = useImmer<ImagePreviewItem[]>([]);

  const assets = useMemo(() => {
    const files = watchAssets;
    if (!files) {
      return [];
    }
    const arr = [];
    for (let i = 0; i < files.length; i++) {
      if (!handledFile.current.has(files[i])) {
        const resourceUrl = URL.createObjectURL(files[i]);
        const tmp = {
          src: resourceUrl,
          key: resourceUrl,
        };
        handledFile.current.set(files[i], tmp);
        arr.push(tmp);
      } else {
        arr.push(handledFile.current.get(files[i]));
      }
    }
    return arr;
  }, [watchAssets]);

  useIsomorphicLayoutEffect(() => {
    setImages([]);
    assets.forEach((item, index) => {
      const image = new Image();
      image.src = item.src;
      image.onload = () => {
        const preview = {
          original: item.src,
          thumbnail: item.src,
          size: {
            width: image.naturalWidth,
            height: image.naturalHeight,
          },
          id: item.src,
        };
        setImages((draft) => {
          draft[index] = preview;
        });
      };
    });
  }, [assets, setImages]);

  useFormDiscardWarning(() => {
    return watchContent !== '' || watchAssets?.length > 0;
  }, [watchContent, watchAssets]);

  const onSubmit = useCallback(
    (v: CreateFeedDto | UpdateFeedDto) => {
      mutation.mutate(v);
    },
    [mutation],
  );
  return (
    <div className={styles.timelineInput}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.timelineTextarea}>
          {editItem && <input hidden {...register('id')} />}
          <textarea
            {...register('content')}
            className={classNames(
              {
                'cursor-progress': mutation.isLoading,
              },
              'resize-none',
            )}
            onPaste={paste}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                submitButtonRef.current && submitButtonRef.current.click();
              }
            }}
            placeholder="写点什么..."
            aria-invalid={errors.content ? 'true' : 'false'}
          />
        </div>
        <div className={classNames(styles.assets)}>
          <ImagePreview parentControl images={images}>
            {assets.map((item, index) => (
              <div key={item.key} className="pointer relative">
                <Icon
                  className="absolute right-0 z-[1] -translate-y-1/2 translate-x-1/2 text-2xl"
                  type="icon-close"
                  onClick={(e) => {
                    e.stopPropagation();
                    URL.revokeObjectURL(item.src);
                    setValue('assets', removeFromFileList(watchAssets, index));
                  }}
                />
                <LazyImage
                  containerClassName="rounded shadow-lg"
                  className={styles.img}
                  src={item.src}
                />
              </div>
            ))}
          </ImagePreview>
        </div>
        {errors.content && (
          <span role="alert" className="my-1 mr-4 block text-right text-red-400">
            {errors.content?.message}
          </span>
        )}
        {editItem && (
          <div className="text-right">
            <button
              onClick={() => {
                reset();
                setEditItem(undefined);
              }}
              type="button"
              className="pointer pr-4 text-gray-500"
            >
              discard
            </button>
          </div>
        )}
        <div className="mb-4 flex items-center justify-end pr-4 text-right">
          <Switch {...register('public')} checkedDescription="公开" uncheckedDescription="私密" />
          <label htmlFor="assets" className="pointer inline-block px-4 text-lg text-pink-400">
            上传图片
            <input
              {...register('assets', {
                onChange: (e: ChangeEvent<HTMLInputElement>) => {
                  const { files } = e.target;
                  if (files?.length) {
                    const tmp = appendToFileList(watchAssets, files);
                    setValue('assets', tmp);
                  }
                },
              })}
              id="assets"
              hidden
              type="file"
              accept="image/*"
              multiple
            />
          </label>
          <button
            disabled={mutation.isLoading}
            type="submit"
            ref={submitButtonRef}
            className={classNames(styles.timelineSubmit)}
          >
            {editItem ? '修改' : '发布'}
          </button>
        </div>
      </form>
    </div>
  );
});

TimeLineForm.displayName = 'TimeLineForm';
