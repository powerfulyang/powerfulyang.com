import { VideoProcessor } from '@/components/VideoProcessor';

const Video = () => {
  return (
    <div className="w-full">
      <div className="flex flex-wrap justify-center">
        <p className="w-full text-center text-[40px] font-medium text-[#212529]">
          Free Video Converter
        </p>
        <p className="text-center text-sm text-[#1b233d]/70">
          Easily convert your videos to MP4, MOV, AVI, and more.
        </p>
      </div>
      <div className="mt-4 text-center">
        <VideoProcessor />
      </div>
    </div>
  );
};

export const getServerSideProps = () => {
  return {
    props: {
      meta: {
        title: 'Video Converter',
      },
    },
  };
};

export default Video;
