import { ipcMessage, storageCheckerErrorText } from "@/constants";
import { returnDuplicatedFiles } from "@/server/storageCheck/modules/checkDuplication";
import { returnUnexpectedFiles } from "@/server/storageCheck/modules/checkUnexpectedFiles";
import { returnNgStrIncludedFiles } from "@/server/storageCheck/modules/ngStrIncludedFiles";
import { returnSolidColorImages } from "@/server/storageCheck/modules/solidColorImages";
import { adjustedErrorMessage } from "@/server/storageCheck/helper/helper";
const errorText = storageCheckerErrorText;

export const storageChecker = async (storage: string, language: string): Promise<string> => {
  let errorMessage: string | null = null;

  // check a duplication
  const duplicatedFiles = await returnDuplicatedFiles(storage);
  const duplicatedFilesLength = duplicatedFiles.length;
  let duplicatedFilesStr = duplicatedFiles.toString();
  if (duplicatedFilesLength > 0) {
    if (duplicatedFilesLength >= 2) {
      duplicatedFilesStr = duplicatedFilesStr.replaceAll(",", "\n");
    }
    errorMessage = `${errorText[language].a}\n\n${duplicatedFilesStr}`;
  }

  // check unexpected files
  const unexpectedFiles = await returnUnexpectedFiles(storage);
  const unexpectedFilesLength = unexpectedFiles.length;
  if (unexpectedFilesLength > 0) {
    let unexpectedFilesStr = unexpectedFiles.toString();
    // if more than 2
    if (unexpectedFilesLength >= 2) {
      unexpectedFilesStr = unexpectedFilesStr.replaceAll(",", "\n");
    }
    const unexpectedFilesMessage = `${errorText[language].b}\n\n${unexpectedFilesStr}`;
    errorMessage = adjustedErrorMessage(errorMessage, unexpectedFilesMessage);
  }

  // check ngStrIncluded files
  const ngStrIncludedFiles = await returnNgStrIncludedFiles(storage);
  const ngStrIncludedFilesLength = ngStrIncludedFiles.length;
  if (ngStrIncludedFilesLength > 0) {
    let ngStrIncludedFilesStr = ngStrIncludedFiles.toString();
    ngStrIncludedFilesStr = ngStrIncludedFilesStr.replaceAll(",", "\n");
    const ngStrIncludedFilesMessage = `${errorText[language].c}\n\n${ngStrIncludedFilesStr}`;
    errorMessage = adjustedErrorMessage(errorMessage, ngStrIncludedFilesMessage);
  }

  // check solid-color-images
  const solidColorImages = await returnSolidColorImages(storage);
  const solidColorImagesLength = solidColorImages.length;
  if (solidColorImagesLength > 0) {
    let solidColorImagesStr = solidColorImages.toString();
    solidColorImagesStr = solidColorImagesStr.replaceAll(",", "\n");
    const solidColorImagesMessage = `${errorText[language].d}\n\n${solidColorImagesStr}`;
    errorMessage = adjustedErrorMessage(errorMessage, solidColorImagesMessage);
  }

  return errorMessage ? errorMessage : ipcMessage[language].checkStorage;
};
