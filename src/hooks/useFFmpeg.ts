import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';
import { useState } from 'react';

const ffmpegVersion = process.env.NEXT_PUBLIC_FFMPEG_VERSION;

export const useFFmpeg = () => {
  const [progress, setProgress] = useState<number>(0);

  const transcode = async (file: File, format: string) => {
    const ffmpeg = new FFmpeg();
    await ffmpeg.load({
      coreURL: `/_next/static/ffmpeg/${ffmpegVersion}/ffmpeg-core.js`,
    });
    const p = (e: { progress: number }) => {
      setProgress(e.progress * 100);
    };
    ffmpeg.on('progress', p);
    await ffmpeg.writeFile('input', await fetchFile(file));
    await ffmpeg.exec(['-i', 'input', `output.${format}`]);
    const res = await ffmpeg.readFile(`output.${format}`);
    ffmpeg.off('progress', p);
    ffmpeg.terminate();
    return res;
  };

  return { transcode, progress };
};
