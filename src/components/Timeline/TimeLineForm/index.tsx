import classNames from 'classnames';
import type { ChangeEvent, ClipboardEvent } from 'react';
import React, { memo, useCallback, useEffect, useMemo, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { interval } from 'rxjs';
import { startWith } from 'rxjs/operators';
import { LazyImage } from '@/components/LazyImage';
import { Switch } from '@/components/Switch';
import type { Feed, FeedCreate } from '@/type/Feed';
import {
  appendToFileList,
  fileListToFormData,
  handlePasteImageAndReturnFileList,
  removeFromFileList,
  sourceUrlToFile,
} from '@/utils/copy';
import { requestAtClient } from '@/utils/client';
import { useFormDiscardWarning } from '@/hooks/useFormDiscardWarning';
import type { ImagePreviewItem } from '@/components/ImagePreview';
import { ImagePreview } from '@/components/ImagePreview';
import { Icon } from '@powerfulyang/components';
import { useImmer, useIsomorphicLayoutEffect } from '@powerfulyang/hooks';
import { useEditTimeLineItem } from '@/components/Timeline/TimeLineItem';
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
  } = useForm<FeedCreate>({
    defaultValues: {
      content: '',
      public: true,
    },
  });

  useEffect(() => {
    if (editItem) {
      setValue('content', editItem.content);
      setValue('public', editItem.public);
      (async () => {
        const tmp = new DataTransfer();
        for (let i = 0; i < editItem.assets?.length; i++) {
          const asset = editItem.assets[i];
          // eslint-disable-next-line no-await-in-loop
          const file = await sourceUrlToFile(asset.objectUrl);
          tmp.items.add(file);
        }
        setValue('assets', tmp.files);
      })();
    }
  }, [editItem, setValue]);

  const mutation = useMutation({
    mutationFn: (variables: FeedCreate) => {
      let method = 'POST';
      const formData = fileListToFormData(variables.assets, 'assets');
      formData.append('content', variables.content);
      formData.append('public', String(variables.public));
      if (editItem) {
        method = 'PUT';
        formData.append('id', String(editItem.id));
      }
      return requestAtClient<Feed>('/feed', {
        body: formData,
        method,
      });
    },
    onSuccess({ data }) {
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
    assets.forEach((item) => {
      const image = new Image();
      image.src = item.src;
      image.onload = () => {
        setImages((draft) => {
          draft.push({
            original: item.src,
            thumbnail: item.src,
            size: {
              width: image.naturalWidth,
              height: image.naturalHeight,
            },
            id: item.src,
          });
        });
      };
    });
  }, [assets, setImages]);

  useFormDiscardWarning(() => {
    return watchContent !== '' || watchAssets?.length > 0;
  }, [watchContent, watchAssets]);

  const onSubmit = useCallback(
    async (v: FeedCreate) => {
      const { poofClickPlay } = await import('@/components/mo.js/Material');
      const source$ = interval(500)
        .pipe(startWith(0))
        .subscribe(() => {
          submitButtonRef.current && poofClickPlay(submitButtonRef.current);
        });
      mutation.mutate(v, {
        onSettled() {
          source$.unsubscribe();
        },
      });
    },
    [mutation],
  );
  return (
    <div className={styles.timelineInput}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.timelineTextarea}>
          <textarea
            {...register('content', {
              required: '请写点什么~~~',
            })}
            className={classNames(
              {
                'cursor-progress': mutation.isLoading,
              },
              'resize-none',
            )}
            onPaste={paste}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.ctrlKey) {
                e.preventDefault();
                submitButtonRef.current && submitButtonRef.current.click();
              }
            }}
            placeholder="写点什么..."
          />
        </div>
        <div className={classNames(styles.assets)}>
          <ImagePreview parentControl images={images}>
            {assets.map((item, index) => (
              <div key={item.key} className="relative">
                <Icon
                  className="pointer absolute -top-5 -right-6 z-[1] h-10 w-10"
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
        <span className="my-1 mr-4 block text-right text-red-400 empty:hidden">
          {errors.content?.message}
        </span>
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
