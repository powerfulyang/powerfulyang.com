import React, { ClipboardEvent, FC, useEffect, useRef, useState } from 'react';
import { Icon } from '@powerfulyang/components';
import classNames from 'classnames';
import MonacoEditor, { Monaco } from '@monaco-editor/react';
import { VoidFunction } from '@powerfulyang/utils';
import { editor } from 'monaco-editor';
import { fromEvent } from 'rxjs';
import { extractMetaData } from '@/utils/toc';
import { MarkdownWrap } from '@/components/MarkdownWrap';
import { handlePasteImageAndReturnAsset } from '@/utils/copy';
import { AssetBucket } from '@/type/Bucket';
import { MarkdownImageFromAssetManageAltConstant } from '@/constant/Constant';
import styles from './index.module.scss';
import { Asset } from '@/type/Asset';

type IStandaloneCodeEditor = editor.IStandaloneCodeEditor;

type MarkdownEditorProps = {
  defaultValue?: string;
  onPost?: VoidFunction;
};

export type MarkdownMetadata = {
  author: string;
  tags: string[];
  poster: Asset;
};

export const MarkdownEditor: FC<MarkdownEditorProps> = ({ defaultValue = '', onPost }) => {
  const [input, setInput] = useState(defaultValue);
  const [toRender, setToRender] = useState('');
  const ref = useRef<{
    editor: IStandaloneCodeEditor;
    monaco: Monaco;
  }>();

  useEffect(() => {
    const [, r] = extractMetaData(input);
    setToRender(r);
  }, [input]);

  useEffect(() => {
    const s = fromEvent<ClipboardEvent>(window, 'paste').subscribe(async (e) => {
      const isFocus = ref.current?.editor.hasTextFocus();
      if (!isFocus) {
        return;
      }
      const r = await handlePasteImageAndReturnAsset(e, AssetBucket.post);
      if (r?.length) {
        const text = r
          .map((asset) => {
            return `![${MarkdownImageFromAssetManageAltConstant}](${asset.id})`;
          })
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

  const post = () => onPost?.(input);
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
        <Icon className={classNames(styles.icon, styles.post)} type="icon-send" onClick={post} />
      </section>
      <main className={styles.main}>
        <section className={styles.input_content}>
          <MonacoEditor
            defaultLanguage="markdown"
            defaultValue={input}
            onChange={(v) => {
              setInput(v || '');
            }}
            options={{ minimap: { enabled: false } }}
            onMount={(e, m) => {
              ref.current = {
                editor: e,
                monaco: m,
              };
            }}
          />
        </section>
        <MarkdownWrap className={styles.preview} source={toRender} />
      </main>
    </div>
  );
};
