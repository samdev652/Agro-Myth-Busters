import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Box,
  Container,
  Typography,
  Paper,
  Chip,
  Button,
  Divider,
  CircularProgress,
  Alert,
  Grid,
  Card,
  CardContent,
  TextField,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Avatar,
} from '@mui/material';
import {
  ThumbUp,
  ThumbDown,
  ArrowBack,
  Science,
  Comment as CommentIcon,
  Send,
} from '@mui/icons-material';
import api from '../../services/api';

const MythDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  
  const [myth, setMyth] = useState(null);
  const [evidence, setEvidence] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    fetchMythDetails();
  }, [id]);

  const fetchMythDetails = async () => {
    setLoading(true);
    try {
      const [mythResponse, evidenceResponse, commentsResponse] = await Promise.all([
        api.get(`/myths/${id}/`),
        api.get(`/evidence/?myth=${id}`),
        api.get(`/comments/?myth=${id}`),
      ]);

      setMyth(mythResponse.data);
      setEvidence(evidenceResponse.data.results || evidenceResponse.data);
      setComments(commentsResponse.data.results || commentsResponse.data);
      setError(null);
    } catch (error) {
      console.error('Failed to fetch myth details:', error);
      setError('Failed to load myth details. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (voteType) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      await api.post(`/myths/${id}/${voteType}/`);
      fetchMythDetails(); // Refresh data
    } catch (error) {
      console.error(`Failed to ${voteType}:`, error);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !isAuthenticated) return;

    setSubmittingComment(true);
    try {
      await api.post('/comments/', {
        myth: id,
        content: newComment,
      });
      setNewComment('');
      fetchMythDetails(); // Refresh comments
    } catch (error) {
      console.error('Failed to submit comment:', error);
    } finally {
      setSubmittingComment(false);
    }
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

  const getEvidenceTypeLabel = (type) => {
    return type.replace('_', ' ').split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !myth) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error || 'Myth not found'}</Alert>
        <Button startIcon={<ArrowBack />} onClick={() => navigate('/myths')} sx={{ mt: 2 }}>
          Back to Myths
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Button startIcon={<ArrowBack />} onClick={() => navigate('/myths')} sx={{ mb: 3 }}>
        Back to Myths
      </Button>

      {/* Myth Header */}
      <Paper sx={{ p: 4, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ flex: 1 }}>
            {myth.category && (
              <Chip 
                label={myth.category.name} 
                color="primary" 
                variant="outlined"
                sx={{ mb: 2 }}
              />
            )}
            <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
              {myth.title}
            </Typography>
          </Box>
          <Chip 
            label={getStatusLabel(myth.status)} 
            color={getStatusColor(myth.status)}
            sx={{ ml: 2 }}
          />
        </Box>

        <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
          {myth.description}
        </Typography>

        {myth.origin && (
          <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', mb: 2 }}>
            Origin: {myth.origin}
          </Typography>
        )}

        <Divider sx={{ my: 3 }} />

        {/* Voting Section */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Was this helpful?
          </Typography>
          <Button
            variant={myth.user_vote === 'upvote' ? 'contained' : 'outlined'}
            startIcon={<ThumbUp />}
            onClick={() => handleVote('upvote')}
            disabled={!isAuthenticated}
          >
            {myth.upvotes || 0}
          </Button>
          <Button
            variant={myth.user_vote === 'downvote' ? 'contained' : 'outlined'}
            startIcon={<ThumbDown />}
            onClick={() => handleVote('downvote')}
            disabled={!isAuthenticated}
            color="error"
          >
            {myth.downvotes || 0}
          </Button>
        </Box>
      </Paper>

      <Grid container spacing={3}>
        {/* Evidence Section */}
        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Science /> Scientific Evidence
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            {evidence.length === 0 ? (
              <Typography color="text.secondary">
                No evidence has been submitted yet for this myth.
              </Typography>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {evidence.map((item) => (
                  <Card key={item.id} variant="outlined">
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="h6">{item.title}</Typography>
                        <Chip 
                          label={getEvidenceTypeLabel(item.evidence_type)} 
                          size="small"
                          color="secondary"
                        />
                      </Box>
                      <Typography variant="body2" paragraph>
                        {item.description}
                      </Typography>
                      {item.source_url && (
                        <Button 
                          size="small" 
                          href={item.source_url} 
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View Source
                        </Button>
                      )}
                      {item.source_citation && (
                        <Typography variant="caption" display="block" sx={{ mt: 1, fontStyle: 'italic' }}>
                          Citation: {item.source_citation}
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Comments Section */}
        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CommentIcon /> Comments ({comments.length})
            </Typography>
            <Divider sx={{ mb: 2 }} />

            {/* Comment Form */}
            {isAuthenticated ? (
              <Box component="form" onSubmit={handleCommentSubmit} sx={{ mb: 3 }}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  placeholder="Add your comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  sx={{ mb: 1 }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  endIcon={<Send />}
                  disabled={!newComment.trim() || submittingComment}
                  fullWidth
                >
                  {submittingComment ? 'Posting...' : 'Post Comment'}
                </Button>
              </Box>
            ) : (
              <Alert severity="info" sx={{ mb: 3 }}>
                Please <Button onClick={() => navigate('/login')}>log in</Button> to comment.
              </Alert>
            )}

            {/* Comments List */}
            {comments.length === 0 ? (
              <Typography color="text.secondary">
                No comments yet. Be the first to comment!
              </Typography>
            ) : (
              <List>
                {comments.map((comment, index) => (
                  <React.Fragment key={comment.id}>
                    <ListItem alignItems="flex-start" sx={{ px: 0 }}>
                      <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                        {comment.user?.first_name?.[0] || 'U'}
                      </Avatar>
                      <ListItemText
                        primary={
                          <Typography variant="subtitle2">
                            {comment.user?.first_name} {comment.user?.last_name}
                          </Typography>
                        }
                        secondary={
                          <>
                            <Typography variant="body2" component="span" display="block" sx={{ mt: 0.5 }}>
                              {comment.content}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {new Date(comment.created_at).toLocaleDateString()}
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>
                    {index < comments.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default MythDetail;
