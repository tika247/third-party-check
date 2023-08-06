import path from "path";
import { spawn } from "child_process";
import { SimpleGit, CleanOptions, BranchSummary } from "simple-git";
import { TargetProjectInfoType, MakeArchiveType } from "@/server/common/types";
import { gitCommandErrorText } from "@/constants";
const errorText = gitCommandErrorText;

export const gitClean = async (git: SimpleGit) => {
  await git.clean(CleanOptions.FORCE);
};

export const gitBranchLocal = async (git: SimpleGit) => {
  return await git.branchLocal();
};

export const gitFetch = async (git: SimpleGit, locals: BranchSummary, targetProjectInfo: TargetProjectInfoType) => {
  let ifFetchThisTime = false;

  await git.fetch();
  // check if targetProjectInfo.branch exsits in local
  if (!locals.all.includes(targetProjectInfo.branch)) {
    ifFetchThisTime = true;
  }

  return ifFetchThisTime;
};

export const gitDiff = async (git: SimpleGit, language: string) => {
  return (await git.diff(["HEAD"])) ? errorText[language].b : null;
};

export const gitCheckout = async (git: SimpleGit, branch: string, language: string) => {
  let errorMessage = null;
  // check if uncommited changes in current branch would conflict with targetProjectInfo
  try {
    await git.checkout(branch);
  } catch (error) {
    errorMessage = errorText[language].b;
  }
  return errorMessage;
};

export const gitPull = async (git: SimpleGit, language: string) => {
  let errorMessage = null;
  // check if target branch exsists in remote
  try {
    await git.pull();
  } catch (error: any) {
    if (error.message.includes("There is no tracking information for the current branch")) {
      errorMessage = errorText[language].f;
    } else {
      errorMessage = error.message;
    }
  }
  return errorMessage;
};

/**
 * @description git diff && git archive - execute bat file * SHA (commit hash) doesn't have to be full
 * @description @ = HEAD, @^ = SHA one before latest
 */
export const gitArchive = async (batchPath: string, git: SimpleGit, targetProjectInfo: TargetProjectInfoType, language: string) => {
  let errorMessage = null;
  const makeArchive: MakeArchiveType = async (commitNew, commitOld) => {
    if (!targetProjectInfo) return;
    let commitNewSHA = commitNew;
    let commitOldSHA = commitOld;
    const batPath = path.join(batchPath, "/archive.bat");
    if (commitNewSHA === "") commitNewSHA = await git.revparse("@");
    if (commitOldSHA === "") commitOldSHA = await git.revparse("@^");
    // TODO: https://www.npmjs.com/package/simple-git#environment-variables
    const archiveResult = spawn(batPath, [commitNewSHA, commitOldSHA, targetProjectInfo.local]);

    return new Promise((resolve) => {
      // archiveResult.stdout.on("data", (x: any) => {
      //   const str = x.toString();
      //   process.stdout.write(str);
      // });
      archiveResult.stderr.on("data", (x: any) => {
        const str = x.toString();
        // process.stderr.write(str);
        if (str.includes("ambiguous argument")) errorMessage = errorText[language].c;
        if (str.includes("line is too long")) errorMessage = errorText[language].d;
        if (str.includes("The system cannot find the file specified.")) errorMessage = errorText[language].e;
      });
      archiveResult.on("exit", (code: any) => {
        resolve(code);
      });
    });
  };
  await makeArchive(targetProjectInfo.commit[0], targetProjectInfo.commit[1]);

  return errorMessage;
};

export const gitDeleteLocalBranch = async (git: SimpleGit, branch: string) => {
  await git.deleteLocalBranch(branch);
};
