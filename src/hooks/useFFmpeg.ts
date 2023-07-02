import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
import { useState } from 'react';

export const useFFmpeg = () => {
  const [progress, setProgress] = useState<number>(0);

  const transcode = async (file: File, format: string) => {
    const { origin } = window.location;
    const ffmpeg = createFFmpeg({
      corePath: `${origin}/_next/static/ffmpeg/ffmpeg-core.js`,
      workerPath: `${origin}/_next/static/ffmpeg/ffmpeg-core.worker.js`,
      wasmPath: `${origin}/_next/static/ffmpeg/ffmpeg-core.wasm`,
      progress: (e) => {
        setProgress(e.ratio * 100);
      },
    });
    await ffmpeg.load();
    ffmpeg.FS('writeFile', 'input', await fetchFile(file));
    await ffmpeg.run('-i', 'input', `output.${format}`);
    const res = ffmpeg.FS('readFile', `output.${format}`);
    ffmpeg.exit();
    return res;
  };

  return { transcode, progress };
};
