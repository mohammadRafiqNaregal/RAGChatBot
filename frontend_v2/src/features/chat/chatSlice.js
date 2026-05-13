import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchChatHistoryRequest, sendChatRequest } from '@/lib/api/chat';

// ── Toggle this flag to switch between mock data and real API ────────────────
//    true  → uses static mock data below (no backend needed)
//    false → calls the real FastAPI backend
const USE_MOCK_API = true;

// ── Static mock data (remove once real API is wired) ─────────────────────────
const MOCK_HISTORY = [
  {
    id: 'h1',
    role: 'user',
    content: 'What is the leave policy for HR employees?',
    created_at: '2026-05-12T09:00:00Z',
  },
  {
    id: 'h2',
    role: 'assistant',
    content:
      'According to the HR policy document, employees are entitled to 20 days of annual leave per year. Leave must be requested at least 5 working days in advance and approved by the direct manager.',
    created_at: '2026-05-12T09:00:05Z',
  },
  {
    id: 'h3',
    role: 'user',
    content: 'Can unused leave be carried over to the next year?',
    created_at: '2026-05-12T09:01:00Z',
  },
  {
    id: 'h4',
    role: 'assistant',
    content:
      'Yes, up to 5 days of unused annual leave can be carried over to the following year. Any remaining balance beyond 5 days will be forfeited at year-end unless a written exception is approved by HR.',
    created_at: '2026-05-12T09:01:08Z',
  },
];

const MOCK_REPLIES = [
  'Based on the uploaded documents, here is what I found: the policy states that all requests must go through the department head before reaching HR for final approval.',
  'The finance guidelines document (Q1 2026) mentions that budget requests above $10,000 require CFO sign-off in addition to the standard approval chain.',
  'I found 3 relevant sections across 2 documents. The IT security policy requires all remote access to use MFA and a company-approved VPN.',
  'According to the onboarding handbook, new employees complete a 30-day probation review and a 90-day performance check-in with their manager.',
];

let mockReplyIndex = 0;

const mockDelay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// ── normalise a history record from the backend into our message shape ──────
const normalizeHistoryItem = (item) => ({
  id: String(item.id ?? crypto.randomUUID()),
  role: item.role ?? 'assistant',
  parts: [
    {
      type: 'text',
      text: item.content ?? item.message ?? item.text ?? '',
    },
  ],
  sources: item.sources ?? item.chunks ?? [],
  timestamp: item.created_at ?? item.timestamp ?? null,
});

// ── thunks ──────────────────────────────────────────────────────────────────

export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async ({ query, conversationId }, { getState, rejectWithValue }) => {
    try {
      if (USE_MOCK_API) {
        await mockDelay(800);
        const reply = MOCK_REPLIES[mockReplyIndex % MOCK_REPLIES.length];
        mockReplyIndex += 1;
        return {
          id: crypto.randomUUID(),
          answer: reply,
          conversation_id: conversationId ?? 'mock-conv-1',
          sources: [],
        };
      }

      const token = getState().auth.token;
      return await sendChatRequest({
        token,
        query,
        conversation_id: conversationId ?? null,
      });
    } catch (err) {
      return rejectWithValue(err.message ?? 'Chat request failed');
    }
  },
);

export const fetchChatHistory = createAsyncThunk(
  'chat/fetchHistory',
  async (limit = 20, { getState, rejectWithValue }) => {
    try {
      if (USE_MOCK_API) {
        await mockDelay(400);
        return MOCK_HISTORY.slice(0, limit);
      }

      const token = getState().auth.token;
      return await fetchChatHistoryRequest({ token, limit });
    } catch (err) {
      return rejectWithValue(err.message ?? 'Unable to load chat history');
    }
  },
);

// ── slice ─────────────────────────────────────────────────────────────────

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    messages: [],
    isLoading: false,
    error: null,
    conversationId: null,
  },
  reducers: {
    // Sync action – optimistically add user message before API responds
    addMessage(state, action) {
      state.messages.push(action.payload);
    },
    clearChat(state) {
      state.messages = [];
      state.error = null;
      state.conversationId = null;
    },
  },
  extraReducers: (builder) => {
    // ── sendMessage ────────────────────────────────────────────────────────
    builder
      .addCase(sendMessage.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.isLoading = false;
        const payload = action.payload;

        // Persist conversation_id for multi-turn context
        if (payload.conversation_id) {
          state.conversationId = payload.conversation_id;
        }

        // Map backend ChatResponse to our message shape
        // Handles: answer | response | message | content
        const text =
          payload.answer ??
          payload.response ??
          payload.message ??
          payload.content ??
          '';

        state.messages.push({
          id: String(payload.id ?? crypto.randomUUID()),
          role: 'assistant',
          parts: [{ type: 'text', text }],
          sources: payload.sources ?? payload.chunks ?? [],
        });
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Chat request failed';
      });

    // ── fetchChatHistory ───────────────────────────────────────────────────
    builder
      .addCase(fetchChatHistory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchChatHistory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.messages = action.payload.map(normalizeHistoryItem);
      })
      .addCase(fetchChatHistory.rejected, (state, action) => {
        state.isLoading = false;
        // History load failure is non-critical; surface error but keep messages
        state.error = action.payload ?? 'Unable to load chat history';
      });
  },
});

export const { addMessage, clearChat } = chatSlice.actions;
export default chatSlice.reducer;
