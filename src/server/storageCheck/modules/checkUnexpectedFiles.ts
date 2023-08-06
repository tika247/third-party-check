import fs from "fs";
import path from "path";
import { expectedExtension } from "@/constants";

/**
 * return unexpected files
 * @param {string} folder
 * @returns {Promise<Array<string>>}
 */
export const returnUnexpectedFiles = async (folder: string): Promise<Array<string>> => {
  const unexpectedFiles: Array<string> = [];

  const returnUnexpectedFile = (fullPath: string) => {
    const extension = fullPath.split(".").pop();
    const isExtensionExpected = expectedExtension.some((item) => item === extension);

    return isExtensionExpected ? false : fullPath;
  };

  const loopFolders = async (folder: string) => {
    const filenames = await fs.readdirSync(folder);
    filenames.forEach((filename) => {
      const fullPath = path.join(folder, filename);
      const stats = fs.statSync(fullPath);
      if (stats.isFile()) {
        const unexpectedFile = returnUnexpectedFile(fullPath);
        if (unexpectedFile) unexpectedFiles.push(unexpectedFile);
      } else if (stats.isDirectory()) {
        loopFolders(fullPath);
      }
    });
  };
  await loopFolders(folder);

  return Promise.resolve(unexpectedFiles);
};
