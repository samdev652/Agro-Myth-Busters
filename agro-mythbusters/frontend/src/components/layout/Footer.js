import React from 'react';
import { Box, Container, Grid, Typography, Link, Divider } from '@mui/material';
import { Facebook, Twitter, Instagram, LinkedIn } from '@mui/icons-material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: (theme) =>
          theme.palette.mode === 'light'
            ? theme.palette.grey[200]
            : theme.palette.grey[800],
        p: 3,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Agro-MythBusters
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Debunking agricultural myths with scientific evidence and community knowledge.
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Quick Links
            </Typography>
            <Box display="flex" flexDirection="column">
              <Link href="/about" color="inherit" underline="hover" sx={{ mb: 1 }}>
                About Us
              </Link>
              <Link href="/myths" color="inherit" underline="hover" sx={{ mb: 1 }}>
                Browse Myths
              </Link>
              <Link href="/submit" color="inherit" underline="hover" sx={{ mb: 1 }}>
                Submit a Myth
              </Link>
              <Link href="/contact" color="inherit" underline="hover">
                Contact Us
              </Link>
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Resources
            </Typography>
            <Box display="flex" flexDirection="column">
              <Link href="/blog" color="inherit" underline="hover" sx={{ mb: 1 }}>
                Blog
              </Link>
              <Link href="/research" color="inherit" underline="hover" sx={{ mb: 1 }}>
                Research Papers
              </Link>
              <Link href="/faq" color="inherit" underline="hover" sx={{ mb: 1 }}>
                FAQ
              </Link>
              <Link href="/privacy" color="inherit" underline="hover">
                Privacy Policy
              </Link>
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Connect With Us
            </Typography>
            <Box display="flex" gap={2} mb={2}>
              <Link href="https://facebook.com" color="inherit">
                <Facebook />
              </Link>
              <Link href="https://twitter.com" color="inherit">
                <Twitter />
              </Link>
              <Link href="https://instagram.com" color="inherit">
                <Instagram />
              </Link>
              <Link href="https://linkedin.com" color="inherit">
                <LinkedIn />
              </Link>
            </Box>
            <Typography variant="body2" color="text.secondary">
              Subscribe to our newsletter for the latest updates.
            </Typography>
          </Grid>
        </Grid>
        
        <Divider sx={{ my: 3 }} />
        
        <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems="center">
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} Agro-MythBusters. All rights reserved.
          </Typography>
          <Box>
            <Link href="/terms" color="inherit" underline="hover" sx={{ mr: 2 }}>
              Terms of Service
            </Link>
            <Link href="/privacy" color="inherit" underline="hover" sx={{ mr: 2 }}>
              Privacy Policy
            </Link>
            <Link href="/cookies" color="inherit" underline="hover">
              Cookie Policy
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
