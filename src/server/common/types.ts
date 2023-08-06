/**
 * Used in ts file
 */
import ElectronStore from "electron-store";

export interface InfoFromFrontType {
  project: string;
  branch: string;
  commit: Array<string>;
  storage: string;
}

export interface ProjectsType {
  [key: string]: string;
}

export interface APIType {
  ["projects"]: ProjectsAllType;
  ["winmerge"]: WinMergePathType;
  ["language"]: LanguageType;
}

export type ProjectsAllType = Array<ProjectsType>;

export type WinMergePathType = string;

export type LanguageType = string;

export type StoredAPIType = ElectronStore<{ api: APIType }>;

export interface IpcConfigType {
  PROCESS_GET_API: () => Promise<any | void>;
  PROCESS_A: (infoFromFront: InfoFromFrontType) => Promise<string | void>;
  PROCESS_B: () => Promise<string | void>;
  PROCESS_C: (errorMessage: string) => Promise<string | void>;
  PROCESS_D: () => Promise<string | void>;
  PROCESS_UPDATE_API: (newAPIData: APIType) => Promise<void>;
  PROCESS_ERROR_DIALOG: (errorMessage: string) => Promise<void>;
  // on: () => void;
}

export type GitControllerAType = (remote: string, local: string, branch: string, commit: Array<string>, storage: string, winmergePath: string, language: string) => Promise<string | void>;

export type GitControllerBType = (remote: string, local: string, branch: string, language: string) => Promise<string | void>;

export interface TargetProjectInfoType {
  remote: string;
  local: string;
  branch: string;
  commit: Array<string>;
  storage: string;
}

export interface IpcMessageType {
  [key: string]: { [key: string]: string };
}

export interface UiTextType {
  [key: string]: { [key: string]: string };
}

export interface ErrorTextType {
  [key: string]: { [key: string]: string };
}

export type WmControllerType = (archivePath: string, targetProjectInfo: TargetProjectInfoType, winmergePath: string) => Promise<string>;

export type MakeArchiveType = (commitNew: string, commitOld: string) => Promise<string | void>;
