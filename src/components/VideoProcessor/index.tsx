import { useFFmpeg } from '@/hooks/useFFmpeg';
import { zodResolver } from '@hookform/resolvers/zod';
import { Download } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import type { CircularProgressProps } from '@mui/material';
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import z from 'zod';

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

const supportFormats = [
  'mp4',
  'mov',
  'avi',
  'wmv',
  'flv',
  'mkv',
  'webm',
  'm4v',
  '3gp',
  '3g2',
  'ogg',
  'ogv',
];

type FormProps = {
  format: string;
  file?: File;
};

export const VideoProcessor = () => {
  const { transcode, progress } = useFFmpeg();
  const [start, setStart] = useState(0);

  const { control, setValue, handleSubmit } = useForm<FormProps>({
    defaultValues: {
      format: 'mp4',
    },
    resolver: zodResolver(
      z.object({
        format: z.string().refine((v) => supportFormats.includes(v), {
          message: '请选择支持的格式',
        }),
        file: z.custom<File>((v) => v instanceof File, {
          message: '请选择文件',
        }),
      }),
    ),
  });

  const convertVideo = useMutation({
    mutationFn: (values: Required<FormProps>) => {
      return transcode(values.file, values.format);
    },
    onMutate: () => {
      setStart(Date.now());
    },
  });

  return (
    <form
      onSubmit={handleSubmit((v) => {
        convertVideo.mutate(v as Required<FormProps>);
      })}
    >
      <Controller
        render={({ fieldState, field }) => {
          return (
            <div>
              <Button
                sx={{
                  minWidth: 240,
                  my: 1,
                }}
                variant="contained"
                component="label"
              >
                选择文件
                <input
                  type="file"
                  hidden
                  onChange={(e) => {
                    setValue('file', e.target.files?.[0]);
                  }}
                />
              </Button>
              {fieldState.error?.message && (
                <Typography variant="body1" color="error">
                  {fieldState.error?.message}
                </Typography>
              )}
              <Typography
                sx={{
                  m: 'auto',
                  maxWidth: 240,
                }}
                className="truncate"
                variant="body1"
                title={field.value?.name}
              >
                {field.value?.name}
              </Typography>
            </div>
          );
        }}
        name="file"
        control={control}
      />
      <FormControl
        sx={{
          minWidth: 240,
          my: 4,
        }}
      >
        <InputLabel id="target-format">Target Format</InputLabel>
        <Controller
          control={control}
          render={({ field }) => {
            return (
              <Select labelId="target-format" label="Target Format" {...field}>
                {supportFormats.map((item) => (
                  <MenuItem key={item} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </Select>
            );
          }}
          name="format"
        />
      </FormControl>
      <br />
      <LoadingButton
        variant="contained"
        type="submit"
        sx={{
          minWidth: 240,
          my: 1,
        }}
        loading={convertVideo.isLoading}
      >
        Convert
      </LoadingButton>
      <br />
      <CircularProgressWithLabel className="my-4" size={150} value={progress} />
      <br />
      <Typography variant="h6" className="mb-4 text-center">
        用时：{progress > 0 ? (Date.now() - start) / 1000 : 0}秒
      </Typography>
      <br />
      {convertVideo.data && (
        <Button
          variant="contained"
          startIcon={<Download />}
          onClick={() => {
            const blob = new Blob([convertVideo.data]);
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            const format = convertVideo.variables?.format || '';
            a.download = `video.${format}`;
            a.click();
            URL.revokeObjectURL(url);
          }}
        >
          下载
        </Button>
      )}
    </form>
  );
};
