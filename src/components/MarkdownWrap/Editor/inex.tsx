import React, { FC, useEffect, useState } from 'react';
import { Icon } from '@powerfulyang/components';
import classNames from 'classnames';
import { MarkdownWrap } from '@/components/MarkdownWrap';
import MonacoEditor from '@monaco-editor/react';
import { VoidFunction } from '@powerfulyang/utils';
import styles from './index.module.scss';

type MarkdownEditorProps = {
  defaultValue?: string;
  onChange?: VoidFunction<string>;
};

export const MarkdownEditor: FC<MarkdownEditorProps> = ({ defaultValue = '', onChange }) => {
  const [content, setContent] = useState(defaultValue);
  useEffect(() => {
    if (content) {
      onChange?.(content);
    }
  }, [content, onChange]);
  return (
    <>
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
          <Icon className={styles.icon} type="icon-fullscreen" />
          <Icon className={styles.icon} type="icon-fullscreen-exit" />
        </section>
        <main className={styles.main}>
          <section className={styles.input_content}>
            <MonacoEditor
              defaultLanguage="markdown"
              defaultValue={content}
              onChange={(v) => {
                setContent(v || '');
              }}
              options={{ minimap: { enabled: false } }}
            />
          </section>
          <section className={styles.preview}>
            <MarkdownWrap source={content} />
          </section>
        </main>
      </div>
    </>
  );
};
