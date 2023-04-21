import type { FFmpeg } from '@ffmpeg/ffmpeg';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
import { isServer } from '@tanstack/react-query';
import type { ChangeEvent } from 'react';
import { useState } from 'react';

let ffmpeg: FFmpeg;

if (!isServer) {
  const { origin } = window.location;
  ffmpeg = createFFmpeg({
    log: true,
    corePath: `${origin}/ffmpeg/ffmpeg-core.js`,
    workerPath: `${origin}/ffmpeg/ffmpeg-core.worker.js`,
    wasmPath: `${origin}/ffmpeg/ffmpeg-core.wasm`,
  });
}

export const VideoProcessor = () => {
  const [videoSrc, setVideoSrc] = useState('');
  const [message, setMessage] = useState('Click "Load" to load a video.');

  const loadVideo = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files![0];
    setMessage('Loading video...');
    await ffmpeg.load();
    setMessage('Video loaded.');

    ffmpeg.FS('writeFile', file.name, await fetchFile(file));
    await ffmpeg.run('-i', file.name, 'output.mp4');

    const data = ffmpeg.FS('readFile', 'output.mp4');
    const videoUrl = URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }));

    setVideoSrc(videoUrl);
    setMessage('Video processed.');
  };

  return (
    <div>
      <input type="file" onChange={loadVideo} />
      {message && <p>{message}</p>}
      {videoSrc && (
        <video src={videoSrc} controls>
          <track kind="captions" />
        </video>
      )}
    </div>
  );
};
