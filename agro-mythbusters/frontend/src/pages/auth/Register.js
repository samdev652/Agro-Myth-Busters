import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { register } from '../../services/authService';
import { loginUser } from '../../store/authSlice';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  Button,
  TextField,
  Typography,
  IconButton,
  InputAdornment,
  CircularProgress,
  Alert,
  FormControlLabel,
  Checkbox,
  Grid,
  Link as MuiLink,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);

  const initialValues = {
    email: '',
    first_name: '',
    last_name: '',
    password: '',
    password2: '',
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    first_name: Yup.string()
      .max(30, 'Must be 30 characters or less')
      .required('First name is required'),
    last_name: Yup.string()
      .max(30, 'Must be 30 characters or less')
      .required('Last name is required'),
    password: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
      )
      .required('Password is required'),
    password2: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Confirm Password is required'),
  });

  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    if (!termsAccepted) {
      setFieldError('terms', 'You must accept the terms and conditions');
      setSubmitting(false);
      return;
    }

    setLoading(true);
    try {
      await register(values);
      
      // Automatically log in the user after successful registration
      await dispatch(loginUser({ email: values.email, password: values.password })).unwrap();
      navigate('/');
    } catch (error) {
      if (error?.email) {
        setFieldError('email', error.email[0]);
      } else if (error?.password) {
        setFieldError('password', error.password[0]);
      } else if (error?.non_field_errors) {
        setFieldError('nonFieldError', error.non_field_errors[0]);
      } else {
        setFieldError('nonFieldError', 'An error occurred during registration. Please try again.');
      }
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 500, mx: 'auto' }}>
      <Typography variant="h5" component="h1" gutterBottom align="center">
        Create an Account
      </Typography>
      <Typography variant="body1" color="textSecondary" align="center" mb={4}>
        Join Agro-MythBusters today
      </Typography>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched, isSubmitting, values }) => (
          <Form>
            {errors.nonFieldError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {errors.nonFieldError}
              </Alert>
            )}

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Field name="first_name">
                  {({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="First Name"
                      margin="normal"
                      variant="outlined"
                      error={touched.first_name && Boolean(errors.first_name)}
                      helperText={touched.first_name && errors.first_name}
                      disabled={loading}
                    />
                  )}
                </Field>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Field name="last_name">
                  {({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Last Name"
                      margin="normal"
                      variant="outlined"
                      error={touched.last_name && Boolean(errors.last_name)}
                      helperText={touched.last_name && errors.last_name}
                      disabled={loading}
                    />
                  )}
                </Field>
              </Grid>
            </Grid>

            <Field name="email">
              {({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Email Address"
                  margin="normal"
                  variant="outlined"
                  error={touched.email && Boolean(errors.email)}
                  helperText={touched.email && errors.email}
                  disabled={loading}
                />
              )}
            </Field>

            <Field name="password">
              {({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  margin="normal"
                  variant="outlined"
                  error={touched.password && Boolean(errors.password)}
                  helperText={touched.password && errors.password}
                  disabled={loading}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            </Field>

            <Field name="password2">
              {({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Confirm Password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  margin="normal"
                  variant="outlined"
                  error={touched.password2 && Boolean(errors.password2)}
                  helperText={touched.password2 && errors.password2}
                  disabled={loading}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle confirm password visibility"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          edge="end"
                        >
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            </Field>

            <Box mt={2} mb={2}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    color="primary"
                  />
                }
                label={
                  <Typography variant="body2">
                    I agree to the{' '}
                    <MuiLink href="/terms" color="primary">
                      Terms of Service
                    </MuiLink>{' '}
                    and{' '}
                    <MuiLink href="/privacy" color="primary">
                      Privacy Policy
                    </MuiLink>
                  </Typography>
                }
              />
              {errors.terms && (
                <Typography color="error" variant="caption" display="block">
                  {errors.terms}
                </Typography>
              )}
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              disabled={loading || isSubmitting || !termsAccepted}
              sx={{ mt: 2, mb: 2, py: 1.5 }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Create Account'
              )}
            </Button>

            <Box mt={2} textAlign="center">
              <Typography variant="body2" color="textSecondary">
                Already have an account?{' '}
                <MuiLink 
                  component={Link}
                  to="/login" 
                  sx={{ 
                    color: 'primary.main', 
                    textDecoration: 'none',
                    fontWeight: 500,
                  }}
                >
                  Sign in
                </MuiLink>
              </Typography>
            </Box>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default Register;
