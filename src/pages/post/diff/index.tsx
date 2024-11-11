import type { Post } from '@/__generated__/api';
import Loading from '@/components/loading';
import { clientApi } from '@/request/requestTool';
import { formatDateTime } from '@/utils/format';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import type { FC } from 'react';
import { useEffect, useState } from 'react';

import { Prism } from 'react-syntax-highlighter';
import { coy } from 'react-syntax-highlighter/dist/esm/styles/prism';


const ReactDiffViewer = dynamic(() => import('react-diff-viewer'), {
  ssr: false,
  loading: () => <Loading />,
});

const Diff: FC = () => {
  const router = useRouter();
  const { id, versions } = router.query;
  const [left, setLeft] = useState<Post>();
  const [right, setRight] = useState<Post>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!id || !versions) {
        return;
      }
      try {
        const res = await clientApi.queryPublicPostById(Number(id), {
          versions: versions as string[],
        });
        const post = res.data;
        const { logs } = post;
        if (logs.length === 2) {
          setLeft(logs[1] as any);
          setRight(logs[0] as any);
        } else {
          router.push('/404');
        }
      } catch (e) {
        router.push('/404');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, versions, router]);

  if (loading || !left || !right) {
    return <Loading />;
  }

  const leftTitle = `${left.title} @ ${formatDateTime(left.createdAt)}`;
  const rightTitle = `${right.title} @ ${formatDateTime(right.createdAt)}`;

  return (
    <ReactDiffViewer
      leftTitle={leftTitle}
      rightTitle={rightTitle}
      oldValue={left.content}
      newValue={right.content}
      styles={{
        wordDiff: {
          display: 'contents',
        },
        wordRemoved: {
          display: 'inline',
        },
        wordAdded: {
          display: 'inline',
        },
        diffContainer: {
          width: 'calc(100vw - 6px)',
          pre: {
            fontFamily: 'inherit',
          },
        },
        content: {
          width: 'calc(50vw - 6px - 50px - 25px)',
        },
        contentText: {
          span: {
            fontFamily: 'inherit !important',
          },
          code: {
            fontFamily: 'inherit !important',
          },
        },
      }}
      renderContent={(value) => {
        return (
          <Prism
            style={coy}
            language="markdown"
            wrapLongLines
            wrapLines
            PreTag="span"
            customStyle={{
              display: 'contents',
              wordBreak: 'break-word',
            }}
            codeTagProps={{
              style: {
                display: 'contents',
              },
            }}
          >
            {value}
          </Prism>
        );
      }}
    />
  );
};

export default Diff;
