import { SimpleGit } from "simple-git";
import { gitClean, gitCheckout, gitDeleteLocalBranch, gitBranchLocal } from "@/server/gitControl/gitCommand";
/**
 * @description if error, reset git state
 * @example  await gitErrorCheck(errorMessage, git, originalBranch, ifFetchThisTime, targetProjectInfo.branch);
 */
export const gitErrorCheck: any = async (errorMessage: string | null, git: SimpleGit, originalBranch: string, ifFetchThisTime: boolean, targetBranch: string, language: string) => {
  if (errorMessage) {
    // clean
    await gitClean(git);
    // checkout
    if (originalBranch) await gitCheckout(git, originalBranch, language);
    // delete * if error OK
    if (ifFetchThisTime) {
      const locals = await gitBranchLocal(git);
      if (locals.all.includes(targetBranch)) {
        await gitDeleteLocalBranch(git, targetBranch);
      }
    }
  }
};
