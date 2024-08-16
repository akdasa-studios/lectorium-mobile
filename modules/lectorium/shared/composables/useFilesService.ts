import { FilesService } from "@lectorium/shared";

export function useFilesService() {
  return new FilesService();
}