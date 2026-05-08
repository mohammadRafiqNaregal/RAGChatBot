import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { loginRequest, registerRequest } from '@/lib/api/auth';

const AUTH_STORAGE_KEY = 'frontend_v2.auth';

const readStoredAuth = () => {
  const raw = localStorage.getItem(AUTH_STORAGE_KEY);

  if (!raw) {
    return { token: null, user: null };
  }

  try {
    return JSON.parse(raw);
  } catch {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    return { token: null, user: null };
  }
};

const persistAuth = ({ token, user }) => {
  if (!token || !user) {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    return;
  }

  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ token, user }));
};

const deriveFallbackRole = (username) =>
  username?.toLowerCase() === 'admin' ? 'Admin' : 'Employee';

const normalizeRoleLabel = (roleValue, fallbackUsername) => {
  const role = roleValue || deriveFallbackRole(fallbackUsername);
  const normalized = String(role).trim().toLowerCase();

  if (normalized === 'admin') return 'Admin';
  if (
    normalized === 'hr user' ||
    normalized === 'hr_user' ||
    normalized === 'hr'
  )
    return 'HR User';
  if (
    normalized === 'finance user' ||
    normalized === 'finance_user' ||
    normalized === 'finance'
  )
    return 'Finance User';
  if (
    normalized === 'it user' ||
    normalized === 'it_user' ||
    normalized === 'it'
  )
    return 'IT User';

  return 'Employee';
};

const normalizeAuthPayload = (payload, fallbackUsername) => ({
  token: payload.access_token || payload.token || null,

  user: {
    id: payload.user?.id || payload.user_id || fallbackUsername,
    username: payload.user?.username || payload.username || fallbackUsername,
    email: payload.user?.email || payload.email || '',
    role: normalizeRoleLabel(
      payload.user?.role || payload.role,
      payload.user?.username || payload.username || fallbackUsername,
    ),
  },
});

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const payload = await loginRequest({ username, password });
      return normalizeAuthPayload(payload, username);
    } catch (error) {
      return rejectWithValue(error.message || 'Unable to login');
    }
  },
);

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async ({ username, email, password }, { rejectWithValue }) => {
    try {
      const payload = await registerRequest({ username, email, password });
      return normalizeAuthPayload(payload, username);
    } catch (error) {
      return rejectWithValue(error.message || 'Unable to register');
    }
  },
);

const storedAuth = readStoredAuth();

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: storedAuth.token,
    user: storedAuth.user,
    isAuthenticated: Boolean(storedAuth.token && storedAuth.user),
    isLoading: false,
    error: null,
  },
  reducers: {
    clearAuthError: (state) => {
      state.error = null;
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
      persistAuth({ token: null, user: null });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        persistAuth(action.payload);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Unable to login';
      })
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        persistAuth(action.payload);
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Unable to register';
      });
  },
});

export const { clearAuthError, logout } = authSlice.actions;
export default authSlice.reducer;
