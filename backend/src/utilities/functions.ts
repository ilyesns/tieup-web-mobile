import Media from "../models/utilities/file";
import {
  uploadFilesToFirebaseStorage,
  uploadToFirebaseStorage,
} from "./firestorage_methods";

// Function to handle uploading multiple images
async function uploadImages(
  files: Express.Multer.File[],
  userId: string,
  path: string
): Promise<Media[]> {
  if (!files || files.length === 0) return [];
  const uploads = await uploadFilesToFirebaseStorage(files, userId, path);
  return uploads.map(
    (file) =>
      new Media({
        name: file.fileName,
        size: file.size,
        type: file.type,
        url: file.publicUrl,
      })
  );
}
async function uploadVideos(
  files: Express.Multer.File[],
  userId: string,
  path: string
): Promise<Media[]> {
  if (!files || files.length === 0) return [];
  const uploads = await uploadFilesToFirebaseStorage(files, userId, path);
  return uploads.map(
    (file) =>
      new Media({
        name: file.fileName,
        size: file.size,
        type: file.type,
        url: file.publicUrl,
      })
  );
}
async function uploadFiles(
  files: Express.Multer.File[],
  userId: string,
  path: string
): Promise<Media[]> {
  if (!files || files.length === 0) return [];
  const uploads = await uploadFilesToFirebaseStorage(files, userId, path);
  return uploads.map(
    (file) =>
      new Media({
        name: file.fileName,
        size: file.size,
        type: file.type,
        url: file.publicUrl,
      })
  );
}

//
async function uploadFile(
  file: Express.Multer.File,
  userId: string,
  path: string
): Promise<Media | null> {
  if (!file) return null;
  const upload = await uploadToFirebaseStorage(file, userId, path);
  return new Media({
    name: upload.fileName,
    size: upload.size,
    type: upload.type,
    url: upload.publicUrl,
  });
}

// Function to handle uploading a single video
async function uploadVideo(
  file: Express.Multer.File,
  userId: string,
  path: string
): Promise<Media | null> {
  if (!file) return null;
  const upload = await uploadToFirebaseStorage(file, userId, path);
  return new Media({
    name: upload.fileName,
    size: upload.size,
    type: upload.type,
    url: upload.publicUrl,
  });
}
function generateString(): string {
  const prefix = "#TO";
  const desiredLength = 18;
  let result = prefix;
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < desiredLength - prefix.length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function generateUserName(firstName: string, lastName: string) {
  // Ensure lastName is not empty
  if (!lastName) {
    lastName = "";
  }

  // Extract the first character of the first name
  const firstChar = firstName.charAt(0);

  // Extract characters from the last name (at most 9 characters to ensure 10-character length including '@')
  const lastNameChars = lastName.slice(0, 9 - firstChar.length);

  // Concatenate "@" with the first character of the first name and characters from the last name
  const userName = `@${firstChar}${lastNameChars}`;

  return userName;
}

export {
  uploadImages,
  uploadVideo,
  uploadFiles,
  uploadFile,
  uploadVideos,
  generateString,
  generateUserName,
};
