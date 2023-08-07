import type { Monaco } from '@monaco-editor/react';
import { Icon } from '@powerfulyang/components';
import type { VoidFunction } from '@powerfulyang/utils';
import classNames from 'classnames';
import type { editor } from 'monaco-editor';
import type { ClipboardEvent, FC } from 'react';
import React, { useDeferredValue, useEffect, useRef } from 'react';
import { fromEvent } from 'rxjs';
import { handlePasteImageAndReturnAsset } from '@/utils/copy';
import {
  commands,
  createMarkdownTagCommand,
  MarkdownTags,
  runTagCommand,
} from '@/components/MarkdownContainer/LiveMarkdownEditor/utils';
import { MarkdownImageFromAssetManageAltConstant } from '@/constant/Constant';
import { MarkdownContainer } from '@/components/MarkdownContainer';
import MonacoEditor from './editor';
import styles from './index.module.scss';

export type MarkdownMetadata = {
  author?: string;
  tags?: string[];
  posterId?: number;
  date?: string;
  title: string;
  summary?: string;
};

type MarkdownEditorProps = {
  defaultValue?: string;
  onPost?: VoidFunction<[MarkdownMetadata]>;
  onChange?: VoidFunction<[string | undefined]>;
  value: string;
  loading?: boolean;
};

export const LiveMarkdownEditor: FC<MarkdownEditorProps> = (
  { defaultValue = '', onPost, onChange, value, loading },
) => {
  const ref = useRef<{
    editor: editor.IStandaloneCodeEditor;
    monaco: Monaco;
  }>();

  const metadataRef = useRef<MarkdownMetadata>({
    title: '',
  });

  useEffect(() => {
    const s = fromEvent<ClipboardEvent>(window, 'paste').subscribe(async (e) => {
      const r = await handlePasteImageAndReturnAsset(e, 'post');
      if (r?.length && ref.current) {
        const editorInstance = ref.current.editor;
        const text = r
          .map((asset) => `![${MarkdownImageFromAssetManageAltConstant}](${asset.id})`)
          .join('\r\n');
        const selection = editorInstance.getSelection();
        const operation = { range: selection!, text };
        editorInstance.executeEdits('', [operation]);
        editorInstance.pushUndoStop();
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
        <span title="加粗">
          <Icon
            className={styles.icon}
            type="icon-bold"
            onClick={() => {
              runTagCommand(ref.current?.editor!, {
                startTag: MarkdownTags.Bold,
              });
            }}
          />
        </span>
        <span title="删除">
          <Icon
            className={styles.icon}
            type="icon-strikethrough"
            onClick={() => {
              runTagCommand(ref.current?.editor!, {
                startTag: MarkdownTags.StrikeThrough,
              });
            }}
          />
        </span>
        <span title="斜体">
          <Icon
            className={styles.icon}
            type="icon-italic"
            onClick={() => {
              runTagCommand(ref.current?.editor!, {
                startTag: MarkdownTags.Italic,
              });
            }}
          />
        </span>
        <span title="行内代码">
          <Icon
            className={styles.icon}
            type="icon-code"
            onClick={() => {
              runTagCommand(ref.current?.editor!, {
                startTag: MarkdownTags.InlineCode,
              });
            }}
          />
        </span>
        <span title="代码块">
          <Icon
            className={styles.icon}
            type="icon-pre"
            onClick={() => {
              runTagCommand(ref.current?.editor!, {
                startTag: MarkdownTags.CodeBlock,
              });
            }}
          />
        </span>
        <span title="引用">
          <Icon
            className={styles.icon}
            type="icon-quote"
            onClick={() => {
              runTagCommand(ref.current?.editor!, {
                startTag: MarkdownTags.Blockquote,
                endTag: '',
              });
            }}
          />
        </span>
        <span title="表格">
          <Icon
            className={styles.icon}
            type="icon-table"
            onClick={() => {
              runTagCommand(ref.current?.editor!, {
                startTag: MarkdownTags.Table,
                endTag: '',
              });
            }}
          />
        </span>
        <span title="有序列表">
          <Icon
            className={styles.icon}
            type="icon-orderedlist"
            onClick={() => {
              runTagCommand(ref.current?.editor!, {
                startTag: MarkdownTags.OrderedList,
                endTag: '',
              });
            }}
          />
        </span>
        <span title="无序列表">
          <Icon
            className={styles.icon}
            type="icon-unorderedlist"
            onClick={() => {
              runTagCommand(ref.current?.editor!, {
                startTag: MarkdownTags.UnorderedList,
                endTag: '',
              });
            }}
          />
        </span>
        {loading ? (
          <Icon
            className={classNames(styles.icon, styles.post, 'animate-spin')}
            type="icon-loading"
          />
        ) : (
          <Icon
            className={classNames(styles.icon, styles.post, 'pointer', {
              'hover:bg-blue-300': !loading,
            })}
            type="icon-send"
            onClick={() => {
              onPost?.(metadataRef.current);
            }}
          />
        )}
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
              commands.forEach((command) => {
                ref.current?.editor.addAction({
                  id: command.id,
                  label: command.label,
                  run: createMarkdownTagCommand(command),
                  keybindings: command.keybindings,
                });
              });
            }}
          />
        </section>
        <MarkdownContainer
          metadataRef={metadataRef}
          className={styles.preview}
          source={deferValue}
        />
      </main>
    </div>
  );
};
