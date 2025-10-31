import React from 'react';
import { Box, Container, Typography, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';

const AuthContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.dark} 100%)`,
  padding: theme.spacing(3),
}));

const AuthCard = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[10],
  padding: theme.spacing(4),
  width: '100%',
  maxWidth: 500,
  position: 'relative',
  overflow: 'hidden',
  '&:before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 8,
    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  },
}));

const AuthLayout = ({ children, title, subtitle }) => {
  const theme = useTheme();

  return (
    <AuthContainer>
      <AuthCard>
        <Box mb={4} textAlign="center">
          <Typography 
            variant="h4" 
            component="h1" 
            gutterBottom
            sx={{ 
              fontWeight: 700,
              color: theme.palette.primary.main,
              marginTop: theme.spacing(1)
            }}
          >
            Agro-MythBusters
          </Typography>
          {title && (
            <Typography variant="h5" component="h2" gutterBottom>
              {title}
            </Typography>
          )}
          {subtitle && (
            <Typography variant="body1" color="textSecondary">
              {subtitle}
            </Typography>
          )}
        </Box>
        
        <Box>
          {children}
        </Box>
        
        <Box mt={4} textAlign="center">
          <Typography variant="body2" color="textSecondary">
            {title === 'Sign In' ? (
              <>
                Don't have an account?{' '}
                <a href="/register" style={{ color: theme.palette.primary.main, textDecoration: 'none' }}>
                  Sign up
                </a>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <a href="/login" style={{ color: theme.palette.primary.main, textDecoration: 'none' }}>
                  Sign in
                </a>
              </>
            )}
          </Typography>
        </Box>
      </AuthCard>
      
      <Box mt={4} textAlign="center">
        <Typography variant="body2" color="common.white">
          © {new Date().getFullYear()} Agro-MythBusters. All rights reserved.
        </Typography>
      </Box>
    </AuthContainer>
  );
};

export default AuthLayout;
