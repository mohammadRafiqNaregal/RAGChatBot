import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { createUserRequest, fetchUsersRequest } from '@/lib/api/users';

const USERS_STORAGE_KEY = 'frontend_v2.users';

const readStoredUsers = () => {
  const raw = localStorage.getItem(USERS_STORAGE_KEY);

  if (!raw) {
    return [];
  }

  try {
    return JSON.parse(raw);
  } catch {
    localStorage.removeItem(USERS_STORAGE_KEY);
    return [];
  }
};

const persistUsers = (users) => {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
};

export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const response = await fetchUsersRequest({ token });
      return response.users || response.items || response;
    } catch (error) {
      return rejectWithValue(error.message || 'Unable to load users');
    }
  },
);

export const createUser = createAsyncThunk(
  'users/createUser',
  async (payload, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const response = await createUserRequest({ token, payload });
      return response.user || response;
    } catch (error) {
      return rejectWithValue(error.message || 'Unable to create user');
    }
  },
);

const usersSlice = createSlice({
  name: 'users',
  initialState: {
    items: readStoredUsers(),
    isLoading: false,
    isCreating: false,
    error: null,
    createError: null,
    lastCreatedUser: null,
  },
  reducers: {
    clearUsersState: (state) => {
      state.error = null;
      state.createError = null;
      state.lastCreatedUser = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.items = Array.isArray(action.payload) ? action.payload : [];
        persistUsers(state.items);
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Unable to load users';
      })
      .addCase(createUser.pending, (state) => {
        state.isCreating = true;
        state.createError = null;
        state.lastCreatedUser = null;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.isCreating = false;
        state.createError = null;
        state.lastCreatedUser = action.payload;
        state.items = [action.payload, ...state.items];
        persistUsers(state.items);
      })
      .addCase(createUser.rejected, (state, action) => {
        state.isCreating = false;
        state.createError = action.payload || 'Unable to create user';
      });
  },
});

export const { clearUsersState } = usersSlice.actions;
export default usersSlice.reducer;
