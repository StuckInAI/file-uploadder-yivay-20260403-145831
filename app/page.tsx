import FileUploader from '@/components/FileUploader';

export default function Home() {
  return (
    <main className="container">
      <div className="header">
        <h1>📁 File Uploader</h1>
        <p>Upload, preview and download your files with ease</p>
      </div>
      <FileUploader />
    </main>
  );
}
