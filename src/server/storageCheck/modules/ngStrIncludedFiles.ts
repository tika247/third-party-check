import fs from "fs";
import path from "path";
import { consoleLog } from "@/server/common/helper";
import { ngWord } from "@/constants";

type FileAndNg = Array<Array<string | Array<string>>>;
type FuncType = (folder: string) => Promise<FileAndNg>;
/**
 * return files and the dummy string
 * @param {string} folder
 * @returns {FileAndNg}
 */
export const returnNgStrIncludedFiles: FuncType = async (folder: string) => {
  const ngStrIncludedFiles: FileAndNg = [];

  // clarify fullPath and ngStrIncluded
  const loopFolders = async (folder: string) => {
    const filenames = await fs.readdirSync(folder);
    filenames.forEach((filename) => {
      const fullPath = path.join(folder, filename);
      const stats = fs.statSync(fullPath);
      if (stats.isFile()) {
        try {
          const fileContent = fs.readFileSync(fullPath).toString();
          const ngStrIncluded = ngWord.filter((str) => fileContent.includes(str));
          if (ngStrIncluded.length > 0) ngStrIncludedFiles.push([fullPath, ngStrIncluded]);
        } catch (err) {
          if (!(err instanceof Error)) return;
          consoleLog(err);
        }
      } else if (stats.isDirectory()) {
        loopFolders(fullPath);
      }
    });
  };
  await loopFolders(folder);

  return Promise.resolve(ngStrIncludedFiles);
};
