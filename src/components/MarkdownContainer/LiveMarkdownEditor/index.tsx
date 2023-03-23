import type { ClipboardEvent, FC } from 'react';
import React, { useDeferredValue, useEffect, useRef } from 'react';
import { Icon } from '@powerfulyang/components';
import classNames from 'classnames';
import type { VoidFunction } from '@powerfulyang/utils';
import { fromEvent } from 'rxjs';
import { handlePasteImageAndReturnAsset } from '@/utils/copy';
import { MarkdownImageFromAssetManageAltConstant } from '@/constant/Constant';
import dynamic from 'next/dynamic';
import { editor } from 'monaco-editor';
import type { Monaco } from '@monaco-editor/react';
import { useIsomorphicLayoutEffect } from 'framer-motion';
import { LazyMarkdownContainer } from '@/components/MarkdownContainer/lazy';
import styles from './index.module.scss';
import IStandaloneCodeEditor = editor.IStandaloneCodeEditor;

export type MarkdownMetadata = {
  author?: string;
  tags?: string[];
  posterId?: number;
  date?: string;
  title: string;
};

type MarkdownEditorProps = {
  defaultValue?: string;
  onPost?: VoidFunction<[MarkdownMetadata]>;
  onChange?: VoidFunction<[string | undefined]>;
  value: string;
};

const DynamicMonacoEditor = dynamic(() => import('./editor'), {
  ssr: false,
  loading: () => <div className="flex h-full w-full items-center justify-center">Loading...</div>,
});

export const LiveMarkdownEditor: FC<MarkdownEditorProps> = ({
  defaultValue = '',
  onPost,
  onChange,
  value,
}) => {
  const ref = useRef<{
    editor: IStandaloneCodeEditor;
    monaco: Monaco;
  }>();

  useIsomorphicLayoutEffect(() => {
    const fixRootElement = document.body;
    if (fixRootElement) {
      fixRootElement.style.cssText = `
      overflow: hidden;
      overflow: clip;
      `;
      return () => {
        fixRootElement.removeAttribute('style');
      };
    }
    return () => null;
  }, []);

  const metadataRef = useRef<MarkdownMetadata>({
    title: '',
  });

  useEffect(() => {
    const s = fromEvent<ClipboardEvent>(window, 'paste').subscribe(async (e) => {
      const isFocus = ref.current?.editor.hasTextFocus();
      if (!isFocus) {
        return;
      }
      const r = await handlePasteImageAndReturnAsset(e, 'post');
      if (r?.length && ref.current) {
        const text = r
          .map((asset) => `![${MarkdownImageFromAssetManageAltConstant}](${asset.id})`)
          .join('\r\n');
        const pos = ref.current.editor.getPosition();
        const selection = ref.current.editor.getSelection();

        const range = new ref.current.monaco.Range(
          selection?.startLineNumber || pos?.lineNumber || 0,
          selection?.startColumn || pos?.column || 0,
          selection?.endLineNumber || pos?.lineNumber || 0,
          selection?.endColumn || pos?.column || 0,
        );
        ref.current.editor.executeEdits('', [
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

  const deferValue = useDeferredValue(value);

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
          <DynamicMonacoEditor
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
        <LazyMarkdownContainer
          metadataRef={metadataRef}
          className={styles.preview}
          source={deferValue}
        />
      </main>
    </div>
  );
};
