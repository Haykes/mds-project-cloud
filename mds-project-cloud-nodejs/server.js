// Importer les packages nécessaires
require('dotenv').config()
const express = require('express');
const AWS = require('aws-sdk');
const multer = require('multer');
const fs = require('fs');
const upload = multer({ dest: 'uploads/' });
const cors = require('cors');

// Initialiser l'application Express
const app = express();
const port = 5000;

app.use(cors());

// Configure AWS avec votre accessKey, secretAccessKey et région
const { ACCESS_KEY, SECRET_ACCESS_KEY, REGION, AWS_BUCKET_NAME } = process.env;

AWS.config.update({
  accessKeyId: ACCESS_KEY,
  secretAccessKey: SECRET_ACCESS_KEY,
  region: REGION
});

const s3 = new AWS.S3();

// Route par défaut
app.get('/', (req, res) => {
  res.send('Hello, ça marche bien');
});

// Route pour lister les éléments du bucket
app.get('/list', async (req, res) => {
  const bucketName = req.query.bucket;

  if (!bucketName) {
    return res.status(400).send('Veuillez fournir un nom de bucket valide.');
  }

  const params = {
    Bucket: bucketName,
  };

  s3.listObjectsV2(params, (err, data) => {
    if (err) {
      console.log(err, err.stack);
      res.status(500).send("Une erreur s'est produite lors de la récupération de la liste des objets du bucket");
    } else {
      const objects = data.Contents.map((obj) => {
        return {
          Key: obj.Key,
          Size: obj.Size,
          LastModified: obj.LastModified,
          ETag: obj.ETag,
          StorageClass: obj.StorageClass,
          Owner: obj.Owner,
        };
      });
      res.send(objects);
    }
  });
});

// Route pour uploader un fichier au bucket
app.post('/upload/:bucketName', upload.single('file'), (req, res) => {
  const bucketName = req.params.bucketName;
  const fileContent = fs.readFileSync(req.file.path);

  const params = {
    Bucket: bucketName, // Utiliser le nom du bucket sélectionné
    Key: req.file.originalname,
    Body: fileContent
  };

  s3.upload(params, function(err, data) {
    if (err) {
      console.log(err);
      res.status(500).send(err);
    } else {
      res.send({ message: "File uploaded successfully. " + data.Location });
    }
  });
});



// Route pour télécharger un fichier du bucket
app.get('/download/:fileName', (req, res) => {
  const fileName = req.params.fileName;
  const params = {
    Bucket: AWS_BUCKET_NAME,
    Key: fileName,
  };

  s3.getObject(params, (err, data) => {
    if (err) {
      console.log(err);
      res.status(500).send(err);
    } else {
      res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
      res.send(data.Body);
    }
  });
});

// Route pour supprimer un fichier du bucket
app.delete('/delete/:fileName', (req, res) => {
  const fileName = req.params.fileName;
  const params = {
    Bucket: AWS_BUCKET_NAME,
    Key: fileName,
  };

  s3.deleteObject(params, (err, data) => {
    if (err) {
      console.log(err);
      res.status(500).send(err);
    } else {
      res.sendStatus(200);
    }
  });
});

// Route pour récupérer la liste des Buckets accessibles
app.get('/buckets', (req, res) => {
  const s3 = new AWS.S3();

  s3.listBuckets((err, data) => {
    if (err) {
      console.log(err, err.stack);
      res.status(500).send("Une erreur s'est produite lors de la récupération de la liste des Buckets");
    } else {
      const buckets = data.Buckets.map((bucket) => bucket.Name);
      res.send(buckets);
    }
  });
});


// Démarrer le serveur
app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
