import { useFFmpeg } from '@/hooks/useFFmpeg';
import type { CircularProgressProps } from '@mui/material';
import { Box, CircularProgress, Typography } from '@mui/material';
import type { ChangeEvent } from 'react';

const CircularProgressWithLabel = ({
  value,
  ...props
}: CircularProgressProps & { value: number }) => {
  return (
    <Box component="div" sx={{ position: 'relative', display: 'inline-flex' }}>
      <CircularProgress variant="determinate" value={value} {...props} />
      <Box
        component="span"
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography variant="caption" component="div" color="text.secondary">
          {`${Math.round(value)}%`}
        </Typography>
      </Box>
    </Box>
  );
};

export const VideoProcessor = () => {
  const { videoURL, transcode, progress } = useFFmpeg();

  const loadVideo = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await transcode(file);
    }
  };

  return (
    <div>
      <input type="file" onChange={loadVideo} />
      <CircularProgressWithLabel value={progress} />
      {videoURL && (
        <video src={videoURL} controls>
          <track kind="captions" />
        </video>
      )}
    </div>
  );
};
