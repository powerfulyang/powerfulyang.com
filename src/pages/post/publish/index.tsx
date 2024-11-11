import type {Post} from '@/__generated__/api';
import {Footer} from '@/components/Footer';
import Loading from "@/components/loading";
import type {MarkdownMetadata} from '@/components/MarkdownContainer/LiveMarkdownEditor';
import {NoSSRLiveMarkdownEditor} from '@/components/MarkdownContainer/LiveMarkdownEditor/NoSSR';
import {useFormDiscardWarning} from '@/hooks/useFormDiscardWarning';
import {clientApi} from '@/request/requestTool';
import type {LayoutFC} from '@/types/GlobalContext';
import {isString} from '@powerfulyang/utils';
import {useMutation, useQuery} from '@tanstack/react-query';
import {useRouter} from 'next/router';
import {useCallback, useEffect, useState} from 'react';

type PublishProps = {};

const Publish: LayoutFC<PublishProps> = () => {
  const {push, query} = useRouter();
  const {id, versions} = query;

  const {data: post} = useQuery({
    queryKey: ['post', id, versions],
    queryFn: async () => {
      if (isString(id) && id !== '0') {
        const res = await clientApi.queryPublicPostById(Number(id), {
          // @ts-ignore
          versions,
        });
        return res.data;
      }
      return {} as Post;
    },
  });

  const [content, setContent] = useState('');

  useEffect(() => {
    if (post?.content) {
      setContent(post.content);
    } else if (!id) {
      setContent(localStorage.getItem('draft') || '');
    }
  }, [post?.content, id]);

  const publishPostMutation = useMutation(
    {
      mutationFn: (metadata: MarkdownMetadata) => {
        if (post?.id) {
          return clientApi.updatePost({
            id: post.id,
            ...metadata,
            content,
          });
        }
        return clientApi.createPost({
          ...metadata,
          content,
        });
      },
      async onSuccess(res) {
        return push(`/post/${res.data.id}`);
      },
    },
  );

  const saveDraft = useCallback(
    (draft?: string) => {
      setContent(draft || '');
      if (!post?.id) {
        localStorage.setItem('draft', draft || '');
      }
    },
    [post?.id],
  );

  useFormDiscardWarning(() => {
    return content !== post?.content && Boolean(post?.id) && !publishPostMutation.isPending;
  }, [content, post?.content, post?.id, publishPostMutation.isPending]);

  return (
    post ? <NoSSRLiveMarkdownEditor
      value={content}
      onChange={saveDraft}
      defaultValue={post?.content}
      loading={publishPostMutation.isPending}
      onPost={publishPostMutation.mutate}
    /> : <Loading/>
  );
};

Publish.displayName = 'Publish';

Publish.getLayout = (page) => {
  return (
    <>
      {page}
      <Footer/>
    </>
  );
};

export default Publish;
