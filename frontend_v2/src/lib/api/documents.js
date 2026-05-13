const API_BASE_URL =
  // import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

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

export const uploadDocumentRequest = async ({ token, payload }) => {
  const formData = new FormData();
  formData.append('file', payload.file);
  formData.append('title', payload.title);
  formData.append('department', payload.department);
  formData.append('section', payload.section);
  formData.append('tags', (payload.tags || []).join(','));
  formData.append('allowed_roles', (payload.allowedRoles || []).join(','));

  const response = await fetch(`${API_BASE_URL}/api/documents/`, {
    method: 'POST',
    headers: token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : undefined,
    body: formData,
  });

  const data = await parseJson(response);

  if (!response.ok) {
    throw new Error(data.detail || data.message || 'Unable to upload document');
  }

  return data;
};

export const fetchDocumentsRequest = async ({ token }) => {
  const response = await fetch(`${API_BASE_URL}/api/documents/`, {
    method: 'GET',
    headers: token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : undefined,
  });

  const data = await parseJson(response);

  if (!response.ok) {
    throw new Error(data.detail || data.message || 'Unable to load documents');
  }

  return Array.isArray(data) ? data : [];
};

export const getDocumentFileUrl = (filename) =>
  `${API_BASE_URL}/uploads/${filename}`;

export const deleteDocumentRequest = async ({ token, documentId }) => {
  const response = await fetch(`${API_BASE_URL}/api/documents/${documentId}`, {
    method: 'DELETE',
    headers: token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : undefined,
  });

  if (!response.ok) {
    const data = await parseJson(response);
    throw new Error(data.detail || data.message || 'Unable to delete document');
  }
};
