export default function DownloadButton({ document }) {
  return (
    <a className="download-button" href={`/api/documents/${document.id}/download`}>
      Baixar documento
    </a>
  );
}
