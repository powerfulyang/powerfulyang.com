import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import z from 'zod';
import { Download } from 'lucide-react';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useFFmpeg } from '@/hooks/useFFmpeg';
import { Button } from '../ui/button';
import { LoadingButton } from '../utils/LoadingButton';

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

const VideoProcessor = () => {
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
      className="space-y-6"
    >
      <Controller
        render={({ fieldState, field }) => {
          return (
            <div className="space-y-6">
              <Button type="button" asChild>
                <Label>
                  选择文件
                  <input
                    id="upload"
                    type="file"
                    hidden
                    onChange={(e) => {
                      setValue('file', e.target.files?.[0]);
                    }}
                  />
                </Label>
              </Button>
              {fieldState.error?.message && (
                <div className="text-red-500">{fieldState.error?.message}</div>
              )}
              {field.value?.name && (
                <div className="truncate" title={field.value?.name}>
                  {field.value?.name}
                </div>
              )}
            </div>
          );
        }}
        name="file"
        control={control}
      />
      <Controller
        control={control}
        render={({ field }) => {
          return (
            <div className="flex items-center justify-center space-x-2">
              <span>Format:</span>
              <Select
                value={field.value}
                onValueChange={(e) => {
                  field.onChange(e);
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  {supportFormats.map((item) => (
                    <SelectItem className="pointer" key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          );
        }}
        name="format"
      />
      <LoadingButton type="submit" loading={convertVideo.isLoading}>
        Convert
      </LoadingButton>
      <div>{`${Math.round(progress)}%`}</div>
      <span className="mb-4 text-center">
        用时：{progress > 0 ? (Date.now() - start) / 1000 : 0}秒
      </span>
      <br />
      {convertVideo.data && (
        <Button
          type="button"
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
          className="space-x-2"
        >
          <Download size={14} />
          <span>下载</span>
        </Button>
      )}
    </form>
  );
};

export default VideoProcessor;
