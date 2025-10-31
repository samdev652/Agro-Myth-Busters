import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, CssBaseline, Container, useTheme, useMediaQuery } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useSelector } from 'react-redux';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';
import Footer from '../components/layout/Footer';

const Main = styled('main')(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: 0,
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 240,
  }),
}));

const MainLayout = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const { isAuthenticated } = useSelector((state) => state.auth);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', flexDirection: 'column' }}>
      <CssBaseline />
      <Navbar onMenuClick={handleDrawerToggle} isAuthenticated={isAuthenticated} />
      
      {isAuthenticated && (
        <Sidebar 
          mobileOpen={mobileOpen} 
          onClose={handleDrawerToggle} 
          isMobile={isMobile} 
        />
      )}
      
      <Main 
        component="main" 
        sx={{
          flexGrow: 1,
          p: 3,
          width: { 
            sm: `calc(100% - ${isAuthenticated && !isMobile ? 240 : 0}px)`,
            ml: { sm: isAuthenticated && !isMobile ? '240px' : 0 }
          },
          mt: 8,
          mb: 4
        }}
      >
        <Container maxWidth="lg">
          {children || <Outlet />}
        </Container>
      </Main>
      
      <Footer />
    </Box>
  );
};

export default MainLayout;
