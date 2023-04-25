import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
import { useState } from 'react';

export const useFFmpeg = () => {
  const [progress, setProgress] = useState<number>(0);
  const [videoURL, setVideoURL] = useState<string | null>(null);

  const transcode = async (file: File) => {
    const { origin } = window.location;
    const ffmpeg = createFFmpeg({
      log: true,
      corePath: `${origin}/ffmpeg/ffmpeg-core.js`,
      workerPath: `${origin}/ffmpeg/ffmpeg-core.worker.js`,
      wasmPath: `${origin}/ffmpeg/ffmpeg-core.wasm`,
      progress: (e) => setProgress(e.ratio),
    });
    await ffmpeg.load();
    ffmpeg.FS('writeFile', 'input.mp4', await fetchFile(file));
    await ffmpeg.run('-i', 'input.mp4', 'output.mp4');
    const data = ffmpeg.FS('readFile', 'output.mp4');
    const url = URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }));
    setVideoURL(url);
  };

  return { transcode, progress, videoURL };
};
