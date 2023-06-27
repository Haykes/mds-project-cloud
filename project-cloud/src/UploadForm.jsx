import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function UploadForm() {
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [fileName, setFileName] = useState("Choisir un fichier");
  const [bucketList, setBucketList] = useState([]);
  const [selectedBucket, setSelectedBucket] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setFileName(e.target.files[0] ? e.target.files[0].name : "Choisir un fichier");
  };

  const handleBucketChange = (e) => {
    setSelectedBucket(e.target.value);
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!selectedBucket) {
      setUploadStatus("Veuillez sélectionner un Bucket");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(`http://localhost:5000/upload/${selectedBucket}`, formData);
      setUploadStatus(response.data.message);
      fetchFileList(selectedBucket);
    } catch (error) {
      setUploadStatus(`Error: ${error.message}`);
    }
  };

  const fetchFileList = async (bucketName) => {
    try {
      const response = await axios.get(`http://localhost:5000/list?bucket=${bucketName}`);
      setFileList(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchBucketList = async () => {
    try {
      const response = await axios.get("http://localhost:5000/buckets");
      setBucketList(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchBucketList();
  }, []);

  useEffect(() => {
    if (selectedBucket) {
      fetchFileList(selectedBucket);
    }
  }, [selectedBucket]);

  return (
    <div className="upload-form">
      <form onSubmit={handleUpload}>
        <div className="form-control">
          <input type="file" id="file-upload" onChange={handleFileChange} />
          <label htmlFor="file-upload">{fileName}</label>
        </div>
        <div className="form-control">
          <select value={selectedBucket} onChange={handleBucketChange}>
            <option value="">Sélectionner un Bucket</option>
            {bucketList.map((bucket) => (
              <option value={bucket} key={bucket}>
                {bucket}
              </option>
            ))}
          </select>
        </div>
        <button type="submit">Upload</button>
      </form>
      {uploadStatus && <p>{uploadStatus}</p>}
    </div>
  );
}

export default UploadForm;
