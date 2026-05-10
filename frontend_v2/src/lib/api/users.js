const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const parseJson = async (response) => {
  const text = await response.text();

  if (!text) {
    return {};
  }

  try {
    return JSON.parse(text);
  } catch {
    return { message: text };
  }
};

const authorizedRequest = async ({ path, method = 'GET', token, body }) => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(body ? { 'Content-Type': 'application/json' } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await parseJson(response);

  if (!response.ok) {
    throw new Error(data.detail || data.message || 'Request failed');
  }

  return data;
};

export const fetchUsersRequest = async ({ token }) =>
  authorizedRequest({ path: '/users', token });

export const createUserRequest = async ({ token, payload }) =>
  authorizedRequest({
    path: '/users',
    method: 'POST',
    token,
    body: payload,
  });
