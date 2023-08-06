import fs from "fs";
import path from "path";
import Jimp from "jimp";
import { consoleLog } from "@/server/common/helper";

type SolidImages = Array<string>;
type FuncType = (folder: string) => Promise<SolidImages>;

/**
 * return solid color images
 * @param {string} folder
 */
export const returnSolidColorImages: FuncType = async (folder: string) => {
  const solidColorImages: SolidImages = [];

  // clarify solid-color-images
  const loopFolders = async (folder: string) => {
    const filenames = fs.readdirSync(folder);

    for await (const filename of filenames) {
      const fullPath = path.join(folder, filename);
      const stats = fs.statSync(fullPath);
      if (stats.isFile()) {
        try {
          const image = await Jimp.read(fullPath);
          const colorArr = [];

          const width = image.bitmap.width;
          const height = image.bitmap.height;

          for (let posX = 0; posX < width; posX++) {
            for (let posY = 0; posY < height; posY++) {
              colorArr.push(image.getPixelColor(posX, posY));
            }
          }

          const filteredColorArr = Array.from(new Set(colorArr));
          if (filteredColorArr.length === 1) solidColorImages.push(fullPath);
        } catch (err) {
          if (err instanceof Error && !String(err).includes("Could not find MIME for Buffer")) {
            consoleLog(err);
          }
        }
      } else if (stats.isDirectory()) {
        await loopFolders(fullPath);
      }
    }
  };
  await loopFolders(folder);

  return Promise.resolve(solidColorImages);
};
