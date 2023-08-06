"use strict";
import { WmControllerType } from "@/server/common/types";
import { exec } from "child_process";

export const wmController: WmControllerType = async (archivePath, targetProjectInfo, winmergePath) => {
  /**
   * @description check winmerge command options by executing `"C:/Program Files/WinMerge/WinMergeU.exe" -?` in cmd
   * @description ref-site: https://qiita.com/mima_ita/items/ac21c0588080e73fc458
   * @param -r - include sub folders as a target for comparison
   * @param -noprefs - exclude any registry files
   * @param -noninteractive - quit winmerge after outputting report
   * @param -s - open winmerge with just 1 window
   * @param -cfg - Settings/DirViewExpandSubdirs=1
   * @param -cfg - ReportFiles/ReportType=2
   * @param -cfg - ReportFiles/IncludeFileCmpReport=1
   * @param -or - output report into a specified directory
   */
  //  const winmergeOutput = '"C:/Users/nishina-takahiro/OneDrive - Mitsue-Links Co., Ltd/デスクトップ"';
  const winmergeOptions = `-r -noprefs -s  -cfg Settings/DirViewExpandSubdirs=1 -cfg ReportFiles/ReportType=2 -cfg ReportFiles/IncludeFileCmpReport=1`;
  const winmergeCommand = `"${winmergePath}" ${targetProjectInfo.storage} ${archivePath} ${winmergeOptions}`;

  exec(winmergeCommand, { encoding: "utf-8" }, (err) => {
    if (err) {
      throw new Error("WinMerge could not open for some reason!");
    }
  });

  return "wmController succeeded!";
};
