import { Link } from '@/components/Link';
import { HomeRepairService } from '@mui/icons-material';
import { AppBar, Card, Container, Grid, Toolbar, Typography } from '@mui/material';

const Tools = () => {
  return (
    <>
      <AppBar position="static">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <HomeRepairService sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
            <Typography
              variant="h6"
              noWrap
              component={Link}
              href="/tools"
              sx={{
                mr: 2,
                display: { xs: 'none', md: 'flex' },
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
        <Grid container spacing={4}>
          <Grid item xs={4} className="pointer" component={Link} href="/tools/video-converter">
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
              <img
                className="h-full w-full"
                src="https://scrnli.com/static/media/convert.72f8549077f576625a23b196db551253.svg"
                alt="Video Converter"
              />
              <Typography
                variant="h5"
                sx={{
                  position: 'absolute',
                  bottom: 10,
                  width: '100%',
                  textAlign: 'center',
                }}
              >
                Video Converter
              </Typography>
            </Card>
          </Grid>
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
      },
    },
  };
};

export default Tools;
