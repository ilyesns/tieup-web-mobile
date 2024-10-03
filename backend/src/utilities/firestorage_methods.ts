// uploadToFirebaseStorage.ts

import admin from "../config/firebase.config";

interface UploadResult {
  fileName: string;
  size: number;
  publicUrl: string;
  type: string;
}

async function uploadToFirebaseStorage(
  file: Express.Multer.File,
  userId: string,
  path: string
): Promise<UploadResult> {
  if (!file) throw new Error("No file provided.");

  const bucket = admin.storage().bucket();
  // Consider adding a more unique identifier for the fileName to avoid collisions.
  const filePath = `${path}/${userId}/uploads/${Date.now()}_${
    file.originalname
  }`;
  const blob = bucket.file(filePath);
  const blobStream = blob.createWriteStream({
    metadata: {
      contentType: file.mimetype,
    },
  });

  return new Promise((resolve, reject) => {
    blobStream.on("error", (error) => reject(error));

    blobStream.on("finish", async () => {
      // Make the file publicly readable (optional, remove if using signed URLs)
      // await blob.makePublic();

      // Get the signed URL for the uploaded file
      try {
        const signedUrls = await blob.getSignedUrl({
          action: "read",
          expires: "03-09-2491", // You can adjust the expiry date as needed
        });

        const publicUrl = signedUrls[0]; // The signed URL

        resolve({
          fileName: file.originalname,
          size: file.size,
          publicUrl: publicUrl, // This URL includes the token
          type: file.mimetype,
        });
      } catch (error) {
        reject(error);
      }
    });

    blobStream.end(file.buffer);
  });
}

async function uploadFilesToFirebaseStorage(
  files: Express.Multer.File[],
  userId: string,
  path: string
): Promise<UploadResult[]> {
  const uploadPromises = files.map((file) =>
    uploadToFirebaseStorage(file, userId, path)
  );
  return Promise.all(uploadPromises);
}

async function deleteFileFromFirebaseStorage(url: string): Promise<void> {
  try {
    const filePath = extractFilePath(url); // Use the updated method to extract the file path
    const bucket = admin.storage().bucket();
    await bucket.file(filePath).delete();
    console.log(`File ${filePath} deleted successfully.`);
  } catch (error) {
    console.error("Error deleting file from Firebase Storage:", error);
  }
}
function extractFilePath(url: string): string {
  const urlPattern = /^https:\/\/storage\.googleapis\.com\/[^\/]+\/(.+?)(\?|$)/;
  const match = url.match(urlPattern);
  if (!match) throw new Error("Failed to extract file path from URL");
  return decodeURIComponent(match[1]);
}

/**
 * const upload = multer({ storage: multer.memoryStorage() });

app.post('/upload', upload.single('file'), async (req, res) => {
  console.log(req.file)
  try {
    const file = req.file;
    if (!file) {
      res.status(400).send('No file uploaded.');
      return;
    }

    const { fileName, size, publicUrl, type } = await uploadToFirebaseStorage(file);
    res.status(200).send({ fileName, size, publicUrl, type });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error uploading file.');
  }
  
});
 * 
 */
export {
  uploadToFirebaseStorage,
  uploadFilesToFirebaseStorage,
  deleteFileFromFirebaseStorage,
};
