import { watch } from "vue"
import { useUserData } from "@lectorium/playlist"
import { Directory, Filesystem } from "@capacitor/filesystem"
import { Capacitor } from "@capacitor/core"

export function runDownloadMediaItems() {
  const data = useUserData()

  watch(data.media.changedAt, async () => {
    const mediaItems = await data.media.service.getAll()
    const fileToDownload = mediaItems.find(item => item.state === 'pending')

    // TODO: download only one file at a time
    const downloadingFile = mediaItems.find(item => item.state === 'downloading')

    if (!fileToDownload || downloadingFile) { return }

    await data.media.service.update(fileToDownload.id, { state: 'downloading' })
    try {
      const result = await Filesystem.downloadFile({
        webFetchExtra: {
          mode: 'no-cors',
        },
        url: fileToDownload.remoteUrl,
        path: fileToDownload.localPath,
        directory: Directory.Data,
        recursive: true
      })

      if (result.path) {
        const stat = await Filesystem.stat({
          path: result.path,
        })
        await data.media.service.update(fileToDownload.id, {
          state: 'downloaded',
          size: stat.size,
          localUrl: Capacitor.convertFileSrc(result.path)
        })
      }
    } catch (error) {
      console.error('Error downloading file', error instanceof Error ? error.message : error)
      await data.media.service.update(fileToDownload.id, {
        state: 'failed',
      })
    }
  }, { immediate: true })
}
