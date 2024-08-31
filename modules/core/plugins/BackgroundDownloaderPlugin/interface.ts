import { Plugin } from '@capacitor/core'


export type DownloadFileRequest = {
  url: string
  fileName: string
  title?: string
}

export type DownloadFileResponse = {
  downloadId: number
  localUrl: string
}

export type DownloadCompleteEvent = {
  downloadId: number
  fileUri?: string
  fileSize: number
}

export interface BackgroundDownloaderPlugin extends Plugin {
  downloadFile(
    request: DownloadFileRequest
  ): Promise<DownloadFileResponse>

  onDownloadComplete(
    callback: (event: DownloadCompleteEvent) => void
  ): Promise<{ callbackId: string }>
}