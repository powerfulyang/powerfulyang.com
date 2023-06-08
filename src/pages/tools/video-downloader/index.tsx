import { PrismCode } from '@/components/PrismCode';
import { UserLayout } from '@/layout/UserLayout';
import type { LayoutFC } from '@/types/GlobalContext';
import { copyToClipboardAndNotify } from '@/utils/copy';
import { CopyAllOutlined } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { Container, TextField, Typography } from '@mui/material';
import { useImmer } from '@powerfulyang/hooks';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';

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
      }>((resolve) => {
        eventSource.addEventListener('done', (event) => {
          eventSource.close();
          const data = JSON.parse(event.data);
          resolve(data);
        });
      });
    },
  });

  return (
    <Container>
      <Typography
        sx={{
          textAlign: 'center',
          pt: 4,
        }}
        variant="h3"
      >
        Video Downloader
      </Typography>
      <Typography
        sx={{
          textAlign: 'center',
          mt: 2,
        }}
        className="text-[#1b233d]/70"
        variant="body1"
      >
        Download videos from YouTube, Facebook, Instagram, Twitter, TikTok, and more.
      </Typography>
      <TextField
        sx={{
          mt: 2,
        }}
        fullWidth
        label="video url"
        value={videoUrl}
        onChange={(event) => {
          const url = event.target.value;
          setVideoUrl(url);
        }}
        name="videoUrl"
      />
      <LoadingButton
        sx={{
          mt: 2,
        }}
        fullWidth
        variant="contained"
        loading={download.isLoading}
        onClick={() => {
          download.mutate(videoUrl);
        }}
      >
        Download
      </LoadingButton>
      {download?.data?.downloadUrl && (
        <Typography sx={{ mt: 4, color: 'green', textAlign: 'center' }} variant="body1">
          {download?.data?.downloadUrl}
          <CopyAllOutlined
            sx={{
              ml: 1,
              cursor: 'pointer',
            }}
            onClick={() => {
              copyToClipboardAndNotify(download?.data?.downloadUrl);
            }}
          />
        </Typography>
      )}
      {messages?.length > 0 && (
        <PrismCode className="mt-8" language="shell">
          {messages.join('').trim()}
        </PrismCode>
      )}
    </Container>
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
