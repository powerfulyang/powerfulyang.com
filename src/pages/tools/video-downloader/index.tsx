import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { clientBaseHost } from '@/constant/Constant';
import { useUser } from '@/hooks/useUser';
import { clientApi } from '@/request/requestTool';
import { useImmer } from '@powerfulyang/hooks';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Copy, Settings } from 'lucide-react';
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
      const eventSource = new EventSource(
        `//${clientBaseHost}/api/tools/video-downloader?${_str}`,
        {
          withCredentials: true,
        },
      );
      eventSource.onmessage = (event) => {
        setMessages((draft) => {
          draft.push(event.data);
        });
      };
      return new Promise<string>((resolve, reject) => {
        eventSource.addEventListener('done', (event) => {
          eventSource.close();
          resolve(event.data);
        });
        eventSource.addEventListener('error', (event: MessageEvent) => {
          eventSource.close();
          reject(new Error(event.data));
        });
      });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const [cookies, setCookies] = useState('');
  const [open, setOpen] = useState(false);

  const mutation = useMutation({
    mutationFn: () => {
      return clientApi.saveCookies({
        cookies,
      });
    },
    onSuccess: () => {
      setOpen(false);
    },
  });
  const { user } = useUser();
  const { isFetching } = useQuery({
    queryKey: ['cookies'],
    enabled: open && !!user,
    queryFn: () => {
      return clientApi.readCookies({ format: 'text' });
    },
    select: (v) => {
      return v?.data;
    },
    onSuccess: (data) => {
      setCookies(data);
    },
  });

  return (
    <div className="flex flex-col items-center space-y-4 p-10">
      <h3 className="text-3xl font-medium">Free Video Downloader</h3>
      <span className="!mb-4 text-[#1b233d]/70">
        Download videos from YouTube, Facebook, Instagram, Twitter, TikTok, and more.
      </span>
      <div className="!mb-4 flex w-full max-w-[800px] items-baseline gap-4">
        <Label htmlFor="videoUrl">Video URL:</Label>
        <Input
          id="videoUrl"
          className="max-w-[800px] flex-1"
          placeholder="video url"
          value={videoUrl}
          onChange={(event) => {
            const url = event.target.value;
            setVideoUrl(url);
          }}
          name="videoUrl"
        />
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger
            asChild
            onClick={() => {
              setOpen(true);
            }}
          >
            <Settings size={20} className="pointer self-center" />
          </DialogTrigger>
          <DialogContent className="w-[80%] max-w-[825px]">
            <DialogHeader>
              <DialogTitle>Edit Cookies</DialogTitle>
              <DialogDescription>
                <span className="text-[#1b233d]/70">
                  Edit your cookies for
                  <span className="px-2 font-bold">youtube.com, bilibili.com, etc,</span>
                  which will storage in your account.
                </span>
              </DialogDescription>
            </DialogHeader>
            <Textarea
              value={cookies}
              onChange={(event) => {
                setCookies(event.target.value);
              }}
              disabled={isFetching}
              rows={20}
              placeholder="Enter Netscape Format Cookies"
            />
            <DialogFooter>
              <LoadingButton
                loading={mutation.isLoading}
                onClick={() => {
                  mutation.mutate();
                }}
                type="submit"
              >
                Save changes
              </LoadingButton>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <LoadingButton
        loading={download.isLoading}
        onClick={() => {
          download.mutate(videoUrl);
        }}
      >
        Download
      </LoadingButton>
      {download?.data && (
        <span className="mt-2 flex items-center gap-2 break-all text-green-700">
          <span className="flex-1">{download?.data}</span>
          <Copy
            className="pointer"
            size={15}
            onClick={() => {
              return copyToClipboardAndNotify(download?.data);
            }}
          />
        </span>
      )}
      {messages?.length > 0 && (
        <PrismCode className="mt-8 w-[70%] max-w-[800px]" language="shell">
          {messages.join('').trim()}
        </PrismCode>
      )}
    </div>
  );
};

VideoDownloader.getLayout = (page) => {
  return <UserLayout>{page}</UserLayout>;
};

export const getStaticProps = () => {
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
