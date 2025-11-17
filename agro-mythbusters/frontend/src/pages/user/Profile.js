import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Avatar,
  Divider,
  Switch,
  FormControlLabel,
  CircularProgress,
  Alert,
  Snackbar,
  Tab,
  Tabs,
  Card,
  CardContent,
  Chip,
} from '@mui/material';
import {
  Person,
  Edit,
  Save,
  Cancel,
  Lock,
} from '@mui/icons-material';
import api from '../../services/api';
import { loginSuccess } from '../../store/authSlice';

const TabPanel = ({ children, value, index, ...other }) => (
  <div
    role="tabpanel"
    hidden={value !== index}
    id={`profile-tabpanel-${index}`}
    aria-labelledby={`profile-tab-${index}`}
    {...other}
  >
    {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
  </div>
);

const Profile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  // Profile form
  const [profileData, setProfileData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    bio: '',
    location: '',
    is_farmer: false,
    is_researcher: false,
  });

  // Password form
  const [passwordData, setPasswordData] = useState({
    old_password: '',
    new_password: '',
    confirm_password: '',
  });

  // User's myths
  const [userMyths, setUserMyths] = useState([]);

  useEffect(() => {
    if (user) {
      setProfileData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        phone_number: user.phone_number || '',
        bio: user.bio || '',
        location: user.location || '',
        is_farmer: user.is_farmer || false,
        is_researcher: user.is_researcher || false,
      });
      fetchUserMyths();
    }
  }, [user]);

  const fetchUserMyths = async () => {
    try {
      const response = await api.get('/myths/', {
        params: { user: user.id },
      });
      setUserMyths(response.data.results || response.data);
    } catch (error) {
      console.error('Failed to fetch user myths:', error);
    }
  };

  const handleProfileChange = (e) => {
    const { name, value, checked, type } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProfileUpdate = async () => {
    setLoading(true);
    try {
      const response = await api.put('/auth/profile/', profileData);
      dispatch(loginSuccess(response.data));
      localStorage.setItem('user', JSON.stringify(response.data));
      setSnackbar({ open: true, message: 'Profile updated successfully!', severity: 'success' });
      setEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
      setSnackbar({ open: true, message: 'Failed to update profile', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async () => {
    if (passwordData.new_password !== passwordData.confirm_password) {
      setSnackbar({ open: true, message: 'Passwords do not match', severity: 'error' });
      return;
    }

    setLoading(true);
    try {
      await api.put('/auth/auth/change-password/', {
        old_password: passwordData.old_password,
        new_password: passwordData.new_password,
      });
      setPasswordData({ old_password: '', new_password: '', confirm_password: '' });
      setSnackbar({ open: true, message: 'Password updated successfully!', severity: 'success' });
    } catch (error) {
      console.error('Failed to update password:', error);
      setSnackbar({ 
        open: true, 
        message: error.response?.data?.old_password?.[0] || 'Failed to update password', 
        severity: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'verified': return 'success';
      case 'debunked': return 'error';
      case 'under_review': return 'warning';
      default: return 'default';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper sx={{ p: 4 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <Avatar 
            sx={{ width: 80, height: 80, bgcolor: 'primary.main', mr: 3 }}
            src={user?.profile_picture}
          >
            {user?.first_name?.[0]}{user?.last_name?.[0]}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h4" gutterBottom>
              {user?.first_name} {user?.last_name}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {user?.email}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Profile Information" icon={<Person />} iconPosition="start" />
            <Tab label="My Submissions" icon={<Edit />} iconPosition="start" />
            <Tab label="Security" icon={<Lock />} iconPosition="start" />
          </Tabs>
        </Box>

        {/* Profile Information Tab */}
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="First Name"
                name="first_name"
                value={profileData.first_name}
                onChange={handleProfileChange}
                disabled={!editing}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last Name"
                name="last_name"
                value={profileData.last_name}
                onChange={handleProfileChange}
                disabled={!editing}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                value={profileData.email}
                disabled
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone Number"
                name="phone_number"
                value={profileData.phone_number}
                onChange={handleProfileChange}
                disabled={!editing}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Location"
                name="location"
                value={profileData.location}
                onChange={handleProfileChange}
                disabled={!editing}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Bio"
                name="bio"
                multiline
                rows={4}
                value={profileData.bio}
                onChange={handleProfileChange}
                disabled={!editing}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={profileData.is_farmer}
                    onChange={handleProfileChange}
                    name="is_farmer"
                    disabled={!editing}
                  />
                }
                label="I am a farmer"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={profileData.is_researcher}
                    onChange={handleProfileChange}
                    name="is_researcher"
                    disabled={!editing}
                  />
                }
                label="I am a researcher"
              />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                {!editing ? (
                  <Button
                    variant="contained"
                    startIcon={<Edit />}
                    onClick={() => setEditing(true)}
                  >
                    Edit Profile
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="contained"
                      startIcon={<Save />}
                      onClick={handleProfileUpdate}
                      disabled={loading}
                    >
                      {loading ? <CircularProgress size={24} /> : 'Save Changes'}
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<Cancel />}
                      onClick={() => {
                        setEditing(false);
                        if (user) {
                          setProfileData({
                            first_name: user.first_name || '',
                            last_name: user.last_name || '',
                            email: user.email || '',
                            phone_number: user.phone_number || '',
                            bio: user.bio || '',
                            location: user.location || '',
                            is_farmer: user.is_farmer || false,
                            is_researcher: user.is_researcher || false,
                          });
                        }
                      }}
                    >
                      Cancel
                    </Button>
                  </>
                )}
              </Box>
            </Grid>
          </Grid>
        </TabPanel>

        {/* My Submissions Tab */}
        <TabPanel value={tabValue} index={1}>
          <Typography variant="h6" gutterBottom>
            My Submitted Myths ({userMyths.length})
          </Typography>
          {userMyths.length === 0 ? (
            <Alert severity="info">You haven't submitted any myths yet.</Alert>
          ) : (
            <Grid container spacing={2} sx={{ mt: 2 }}>
              {userMyths.map((myth) => (
                <Grid item xs={12} key={myth.id}>
                  <Card variant="outlined">
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="h6">{myth.title}</Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            {myth.description.substring(0, 150)}...
                          </Typography>
                          <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                            {myth.category && (
                              <Chip label={myth.category.name} size="small" />
                            )}
                            <Chip 
                              label={myth.status.replace('_', ' ').toUpperCase()} 
                              size="small" 
                              color={getStatusColor(myth.status)}
                            />
                          </Box>
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(myth.created_at).toLocaleDateString()}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </TabPanel>

        {/* Security Tab */}
        <TabPanel value={tabValue} index={2}>
          <Typography variant="h6" gutterBottom>
            Change Password
          </Typography>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="password"
                label="Current Password"
                name="old_password"
                value={passwordData.old_password}
                onChange={handlePasswordChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="password"
                label="New Password"
                name="new_password"
                value={passwordData.new_password}
                onChange={handlePasswordChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="password"
                label="Confirm New Password"
                name="confirm_password"
                value={passwordData.confirm_password}
                onChange={handlePasswordChange}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                onClick={handlePasswordUpdate}
                disabled={loading || !passwordData.old_password || !passwordData.new_password}
              >
                {loading ? <CircularProgress size={24} /> : 'Update Password'}
              </Button>
            </Grid>
          </Grid>
        </TabPanel>
      </Paper>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Profile;
