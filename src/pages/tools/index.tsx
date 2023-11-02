import { management } from '@/constant/Constant';
import Link from 'next/link';
import type { HTMLAttributeAnchorTarget } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import type { LayoutFC } from '@/types/GlobalContext';
import { UserLayout } from '@/layout/UserLayout';

type ToolProps = {
  name: string;
  description: string;
  icon: string;
  url: string;
  target?: HTMLAttributeAnchorTarget;
};

const tools: ToolProps[] = [
  {
    name: 'Free Video Converter',
    description:
      'Convert video to mp4, webm, mkv, flv, 3gp, gif, avi, wmv, mov, mpeg, mpg, m4v, ogv, ogg, and more.',
    icon: 'https://scrnli.com/static/media/convert.72f8549077f576625a23b196db551253.svg',
    url: '/tools/video-converter',
  },
  {
    name: 'Free Video Downloader',
    description: 'Download video from YouTube, Facebook, Instagram, Twitter, TikTok, and more.',
    icon: 'https://scrnli.com/static/media/convert.72f8549077f576625a23b196db551253.svg',
    url: '/tools/video-downloader',
  },
  {
    name: 'Bg Remover',
    description: 'Remove background from image.',
    icon: 'https://scrnli.com/static/media/convert.72f8549077f576625a23b196db551253.svg',
    url: 'https://www.remove.bg/',
    target: '_blank',
  },
  {
    name: 'Transform',
    description: 'Transform HTML to JSX',
    icon: 'https://scrnli.com/static/media/convert.72f8549077f576625a23b196db551253.svg',
    url: '/tools/transform',
  },
  {
    name: 'Format',
    description: 'Format Nginx Conf Online',
    icon: 'https://scrnli.com/static/media/convert.72f8549077f576625a23b196db551253.svg',
    url: '/tools/format',
  },
  {
    name: 'Pipe Converter',
    description: 'Pipe Converter',
    icon: 'https://scrnli.com/static/media/convert.72f8549077f576625a23b196db551253.svg',
    url: '/tools/pipe-converter',
  },
  {
    name: 'Swagger to Code',
    description:
      'Generate code from swagger document, such as ProTable, ProForm(not implemented yet) etc.',
    icon: 'https://scrnli.com/static/media/convert.72f8549077f576625a23b196db551253.svg',
    url: '/tools/swagger2code',
  },
  {
    name: 'White Board',
    description: 'A simple white board.',
    icon: 'https://scrnli.com/static/media/convert.72f8549077f576625a23b196db551253.svg',
    url: '/tools/white-board',
  },
  {
    name: 'Wi-Fi QR Code Generator',
    description: 'Generate Wi-Fi QR Code.',
    icon: 'https://scrnli.com/static/media/convert.72f8549077f576625a23b196db551253.svg',
    url: '/tools/wifi-share',
  },
  {
    name: 'Funny',
    description: 'Funny WebGL',
    icon: 'https://scrnli.com/static/media/convert.72f8549077f576625a23b196db551253.svg',
    url: '/tools/funny',
  },
  {
    name: 'Management',
    description: 'Management',
    icon: 'https://scrnli.com/static/media/convert.72f8549077f576625a23b196db551253.svg',
    url: management,
    target: '_blank',
  },
  {
    name: 'URL Params Extractor',
    description: 'Extract URL params from a URL',
    icon: 'https://scrnli.com/static/media/convert.72f8549077f576625a23b196db551253.svg',
    url: '/tools/url-params-extractor',
  },
];

const Tools: LayoutFC = () => {
  return (
    <div className="flex flex-wrap p-4">
      {tools.map((tool) => {
        return (
          <Link
            key={tool.name}
            className="pointer w-full p-2 sm:w-1/2 xl:w-1/3 2xl:w-1/4"
            href={tool.url}
            target={tool.target}
          >
            <Card>
              <img
                style={{
                  aspectRatio: '325 / 266',
                }}
                className="w-full"
                src={tool.icon}
                alt={tool.description}
              />
              <CardContent className="text-center">{tool.name}</CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
};

Tools.getLayout = (page) => {
  return <UserLayout>{page}</UserLayout>;
};

export const getStaticProps = () => {
  return {
    props: {
      meta: {
        title: 'Tools',
        description: 'Useful tools, such as video converter, swagger to code, etc.',
      },
    },
  };
};

export default Tools;
