import { Capacitor } from "@capacitor/core"
import { Directory, Filesystem } from "@capacitor/filesystem"


/**
 * Represents the result of a download operation.
 */
export type DownloadResult = {
  // The size of the downloaded file in bytes.
  size: number,

  // The local path of the downloaded file.
  localPath: string,

  // The local URL of the downloaded file.
  localUrl: string,
}

export class FilesService {
  /**
   * Downloads a file from the specified URL and saves it to the
   * specified path.
   * @param url The URL of the file to download.
   * @param path The path where the downloaded file will be saved.
   * @returns A promise that resolves to a DownloadResult object
   *          containing information about the downloaded file.
   * @throws An error if the download fails.
   */
  async downloadFile(
    url: string,
    path: string
  ): Promise<DownloadResult> {
    const result = await Filesystem.downloadFile({
      webFetchExtra: { mode: 'no-cors', },
      directory: Directory.Data,
      recursive: true,
      url, path,
    })

    if (!result.path) {
      throw new Error(`Download of ${url} to ${path} failed`)
    }

    const stat = await Filesystem.stat({
      path: result.path,
    })

    return {
      size: stat.size,
      localPath: result.path,
      localUrl: Capacitor.convertFileSrc(result.path)
    }
  }

  /**
   * Deletes a file from the specified directory.
   *
   * @param path The path of the file to be deleted.
   * @returns A promise that resolves when the file is
   *          successfully deleted.
   */
  async deleteFile(path: string) {
    await Filesystem.deleteFile({
      directory: Directory.Data,
      path,
    })
  }
}
