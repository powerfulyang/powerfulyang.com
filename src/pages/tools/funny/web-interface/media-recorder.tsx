import { Button } from '@/components/ui/button';
import { UserLayout } from '@/layout/UserLayout';
import type { LayoutFC } from '@/types/GlobalContext';
import React, { useState, useRef } from 'react';

const VideoRecorder: LayoutFC = () => {
  // 用于存储媒体流
  const [stream, setStream] = useState<MediaStream | null>(null);
  // 用于存储 MediaRecorder 实例
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  // 存储录制的视频数据
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  // 视频元素的引用
  const videoRef = useRef<HTMLVideoElement>(null!);

  // 请求用户媒体并开始预览
  const startCamera = async () => {
    try {
      const _stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setStream(_stream);
      if (videoRef.current) {
        videoRef.current.srcObject = _stream;
      }
    } catch (error) {
      console.error('获取用户媒体失败:', error);
    }
  };

  // 开始录制
  const startRecording = () => {
    if (stream) {
      const recorder = new MediaRecorder(stream);
      recorder.ondataavailable = (event) => setRecordedChunks((prev) => [...prev, event.data]);
      recorder.start();
      setMediaRecorder(recorder);
    }
  };

  // 停止录制
  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setStream(null); // 停止流
    }
  };

  // 播放录制的视频
  const playRecordedVideo = () => {
    const recordedBlob = new Blob(recordedChunks, { type: 'video/webm' });
    const videoUrl = window.URL.createObjectURL(recordedBlob);
    if (videoRef.current) {
      videoRef.current.src = videoUrl;
      videoRef.current.srcObject = null;
    }
  };

  return (
    <div>
      <video ref={videoRef} autoPlay muted />
      <div>
        <Button onClick={startCamera}>开启摄像头</Button>
        <Button onClick={startRecording} disabled={!stream}>
          开始录制
        </Button>
        <Button onClick={stopRecording} disabled={!mediaRecorder}>
          停止录制
        </Button>
        <Button onClick={playRecordedVideo} disabled={!recordedChunks.length}>
          播放录制的视频
        </Button>
      </div>
    </div>
  );
};

VideoRecorder.getLayout = function getLayout(page) {
  return <UserLayout>{page}</UserLayout>;
};

export default VideoRecorder;

export const getStaticProps = () => {
  return {
    props: {
      meta: {
        title: 'MediaRecorder',
        description: ' An example of MediaRecorder',
      },
    },
  };
};
