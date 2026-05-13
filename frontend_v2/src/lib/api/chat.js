const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const parseJson = async (response) => {
  const text = await response.text();
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    return { message: text };
  }
};

// POST /api/chat
export const sendChatRequest = async ({ token, query, conversation_id }) => {
  const response = await fetch(`${API_BASE_URL}/api/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ query, conversation_id: conversation_id ?? null }),
  });

  const data = await parseJson(response);

  if (!response.ok) {
    throw new Error(data.detail || data.message || 'Chat request failed');
  }

  return data;
};

// GET /api/chat/history?limit=N
export const fetchChatHistoryRequest = async ({ token, limit = 20 }) => {
  const response = await fetch(
    `${API_BASE_URL}/api/chat/history?limit=${limit}`,
    {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    },
  );

  const data = await parseJson(response);

  if (!response.ok) {
    throw new Error(
      data.detail || data.message || 'Unable to load chat history',
    );
  }

  // Backend returns ChatHistoryListResponse; normalize to array
  return Array.isArray(data) ? data : (data.items ?? data.history ?? []);
};
