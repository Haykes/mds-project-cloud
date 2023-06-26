import React, { useState, useEffect } from "react";
import axios from "axios";
import './App.css';

function FileList() {
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    fetchFileList();
  }, []);

  const fetchFileList = async () => {
    try {
      const response = await axios.get("http://localhost:5000/list");
      setFileList(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="file-list">
      <h2>Liste des fichiers</h2>
      {fileList.length > 0 ? (
        <ul>
          {fileList.map((file) => (
            <li key={file.Key}>
              <p>Nom du fichier : {file.Key}</p>
              <p>Taille : {file.Size} octets</p>
              <p>Dernière modification : {file.LastModified}</p>
              <p>ETag : {file.ETag}</p>
              <p>Classe de stockage : {file.StorageClass}</p>
              <p>Propriétaire : {file.Owner}</p>
              <hr />
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
