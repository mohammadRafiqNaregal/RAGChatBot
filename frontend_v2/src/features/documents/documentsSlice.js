import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { uploadDocumentRequest } from '@/lib/api/documents';

const DOCUMENTS_STORAGE_KEY = 'frontend_v2.documents';

const readStoredDocuments = () => {
  const raw = localStorage.getItem(DOCUMENTS_STORAGE_KEY);

  if (!raw) {
    return [];
  }

  try {
    return JSON.parse(raw);
  } catch {
    localStorage.removeItem(DOCUMENTS_STORAGE_KEY);
    return [];
  }
};

const persistDocuments = (documents) => {
  localStorage.setItem(DOCUMENTS_STORAGE_KEY, JSON.stringify(documents));
};

export const DOCUMENT_ROLE_OPTIONS = [
  'Admin',
  'HR User',
  'Finance User',
  'IT User',
  'Employee',
];

export const DOCUMENT_DEPARTMENT_OPTIONS = ['HR', 'Finance', 'IT'];

export const uploadDocument = createAsyncThunk(
  'documents/uploadDocument',
  async (payload, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const response = await uploadDocumentRequest({ token, payload });
      return response.document || response;
    } catch (error) {
      return rejectWithValue(error.message || 'Unable to upload document');
    }
  },
);

const documentsSlice = createSlice({
  name: 'documents',
  initialState: {
    items: readStoredDocuments(),
    isUploading: false,
    uploadError: null,
    lastUploaded: null,
  },
  reducers: {
    clearUploadState: (state) => {
      state.uploadError = null;
      state.lastUploaded = null;
    },
    deleteDocument: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      persistDocuments(state.items);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadDocument.pending, (state) => {
        state.isUploading = true;
        state.uploadError = null;
      })
      .addCase(uploadDocument.fulfilled, (state, action) => {
        state.isUploading = false;
        state.uploadError = null;
        state.lastUploaded = action.payload;
        state.items.unshift(action.payload);
        persistDocuments(state.items);
      })
      .addCase(uploadDocument.rejected, (state, action) => {
        state.isUploading = false;
        state.uploadError = action.payload || 'Unable to upload document';
      });
  },
});

export const { clearUploadState, deleteDocument } = documentsSlice.actions;
export default documentsSlice.reducer;
