import React, { FC, useEffect, useState } from 'react';
import { Icon } from '@powerfulyang/components';
import classNames from 'classnames';
import { MarkdownWrap } from '@/components/MarkdownWrap';
import MonacoEditor from '@monaco-editor/react';
import { VoidFunction } from '@powerfulyang/utils';
import { extractMetaData } from '@/utils/toc';
import styles from './index.module.scss';

type MarkdownEditorProps = {
  defaultValue?: string;
  onChange?: VoidFunction<string>;
  onPost?: VoidFunction;
};

export type MarkdownMetadata = {
  author: string;
  tags: string[];
};

export const MarkdownEditor: FC<MarkdownEditorProps> = ({
  defaultValue = '',
  onChange,
  onPost,
}) => {
  const [input, setInput] = useState(defaultValue);
  const [toRender, setToRender] = useState('');
  const [metadata, setMetadata] = useState<MarkdownMetadata>();
  useEffect(() => {
    if (input) {
      const [m, c] = extractMetaData(input);
      setToRender(c);
      setMetadata(m);
      onChange?.(input);
    }
  }, [input, onChange]);
  const post = () => onPost?.(metadata, input);
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
          <Icon className={classNames(styles.icon, styles.post)} type="icon-send" onClick={post} />
        </section>
        <main className={styles.main}>
          <section className={styles.input_content}>
            <MonacoEditor
              defaultLanguage="markdown"
              defaultValue={input}
              onChange={(v) => {
                setInput(v!);
              }}
              options={{ minimap: { enabled: false } }}
            />
          </section>
          <section className={styles.preview}>
            <MarkdownWrap source={toRender} />
          </section>
        </main>
      </div>
    </>
  );
};
