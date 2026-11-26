import DownloadButton from './DownloadButton';

function formatFileSize(size) {
  if (size < 1024) {
    return `${size} B`;
  }
  return `${(size / 1024).toFixed(1)} KB`;
}

export default function DocumentList({ documents }) {
  if (documents.length === 0) {
    return <p>Nenhum documento enviado ainda.</p>;
  }

  return (
    <div className="document-grid">
      {documents.map((document) => (
        <article className="document-card" key={document.id}>
          <h3>{document.name}</h3>
          <p className="document-description">{document.description}</p>
          <p className="document-details">
            Enviado em {new Date(document.uploadedAt).toLocaleString('pt-BR')}
            {' · '}{formatFileSize(document.size)}
          </p>
          <DownloadButton document={document} />
        </article>
      ))}
    </div>
  );
}
