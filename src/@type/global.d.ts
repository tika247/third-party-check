/**
 * Used in vue
 */
declare global {
  interface Window {
    electron: Electron;
  }
}
export interface Electron {
  PROCESS_GET_API: () => void;
  PROCESS_A: (infoFromFront: InfoFromFrontType) => void;
  PROCESS_B: () => void;
  PROCESS_C: () => void;
  PROCESS_D: () => void;
  PROCESS_UPDATE_API: (arg: APIType) => void;
  PROCESS_ERROR_DIALOG: (errorMessage: string) => void;
}
