import dynamic from 'next/dynamic';
import type { LayoutFC } from '@/types/GlobalContext';
import { UserLayout } from '@/layout/UserLayout';

const VideoProcessor = dynamic(() => import('@/components/VideoProcessor'), { ssr: false });

const Video: LayoutFC = () => {
  return (
    <div className="w-full">
      <div className="flex flex-wrap justify-center">
        <p className="mt-10 w-full text-center text-[40px] font-medium text-[#212529]">
          Free Video Converter
        </p>
        <p className="mt-4 text-center text-sm text-[#1b233d]/70">
          Easily convert your videos to MP4, MOV, AVI, and more.
        </p>
      </div>
      <div className="mt-4 text-center">
        <VideoProcessor />
      </div>
    </div>
  );
};

Video.getLayout = (page) => {
  return <UserLayout>{page}</UserLayout>;
};

export const getServerSideProps = () => {
  return {
    props: {
      meta: {
        title: 'Free Video Converter',
        description:
          'Convert video to mp4, webm, mkv, flv, 3gp, gif, avi, wmv, mov, mpeg, mpg, m4v, ogv, ogg, and more.',
      },
    },
  };
};

export default Video;
