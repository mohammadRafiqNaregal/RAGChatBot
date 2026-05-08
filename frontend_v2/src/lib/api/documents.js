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

export const uploadDocumentRequest = async ({ token, payload }) => {
  const formData = new FormData();
  formData.append('file', payload.file);
  formData.append('title', payload.title);
  formData.append('department', payload.department);
  formData.append('section', payload.section);
  formData.append('tags', JSON.stringify(payload.tags));
  formData.append('allowedRoles', JSON.stringify(payload.allowedRoles));

  const response = await fetch(`${API_BASE_URL}/documents/upload`, {
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
