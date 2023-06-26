
import React from 'react';
import UploadForm from './UploadForm';
import FileList from './FileList';
import './App.css'

function App() {
  
  return (
    <div>
      <h1>My S3 Upload Application</h1>
      <UploadForm />
      <FileList />
    </div>
  );
}

export default App
