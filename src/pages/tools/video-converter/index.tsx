import Loading from '@/app/loading';
import dynamic from 'next/dynamic';
import type { LayoutFC } from '@/types/GlobalContext';
import { UserLayout } from '@/layout/UserLayout';

const VideoProcessor = dynamic(() => import('@/components/VideoProcessor'), {
  ssr: false,
  loading: () => <Loading />,
});

const Video: LayoutFC = () => {
  return (
    <div className="flex flex-col items-center space-y-4 p-10">
      <h3 className="text-3xl font-medium">Free Video Converter</h3>
      <span className="!mb-4 text-[#1b233d]/70">
        Easily convert your videos to MP4, MOV, AVI, and more.
      </span>
      <div className="text-center">
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
