import { PluginListenerHandle } from '@capacitor/core';
import { DownloadCompleteEvent, DownloadFileRequest, DownloadFileResponse, type BackgroundDownloaderPlugin } from './interface'

export class WebBackgroundDownloaderPlugin
  implements BackgroundDownloaderPlugin
{
  private downloadId = 0;
  private downloadCompleteHandlers: ((event: DownloadCompleteEvent) => void)[] = [];

  async downloadFile(
    request: DownloadFileRequest
  ): Promise<DownloadFileResponse> {
    const currentDownloadId = this.downloadId++;

    // Emulate a download
    setTimeout(() => {
      const event: DownloadCompleteEvent = {
        downloadId: currentDownloadId,
        fileSize: 0,
        fileUri: request.url
      }
      this.downloadCompleteHandlers.forEach(handler => handler(event));
    }, 1000)

    return {
      downloadId: currentDownloadId,
      localUrl: request.url
    }
  }

  async onDownloadComplete(
    callback: (event: DownloadCompleteEvent) => void
  ): Promise<{ callbackId: string; }> {
    this.downloadCompleteHandlers.push(callback);
    return { callbackId: '' };
  }

  addListener(
    eventName: string, listenerFunc: (...args: any[]) => any
  ): Promise<PluginListenerHandle> {
    throw new Error('Method not implemented.');
  }
  removeAllListeners(): Promise<void> {
    throw new Error('Method not implemented.');
  }
}