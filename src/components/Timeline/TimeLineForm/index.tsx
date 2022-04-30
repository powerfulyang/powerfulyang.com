import classNames from 'classnames';
import type { ClipboardEvent } from 'react';
import React, { memo, useCallback, useMemo, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import { interval } from 'rxjs';
import { startWith } from 'rxjs/operators';
import { LazyImage } from '@/components/LazyImage';
import { Switch } from '@/components/Switch';
import type { Feed, FeedCreate } from '@/type/Feed';
import { fileListToFormData, handlePasteImageAndReturnFileList } from '@/utils/copy';
import { requestAtClient } from '@/utils/client';
import { useFormDiscardWarning } from '@/hooks/useFormDiscardWarning';
import styles from './index.module.scss';

type Props = {
  onSubmitSuccess: () => void;
};

export const TimeLineForm = memo<Props>(({ onSubmitSuccess }) => {
  const submitButtonRef = useRef<HTMLButtonElement>(null);

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

  const mutation = useMutation({
    mutationFn: (variables: FeedCreate) => {
      const formData = fileListToFormData(variables.assets, 'assets');
      formData.append('content', variables.content);
      formData.append('public', variables.public ? 'true' : 'false');
      return requestAtClient<Feed>('/feed', {
        body: formData,
        method: 'POST',
      });
    },
    onSuccess() {
      reset();
      onSubmitSuccess();
    },
  });

  const paste = useCallback(
    (e: ClipboardEvent) => {
      const files = handlePasteImageAndReturnFileList(e);
      if (files) {
        setValue('assets', files);
      }
    },
    [setValue],
  );

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

  useFormDiscardWarning(() => {
    return watchFields[0] !== '' || watchFields[1]?.length > 0;
  });

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
            className={classNames({
              'cursor-progress': mutation.isLoading,
            })}
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
          {assets.map((item) => (
            <a key={item.key} href={item.src} target="_blank" rel="noreferrer">
              <LazyImage
                containerClassName="rounded shadow-lg"
                className={styles.img}
                src={item.src}
              />
            </a>
          ))}
        </div>
        <span className="text-red-400 my-1 mr-4 block text-right">{errors.content?.message}</span>
        <div className="flex items-center justify-end text-right pr-4 mb-4">
          <Switch
            {...register('public', {
              required: true,
            })}
            checkedDescription="公开"
            uncheckedDescription="私密"
          />
          <label htmlFor="assets" className="inline-block px-4 text-pink-400 text-lg pointer">
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
            ref={submitButtonRef}
            className={classNames(styles.timelineSubmit)}
          >
            发送
          </button>
        </div>
      </form>
    </div>
  );
});

TimeLineForm.displayName = 'TimeLineForm';
