import { prettify } from '@/prettier/prettifyOnClient';
import type { Monaco } from '@monaco-editor/react';
import type { VoidFunction } from '@powerfulyang/utils';
import classNames from 'classnames';
import type { editor } from 'monaco-editor';
import type { ClipboardEvent, FC } from 'react';
import { useDeferredValue, useEffect, useRef } from 'react';
import { fromEvent } from 'rxjs';
import { handlePasteImageAndReturnAsset } from '@/utils/copy';
import {
  commands,
  createMarkdownTagCommand,
  MarkdownTags,
  runTagCommand,
} from '@/components/MarkdownContainer/LiveMarkdownEditor/utils';
import { MarkdownImageFromAssetManageAltConstant } from '@/constant/Constant';
import { Icon } from '@/components/Icon';
import MonacoEditor from '@/components/monaco-editor/md-editor';
import { MarkdownContainer } from '@/components/MarkdownContainer';
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

export const LiveMarkdownEditor: FC<MarkdownEditorProps> = ({
  defaultValue = '',
  onPost,
  onChange,
  value,
  loading,
}) => {
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
          .map((asset) => `![${MarkdownImageFromAssetManageAltConstant}](${asset.alt})`)
          .join('\r\n');
        const selection = editorInstance.getSelection();
        const operation = { range: selection!, text };
        editorInstance.pushUndoStop();
        editorInstance.executeEdits('', [operation]);
        editorInstance.pushUndoStop();
      } else {
        // 处理文本
        const text = e.clipboardData.getData('text/plain');
        if (text && ref.current) {
          const editorInstance = ref.current.editor;
          const selection = editorInstance.getSelection();
          const operation = { range: selection!, text };
          editorInstance.pushUndoStop();
          editorInstance.executeEdits('', [operation]);
          editorInstance.pushUndoStop();
        }
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
              fontFamily: 'Fira Code, sans-serif',
              pasteAs: {
                enabled: false,
              },
            }}
            onMount={(e, m) => {
              ref.current = {
                editor: e,
                monaco: m,
              };
              e.onDidPaste(({ range }) => {
                // 阻止默认的粘贴行为
                // 请注意，这种方法可能不会完全阻止默认行为，取决于monaco-editor的内部实现
                // 你可能需要寻找更直接的方法来完全控制粘贴过程

                const op2 = { range, text: '', forceMoveMarkers: true };
                e.pushUndoStop();
                e.executeEdits('', [op2]);
                e.pushUndoStop();
              });
              commands.forEach((command) => {
                e.addAction({
                  id: command.id,
                  label: command.label,
                  run: createMarkdownTagCommand(command),
                  keybindings: command.keybindings,
                });
              });
              e.addAction({
                id: 'format',
                label: 'Format',
                contextMenuGroupId: 'navigation',
                contextMenuOrder: 1.5,
                async run() {
                  const source = e.getValue();
                  const formatted = await prettify('markdown', source);
                  e.pushUndoStop();
                  e.executeEdits(source, [
                    {
                      range: e.getModel()!.getFullModelRange(),
                      text: formatted,
                    },
                  ]);
                  e.pushUndoStop();
                },
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
