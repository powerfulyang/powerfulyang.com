import { useMutation } from '@tanstack/react-query';
import { waitFor } from '@powerfulyang/utils';
import { useState } from 'react';
import { LoadingButton } from '@/components/utils/LoadingButton';
import { PrismCode } from '@/components/PrismCode';
import { NoSSRMarkdownEditor } from '@/components/monaco-editor';
import { html2jsx } from '@/utils/html2jsx';

const Transform = () => {
  const [value, setValue] = useState('');
  const mutation = useMutation({
    mutationFn: async () => {
      return Promise.all([
        html2jsx(value, {
          createFunction: true,
        }),
        waitFor(1000),
      ]).then(([data]) => data);
    },
  });

  return (
    <div className="flex h-[100vh] w-full flex-col">
      <div className="flex items-center justify-between px-2 py-1">
        <span>HTML to JSX</span>
        <LoadingButton
          loading={mutation.isLoading}
          size="sm"
          onClick={() => {
            mutation.mutate();
          }}
        >
          Transform
        </LoadingButton>
      </div>
      <div className="flex flex-1 divide-x divide-dashed divide-gray-400 border-t border-dashed border-amber-400">
        <div className="w-1/2">
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
          <PrismCode language="html">
            {mutation.isLoading ? 'loading...' : mutation.data!}
          </PrismCode>
        </div>
      </div>
    </div>
  );
};

export default Transform;
