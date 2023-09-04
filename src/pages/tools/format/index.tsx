import { useMutation } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { toast } from 'react-hot-toast';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { LoadingButton } from '@/components/utils/LoadingButton';
import { NoSSRMarkdownEditor } from '@/components/monaco-editor';
import { useWorkerLoader } from '@/hooks/useWorkerLoader';
import { cn } from '@/lib/utils';
import styles from '@/styles/content.module.scss';
import type { PrettierWorker } from '@/workers/prettier.worker';

const Format = () => {
  const [value, setValue] = useState('');
  const [language, setLanguage] = useState('nginx');
  const { wrap, isReady } = useWorkerLoader<PrettierWorker>(() => {
    return new Worker(new URL('@/workers/prettier.worker.ts', import.meta.url), {
      name: 'prettier',
      type: 'module',
    });
  });

  const mutation = useMutation({
    mutationFn: () => {
      return wrap!.prettify(language, value, {
        printWidth: Infinity,
      });
    },
    onSuccess: (data) => {
      setValue(data);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const monacoLanguage = useMemo(() => {
    if (language === 'babel') {
      return 'javascript';
    }
    if (language === 'prisma-parse') {
      return 'nginx';
    }
    return language;
  }, [language]);

  return (
    <div className={cn('flex w-full flex-col', styles.nonLayoutContent)}>
      <div className="flex items-center justify-between border-b border-dashed px-4 py-1">
        <Label className="flex items-center gap-2">
          <span>Language:</span>
          <Select
            value={language}
            onValueChange={(_value) => {
              setLanguage(_value);
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Format Language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="nginx">nginx</SelectItem>
              <SelectItem value="json">json</SelectItem>
              <SelectItem value="html">html</SelectItem>
              <SelectItem value="css">css</SelectItem>
              <SelectItem value="babel">js(x)</SelectItem>
              <SelectItem value="vue">vue</SelectItem>
              <SelectItem value="typescript">ts(x)</SelectItem>
              <SelectItem value="markdown">markdown</SelectItem>
              <SelectItem value="yaml">yaml</SelectItem>
              <SelectItem value="graphql">graphql</SelectItem>
              <SelectItem value="xml">xml</SelectItem>
              <SelectItem value="java">java</SelectItem>
              <SelectItem value="prisma-parse">prisma</SelectItem>
              <SelectItem value="sql">sql</SelectItem>
            </SelectContent>
          </Select>
        </Label>
        <LoadingButton
          onClick={() => {
            mutation.mutate();
          }}
          size="sm"
          loading={!isReady || mutation.isLoading}
        >
          Format
        </LoadingButton>
      </div>
      <NoSSRMarkdownEditor
        theme="nginx-theme"
        wrapperProps={{
          className: 'flex-1 w-full',
        }}
        language={monacoLanguage}
        options={{
          minimap: { enabled: false },
        }}
        value={value}
        onChange={(_value) => {
          setValue(_value || '');
        }}
      />
    </div>
  );
};

export default Format;

export const getServerSideProps = () => {
  return {
    props: {
      meta: {
        title: 'Format Online',
        description:
          'Format nginx conf, json, html, css, js, ts, jsx, tsx, graphql, md, yaml, toml, etc.',
      },
    },
  };
};
