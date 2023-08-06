import fs from "fs";
import path from "path";

/**
 * return all fils in a folder
 * @param {strgin} folder
 * @returns {Promise<Array<string>>}
 */
export const returnDuplicatedFiles = async (folder: string): Promise<Array<string>> => {
  const filesArr: Array<string> = [];

  const removeExtensionStr = (fullPath: string) => {
    let fixedPath = fullPath.substring(fullPath.lastIndexOf("/") + 1);
    if (fixedPath.lastIndexOf(".") != -1) fixedPath = fixedPath.substring(0, fixedPath.lastIndexOf("."));
    return fixedPath;
  };

  const loopFolders = async (folder: string) => {
    const filenames = fs.readdirSync(folder);
    filenames.forEach((filename) => {
      const fullPath = path.join(folder, filename);
      const stats = fs.statSync(fullPath);
      if (stats.isFile()) {
        const fixedPath = removeExtensionStr(fullPath);
        filesArr.push(fixedPath);
      } else if (stats.isDirectory()) {
        loopFolders(fullPath);
      }
    });
  };
  await loopFolders(folder);

  // check a duplicaton
  const duplicatedFiles = filesArr.filter((path, index, arr) => {
    return arr.indexOf(path) === index && index !== arr.lastIndexOf(path);
  });

  return Promise.resolve(duplicatedFiles);
};
