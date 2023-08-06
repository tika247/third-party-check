/**
 * Used in background.ts
 * To communicate from backend(main process) to frontend(renderer process)
 */
import { IPCKeys } from "./constants";
import { contextBridge, ipcRenderer, IpcRenderer } from "electron";
import { IpcConfigType, APIType } from "@/server/common/types";

const ipcR: IpcRenderer = ipcRenderer;

const ipcConfig: IpcConfigType = {
  PROCESS_GET_API: async () => {
    const result: Promise<any> = await ipcR.invoke(IPCKeys.PROCESS_GET_API);
    return result;
  },
  PROCESS_A: async (infoFromFront) => {
    const result: Promise<string> = await ipcR.invoke(IPCKeys.PROCESS_A, infoFromFront);
    return result;
  },
  PROCESS_B: async () => {
    const result: Promise<string> = await ipcR.invoke(IPCKeys.PROCESS_B);
    return result;
  },
  PROCESS_C: async (errorMessage: string) => {
    const result: Promise<string> = await ipcR.invoke(IPCKeys.PROCESS_C, errorMessage);
    return result;
  },
  PROCESS_D: async () => {
    await ipcR.invoke(IPCKeys.PROCESS_D);
  },
  PROCESS_UPDATE_API: async (newAPIData: APIType) => {
    await ipcR.invoke(IPCKeys.PROCESS_UPDATE_API, newAPIData);
  },
  PROCESS_ERROR_DIALOG: async (errorMessage: string) => {
    ipcR.invoke(IPCKeys.PROCESS_ERROR_DIALOG, errorMessage);
  },
  // on: () => {
  //   ipcR.on(IPCKeys.RECEIVE_DATA, (event, arg) => {
  //     console.log(arg);
  //   });
  // },
};

/**
 * @description renderer -> main
 */
contextBridge.exposeInMainWorld("electron", ipcConfig);
