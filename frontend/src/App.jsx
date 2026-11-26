import { useEffect, useState } from 'react';
import { getDocuments, uploadDocument } from './services/documentApi';
import DocumentList from './components/DocumentList';
import UploadComponent from './components/UploadComponent';
import './App.css';

export default function App() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  async function loadDocuments() {
    try {
      const result = await getDocuments();
      setDocuments(result);
      setError('');
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDocuments();
  }, []);

  async function handleUpload(file, description) {
    setUploading(true);
    setError('');
    try {
      await uploadDocument(file, description);
      await loadDocuments();
      return true;
    } catch (requestError) {
      setError(requestError.message);
      return false;
    } finally {
      setUploading(false);
    }
  }

  return (
    <main className="app">
      <header className="page-header">
        <h1>Documentos</h1>
        <p>Envie documentos e consulte o resumo de cada arquivo.</p>
      </header>

      <UploadComponent onUpload={handleUpload} uploading={uploading} />
      {error && <p className="error-message" role="alert">{error}</p>}

      <section className="documents-section" aria-labelledby="documents-heading">
        <h2 id="documents-heading">Documentos enviados</h2>
        {loading
          ? <p>Carregando documentos...</p>
          : <DocumentList documents={documents} />}
      </section>
    </main>
  );
}
