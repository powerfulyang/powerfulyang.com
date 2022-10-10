import type { ClipboardEvent, FC } from 'react';
import React, { Suspense, useCallback, useEffect, useRef } from 'react';
import { Icon } from '@powerfulyang/components';
import classNames from 'classnames';
import type { Monaco } from '@monaco-editor/react';
import MonacoEditor from '@monaco-editor/react';
import type { VoidFunction } from '@powerfulyang/utils';
import type { editor } from 'monaco-editor';
import { fromEvent } from 'rxjs';
import { handlePasteImageAndReturnAsset } from '@/utils/copy';
import { AssetBucket } from '@/type/Bucket';
import { MarkdownImageFromAssetManageAltConstant } from '@/constant/Constant';
import { MarkdownContainer } from '@/components/MarkdownContainer';
import styles from './index.module.scss';

type IStandaloneCodeEditor = editor.IStandaloneCodeEditor;

export type MarkdownMetadata = {
  author?: string;
  tags?: string[];
  posterId?: string;
  date?: string;
  title?: string;
};

type MarkdownEditorProps = {
  defaultValue?: string;
  onPost?: VoidFunction<[MarkdownMetadata]>;
  onChange?: VoidFunction<[string | undefined]>;
  value: string;
};

export const MarkdownEditor: FC<MarkdownEditorProps> = ({
  defaultValue = '',
  onPost,
  onChange,
  value,
}) => {
  const ref = useRef<{
    editor: IStandaloneCodeEditor;
    monaco: Monaco;
  }>();

  const metadataRef = useRef<MarkdownMetadata>({});
  const onGenerateMetadata = useCallback((metadata: MarkdownMetadata) => {
    metadataRef.current = metadata;
  }, []);

  useEffect(() => {
    const s = fromEvent<ClipboardEvent>(window, 'paste').subscribe(async (e) => {
      const isFocus = ref.current?.editor.hasTextFocus();
      if (!isFocus) {
        return;
      }
      const r = await handlePasteImageAndReturnAsset(e, AssetBucket.post);
      if (r?.length) {
        const text = r
          .map((asset) => `![${MarkdownImageFromAssetManageAltConstant}](${asset.id})`)
          .join('\r\n');
        const pos = ref.current?.editor.getPosition();
        const selection = ref.current?.editor.getSelection();

        const range = new ref.current!.monaco.Range(
          selection?.startLineNumber || pos?.lineNumber || 0,
          selection?.startColumn || pos?.column || 0,
          selection?.endLineNumber || pos?.lineNumber || 0,
          selection?.endColumn || pos?.column || 0,
        );
        ref.current?.editor.executeEdits('', [
          {
            range,
            text: `\r\n${text}\r\n`,
          },
        ]);
      }
    });
    return () => {
      s.unsubscribe();
    };
  }, []);

  return (
    <div className={classNames(styles.editor)}>
      <section className={styles.toolbar}>
        <Icon className={styles.icon} type="icon-bold" />
        <Icon className={styles.icon} type="icon-header" />
        <Icon className={styles.icon} type="icon-italic" />
        <Icon className={styles.icon} type="icon-quote" />
        <Icon className={styles.icon} type="icon-strikethrough" />
        <Icon className={styles.icon} type="icon-underline" />
        <Icon className={styles.icon} type="icon-code" />
        <Icon className={styles.icon} type="icon-pre" />
        <Icon className={styles.icon} type="icon-table" />
        <Icon className={styles.icon} type="icon-orderedlist" />
        <Icon className={styles.icon} type="icon-unorderedlist" />
        <Icon className={styles.icon} type="icon-wrap" />
        <Icon
          className={classNames(styles.icon, styles.post, 'pointer')}
          type="icon-send"
          onClick={() => {
            onPost?.(metadataRef.current);
          }}
        />
      </section>
      <main className={styles.main}>
        <section className={styles.inputContent}>
          <MonacoEditor
            value={value}
            defaultLanguage="markdown"
            defaultValue={defaultValue}
            onChange={onChange}
            options={{
              minimap: { enabled: false },
              wordWrap: 'on',
            }}
            onMount={(e, m) => {
              ref.current = {
                editor: e,
                monaco: m,
              };
            }}
          />
        </section>
        <Suspense fallback="loading">
          <MarkdownContainer
            onGenerateMetadata={onGenerateMetadata}
            className={styles.preview}
            source={value}
          />
        </Suspense>
      </main>
    </div>
  );
};
