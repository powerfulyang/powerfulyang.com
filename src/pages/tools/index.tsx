import { Card, Container, Grid, Typography } from '@mui/material';
import Link from 'next/link';
import type { HTMLAttributeAnchorTarget } from 'react';
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
    icon: '',
    url: 'https://logs.powerfulyang.com',
  },
  {
    name: 'Swagger to Code',
    description:
      'Generate code from swagger document, such as ProTable, ProForm(not implemented yet) etc.',
    icon: '',
    url: '/tools/swagger2code',
  },
  {
    name: 'White Board',
    description: 'A simple white board.',
    icon: '',
    url: '/tools/white-board',
  },
  {
    name: 'Wi-Fi QR Code Generator',
    description: 'Generate Wi-Fi QR Code.',
    icon: '',
    url: '/tools/wifi-share',
  },
  {
    name: 'Image to ASCII',
    description: 'Convert image to ASCII.',
    icon: '',
    url: '/tools/image2ascii',
  },
  {
    name: 'Funny',
    description: 'Funny WebGL',
    icon: '',
    url: '/tools/funny',
  },
  {
    name: 'Management',
    description: 'Management',
    icon: '',
    url: '/admin/user/list',
  },
  {
    name: 'url params extractor',
    description: 'url params extractor',
    icon: '',
    url: '/tools/url-params-extractor',
  },
];

const Tools: LayoutFC = () => {
  return (
    <Container
      maxWidth="xl"
      sx={{
        py: 4,
      }}
    >
      <Grid container wrap="wrap" spacing={4}>
        {tools.map((tool) => {
          return (
            <Grid
              key={tool.name}
              item
              xs={12}
              sm={4}
              className="pointer"
              component={Link}
              href={tool.url}
              target={tool.target}
            >
              <Card
                variant="outlined"
                sx={{
                  aspectRatio: '16 / 9',
                  position: 'relative',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                  },
                }}
              >
                <img className="h-full w-full" src={tool.icon} alt={tool.description} />
                <Typography
                  variant="h5"
                  sx={{
                    position: 'absolute',
                    bottom: 10,
                    width: '100%',
                    textAlign: 'center',
                  }}
                >
                  {tool.name}
                </Typography>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Container>
  );
};

Tools.getLayout = (page) => {
  return <UserLayout>{page}</UserLayout>;
};

export const getServerSideProps = () => {
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
