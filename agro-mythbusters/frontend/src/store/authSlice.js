import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { login as loginService, getCurrentUser, isAuthenticated as checkIsAuthenticated } from '../services/authService';

const initialState = {
  isAuthenticated: checkIsAuthenticated(),
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  loading: false,
  error: null,
};

// Thunk for login
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const user = await loginService(credentials);
      return user;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// Thunk for checking authentication
export const checkAuth = createAsyncThunk(
  'auth/checkAuth',
  async (_, { rejectWithValue }) => {
    if (checkIsAuthenticated()) {
      try {
        const user = await getCurrentUser();
        return user;
      } catch (error) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        return rejectWithValue(error);
      }
    }
    return null;
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.loading = false;
      state.error = null;
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Check Auth
      .addCase(checkAuth.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        if (action.payload) {
          state.isAuthenticated = true;
          state.user = action.payload;
        }
        state.loading = false;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.loading = false;
      });
  },
});

export const { logout, clearError } = authSlice.actions;

export default authSlice.reducer;
