import React, { useState } from "react";
import axios from "axios";
import './App.css';

function UploadForm() {
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [fileName, setFileName] = useState("Choisir un fichier");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setFileName(e.target.files[0] ? e.target.files[0].name : "Choisir un fichier");
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("http://localhost:5000/upload", formData);
      setUploadStatus(response.data.message); // modification ici, on extrait la propriété 'message' de la réponse
    } catch (error) {
      setUploadStatus(`Error: ${error.message}`);
    }
  };

  return (
    <div className="upload-form">
      <form onSubmit={handleUpload}>
        <div className="form-control">
          <input type="file" id="file-upload" onChange={handleFileChange} />
          <label htmlFor="file-upload">{fileName}</label>
        </div>
        <button type="submit">Upload</button>
      </form>
      {uploadStatus && <p>{uploadStatus}</p>}
    </div>
  );
}

export default UploadForm;
