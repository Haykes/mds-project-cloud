import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function FileList() {
  const [fileList, setFileList] = useState([]);
  const [bucketList, setBucketList] = useState([]);
  const [selectedBucket, setSelectedBucket] = useState("");

  useEffect(() => {
    fetchBucketList();
  }, []);

  useEffect(() => {
    if (selectedBucket) {
      fetchFileList(selectedBucket);
    }
  }, [selectedBucket]);

  const fetchBucketList = async () => {
    try {
      const response = await axios.get("http://localhost:5000/buckets");
      setBucketList(response.data);
    } catch (error) {
      console.log(error);
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

  const handleBucketChange = (e) => {
    setSelectedBucket(e.target.value);
  };

  const handleOK = () => {
    fetchFileList(selectedBucket);
  };

  const handleDownload = async (fileName) => {
    try {
      const response = await axios.get(`http://localhost:5000/download/${fileName}`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (fileName) => {
    try {
      await axios.delete(`http://localhost:5000/delete/${fileName}`);
      fetchFileList(selectedBucket);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="file-list-container">
      <h2>Liste des fichiers</h2>
      <div>
        <label>Sélectionner un bucket :</label>
        <select value={selectedBucket} onChange={handleBucketChange}>
          <option value="">Sélectionner un Bucket</option>
          {bucketList.map((bucket) => (
            <option value={bucket} key={bucket}>
              {bucket}
            </option>
          ))}
        </select>
        <button className="file-button"  onClick={handleOK} disabled={!selectedBucket}>
          OK
        </button>
      </div>
      {fileList.length > 0 ? (
        <ul className="file-list">
          {fileList.map((file) => (
            <li key={file.Key} className="file-item">
              <p>Nom du fichier : {file.Key}</p>
              <p>Taille : {file.Size} octets</p>
              <p>Dernière modification : {file.LastModified}</p>
              <p>ETag : {file.ETag}</p>
              <p>Classe de stockage : {file.StorageClass}</p>
              <p>Propriétaire : {file.Owner}</p>
              <hr className="file-divider" />
              <div className="button-container">
                <button className="file-button" onClick={() => handleDownload(file.Key)}>
                  Télécharger
                </button>
                <button className="file-button" onClick={() => handleDelete(file.Key)}>
                  Supprimer
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>Aucun fichier trouvé</p>
      )}
    </div>
  );
}

export default FileList;
