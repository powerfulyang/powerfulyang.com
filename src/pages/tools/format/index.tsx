import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { NoSSRMarkdownEditor } from '@/components/monaco-editor';
import { PrismCode } from '@/components/PrismCode';
import { useWorkerLoader } from '@/hooks/useWorkerLoader';
import { UserLayout } from '@/layout/UserLayout';
import type { LayoutFC } from '@/types/GlobalContext';
import type { PrettierWorker } from '@/workers/prettier.worker';
import styles from '@/styles/content.module.scss';

const Format: LayoutFC = () => {
  const [value, setValue] = useState('');
  const { wrap, isReady } = useWorkerLoader<PrettierWorker>(() => {
    return new Worker(new URL('@/workers/prettier.worker.ts', import.meta.url), {
      type: 'module',
    });
  });

  const query = useQuery({
    queryKey: ['prettify', value],
    enabled: isReady,
    keepPreviousData: true,
    queryFn: () => {
      return wrap!.prettify('nginx', value, {
        printWidth: Infinity,
      });
    },
  });

  return (
    <div className={cn('flex w-full flex-col', styles.layoutContent)}>
      <div className="flex items-center  px-4 py-1">
        <span>Format Nginx Conf Online</span>
      </div>
      <div className="flex flex-1 divide-x divide-dashed divide-gray-400 border-t border-dashed border-amber-400">
        <div className="w-1/2 py-2">
          <NoSSRMarkdownEditor
            language="html"
            options={{
              minimap: { enabled: false },
            }}
            value={value}
            onChange={(_value) => {
              setValue(_value || '');
            }}
          />
        </div>
        <div className="w-1/2 px-4 py-2">
          <PrismCode language="nginx">{query.isLoading ? 'loading...' : query.data!}</PrismCode>
        </div>
      </div>
    </div>
  );
};

Format.getLayout = (page) => {
  return <UserLayout>{page}</UserLayout>;
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
