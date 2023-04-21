import { VideoProcessor } from '@/components/VideoProcessor';

const Video = () => {
  return <VideoProcessor />;
};

export const getServerSideProps = () => {
  return {
    props: {
      meta: {
        title: '视频处理',
      },
    },
  };
};

export default Video;
