import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Search as SearchIcon, FilterList as FilterIcon } from '@mui/icons-material';
import api from '../../services/api';

const Myths = () => {
  const navigate = useNavigate();
  const [myths, setMyths] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchMyths();
  }, [searchQuery, selectedCategory, selectedStatus, page]);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories/');
      setCategories(response.data.results || response.data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const fetchMyths = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        search: searchQuery,
        ...(selectedCategory && { category: selectedCategory }),
        ...(selectedStatus && { status: selectedStatus }),
      };

      const response = await api.get('/myths/', { params });
      setMyths(response.data.results || response.data);
      
      if (response.data.count) {
        setTotalPages(Math.ceil(response.data.count / 20));
      }
      
      setError(null);
    } catch (error) {
      console.error('Failed to fetch myths:', error);
      setError('Failed to load myths. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setPage(1);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setPage(1);
  };

  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value);
    setPage(1);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'verified':
        return 'success';
      case 'debunked':
        return 'error';
      case 'under_review':
        return 'warning';
      case 'inconclusive':
        return 'info';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status) => {
    return status.replace('_', ' ').toUpperCase();
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 600, mb: 4 }}>
        Agricultural Myths Database
      </Typography>

      {/* Filters Section */}
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search myths..."
              value={searchQuery}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={selectedCategory}
                label="Category"
                onChange={handleCategoryChange}
              >
                <MenuItem value="">All Categories</MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={selectedStatus}
                label="Status"
                onChange={handleStatusChange}
              >
                <MenuItem value="">All Status</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="under_review">Under Review</MenuItem>
                <MenuItem value="verified">Verified</MenuItem>
                <MenuItem value="debunked">Debunked</MenuItem>
                <MenuItem value="inconclusive">Inconclusive</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Loading State */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* Myths Grid */}
          {myths.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6" color="text.secondary">
                No myths found. Try adjusting your filters.
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {myths.map((myth) => (
                <Grid item xs={12} md={6} lg={4} key={myth.id}>
                  <Card 
                    sx={{ 
                      height: '100%', 
                      display: 'flex', 
                      flexDirection: 'column',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: 4,
                      },
                    }}
                  >
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        {myth.category && (
                          <Chip 
                            label={myth.category.name} 
                            size="small" 
                            color="primary" 
                            variant="outlined"
                          />
                        )}
                        <Chip 
                          label={getStatusLabel(myth.status)} 
                          size="small" 
                          color={getStatusColor(myth.status)}
                        />
                      </Box>
                      
                      <Typography variant="h6" component="h2" gutterBottom>
                        {myth.title}
                      </Typography>
                      
                      <Typography 
                        variant="body2" 
                        color="text.secondary" 
                        sx={{ 
                          mb: 2,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                        }}
                      >
                        {myth.description}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                        <Typography variant="caption" color="text.secondary">
                          👍 {myth.upvotes || 0}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          👎 {myth.downvotes || 0}
                        </Typography>
                      </Box>
                    </CardContent>
                    
                    <CardActions>
                      <Button 
                        size="small" 
                        color="primary"
                        onClick={() => navigate(`/myths/${myth.id}`)}
                      >
                        Learn More
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination 
                count={totalPages} 
                page={page} 
                onChange={handlePageChange}
                color="primary"
                size="large"
              />
            </Box>
          )}
        </>
      )}
    </Container>
  );
};

export default Myths;
