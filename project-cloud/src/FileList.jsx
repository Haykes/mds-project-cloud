import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

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
    <div className="file-list-container">
      <h2>Liste des fichiers</h2>
      {fileList.length > 0 ? (
        <ul className="file-list">
          {fileList.map((file) => (
            <li key={file.Key} className="file-item">
              <p>Nom du fichier : {file.Key}</p>
              <p>Taille : {file.Size} octets</p>
              <p>Dernière modification : {file.LastModified}</p>
              <p>ETag : {file.ETag}</p>
              <p>Classe de stockage : {file.StorageClass}</p>
              <hr className="file-divider" />
              <div className="button-container">
                <button className="file-button">Bouton 1</button>
                <button className="file-button">Bouton 2</button>
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
