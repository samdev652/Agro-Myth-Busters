import { createSlice } from '@reduxjs/toolkit';
import { isAuthenticated, getCurrentUser } from '../services/authService';

const initialState = {
  isAuthenticated: isAuthenticated(),
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload;
      state.loading = false;
      state.error = null;
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.loading = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout, clearError } = authSlice.actions;

// Thunk for login
export const loginUser = (credentials) => async (dispatch) => {
  dispatch(loginStart());
  try {
    const user = await login(credentials);
    dispatch(loginSuccess(user));
  } catch (error) {
    dispatch(loginFailure(error));
  }
};

// Thunk for checking authentication
export const checkAuth = () => async (dispatch) => {
  if (isAuthenticated()) {
    try {
      const user = await getCurrentUser();
      dispatch(loginSuccess(user));
    } catch (error) {
      dispatch(logout());
    }
  }
};

export default authSlice.reducer;
