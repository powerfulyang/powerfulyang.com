import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { NoSSRMarkdownEditor } from '@/components/monaco-editor';
import { PrismCode } from '@/components/PrismCode';
import { useWorkerLoader } from '@/hooks/useWorkerLoader';
import { UserLayout } from '@/layout/UserLayout';
import type { LayoutFC } from '@/types/GlobalContext';
import type { PrettierWorker } from '@/workers/prettier.worker';

const Transform: LayoutFC = () => {
  const [value, setValue] = useState('');
  const { wrap, isReady } = useWorkerLoader<PrettierWorker>(() => {
    return new Worker(new URL('@/workers/prettier.worker.ts', import.meta.url), {
      type: 'module',
    });
  });

  const query = useQuery({
    queryKey: ['html2jsx', value],
    enabled: isReady,
    keepPreviousData: true,
    queryFn: () => {
      return wrap!.html2jsx(value);
    },
  });

  return (
    <div className="flex h-[100vh] w-full flex-col">
      <div className="flex items-center  px-4 py-1">
        <span>HTML to JSX</span>
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
          <PrismCode language="tsx">{query.isLoading ? 'loading...' : query.data!}</PrismCode>
        </div>
      </div>
    </div>
  );
};

Transform.getLayout = (page) => {
  return <UserLayout>{page}</UserLayout>;
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
