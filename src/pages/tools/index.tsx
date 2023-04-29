import { Link } from '@/components/Link';
import { HomeRepairService } from '@mui/icons-material';
import { AppBar, Card, Container, Grid, Toolbar, Typography } from '@mui/material';

const tools = [
  {
    name: 'Video Converter',
    description:
      'Convert video to mp4, webm, mkv, flv, 3gp, gif, avi, wmv, mov, mpeg, mpg, m4v, ogv, ogg, and more.',
    icon: 'https://scrnli.com/static/media/convert.72f8549077f576625a23b196db551253.svg',
    url: '/tools/video-converter',
    redirect: true,
  },
  {
    name: 'Bg Remover',
    description: 'Remove background from image.',
    icon: '',
    url: 'https://logs.powerfulyang.com',
  },
  {
    name: 'AST(swagger to code)',
    description: 'Convert swagger to code.',
    icon: '',
    url: '/tools/swagger2code',
  },
];

const Tools = () => {
  return (
    <>
      <AppBar position="static">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <HomeRepairService sx={{ mr: 1 }} />
            <Typography
              variant="h6"
              noWrap
              component={Link}
              href="/tools"
              sx={{
                mr: 2,
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              Tools
            </Typography>
          </Toolbar>
        </Container>
      </AppBar>
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
                redirect={tool.redirect}
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
    </>
  );
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
