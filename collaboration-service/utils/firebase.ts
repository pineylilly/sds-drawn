import { initializeApp } from 'firebase/app';
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
  //...
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN, 
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

const MIME_CONVERTER = new Map<string, string>(Object.entries({
    "image/svg+xml" : "svg",
    "image/png" : "png",
    "image/jpeg" : "jpg",
    "image/gif" : "gif",
    "image/webp" : "webp",
    "image/bmp" : "bmp",
    "image/x-icon" : "ico",
    "image/avif" : "avif",
    "image/jfif" : "jfif",
}));

export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);

export const uploadImage = async (fileBytes: string,fileID : string,workspaceId: number,mimeType : string,path : string) => {
    if (!fileBytes) {
        throw new Error("File Bytes is required");
    }
    // get file size in MB
    const extension = MIME_CONVERTER.get(mimeType) || "png";
    const storageRef = ref(storage, `${path}/${(new Date()).getTime()}-${fileID}-${workspaceId}.${extension}`);
    const fileURL = await uploadBytes(storageRef, Buffer.from(fileBytes.split(",")[1],"base64")).then(async (snapshot) => {
        return await getDownloadURL(snapshot.ref);
    });
    console.log(fileURL);
    return fileURL;
}