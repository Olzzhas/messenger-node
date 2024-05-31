const express = require('express').Router;
const multer = require('multer');
const { Storage } = require('@google-cloud/storage');
const authMiddleware = require('../middlewares/auth-middleware');

const router = new express();

// router.use(authMiddleware);

const upload = multer({
   storage: multer.memoryStorage(),
   limits: {
      fileSize: 12 * 1024 * 1024,
   },
});

const storage = new Storage({
   keyFilename:
      '/home/olzzhas/Desktop/Projects/Express/jwt-authorization-express/serviceAccount.json',
});

const bucketName = 'node-messanger-files';
const bucket = storage.bucket(bucketName);

router.post('/upload', upload.single('file'), async (req, res) => {
   if (!req.file) {
      return res.status(400).send('No file uploaded.');
   }

   try {
      const blob = bucket.file(req.file.originalname);
      const blobStream = blob.createWriteStream({
         resumable: false,
      });

      blobStream.on('error', (err) => {
         console.error(err);
         res.status(500).send('Something went wrong');
      });

      blobStream.on('finish', () => {
         const publicUrl = `https://storage.googleapis.com/${bucketName}/${blob.name}`;
         res.status(200).send({
            fileName: req.file.originalname,
            fileUrl: publicUrl,
         });
      });

      blobStream.end(req.file.buffer);
   } catch (error) {
      console.error(error);
      res.status(500).send('Something went wrong');
   }
});

module.exports = router;
