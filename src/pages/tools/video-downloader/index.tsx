import { clientApi } from '@/request/requestTool';
import { copyToClipboardAndNotify } from '@/utils/copy';
import { CopyAllOutlined } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { Container, TextField, Typography } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import type { LayoutFC } from '@/type/GlobalContext';
import { UserLayout } from '@/layout/UserLayout';

const VideoDownloader: LayoutFC = () => {
  const [videoUrl, setVideoUrl] = useState('');

  const download = useMutation({
    mutationFn: (url: string) => {
      return clientApi.toolsControllerDownload(
        { url },
        {
          format: 'text',
        },
      );
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
      {download?.data?.data && (
        <Typography sx={{ mt: 4, color: 'green', textAlign: 'center' }} variant="body1">
          {download?.data?.data}
          <CopyAllOutlined
            sx={{
              ml: 1,
              cursor: 'pointer',
            }}
            onClick={() => {
              copyToClipboardAndNotify(download?.data?.data);
            }}
          />
        </Typography>
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
        title: 'Video Downloader',
        description:
          'Download videos from YouTube, Facebook, Instagram, Twitter, TikTok, and more.',
      },
    },
  };
};

export default VideoDownloader;
