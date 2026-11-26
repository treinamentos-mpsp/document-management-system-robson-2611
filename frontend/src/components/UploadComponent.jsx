import { useState } from 'react';

export default function UploadComponent({ onUpload, uploading }) {
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    if (!file || !description.trim()) {
      return;
    }

    await onUpload(file, description.trim());
    setFile(null);
    setDescription('');
    event.target.reset();
  }

  return (
    <form className="upload-form" onSubmit={handleSubmit}>
      <label>
        Arquivo
        <input
          type="file"
          required
          onChange={(event) => setFile(event.target.files[0] || null)}
        />
      </label>
      <label>
        Resumo do documento
        <textarea
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          maxLength={1000}
          required
          rows={3}
          placeholder="Descreva brevemente o conteúdo do documento"
        />
      </label>
      <button type="submit" disabled={uploading || !file || !description.trim()}>
        {uploading ? 'Enviando...' : 'Enviar documento'}
      </button>
    </form>
  );
}
