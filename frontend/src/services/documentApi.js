async function request(url, options) {
  const response = await fetch(url, options);
  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(result.error || 'Não foi possível concluir a operação.');
  }
  return result;
}

export async function getDocuments() {
  const result = await request('/api/documents');
  return result.documents;
}

export async function uploadDocument(file, description) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('description', description);
  return request('/api/upload', { method: 'POST', body: formData });
}
