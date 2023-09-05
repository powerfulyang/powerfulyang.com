import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { trpc } from '@/utils/trpc';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import styles from '@/styles/content.module.scss';
import { NoSSRMarkdownEditor } from '@/components/monaco-editor';
import { PrismCode } from '@/components/PrismCode';
import { useWorkerLoader } from '@/hooks/useWorkerLoader';
import type { PrettierWorker } from '@/workers/prettier.worker';

const Transform = () => {
  const [action, setAction] = useState('html2jsx');
  const [value, setValue] = useState('');
  const { wrap, isReady } = useWorkerLoader<PrettierWorker>(() => {
    return new Worker(new URL('@/workers/prettier.worker.ts', import.meta.url), {
      name: 'prettier',
      type: 'module',
    });
  });

  const query = useQuery({
    queryKey: ['html2jsx', value],
    enabled: Boolean(isReady && value && action === 'html2jsx'),
    keepPreviousData: true,
    queryFn: () => {
      return wrap!.html2jsx(value);
    },
  });

  const html2pug = trpc.html2pug.useQuery(
    {
      html: value,
    },
    {
      enabled: Boolean(action === 'html2pug' && value),
      keepPreviousData: true,
    },
  );

  return (
    <div className={cn('flex w-full flex-col', styles.nonLayoutContent)}>
      <div className="flex items-center px-4 py-1">
        <Label className="flex items-center gap-2">
          <span>Action:</span>
          <Select
            value={action}
            onValueChange={(_value) => {
              setAction(_value);
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Action" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="html2jsx">html2jsx</SelectItem>
              <SelectItem value="html2pug">html2pug</SelectItem>
            </SelectContent>
          </Select>
        </Label>
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
          {action === 'html2jsx' && (
            <PrismCode language="tsx">{query.isLoading ? 'loading...' : query.data!}</PrismCode>
          )}
          {action === 'html2pug' && (
            <PrismCode language="pug">
              {html2pug.isLoading ? 'loading...' : html2pug.data!}
            </PrismCode>
          )}
        </div>
      </div>
    </div>
  );
};

export default Transform;

export const getServerSideProps = () => {
  return {
    props: {
      meta: {
        title: 'Transform',
        description: 'Transform HTML to JSX',
      },
    },
  };
};
