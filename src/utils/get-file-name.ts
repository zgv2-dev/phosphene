import { customAlphabet } from "nanoid";

const fileNameSanitizer = /[^a-zA-Z0-9-_]/g;
const extensionRemover = /\.[^/.]+$/;

export const getFileName = (fileName: string, unique: boolean | undefined) => {
  const ext = fileName.split(".").pop();
  const sanitizedFileName = fileName.replace(extensionRemover, "").replace(fileNameSanitizer, "_");
  const uniquePrefix = customAlphabet("abcdefghijklmnopqrstuvwxyz", 8)();

  return `${sanitizedFileName}${unique ? `-${uniquePrefix}` : ""}.${ext}`;
};
