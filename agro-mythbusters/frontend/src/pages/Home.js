import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Container, Typography, Button, Grid, Card, CardContent, CardMedia, CardActions, Chip, useMediaQuery, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Search as SearchIcon, Science as ScienceIcon, TrendingUp as TrendingUpIcon, NewReleases as NewReleasesIcon } from '@mui/icons-material';
import { Link } from 'react-router-dom';

// Styled Components
const HeroSection = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
  color: theme.palette.common.white,
  padding: theme.spacing(10, 0),
  textAlign: 'center',
  position: 'relative',
  overflow: 'hidden',
  '&:before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'url("/images/pattern.png")',
    opacity: 0.1,
  },
}));

const FeatureCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[8],
  },
}));

const Home = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  // Sample data - replace with actual data from your API
  const featuredMyths = [
    {
      id: 1,
      title: 'Chemical Fertilizers Always Increase Crop Yield',
      summary: 'Exploring the complex relationship between chemical fertilizers and sustainable agriculture.',
      category: 'Fertilizers',
      status: 'Busted',
      image: '/images/fertilizer-myth.jpg',
    },
    {
      id: 2,
      title: 'Organic Farming Cannot Feed the World',
      summary: 'Debunking the myth that organic farming is insufficient for global food security.',
      category: 'Organic Farming',
      status: 'Verified',
      image: '/images/organic-farming.jpg',
    },
    {
      id: 3,
      title: 'GMOs Are Always Harmful',
      summary: 'A balanced look at the science behind genetically modified organisms in agriculture.',
      category: 'GMOs',
      status: 'Under Review',
      image: '/images/gmo-myth.jpg',
    },
  ];

  const features = [
    {
      icon: <SearchIcon fontSize="large" color="primary" />,
      title: 'Fact-Check',
      description: 'Get accurate, research-backed information about agricultural practices.',
    },
    {
      icon: <ScienceIcon fontSize="large" color="primary" />,
      title: 'Research-Based',
      description: 'Our content is verified by agricultural experts and researchers.',
    },
    {
      icon: <TrendingUpIcon fontSize="large" color="primary" />,
      title: 'Stay Updated',
      description: 'Keep up with the latest developments in sustainable agriculture.',
    },
  ];

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Hero Section */}
      <HeroSection>
        <Container maxWidth="lg">
          <Typography 
            variant={isMobile ? 'h4' : 'h2'} 
            component="h1" 
            gutterBottom 
            sx={{ 
              fontWeight: 700,
              mb: 3,
              position: 'relative',
              zIndex: 1,
            }}
          >
            Debunking Agricultural Myths
          </Typography>
          <Typography 
            variant={isMobile ? 'h6' : 'h5'} 
            component="h2" 
            sx={{ 
              mb: 4, 
              maxWidth: '800px',
              mx: 'auto',
              position: 'relative',
              zIndex: 1,
            }}
          >
            Separating fact from fiction in modern agriculture with evidence-based research
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap', position: 'relative', zIndex: 1 }}>
            {!isAuthenticated ? (
              <>
                <Button 
                  variant="contained" 
                  color="secondary" 
                  size="large"
                  component={Link}
                  to="/register"
                  sx={{ px: 4, py: 1.5 }}
                >
                  Join Now
                </Button>
                <Button 
                  variant="outlined" 
                  color="inherit" 
                  size="large"
                  component={Link}
                  to="/myths"
                  sx={{ px: 4, py: 1.5, borderColor: 'white', color: 'white', '&:hover': { borderColor: 'rgba(255, 255, 255, 0.8)' } }}
                >
                  Explore Myths
                </Button>
              </>
            ) : (
              <Button 
                variant="contained" 
                color="secondary" 
                size="large"
                component={Link}
                to="/myths"
                sx={{ px: 4, py: 1.5 }}
              >
                Browse Myths
              </Button>
            )}
          </Box>
        </Container>
      </HeroSection>

      {/* Features Section */}
      <Box sx={{ py: 8, bgcolor: 'background.paper' }}>
        <Container maxWidth="lg">
          <Typography variant="h4" component="h2" align="center" gutterBottom sx={{ fontWeight: 600, mb: 6 }}>
            Why Choose Agro-MythBusters?
          </Typography>
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Box sx={{ textAlign: 'center', px: 2 }}>
                  <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                  <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 600 }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" color="textSecondary">
                    {feature.description}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Featured Myths Section */}
      <Box sx={{ py: 8, bgcolor: 'background.default' }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography variant="h4" component="h2" sx={{ fontWeight: 600 }}>
              Featured Myths
            </Typography>
            <Button 
              component={Link} 
              to="/myths" 
              endIcon={<NewReleasesIcon />}
              sx={{ textTransform: 'none' }}
            >
              View All Myths
            </Button>
          </Box>
          
          <Grid container spacing={4}>
            {featuredMyths.map((myth) => (
              <Grid item xs={12} md={4} key={myth.id}>
                <FeatureCard>
                  <CardMedia
                    component="img"
                    height="180"
                    image={myth.image}
                    alt={myth.title}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Chip 
                        label={myth.category} 
                        size="small" 
                        color="primary" 
                        variant="outlined"
                        sx={{ mb: 1 }}
                      />
                      <Chip 
                        label={myth.status} 
                        size="small" 
                        color={
                          myth.status === 'Busted' ? 'error' : 
                          myth.status === 'Verified' ? 'success' : 'warning'
                        }
                        variant="filled"
                        sx={{ color: 'white' }}
                      />
                    </Box>
                    <Typography gutterBottom variant="h6" component="h3">
                      {myth.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {myth.summary}
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ p: 2 }}>
                    <Button 
                      size="small" 
                      color="primary"
                      component={Link}
                      to={`/myths/${myth.id}`}
                    >
                      Learn More
                    </Button>
                  </CardActions>
                </FeatureCard>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box sx={{ py: 8, bgcolor: 'primary.main', color: 'white' }}>
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
            Ready to separate fact from fiction?
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
            Join our community of farmers, researchers, and agriculture enthusiasts
          </Typography>
          <Button 
            variant="contained" 
            color="secondary" 
            size="large"
            component={Link}
            to={isAuthenticated ? "/myths" : "/register"}
            sx={{ 
              px: 4, 
              py: 1.5,
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: 3,
              },
              transition: 'all 0.3s ease',
            }}
          >
            {isAuthenticated ? 'Browse Myths' : 'Get Started for Free'}
          </Button>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;
