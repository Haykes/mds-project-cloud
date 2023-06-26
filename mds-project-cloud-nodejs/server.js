// Importer les packages nécessaires
require('dotenv').config()
const express = require('express');
const AWS = require('aws-sdk');
const multer  = require('multer');
const fs = require('fs');
const upload = multer({ dest: 'uploads/' });

// Initialiser l'application Express
const app = express();
const port = 5000;

// Configure AWS avec votre accessKey, secretAccessKey et région
const { ACCESS_KEY, SECRET_ACCESS_KEY, REGION } = process.env;

AWS.config.update({
  accessKeyId: ACCESS_KEY,
  secretAccessKey: SECRET_ACCESS_KEY,
  region: REGION
});

const s3 = new AWS.S3();

// Route par défaut
app.get('/', (req, res) => {
  res.send('Hello ca marche bien')
})

// Route pour lister les éléments du bucket
app.get('/list', async (req, res) => {
  const params = {
    Bucket: 'ezytech-mds',
  };

  s3.listObjectsV2(params, (err, data) => {
    if (err) {
      console.log(err, err.stack);
    } else {
      res.send(data);
    }
  });
});

// Route pour uploader un fichier au bucket
app.post('/upload', upload.single('file'), (req, res) => {
  const fileContent = fs.readFileSync(req.file.path);

  const params = {
    Bucket: 'ezytech-mds',
    Key: req.file.originalname, // Utiliser le nom d'origine du fichier
    Body: fileContent
  };

  s3.upload(params, function(err, data) {
    if (err) {
      throw err;
    }
    res.send({message: "File uploaded successfully. " + data.Location});
  });
});


// Route pour télécharger un fichier du bucket
app.get('/download/:filename', (req, res) => {
  const params = {
    Bucket: 'ezytech-mds',
    Key: req.params.filename
  }

  res.attachment(req.params.filename);
  const fileStream = s3.getObject(params).createReadStream();
  fileStream.pipe(res);
});

// Route pour supprimer un fichier du bucket
app.delete('/delete/:filename', (req, res) => {
  const params = {
    Bucket: 'ezytech-mds',
    Key: req.params.filename
  }

  s3.deleteObject(params, function(err, data) {
    if (err) console.log(err, err.stack);  
    else     console.log("Bien suppr je suis content");
  });
});

// Démarrer le serveur
app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})
