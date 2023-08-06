/**
 * Used in ts file
 */
import { IpcMessageType, UiTextType, ErrorTextType } from "@/server/common/types";

// config of channel
export const IPCKeys = {
  PROCESS_GET_API: "kenxpviejuenflknjg",
  PROCESS_A: "ngoaiejgoavgnbvlak",
  PROCESS_B: "peomnglpameeirbgps",
  PROCESS_C: "xwmjnrekmleibnsjak",
  PROCESS_D: "msbzufphoqpqsibrha",
  RECEIVE_DATA: "zeinskflokskpkhksmre",
  PROCESS_UPDATE_API: "mleiahgn4elapfcine",
  PROCESS_ERROR_DIALOG: "oenfksleibskfodoiejs",
} as const;

export const ipcMessage: IpcMessageType = {
  en: {
    gitControllerA: "GitControllerA Succeeded!",
    gitControllerB: "All Git Process Succeeded!",
    checkStorage: "No problem with the Storage!",
  },
  ja: {
    gitControllerA: "GitControllerA プロセス完了！",
    gitControllerB: "すべてのGitプロセス完了！",
    checkStorage: "格納先の納品物に問題はありませんでした！",
  },
};

export const entryViewText: UiTextType = {
  en: {
    project: "Project",
    note: "Project is not being registered.<br>Register by clicking the right-top-setting-icon!",
    branch: "Branch",
    commit: "Commit",
    flow: "(Latest→Previous)",
    storage: "Storage",
  },
  ja: {
    project: "プロジェクト",
    note: "プロジェクトが登録されていません。<br>右上の歯車アイコンをクリックし、編集画面から登録してください！",
    branch: "ブランチ",
    commit: "コミット",
    flow: "（新→古）",
    storage: "格納先",
  },
};
export const editViewText: UiTextType = {
  en: {
    project: "Project",
    name: "Name",
    remote: "Remote",
    local: "Local",
    winmerge: "WinMerge",
    language: "Language",
  },
  ja: {
    project: "プロジェクト",
    name: "プロジェクト名",
    remote: "リポジトリのGitパス",
    local: "ローカルの作業フォルダパス",
    winmerge: "WinMergeのexeファイルへのパス",
    language: "言語",
  },
};
export const confirmViewText: UiTextType = {
  en: {
    a: "Take a screen shot of WinMerge result",
    b: "Inform in Backlog if no problem",
    c: "Inform with the screen shot in Teams if no problem",
  },
  ja: {
    a: "WinMerge画面のスクリーンショットを撮ってください",
    b: "Backlogで問題ないことを報告してください",
    c: "スクリーンショットを添付のうえ、Teamsで問題ないことを報告してください",
  },
};

export const noProjectErrorText: { [key: string]: string } = {
  en: "The project is not being registered!",
  ja: "プロジェクトが登録されていません！",
};

export const gitControllerErrorText: ErrorTextType = {
  en: {
    a: "Couldn't find project repository in local.\nCheck if registered repository path\nis correct!",
    b: "No files in Storage.\nOr no VPN connection!",
    c: "Use this app only for release branch!",
    d: "Enter a branch name!",
  },
  ja: {
    a: "ローカルに作業フォルダがありません。\n作業フォルダパスが正しいか確認してください！",
    b: "格納先にファイルがありません！\nもしくはVPNの接続が問題のようです。",
    c: "このアプリはリリースブランチを対象に使用してください！\n（リリースブランチ以外のブランチを対象にして使用しないでください）",
    d: "ブランチ名を入力してください！",
  },
};

export const gitCommandErrorText: ErrorTextType = {
  en: {
    a: `Entered text is invalid.\nCheck it again.`,
    b: "Uncommited changes would conflict\nwith the target branch.\nCommit or Stash first!",
    c: "Commit SHA is not correct!",
    d: "Git-Diff output capacity is too heavy!\nSorry but check in other way..",
    e: "No diff files between the specified commits!",
    f: "The target branch do not exsist in a remote. Check if the target is correct!",
  },
  ja: {
    a: "入力内容に誤りがあるようです！",
    b: "コミットされていないファイル変更があります。\nコミットもしくはスタッシュを先に行ってください！",
    c: "コミットのハッシュ値（SHA）が存在しないようです！",
    d: "差分抽出されるファイル量が多いためエラーになりました。申し訳ございませんが、別の方法で第3者チェックを行ってください。",
    e: "指定されたコミット間で差分ファイルが存在しないようです！",
    f: "指定されたブランチがリモートに存在しないようです！",
  },
};
export const storageCheckerErrorText: ErrorTextType = {
  en: {
    a: "Duplication in file names below.\nPlease check if unnecessary files are in!",
    b: "Files below may be unexpected as the delivered!\nCheck if correct!",
    c: "NG words are included! Check if those are OK!",
    d: "Solid-color images are inclided!\nMaybe dummy so check images below!",
  },
  ja: {
    a: "ファイル名が同一（拡張子は異なる）のファイルが存在しています。\n問題ないか確認してください。",
    b: "納品物になりえないファイルが含まれている可能性があります。\n問題ないか確認してください。",
    c: "ダミーテキストなど未修正の文字列が含まれています。\n問題ないか確認してください。",
    d: "単色の画像が存在します。\n問題ないか確認してください。",
  },
};

export const expectedExtension: Array<string> = ["html", "shtml", "txt", "css", "js", "json", "xml", "jpg", "png", "svg", "gif", "webp", "mp4", "pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx"];

export const ngWord: Array<string> = ["dummy", "ダミー", "〇〇〇", "dammy", 'href=""'];
