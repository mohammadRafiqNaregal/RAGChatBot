import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  deleteDocumentRequest,
  fetchDocumentsRequest,
  uploadDocumentRequest,
} from '@/lib/api/documents';

export const DOCUMENT_ROLE_OPTIONS = [
  'Admin',
  'HR User',
  'Finance User',
  'IT User',
  'Employee',
];

export const DOCUMENT_DEPARTMENT_OPTIONS = ['HR', 'Finance', 'IT'];

const normalizeDocument = (document) => ({
  ...document,
  createdAt:
    document.createdAt ||
    document.created_at ||
    document.uploadedAt ||
    document.uploaded_at ||
    null,
  uploadedAt:
    document.uploadedAt ||
    document.uploaded_at ||
    document.createdAt ||
    document.created_at ||
    null,
  fileName: document.fileName || document.filename || null,
  fileType: document.fileType || document.file_type || null,
  tags: Array.isArray(document.tags) ? document.tags : [],
  allowedRoles:
    document.allowedRoles ||
    document.allowed_roles ||
    document.allowedroles ||
    [],
});

export const fetchDocuments = createAsyncThunk(
  'documents/fetchDocuments',
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const response = await fetchDocumentsRequest({ token });
      return response.map(normalizeDocument);
    } catch (error) {
      return rejectWithValue(error.message || 'Unable to load documents');
    }
  },
);

export const uploadDocument = createAsyncThunk(
  'documents/uploadDocument',
  async (payload, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const response = await uploadDocumentRequest({ token, payload });
      return normalizeDocument(response.document || response);
    } catch (error) {
      return rejectWithValue(error.message || 'Unable to upload document');
    }
  },
);

export const deleteDocument = createAsyncThunk(
  'documents/deleteDocument',
  async (documentId, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const token = state.auth.token;
      const userRole = state.auth.user?.role;

      if (userRole !== 'Admin') {
        return rejectWithValue('Only Admin users can delete documents');
      }

      await deleteDocumentRequest({ token, documentId });
      return documentId;
    } catch (error) {
      return rejectWithValue(error.message || 'Unable to delete document');
    }
  },
);

const documentsSlice = createSlice({
  name: 'documents',
  initialState: {
    items: [],
    isLoading: false,
    loadError: null,
    isUploading: false,
    uploadError: null,
    lastUploaded: null,
    deletingId: null,
    deleteError: null,
  },
  reducers: {
    clearUploadState: (state) => {
      state.uploadError = null;
      state.lastUploaded = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDocuments.pending, (state) => {
        state.isLoading = true;
        state.loadError = null;
      })
      .addCase(fetchDocuments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.loadError = null;
        state.items = action.payload;
      })
      .addCase(fetchDocuments.rejected, (state, action) => {
        state.isLoading = false;
        state.loadError = action.payload || 'Unable to load documents';
      })
      .addCase(uploadDocument.pending, (state) => {
        state.isUploading = true;
        state.uploadError = null;
      })
      .addCase(uploadDocument.fulfilled, (state, action) => {
        state.isUploading = false;
        state.uploadError = null;
        state.lastUploaded = action.payload;
        state.items = [
          action.payload,
          ...state.items.filter((item) => item.id !== action.payload.id),
        ];
      })
      .addCase(uploadDocument.rejected, (state, action) => {
        state.isUploading = false;
        state.uploadError = action.payload || 'Unable to upload document';
      })
      .addCase(deleteDocument.pending, (state, action) => {
        state.deletingId = action.meta.arg;
        state.deleteError = null;
      })
      .addCase(deleteDocument.fulfilled, (state, action) => {
        state.deletingId = null;
        state.deleteError = null;
        state.items = state.items.filter((item) => item.id !== action.payload);
      })
      .addCase(deleteDocument.rejected, (state, action) => {
        state.deletingId = null;
        state.deleteError = action.payload || 'Unable to delete document';
      });
  },
});

export const { clearUploadState } = documentsSlice.actions;
export default documentsSlice.reducer;
