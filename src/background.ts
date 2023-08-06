"use strict";

import { app, protocol, BrowserWindow, ipcMain, IpcMain, dialog } from "electron";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
// import installExtension, { VUEJS3_DEVTOOLS } from "electron-devtools-installer";
import { storageChecker } from "@/server/storageCheck/storageChecker";
import { gitControllerA, gitControllerB } from "@/server/gitControl/gitController";
import { InfoFromFrontType, APIType, ProjectsType, ProjectsAllType, WinMergePathType, LanguageType } from "@/server//common/types";
import path from "path";
import { IPCKeys, noProjectErrorText } from "./constants";
import Store from "electron-store";
const isProduction = process.env.NODE_ENV === "production";
let win: any = null;
const ipcM: IpcMain = ipcMain;

// API
const defaultApi: APIType = { projects: [], winmerge: "C:/Program Files/WinMerge/WinMergeU.exe", language: "en" };
const storedAPI = new Store({
  defaults: {
    api: defaultApi,
  },
});
const API_EXSIST = storedAPI.has("api");
let API_DATA: APIType = API_EXSIST ? storedAPI.get("api") : defaultApi;

// all registered projects
let PROJECTS: ProjectsAllType = API_DATA.projects;

// WinMerge Path
let WINMERGE_PATH: WinMergePathType = API_DATA.winmerge;

// WinMerge Path
let LANGUAGE: LanguageType = API_DATA.language;

// info of project
let TARGET_PROJECT: ProjectsType | null | undefined = null;
let INFO_FEOM_FRONT: InfoFromFrontType | null = null;

/**
 * @description Scheme
 */
protocol.registerSchemesAsPrivileged([{ scheme: "app", privileges: { secure: true, standard: true } }]);

/**
 * @description createWindow
 */
async function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION as unknown as boolean,
      contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,
      enableRemoteModule: false,
      preload: path.join(__dirname, "preload.js"),
      webSecurity: false,
    },
  });

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL as string);
    if (!process.env.IS_TEST) win.webContents.openDevTools();
  } else {
    createProtocol("app");
    win.loadURL(path.join(__static, "/index.html"));
  }
}

/**
 * @description IpcMain: PROCESS_GET_API
 */
ipcM.handle(IPCKeys.PROCESS_GET_API, async (): Promise<any | void | null> => {
  return API_DATA;
  // event.sender.send(IPCKeys.RECEIVE_DATA, data);
});

/**
 * @description IpcMain: PROCESS_A
 */
ipcM.handle(IPCKeys.PROCESS_A, async (event, infoFromFront: InfoFromFrontType): Promise<string | void | null> => {
  INFO_FEOM_FRONT = infoFromFront;
  const frontProject = infoFromFront.project;
  TARGET_PROJECT = PROJECTS.find((project: any) => project.name === frontProject);

  let handleResult: string | null | void = null;

  try {
    if (!TARGET_PROJECT) {
      throw new Error(noProjectErrorText[LANGUAGE]);
    }
    handleResult = await gitControllerA(TARGET_PROJECT.remote, TARGET_PROJECT.local, INFO_FEOM_FRONT.branch, INFO_FEOM_FRONT.commit, INFO_FEOM_FRONT.storage, WINMERGE_PATH, LANGUAGE);
  } catch (err) {
    if (err instanceof Error) {
      handleResult = err.message;
    }
  }

  return handleResult;
  // event.sender.send(IPCKeys.RECEIVE_DATA, data);
});

/**
 * @description IpcMain: PROCESS_B
 */
ipcM.handle(IPCKeys.PROCESS_B, async (event): Promise<string | void | null> => {
  if (!INFO_FEOM_FRONT) return;
  let handleResult = null;

  try {
    if (!TARGET_PROJECT) {
      throw new Error("The project is not being registered!");
    }
    handleResult = await gitControllerB(TARGET_PROJECT.remote, TARGET_PROJECT.local, INFO_FEOM_FRONT.branch, LANGUAGE);
  } catch (err) {
    if (err instanceof Error) {
      handleResult = err.message;
    }
  }

  return handleResult;
  // event.sender.send(IPCKeys.RECEIVE_DATA, data);
});

/**
 * @description IpcMain: PROCESS_C
 */
ipcM.handle(IPCKeys.PROCESS_C, async (event): Promise<string | void | null> => {
  if (!INFO_FEOM_FRONT) return;
  let handleResult = null;
  try {
    if (!INFO_FEOM_FRONT.storage) {
      throw new Error("Storage is not recognized! Check if the Storage or ts-file codes are correct!");
    }
    handleResult = await storageChecker(INFO_FEOM_FRONT.storage, LANGUAGE);
  } catch (err) {
    if (err instanceof Error) {
      handleResult = err.message;
    }
  }

  return handleResult;
});

/**
 * @description IpcMain: PROCESS_D
 */
ipcM.handle(IPCKeys.PROCESS_D, async (event): Promise<string | void | null> => {
  // close app
  app.exit(0);
  // event.sender.send(IPCKeys.RECEIVE_DATA, data);enfksleibskfodoiejs
});

/**
 * @description IpcMain: PROCESS_ERROR_DIALOG
 */
ipcM.handle(IPCKeys.PROCESS_ERROR_DIALOG, (event, errorMessage: string) => {
  const options = {
    type: "none",
    buttons: ["OK"],
    title: "Error",
    message: errorMessage,
  };
  dialog.showMessageBox(win, options);
});

/**
 * @description IpcMain: PROCESS_UPDATE_API
 */
ipcM.handle(IPCKeys.PROCESS_UPDATE_API, async (event, newAPIData: APIType): Promise<void> => {
  API_DATA = newAPIData;
  PROJECTS = API_DATA.projects;
  WINMERGE_PATH = newAPIData.winmerge;
  LANGUAGE = newAPIData.language;
  storedAPI.set("api", newAPIData);
});

/**
 * @description Quit when all windows are closed.
 */
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

/**
 * @description Initialization
 */
app.on("ready", async () => {
  if (!isProduction && !process.env.IS_TEST) {
    try {
      // ↓ thrown error, it seems to be bug
      // await installExtension(VUEJS3_DEVTOOLS);
    } catch (e) {
      console.error("Vue Devtools failed to install");
    }
  }
  createWindow();
});

/**
 * @description Exit cleanly on request from a parent process in development mode.
 */
if (!isProduction) {
  if (process.platform === "win32") {
    process.on("message", (data) => {
      if (data === "graceful-exit") {
        app.quit();
      }
    });
  } else {
    process.on("SIGTERM", () => {
      app.quit();
    });
  }
}
