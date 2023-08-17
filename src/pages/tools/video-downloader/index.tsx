import { useImmer } from '@powerfulyang/hooks';
import { useMutation } from '@tanstack/react-query';
import { Copy } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { PrismCode } from '@/components/PrismCode';
import { Input } from '@/components/ui/input';
import { LoadingButton } from '@/components/utils/LoadingButton';
import { UserLayout } from '@/layout/UserLayout';
import type { LayoutFC } from '@/types/GlobalContext';
import { copyToClipboardAndNotify } from '@/utils/copy';

const VideoDownloader: LayoutFC = () => {
  const [videoUrl, setVideoUrl] = useState('');
  const [messages, setMessages] = useImmer<string[]>([]);

  const download = useMutation({
    onMutate: () => {
      setMessages([]);
    },
    mutationFn: (url: string) => {
      const _str = `videoUrl=${encodeURIComponent(url)}`;
      const eventSource = new EventSource(`/api/tools/video-downloader?${_str}`);
      eventSource.onmessage = (event) => {
        setMessages((draft) => {
          draft.push(event.data);
        });
      };
      return new Promise<{
        downloadUrl: string;
      }>((resolve, reject) => {
        eventSource.addEventListener('done', (event) => {
          eventSource.close();
          const data = JSON.parse(event.data);
          resolve(data);
        });
        eventSource.addEventListener('error', () => {
          eventSource.close();
          reject(new Error('出错啦...'));
        });
      });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  return (
    <div className="flex flex-col items-center p-8">
      <h3 className="text-3xl font-medium">Video Downloader</h3>
      <span className="my-4 text-[#1b233d]/70">
        Download videos from YouTube, Facebook, Instagram, Twitter, TikTok, and more.
      </span>
      <Input
        className="mb-4 w-[70%]"
        placeholder="video url"
        value={videoUrl}
        onChange={(event) => {
          const url = event.target.value;
          setVideoUrl(url);
        }}
        name="videoUrl"
      />
      <LoadingButton
        loading={download.isLoading}
        onClick={() => {
          download.mutate(videoUrl);
        }}
      >
        Download
      </LoadingButton>
      {download?.data?.downloadUrl && (
        <span>
          {download?.data?.downloadUrl}
          <Copy
            onClick={() => {
              copyToClipboardAndNotify(download?.data?.downloadUrl);
            }}
          />
        </span>
      )}
      {messages?.length > 0 && (
        <PrismCode className="mt-8 w-[70%]" language="shell">
          {messages.join('').trim()}
        </PrismCode>
      )}
    </div>
  );
};

VideoDownloader.getLayout = (page) => {
  return <UserLayout>{page}</UserLayout>;
};

export const getServerSideProps = () => {
  return {
    props: {
      meta: {
        title: 'Free Video Downloader',
        description:
          'Download videos from YouTube, Facebook, Instagram, Twitter, TikTok, and more.',
      },
    },
  };
};

export default VideoDownloader;
