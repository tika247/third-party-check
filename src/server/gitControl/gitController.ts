"use strict";
import { simpleGit, SimpleGit, SimpleGitOptions } from "simple-git";
import { GitControllerAType, GitControllerBType, TargetProjectInfoType } from "@/server/common/types";
import fs from "fs";
import fsExtra from "fs-extra";
import path from "path";
import { wmController } from "@/server/wmControl/wmController";
import { ipcMessage, gitControllerErrorText } from "@/constants";
import { gitDiff, gitClean, gitBranchLocal, gitFetch, gitCheckout, gitPull, gitArchive, gitDeleteLocalBranch } from "@/server/gitControl/gitCommand";
import { gitErrorCheck } from "@/server/errorCheck/gitErrorCheck";
import { switchSpecialCharactores } from "@/server/gitControl/helper/helper";

let originalBranch: string | null = null;
let ifFetchThisTime = false;
let targetProjectInfo: TargetProjectInfoType | null = null;
let simpleGitOptions: Partial<SimpleGitOptions> | null = null;
let git: SimpleGit | null = null;
const isProduction = process.env.NODE_ENV === "production";
const batchPath = isProduction ? `${path.resolve(__static, "..")}/bat` : `${process.cwd()}/src/bat`;
const archivePath = `${batchPath}/@archive`;
const errorText = gitControllerErrorText;

export const gitControllerA: GitControllerAType = async (remote, local, branch, commit, storage, winmergePath, language) => {
  let errorMessage: string | null = null;

  await (async () => {
    targetProjectInfo = {
      remote: remote,
      local: local,
      branch: branch,
      commit: commit,
      storage: storage,
    };
    /**
     * @description git command
     * @return {Promise<void>}
     */
    const gitCommandProcess = async () => {
      if (!targetProjectInfo) return;
      simpleGitOptions = {
        baseDir: targetProjectInfo.local,
        binary: "git",
        maxConcurrentProcesses: 3,
        trimmed: false,
      };
      git = simpleGit(simpleGitOptions);
      const errorchecker = () => {
        if (!targetProjectInfo) return;
        gitErrorCheck(errorMessage, git, originalBranch, ifFetchThisTime, targetProjectInfo.branch, language);
      };
      // if no string
      if (!(targetProjectInfo.branch.length > 0)) errorMessage = errorText[language].d;
      // if no access to storage
      if (!fs.existsSync(targetProjectInfo.storage)) errorMessage = errorText[language].b;
      // if special charactors in branch name
      targetProjectInfo.branch = await switchSpecialCharactores(targetProjectInfo.branch);
      // if neither 'feature' nor 'release'
      const branchCheck = targetProjectInfo.branch.includes("release") || targetProjectInfo.branch.includes("feature");
      if (!branchCheck) errorMessage = errorText[language].c;
      // clean
      await gitClean(git);
      // git diff - check if uncommitted exsists
      if (!errorMessage) errorMessage = await gitDiff(git, language);
      // get all local branch
      const locals = await gitBranchLocal(git);
      originalBranch = locals.current;
      // fetch
      errorMessage ? errorchecker() : (ifFetchThisTime = (await gitFetch(git, locals, targetProjectInfo)) as boolean);
      // checkout
      errorMessage ? errorchecker() : (errorMessage = await gitCheckout(git, targetProjectInfo.branch, language));
      // pull *just in case
      errorMessage ? errorchecker() : (errorMessage = await gitPull(git, language));
      // git archive
      errorMessage ? errorchecker() : (errorMessage = await gitArchive(batchPath, git, targetProjectInfo, language));

      /**
       * @description winmerge
       */
      errorMessage ? errorchecker() : await wmController(archivePath, targetProjectInfo, winmergePath);
    };
    /**
     * @description check if `targetProjectInfo.local` exsists
     */
    if (fs.existsSync(targetProjectInfo.local)) {
      await gitCommandProcess();
    } else {
      errorMessage = errorText[language].a;
    }
  })();

  return errorMessage ? errorMessage : ipcMessage[language].gitControllerA;
};

export const gitControllerB: GitControllerBType = async (remote, local, branch, language) => {
  const errorMessage: string | null = null;

  await (async () => {
    const targetProjectInfo: Pick<TargetProjectInfoType, "remote" | "local" | "branch"> = {
      remote: remote,
      local: local,
      branch: branch,
    };
    /**
     * @description git command
     * @return {Promise<void>}
     */
    const gitCommandProcess = async () => {
      if (!git) return;
      // clean
      await gitClean(git);

      // remove @archive
      fsExtra.remove(archivePath, (err) => {
        if (err) {
          throw new Error(`${err}`);
        }
      });

      // checkout to original branch
      if (originalBranch) await gitCheckout(git, originalBranch, language);
      // delete branch if it is fetched this time
      if (ifFetchThisTime) await gitDeleteLocalBranch(git, targetProjectInfo.branch);
    };
    await gitCommandProcess();
  })();

  return errorMessage ? errorMessage : ipcMessage[language].gitControllerB;
};
